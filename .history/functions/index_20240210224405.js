const { onRequest } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const axios = require('axios');
const cheerio = require('cheerio');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');

admin.initializeApp();
const db = admin.firestore();

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

const openAI = async function (prompt) {

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer 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`
  };

  const data = {
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "user",
        content: prompt
      }
    ],
    temperature: 0.1,
  };

  return await axios.post('https://api.openai.com/v1/chat/completions', data, { headers });
}

exports.scrape = onRequest(async (request, response) => {
  try {
    const { url } = request.body;
    console.log(url);
    // Scrape the webpage
    const { data } = await axios.get(url);
    console.log(data);
    const $ = cheerio.load(data);
    const bodyContent = $('body').text();

    // Send the body content to the OpenAI API
    //and return the summarize content in hebrew while it is ready to use for next prompt, remove any tags or images
    let prompt = `${bodyContent}\n\n Please summarize the important details from the following text`;
    const openAIResponse = await openAI(prompt);

    // Extract the summary from the OpenAI response
    const summary = openAIResponse.data;

    // request.json({ summary });

    response.status(200).send(data,summary);

  } catch (error) {
    console.error('Error:', error);
    response.status(500).send(`An error occurred ${error}`);
  }
});
const generatePrompt = (promptParams) => {
  const { title, purpose, category, generateImage, generateAudio, language, toneBasedOnCategoryAndPurpose, imagePrompt } = promptParams;

  let prompt = `Title: ${title}\n\n`;
  prompt += `Purpose: ${purpose}\n\n`;
  prompt += `Category: ${category}\n\n---\n\n`;
  prompt += `Please generate a ${category}-themed content that aligns with the following purpose: ${purpose}. The content should be engaging, informative, and tailored for an audience interested in ${category}.\n\n`;

  if (generateImage) {
    prompt += `${generateImage}\n\n`;
  }

  if (generateAudio) {
    prompt += `${generateAudio}\n\n`;
  }

  prompt += `Language: ${language}\n\n---\n\n`;
  prompt += `Additional Instructions:\n\n`;
  prompt += `- The tone should be ${toneBasedOnCategoryAndPurpose}.\n`;
  prompt += `- Include key insights or takeaways for the reader.\n`;
  prompt += `- If applicable, reference recent advancements or trends in the field.\n\n`;

  if (imagePrompt) {
    prompt += `${imagePrompt}\n\n`;
  }

  prompt += `Note: The content should be original and reflect current perspectives and knowledge in the ${category} field.`;

  return prompt;
};
exports.generateContent = onRequest(async (request, response) => {
  try {
    const { promptParams, userToken } = request.body;

    let prompt = generatePrompt(promptParams);
    // Send prompt to OpenAI API
    const openAIResponse = await openAI(prompt);

    // Extract generated content from OpenAI response
    const generatedContent = openAIResponse.data.choices[0].text.trim();

    // Add generated content to Firestore
    const docRef = await db.collection('generatedContent').add({
      content: generatedContent,
      userToken: userToken
    });

    // Send JSON response
    response.json({
      generatedContentId: docRef.id,
      generatedContent: generatedContent
    });
    await sendEmail(generatedContent, "shahar.nardia@retailsoft.io");

  } catch (error) {
    console.error('Error generating content:', error);
    response.status(500).send(`Error generating content ${error}`);
  }
});

  const sendEmail = async (content,subject, email) => {
    // Create a transporter using your Gmail account
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'info@add2cart.co.il',
        pass: 'Shahar2024!'
      }
    });

    // Define the email options
    const mailOptions = {
      from: 'info@add2cart.co.il',
      to: email,
      subject: subject,
      text: content
    };

    // Send the email
    await transporter.sendMail(mailOptions);
  };

exports.sendEmail = onRequest(async (request, response) => {
  const { email, subject, content } = request.body;

  try {
    await sendEmail(content,subject, email);
    response.status(200).json({ message: 'Email sent successfully' });
  } catch (err) {
    response.status(500).json({ error: `Failed to send email ${err}` });
  }
});
  


  
  // Call the sendEmail function after generating the content
//Please note that you need to replace `YOUR_OPENAI_API_KEY` with your actual OpenAI API key.
//write me a post API that gets a prompt for generate content and it will send it via open AI API with rest request and it will response a JSON object + add it to the firestore with the userToken sent
