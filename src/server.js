const express = require("express");
const bodyParser = require("body-parser");

const app = express();

const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

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
