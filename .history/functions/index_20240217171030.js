const { onRequest } = require("firebase-functions/v2/https");
const cors = require("cors")({ origin: true });

// const logger = require("firebase-functions/logger");
// const cheerio = require('cheerio');
const axios = require("axios");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");

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
    "Content-Type": "application/json",
    Authorization: `Bearer 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`,
  };

  const data = {
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
    temperature: 0.1,
  };

  try {
    // Make the POST request and await the response
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      data,
      { headers }
    );
    console.log(response.data);
    return response.data; // Return the response data
  } catch (error) {
    // Handle any errors that occur during the request
    console.error("Error calling OpenAI API:", error.message);
    throw error; // Rethrow the error after logging it
  }
};

const useEmoji = (useIt) => {
  if (useIt) {
    return "use emojis when it fits,";
  }
  return ``;
};
const getPurpose = (purpose) => {
  if (purpose === "api") {
    return "the content should be in a format of API response {title, content, keywords, previewContent, image}";
  } else if (purpose === "email") {
    return "write the content as an email";
  } else if (purpose === "sms") {
    return "write the content as an SMS";
  } else if (purpose === "social") {
    return "write the content as a post for social media";
  } else if (purpose === "assigenment") {
    return "write the content as an academic assigenment";
  } else if (purpose === "blog") {
    return "the content should be in a html format, design it with bold fonts, headers, paragraphs where neeaded - this content is for a blog or a web site- write it well and be informative and interesting";
  }
};

const generatePrompt = (promptParams) => {
  const { title, purpose, useEmojis, language, tone } = promptParams;
  return `Generate a content for ${title}, ${getPurpose(purpose)}, ${useEmoji(
    useEmojis
  )} the content should be in language - ${language}. The tone of the content should be ${tone}.`;
};
exports.generateContent = onRequest((request, response) => {
  cors(request, response, async () => {
    try {
      const { promptParams, userToken } = request.body;
      let docRef;
      await db
        .collection("generatedContent")
        .add({
          title: promptParams.title,
          created: admin.firestore.FieldValue.serverTimestamp(),
          type: promptParams.purpose,
          tone: promptParams.tone,
          language: promptParams.language,
          userToken: userToken,
          sentToMail: promptParams.email,
          status: "pending",
        })
        .then((ref) => {
          docRef = ref;
        });
      // Send immediate response
      response.status(200).send("Request is being handled");

      // Continue processing in the background
      process.nextTick(async () => {
        try {
          let title = promptParams.title;
          if (title.length > 20) {
            title = title.substring(0, 20) + "...";
          }

          let prompt = generatePrompt(promptParams);
          const openAIResponse = await openAI(prompt);
          const generatedContent =
            openAIResponse.choices[0].message.content.trim();

          const userQuerySnapshot = await db
            .collection("users")
            .where("userToken", "==", userToken)
            .limit(1)
            .get();

          if (!userQuerySnapshot.empty) {
            const userDoc = userQuerySnapshot.docs[0]; // Get the first document matching the query
            if (userDoc.exists && userDoc.data().sendUpdates) {
              // Assuming sendUpdates is a boolean indicating user preference
              if (
                promptParams.email &&
                typeof promptParams.email === "string" &&
                /\S+@\S+\.\S+/.test(promptParams.email)
              ) {
                await sendEmail(generatedContent, title, promptParams.email);
              }
            }
          }

          // Update the document with the generated content and status success
          await docRef.update({
            content: generatedContent,
            status: "success",
          });
        } catch (error) {
          await docRef.update({
            status: "failed",
          });
          console.error("Error generating content:", error);
        }
      });
    } catch (error) {
      console.error("Error handling request:", error);
      response.status(500).send(`Error handling request ${error}`);
    }
  });
});
exports.updateUser = onRequest(async (request, response) => {
  const { user } = request.body;

  try {
    const userToken = user.userToken;
    const usersCollection = db.collection("users");
    const userDoc = await usersCollection.doc(userToken).get();

    if (userDoc.exists) {
      // Update existing user document
      await usersCollection.doc(userToken).update(user);
    } else {
      // Add new user document
      await usersCollection.doc(userToken).set(user);
    }

    response.status(200).json({ message: "User updated successfully" });
  } catch (err) {
    response.status(500).json({ error: `Failed to update user ${err}` });
  }
});
exports.getUser = onRequest(async (request, response) => {
  const { userToken } = request.query;

  try {
    const usersCollection = db.collection("users");
    const userDoc = await usersCollection.doc(userToken).get();

    if (userDoc.exists) {
      const user = userDoc.data();
      response.status(200).json(user);
    } else {
      response.status(404).json({ error: "User not found" });
    }
  } catch (err) {
    response.status(500).json({ error: `Failed to get user ${err}` });
  }
});
exports.getDocument = onRequest(async (request, response) => {
  const { userToken, documentId } = request.query;

  try {
    const generatedContentCollection = db.collection("generatedContent");
    const documentRef = generatedContentCollection.doc(documentId);
    const documentSnapshot = await documentRef.get();

    if (documentSnapshot.exists) {
      const documentData = documentSnapshot.data();
      if (documentData.userToken === userToken) {
        response.status(200).json(documentData);
      } else {
        response.status(403).json({ error: "Unauthorized access" });
      }
    } else {
      response.status(404).json({ error: "Document not found" });
    }
  } catch (err) {
    response.status(500).json({ error: `Failed to get document ${err}` });
  }
});
exports.getDocumentsByUserToken = onRequest(async (request, response) => {
  const { userToken } = request.query;

  try {
    const generatedContentCollection = db.collection("generatedContent");
    const querySnapshot = await generatedContentCollection
      .where("userToken", "==", userToken)
      .get();

    const documents = [];
    querySnapshot.forEach((documentSnapshot) => {
      const documentData = documentSnapshot.data();
      documents.push(documentData);
    });

    response.status(200).json(documents);
  } catch (err) {
    response.status(500).json({ error: `Failed to get documents ${err}` });
  }
});
exports.createOrUpdateJob = onRequest(async (request, response) => {
  const { job, userToken } = request.body;

  try {
    const jobsCollection = db.collection("jobs");
    const querySnapshot = await jobsCollection
      .where("jobId", "==", job.jobId)
      .where("userToken", "==", userToken)
      .get();

    if (querySnapshot.empty) {
      // Insert new job
      await jobsCollection.add(job);
    } else {
      // Update existing job
      const jobDoc = querySnapshot.docs[0];
      await jobDoc.ref.update(job);
    }

    response
      .status(200)
      .json({ message: "Job created or updated successfully" });
  } catch (err) {
    response
      .status(500)
      .json({ error: `Failed to create or update job ${err}` });
  }
});
exports.getJobsByUserToken = onRequest(async (request, response) => {
  const { userToken } = request.query;

  try {
    const jobs = await getJobsByUserToken(userToken);
    response.status(200).json(jobs);
  } catch (err) {
    response.status(500).json({ error: `Failed to get jobs: ${err}` });
  }
});
exports.getJobByJobIdAndUserToken = onRequest(async (request, response) => {
  const { jobId, userToken } = request.query;

  try {
    const jobsCollection = db.collection("jobs");
    const querySnapshot = await jobsCollection
      .where("jobId", "==", jobId)
      .where("userToken", "==", userToken)
      .get();

    if (querySnapshot.empty) {
      response.status(404).json({ error: "Job not found" });
    } else {
      const jobDoc = querySnapshot.docs[0];
      const jobData = jobDoc.data();
      response.status(200).json(jobData);
    }
  } catch (err) {
    response.status(500).json({ error: `Failed to get job: ${err}` });
  }
});
exports.getFormSettings = onRequest(async (request, response) => {
  try {
    const goalsListCollection = db.collection("goalsList");
    const tonesListCollection = db.collection("tonesList");
    const platformsListCollection = db.collection("platformList");

    const goalsListSnapshot = await goalsListCollection.get();
    const tonesListSnapshot = await tonesListCollection.get();
    const platformsListSnapshot = await platformsListCollection.get();

    const goalsList = goalsListSnapshot.docs.map((doc) => doc.data());
    const tonesList = tonesListSnapshot.docs.map((doc) => doc.data());
    const platformsList = platformsListSnapshot.docs.map((doc) => doc.data());

    const formSettings = {
      goalsList,
      tonesList,
      platformsList,
    };

    response.status(200).json(formSettings);
  } catch (err) {
    response.status(500).json({ error: `Failed to get form settings: ${err}` });
  }
});
const seedCollections = async () => {
  try {
    const goalsListCollection = db.collection("goalsList");
    const tonesListCollection = db.collection("tonesList");
    const platformsListCollection = db.collection("platformList");

    // Seed goalsList collection
    const goalsListData = [
      { goal: "Goal 1" },
      { goal: "Goal 2" },
      { goal: "Goal 3" },
      // Add more goals as needed
    ];
    await Promise.all(
      goalsListData.map((data) => goalsListCollection.add(data))
    );

    // Seed tonesList collection
    const tonesListData = [
      { 
        id: 1,
        tone: "Informative",
        description: "Provides factual information and explanations."
      },
      { 
        id: 2,
        tone: "Persuasive",
        description: "Aims to convince the audience of a particular viewpoint or action."
      },
      { 
        id: 3,
        tone: "Friendly",
        description: "Warm and inviting, suitable for casual or personal communications."
      },
      { 
        id: 4,
        tone: "Professional",
        description: "Formal and business-like, appropriate for professional contexts."
      },
      { 
        id: 5,
        tone: "Inspirational",
        description: "Uplifting and motivational, often used to inspire action or hope."
      },
      { 
        id: 6,
        tone: "Humorous",
        description: "Light-hearted and funny, great for engaging and entertaining the audience."
      },
      { 
        id: 7,
        tone: "Sarcastic",
        description: "Uses irony and satire to convey messages, often in a humorous way."
      },
      { 
        id: 8,
        tone: "Romantic",
        description: "Expresses love, affection, or strong emotions, suitable for personal letters or creative works."
      },
      { 
        id: 9,
        tone: "Technical",
        description: "Includes specialized language and jargon, ideal for industry-specific topics."
      },
      { 
        id: 10,
        tone: "Conversational",
        description: "Mimics natural speech patterns, making content feel more personal and relatable."
      }
    ];
    
    await Promise.all(
      tonesListData.map((data) => tonesListCollection.add(data))
    );

    // Seed goalsList collection
    const platformListData = [
      {
        id: 1,
        platform: "Social Media Post",
        description:
          "Content tailored for social media platforms like Twitter, Facebook, Instagram, etc.",
      },
      {
        id:2,
        platform: "API Response",
        description: "Content designed for API responses.",
      },
      {
        id:3,
        platform: "Email Campaign",
        description: "Content designed for email marketing campaigns.",
      },
      {
        id:4,
        platform: "Blog Article",
        description: "Detailed content suitable for blogs or websites.",
      },
      {
        id:5,
        platform: "Product Description",
        description:
          "Concise and persuasive descriptions for products on e-commerce sites.",
      },
      {
        id:6,
        platform: "News Article Summary",
        description: "Summaries of news articles for newsletters or updates.",
      },
      {
        id:7,
        platform: "Technical Documentation",
        description: "Technical writing for guides, manuals, or documentation.",
      },
      {
        id:8,
        platform: "Creative Storytelling",
        description:
          "Creative content for stories, scripts, or narrative pieces.",
      },
      {
        id:9,
        platform: "Professional LinkedIn Update",
        description: "Professional content for LinkedIn posts or updates.",
      },
      {
        id:10,
        platform: "YouTube Video Script",
        description: "Scripts tailored for YouTube videos or presentations.",
      },
      {
        id:11,
        platform: "Customer Support Response",
        description: "Tailored responses for customer support inquiries.",
      },
      {
        id:12,
        platform: "SMS",
        description:
          "Short and impactful messages designed for SMS communication.",
      },
      {
        id:13,
        platform: "Academic Assignment",
        description:
          "Well-researched and structured content for academic papers or assignments.",
      },
    ];

    await Promise.all(
      platformListData.map((data) => platformsListCollection.add(data))
    );

    console.log("Collections seeded successfully");
  } catch (err) {
    console.error(`Failed to seed collections: ${err}`);
  }
};

seedCollections();

const getJobsByUserToken = async (userToken) => {
  try {
    const jobsCollection = db.collection("jobs");
    const querySnapshot = await jobsCollection
      .where("userToken", "==", userToken)
      .get();

    const jobs = [];
    querySnapshot.forEach((documentSnapshot) => {
      const jobData = documentSnapshot.data();
      jobs.push(jobData);
    });

    return jobs;
  } catch (err) {
    throw new Error(`Failed to get jobs by user token: ${err}`);
  }
};
const sendEmail = async (content, subject, email) => {
  // Create a transporter using your Gmail account
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "info@add2cart.co.il",
      pass: "iuop kubf ehds kgzo",
      //pass: 'Shahar2024!'  iuop kubf ehds kgzo
    },
  });

  // Define the email options
  const mailOptions = {
    from: "info@add2cart.co.il",
    to: email,
    subject: subject,
    text: content,
  };

  // Send the email
  await transporter.sendMail(mailOptions);
};

exports.sendEmail = onRequest(async (request, response) => {
  const { email, subject, content } = request.body;

  try {
    await sendEmail(content, subject, email);
    response.status(200).json({ message: "Email sent successfully" });
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
