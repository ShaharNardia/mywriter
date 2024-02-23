const { onRequest } = require("firebase-functions/v2/https");
const cors = require("cors")({ origin: true });

// const logger = require("firebase-functions/logger");
// const cheerio = require('cheerio');
const axios = require("axios");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");
const functions = require("firebase-functions");

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
exports.getContentById = onRequest(async (request, response) => {
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
exports.getContentsByUserToken = onRequest(async (request, response) => {
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
    const platformsListCollection = db.collection("platformsList");
    const jobTypesListCollection = db.collection("jobTypesList");

    const collectionsToCheck = [
      "goalsList",
      "tonesList",
      "platformsList",
      "jobTypesList",
    ];

    for (let collectionName of collectionsToCheck) {
      const collection = db.collection(collectionName);
      const document = await collection.findOne();

      if (!document) {
        console.log("Seeding collections");
        await seedCollections();
        break;
      }
    }

    console.log("Getting form settings");
    const goalsListSnapshot = await goalsListCollection.get();
    const tonesListSnapshot = await tonesListCollection.get();
    const platformsListSnapshot = await platformsListCollection.get();
    const jobTypesListSnapshot = await jobTypesListCollection.get();

    const goalsList = goalsListSnapshot.docs.map((doc) => doc.data());
    const tonesList = tonesListSnapshot.docs.map((doc) => doc.data());
    const platformsList = platformsListSnapshot.docs.map((doc) => doc.data());
    const jobTypesList = jobTypesListSnapshot.docs.map((doc) => doc.data());

    const formSettings = {
      goalsList,
      tonesList,
      platformsList,
      jobTypesList,
    };

    response.status(200).json(formSettings);
  } catch (err) {
    response.status(500).json({ error: `Failed to get form settings: ${err}` });
  }
});

exports.scheduledJob = functions.pubsub
  .schedule("every 2 minutes")
  .onRun(async () => {
    try {
      const jobsCollection = db.collection("jobs");
      const now = new Date();
      if (!jobsCollection.empty) {
        const querySnapshot = await jobsCollection
          .where("active", "==", true)
          .where("lastRun", "<=", now)
          .get();

        querySnapshot.forEach(async (doc) => {
          const jobData = doc.data();
          const { runEveryMinutes, lastRun } = jobData;

          if (lastRun === null || isTimeToRun(lastRun, runEveryMinutes)) {
            // Run the job
            await runJob(jobData);
          }
        });

        return null;
      } else {
        console.log("No active jobs found");
      }
    } catch (error) {
      console.error("Error running scheduled job:", error);
      throw new Error("Failed to run scheduled job");
    }
  });

function isTimeToRun(lastRun, runEveryMinutes) {
  const minutesSinceLastRun = (new Date() - lastRun) / (1000 * 60);
  return minutesSinceLastRun >= runEveryMinutes;
}

async function runJob(jobData) {
  // Implement your job logic here
  console.log("Running job:", jobData);
  // ...
}
// const deleteCollection = async (collection) => {
//   const query = collection.limit(100);
//   return new Promise((resolve, reject) => {
//     deleteQueryBatch(query, resolve).catch(reject);
//   });
// };
// const deleteQueryBatch = async (query, resolve) => {
//   const snapshot = await query.get();

//   if (snapshot.size === 0) {
//     // When there are no documents left, we are done
//     return resolve();
//   }

//   // Delete documents in a batch
//   const batch = db.batch();
//   snapshot.docs.forEach((doc) => {
//     batch.delete(doc.ref);
//   });

//   await batch.commit();

//   // Recurse on the next process tick, to avoid exploding the stack.
//   process.nextTick(() => {
//     deleteQueryBatch(query, resolve);
//   });
// };

// Seed goalsList collection
const goalsListData = [
  {
    id: 1,
    goal: "Increase Engagement",
    description: "Create content that boosts user interaction and engagement.",
    icon: ["fas", "users"],
  },
  {
    id: 2,
    goal: "Drive Sales",
    description:
      "Generate content aimed at increasing product sales or service sign-ups.",
    icon: ["fas", "cart-shopping"],
  },
  {
    id: 3,
    goal: "Educate Audience",
    description:
      "Provide informative content that educates the audience on specific topics.",
    icon: ["fas", "book-open"],
  },
  {
    id: 4,
    goal: "Build Brand Awareness",
    description:
      "Craft content that enhances brand recognition and visibility.",
    icon: ["fas", "bullhorn"],
  },
  {
    id: 5,
    goal: "Improve SEO",
    description:
      "Focus on content that is optimized to improve search engine rankings.",
    icon: ["fas", "magnifying-glass"],
  },
  {
    id: 6,
    goal: "Entertain",
    description: "Entertain the audience with creative and engaging content.",
    icon: ["fas", "face-grin-beam"],
  },
  {
    id: 7,
    goal: "Inspire",
    description:
      "Inspire the audience with motivational and uplifting content.",
    icon: ["fas", "lightbulb"],
  },
  {
    id: 8,
    goal: "Inform",
    description:
      "Keep the audience informed with the latest news, updates, or trends.",
    icon: ["fas", "newspaper"],
  },
  {
    id: 9,
    goal: "Connect",
    description:
      "Create content that fosters a sense of community and connection.",
    icon: ["fas", "heart"],
  },
  {
    id: 10,
    goal: "Promote Events",
    description: "Promote upcoming events or webinars to increase attendance.",
    icon: ["fas", "calendar-day"],
  },
  {
    id: 11,
    goal: "Academic Assistance",
    description:
      "Assist students in generating well-researched and structured content for academic assignments.",
    icon: ["fas", "user-graduate"],
  },
];
// Seed tonesList collection
const tonesListData = [
  {
    id: 1,
    tone: "Informative",
    description: "Provides factual information and explanations.",
    icon: ["fas", "circle-info"],
  },
  {
    id: 2,
    tone: "Persuasive",
    description:
      "Aims to convince the audience of a particular viewpoint or action.",
    icon: ["fas", "bullhorn"],
  },
  {
    id: 3,
    tone: "Friendly",
    description:
      "Warm and inviting, suitable for casual or personal communications.",
    icon: ["fas", "face-smile"],
  },
  {
    id: 4,
    tone: "Professional",
    description:
      "Formal and business-like, appropriate for professional contexts.",
    icon: ["fas", "briefcase"],
  },
  {
    id: 5,
    tone: "Inspirational",
    description:
      "Uplifting and motivational, often used to inspire action or hope.",
    icon: ["fas", "lightbulb"],
  },
  {
    id: 6,
    tone: "Humorous",
    description:
      "Light-hearted and funny, great for engaging and entertaining the audience.",
    icon: ["fas", "face-grin-tears"],
  },
  {
    id: 7,
    tone: "Sarcastic",
    description:
      "Uses irony and satire to convey messages, often in a humorous way.",
    icon: ["fas", "face-grin-wink"],
  },
  {
    id: 8,
    tone: "Romantic",
    description:
      "Expresses love, affection, or strong emotions, suitable for personal letters or creative works.",
    icon: ["fas", "heart"],
  },
  {
    id: 9,
    tone: "Technical",
    description:
      "Includes specialized language and jargon, ideal for industry-specific topics.",
    icon: ["fas", "microchip"],
  },
  {
    id: 10,
    tone: "Conversational",
    description:
      "Mimics natural speech patterns, making content feel more personal and relatable.",
    icon: ["fas", "comments"],
  },
];
// Seed platformsList collection
const platformsListData = [
  {
    id: 1,
    platform: "Social Media Post",
    description:
      "Content tailored for social media platforms like Twitter, Facebook, Instagram, etc.",
    icon: ["fab", "twitter"],
  },
  {
    id: 2,
    platform: "API Response",
    description: "Content designed for API responses.",
    icon: ["fas", "code"],
  },
  {
    id: 3,
    platform: "Email Campaign",
    description: "Content designed for email marketing campaigns.",
    icon: ["fas", "envelope"],
  },
  {
    id: 4,
    platform: "Blog Article",
    description: "Detailed content suitable for blogs or websites.",
    icon: ["fas", "blog"],
  },
  {
    id: 5,
    platform: "Product Description",
    description:
      "Concise and persuasive descriptions for products on e-commerce sites.",
    icon: ["fas", "box-open"],
  },
  {
    id: 6,
    platform: "News Article Summary",
    description: "Summaries of news articles for newsletters or updates.",
    icon: ["fas", "newspaper"],
  },
  {
    id: 7,
    platform: "Technical Documentation",
    description: "Technical writing for guides, manuals, or documentation.",
    icon: ["fas", "file-code"],
  },
  {
    id: 8,
    platform: "Creative Storytelling",
    description: "Creative content for stories, scripts, or narrative pieces.",
    icon: ["fas", "feather-alt"],
  },
  {
    id: 9,
    platform: "Professional LinkedIn Update",
    description: "Professional content for LinkedIn posts or updates.",
    icon: ["fab", "linkedin"],
  },
  {
    id: 10,
    platform: "YouTube Video Script",
    description: "Scripts tailored for YouTube videos or presentations.",
    icon: ["fab", "youtube"],
  },
  {
    id: 11,
    platform: "Customer Support Response",
    description: "Tailored responses for customer support inquiries.",
    icon: ["fas", "headset"],
  },
  {
    id: 12,
    platform: "SMS",
    description: "Short and impactful messages designed for SMS communication.",
    icon: ["fas", "sms"],
  },
  {
    id: 13,
    platform: "Academic Assignment",
    description:
      "Well-researched and structured content for academic papers or assignments.",
    icon: ["fas", "user-graduate"],
  },
];
// Seed goalsList collection
const jobTypesListData = [
  {
    id: 1,
    jobType: "Fetch X Numbers of Blog Title/s",
    description:
      "Generate a list of blog title ideas based on trending topics or specified niches every week to inspire your content creation.",
    icon: ["fas", "lightbulb"],
  },
  {
    id: 2,
    jobType: "Generate Social Media Post/s",
    description:
      "Create ready-to-publish social media posts tailored to your brand's voice and audience, saving you hours of brainstorming and writing.",
    icon: ["fas", "pencil-alt"],
  },
  {
    id: 3,
    jobType: "Generate Email Marketing Idea/s",
    description:
      "Produce innovative email marketing concepts, including subject lines and content ideas, to enhance your email campaigns.",
    icon: ["fas", "envelope"],
  },
  {
    id: 4,
    jobType: "Generate Educational Content Pieces",
    description:
      "Generate educational articles, lesson plans, or course materials tailored to specific subjects or learning outcomes.",
    icon: ["fas", "chalkboard-teacher"],
  },
  {
    id: 5,
    jobType: "Produce Product Descriptions ",
    description:
      "Craft unique and persuasive product descriptions for new or existing products, boosting your e-commerce efforts.",
    icon: ["fas", "tags"],
  },
  {
    id: 6,
    jobType: "Automate Weekly Competitive Content Analysis",
    description:
      "Receive weekly insights on competitors' content strategies, helping you stay ahead and fine-tune your content marketing.",
    icon: ["fas", "search"],
  },
  {
    id: 7,
    jobType: "Generate SEO Content Reports",
    description:
      "Automatically analyze and report on the SEO performance of your content, providing actionable insights for optimization.",
    icon: ["fas", "chart-line"],
  },
  {
    id: 8,
    jobType: "Create X Press Releases",
    description:
      "Automatically generate press releases for your company's milestones, product launches, or events, ready for distribution.",
    icon: ["fas", "bullhorn"],
  },
];

// Function to seed collections with initial data
async function seedCollections() {
  // Firestore reference

  // Array of collections and their corresponding seed data
  const collectionsData = [
    { name: "goalsList", data: goalsListData },
    { name: "tonesList", data: tonesListData },
    { name: "platformsList", data: platformsListData },
    { name: "jobTypesList", data: jobTypesListData },
  ];

  // Iterate over each collection to seed data
  for (const { name, data } of collectionsData) {
    const collectionRef = db.collection(name);
    const snapshot = await collectionRef.limit(1).get();

    // Check if the collection is empty
    if (snapshot.empty) {
      console.log(`Seeding ${name}...`);
      // Seed the collection with data
      for (const item of data) {
        await collectionRef.add(item);
      }
    }
  }

  console.log("Seeding completed.");
}

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
