const express = require("express");
const bodyParser = require("body-parser");
import Storage from './gqlClient'
const app = express();

const PORT = process.env.PORT || 3000;

import jwt from "jsonwebtoken";
import instagram from './instagram'
app.use(bodyParser.json());

const IS_AUTH = async (req, res, next)=>{
  if(!req.headers || !req.headers['authorization']){
      res.status(400).json({
          message:"Not authorized"
      })
      return
  }
  let token = req.headers['authorization']
  try{
      token = token.split('Bearer ')[1]
      let hasuraClaims = jwt.verify(token,process.env.JWT_SECRET)
      let user_id = hasuraClaims['https://hasura.io/jwt/claims']['x-hasura-user-id']
      let username = hasuraClaims['https://hasura.io/jwt/claims']['username']
      if(user_id){
          req.token = token
          req.username = username
          next()
          return
      }
  }catch(e){
      res.status(400).json({
          message:"Not authorized"
      })
      return
  }
  res.status(400).json({
      message:"Not authorized"
  })
}
app.post("/login", async (req, res) => {
  // get request input
  const { username, password } = req.body.input;
  let user = await instagram.login({username,password})
  if(!user){
    return res.status(400).json({
      message: "Wrong"
    })
  }
  user = await Storage.createUser({
      object:{
        username,
        password
      },
      on_conflict:{
        update_columns:['password','username'],
        constraint:'clients_username_key'
      }
  })
  delete user.password
  let token = await jwt.sign({
   "https://hasura.io/jwt/claims": {
      "x-hasura-allowed-roles": ["client","anonymous"],
      "x-hasura-default-role": "client",
      "x-hasura-user-id": user.id,
      'username':username
    }
  },process.env.JWT_SECRET)
  
  return res.json({
    token: token,
    user_id: user.id
  });
});

app.post('/send-verfication-code',async(req,res)=>{
  const { code, username } = req.body.input;
  let user = await instagram.verifyChallenge({code,username})
  console.log(user)
  let token = await jwt.sign({
   "https://hasura.io/jwt/claims": {
      "x-hasura-allowed-roles": ["client","anonymous"],
      "x-hasura-default-role": "client",
      "x-hasura-user-id": user.id
    }
  },process.env.JWT_SECRET)
  return res.json({
    token: token,
    status: true
  })
})

app.post('/follow', IS_AUTH, async (req, res)=>{
  const { username } = req.body.input;

  let count = await instagram.follow(username)
  return res.json({
    status:Boolean(count),
    count
  })
})

app.listen(PORT);
