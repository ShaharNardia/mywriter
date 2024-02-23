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

// const getTone = (tone) => {
//   if (tone === 'formal') {
//     return 'פורמלי';
//   } else if (tone === 'casual') {
//     return 'לא פורמלי';
//   } else if (tone === 'professional') {
//     return 'מקצועי';
//   }
//   else if (tone === 'friendly') {
//     return 'ידידותי';
//   }
//   else if (tone === 'persuasive') {
//     return 'משכנע';
//   }
//   else if (tone === 'informative') {
//     return 'מידעתי';
//   }
//   else if (tone === 'humor') {
//     return 'הומוריסטי';
//   }
//   else if (tone === 'academic') {
//     return 'אקדמי';
//   }
//   else if (tone === 'Business') {
//     return 'עסקי';
//   }

// }
const useEmoji= (useIt) => {
  if (useIt) {
    return 'use emojis in your content to enrich the reader experience,';
  }
  return ``;
}
const getPurpose = (purpose) => { 
if (purpose === 'api') {
  return 'the content should be in a format of API response {title, content, keywords, previewContent, image}';
} else if (purpose === 'email') { 
  return 'write the content as an email that includes a greeting, a body, and a closing';
}
else if (purpose === 'sms') {
  return 'write the content as an SMS that includes a greeting and a body';
}
else if(purpose === 'social') {
  return 'write the content as a post for social media that includes a greeting and a body';
}
else if(purpose === 'blog') {
  return 'write the content as a blog post and also the returned content should be styled and with HTML tags so it can be copied to a website and used';
}}

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
  const { title, purpose, useEmojis, language, tone } = promptParams;
  return `Generate a content for ${title}, ${getPurpose(purpose)}, ${useEmoji(useEmojis)} the content should be in language - ${language}. The tone of the content should be ${tone}.`;
};
exports.generateContent = onRequest(async (request, response) => {
  try {
    const { promptParams, userToken } = request.body;

    let prompt = generatePrompt(promptParams);
    // Send prompt to OpenAI API
    const openAIResponse = await openAI(prompt);

    // Extract generated content from OpenAI response
    const generatedContent = openAIResponse;//.data;//.choices[0].text.trim();

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
