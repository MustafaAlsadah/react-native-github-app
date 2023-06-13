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

exports.webhooks = onRequest((req, res)=>{
    console.log("webhooks: "+JSON.stringify(req.body));
    logger.log("webhooks: "+JSON.stringify(req.body));
    res.json({message: "webhooks"});
});
