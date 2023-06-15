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
const fs = require('fs');
require('dotenv').config();
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

exports.sendWebHook = onRequest(async (req, res)=>{
  try{
    const payload = JSON.parse(req.body.payload)

    console.log("HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHh: "+JSON.stringify(payload.comment));
    console.log("HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHh: "+JSON.stringify(payload.comment.body));


const { title, comments_url } = payload.issue;
const { login } = payload.comment.user;
const { comment } = payload.comment.body;

if (login === "KoksalBot") return;
if (login === "KoksalBot") res.json({message: "koksalbot -> don't respond"});


const askGPT = async () => {
  const openaiKey = process.env.OPENAI_KEY;
  const configuration = new Configuration({
    apiKey: process.env.OPENAI_KEY,
  });
  const openai = new OpenAIApi(configuration);
  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [{role: "user", content: JSON.stringify(payload.comment.body)}]
  });
  console.log("fter gpt response");


  const gptResponse = JSON.stringify(response?.data?.choices[0]?.message?.content ?? "UNEXPECTED ERROR: NO RESPONSE");

  return gptResponse;
};

const gptResponse = await askGPT();

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
        body: JSON.stringify({ body: gptResponse }), // The content of the comment
      }
    );
    console.log("fter post comment");


    const data = await response.json();
    console.log(JSON.stringify(data));

  } catch (error) {
    console.log('Error posting comment:', error);
  }
};

await postComment();
  
    
    res.json({message: "gptResponse"});
  }catch(err){
    console.log(err);
    res.json({message: err.message});
  }

});



