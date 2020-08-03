const express = require("express");
const bodyParser = require("body-parser");

const app = express();

const PORT = process.env.PORT || 3000;
import {
  IgApiClient,
  IgLoginTwoFactorRequiredError
} from "instagram-private-api";
import jwt from "jsonwebtoken";
app.use(bodyParser.json());

// paste the code from codegen here

// Request Handler
app.post("/login", async (req, res) => {
  // get request input
  const { username, password } = req.body.input;

  const ig = new IgApiClient();
  ig.state.generateDevice(username);
  let user = await ig.account.login(username, password);
  console.log(user);
  // return res.status(400).json({
  //   message: "error happened"
  // })

  // success
  return res.json({
    token: "<value>",
    user_id: "<value>"
  });
});

app.listen(PORT);
