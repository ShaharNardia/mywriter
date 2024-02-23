const { onRequest } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const axios = require('axios');
const cheerio = require('cheerio');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');

admin.initializeApp();
const db = admin.firestore();
db.settings({ ignoreUndefinedProperties: true });

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

  try {
    // Make the POST request and await the response
    const response = await axios.post('https://api.openai.com/v1/chat/completions', data, { headers });
    console.log(response.data);
    return response.data; // Return the response data
  } catch (error) {
    // Handle any errors that occur during the request
    console.error("Error calling OpenAI API:", error.message);
    throw error; // Rethrow the error after logging it
  }
}

const useEmoji= (useIt) => {
  if (useIt) {
    return 'use emojis when it fits,';
  }
  return ``;
}
const getPurpose = (purpose) => { 
if (purpose === 'api') {
  return 'the content should be in a format of API response {title, content, keywords, previewContent, image}';
} else if (purpose === 'email') { 
  return 'write the content as an email';
}
else if (purpose === 'sms') {
  return 'write the content as an SMS';
}
else if(purpose === 'social') {
  return 'write the content as a post for social media';
}
else if(purpose === 'assigenment') {
  return 'write the content as an academic assigenment';
}
else if(purpose === 'blog') {
  return 'the content should be in a html format, design it with bold fonts, headers, paragraphs where neeaded - this content is for a blog or a web site- write it well and be informative and interesting';
}}

const generatePrompt = (promptParams) => {
  const { title, purpose, useEmojis, language, tone} = promptParams;
  return `Generate a content for ${title}, ${getPurpose(purpose)}, ${useEmoji(useEmojis)} the content should be in language - ${language}. The tone of the content should be ${tone}.`;
};
exports.generateContent = onRequest(async (request, response) => {
  try {
    const { promptParams, userToken } = request.body;
    
    let prompt = generatePrompt(promptParams);
    // Send prompt to OpenAI API
    const openAIResponse = await openAI(prompt);
    

    // Extract generated content from OpenAI response
    const generatedContent = openAIResponse.choices[0].message.content.trim();
    await sendEmail(generatedContent,"test", promptParams.email);
    console.log(generatedContent);
    // Add generated content to Firestore
    await db.collection('generatedContent').add({
      content: generatedContent,
      userToken: userToken
    });

    // Send JSON response
    // response.json({
    //   generatedContentId: docRef.id,
    //   generatedContent: generatedContent
    // });
    response.status(200).send(`{"data":${generatedContent}, "type":"${promptParams.purpose}"}`);

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
        pass: 'iuop kubf ehds kgzo'  
        //pass: 'Shahar2024!'  iuop kubf ehds kgzo
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
  
// exports.scrape = onRequest(async (request, response) => {
//   try {
//     const { url } = request.body;
//     console.log(url);
//     // Scrape the webpage
//     const { data } = await axios.get(url);
//     const $ = cheerio.load(data);
//     const bodyContent = $('body').text();

//     // Send the body content to the OpenAI API
//     //and return the summarize content in hebrew while it is ready to use for next prompt, remove any tags or images
//     let prompt = `${bodyContent}\n\n Please summarize the important details from the following text`;
//     const openAIResponse = await openAI(prompt);

//     // Extract the summary from the OpenAI response
//     const summary = openAIResponse.data;

//     // request.json({ summary });

//     response.status(200).send(data,summary);

//   } catch (error) {
//     console.error('Error:', error);
//     response.status(500).send(`An error occurred ${error}`);
//   }
// });
// const generateImage = async function (title) {
//   let data = JSON.stringify({
//     "model": "dall-e-3",
//     "prompt": `generate me a product image that this is its title: ${title}`,
//     "n": 1,
//     "size": "1024x1024"
//   });

//   let config = {
//     method: 'post',
//     maxBodyLength: Infinity,
//     url: 'https://api.openai.com/v1/images/generations',
//     headers: {
//       'Content-Type': 'application/json',
//       'Authorization': 'Bearer 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',
//     },
//     data: data
//   };
// };
  
  // Call the sendEmail function after generating the content
//Please note that you need to replace `YOUR_OPENAI_API_KEY` with your actual OpenAI API key.
//write me a post API that gets a prompt for generate content and it will send it via open AI API with rest request and it will response a JSON object + add it to the firestore with the userToken sent
