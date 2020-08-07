const express = require("express");
const bodyParser = require("body-parser");

const app = express();

const PORT = process.env.PORT || 3000;

import jwt from "jsonwebtoken";
import instagram from './instagram'
app.use(bodyParser.json());

// paste the code from codegen here

// Request Handler
app.post("/login", async (req, res) => {
  // get request input
  const { username, password } = req.body.input;
  let user = await instagram.login({username,password})
  console.log(user)
  // return res.status(400).json({
  //   message: "error happened"
  // })
  jwt.sign()
  // success
  return res.json({
    token: "<value>",
    user_id: "<value>"
  });
});

app.post('/send-verfication-code',async(req,res)=>{
  const { code, username } = req.body.input;
  let user = await instagram.verifyChallenge({code,username})
  console.log(user)
  
  return res.json({
    token: "<value>",
    status: "<value>"
  })
})

app.listen(PORT);
