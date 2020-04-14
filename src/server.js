const express = require("express");
const bodyParser = require("body-parser");

const app = express();

const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/login', (req, resp) => {
  // You can access their arguments input at req.body.input
  const { username, password } = req.body.input;

  // perform your custom business logic
  // check if the username and password are valid and login the user

  // return the response
  return resp.json({
    accessToken: "Ew8jkGCNDGAo7p35RV72e0Lk3RGJoJKB"
  })
})

app.post('/addNumbers', (req, resp) => {
  const { numbers } = req.body.input;
  try {
    return resp.json({
      sum: numbers.reduce((s, n) => s + n, 0)
    });
  } catch(e) {
    console.error(e)
    return resp.status(500).json({
      message: 'unexpected'
    })
  }
});

app.post('/hello', async (req, res) => {
  return res.json({
    hello: "world"
  });
});

app.listen(PORT);
