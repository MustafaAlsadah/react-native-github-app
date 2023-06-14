/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */
const { onRequest } = require("firebase-functions/v2/https");
const fetch = require('node-fetch');
const {logger} = require("firebase-functions");
const { Configuration, OpenAIApi } = require("openai");
// const axios = require('axios');

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started


exports.user = onRequest(async (req, res)=>{
//   logger.log("Uppercasing", event.params.documentId, original);
    const authToken = req.query.token;
    console.log("funcs token: "+JSON.stringify(authToken));
    const response = await fetch("https://api.github.com/user", {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${authToken}`,
          Accept: 'application/vnd.github.v3+json',
        },
      })
      const data = await response.json();
      res.json(data);
});

exports.starred = onRequest(async (req, res)=>{
    const authToken = req.query.token;
    const response = await fetch("https://api.github.com/user/starred", {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${authToken}`,
          Accept: 'application/vnd.github.v3+json',
        },
      })
      const data = await response.json();
      res.json(data);
});

exports.repos = onRequest(async (req, res)=>{
    const authToken = req.query.token;
    const name = req.query.name;
    const response = await fetch("https://api.github.com/users/"+name+"/repos", {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${authToken}`,
          Accept: 'application/vnd.github.v3+json',
        },
      })
      const data = await response.json();
      res.json(data);
});

exports.ghWebHooks = onRequest(async (req, res)=>{

console.log("OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO");
console.log(req.body.issue.title);
console.log(req.body.issue.comments_url);
console.log(req.body.comment.user.login)
console.log(req.body.comment.body)
console.log("FFFFFFFFFFFFFFFFFFFFFFFFFFFFFF FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF");

  
const { title, body, comments_url } = req?.body?.issue;
const { login } = req?.body?.comment.user;
const { comment } = req?.body?.comment?.body;


const postComment = async () => {

  try {
    const response = await fetch(
      comments_url
      ,{
        method: 'POST',
        headers: {
          Authorization: `Bearer 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`,
          Accept: 'application/vnd.github.v3+json',
        },
        body: JSON.stringify({login: login, comment: comment}), // The content of the comment
        body: JSON.stringify({ body: login+comment }), // The content of the comment
      }
    );

    const data = await response.json();
    console.log(JSON.stringify(data));

  } catch (error) {
    console.log('Error posting comment:', error);
  }
};

await postComment();
  
    
    res.json({message: "gptResponse"});
});



exports.gptClient = onRequest(async (req, res)=>{

  const configuration = new Configuration({
    apiKey: "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",
  });
  const openai = new OpenAIApi(configuration);
  const prompt = `
  This is an issue on github, please propose a solution for it:
  
  Explain how the world is running like i'm 5`;
  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [{role: "user", content: prompt}]
  });

  const gptResponse = JSON.stringify(response?.data?.choices[0]?.message?.content ?? "UNEXPECTED ERROR: NO RESPONSE");

  logger.log("GPT Response: "+gptResponse);
  res.json({message: gptResponse});

});
 