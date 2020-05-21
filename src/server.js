const express = require("express");
const bodyParser = require("body-parser");

const app = express();

const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

// paste the code from codegen here





app.post('/hello', async (req, res) => {
  return res.json({
    hello: "world"
  });
});

app.listen(PORT);
