import express from "express";
import bodyParser from "body-parser";

const app = express();

const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/:route', (req, res) => {
  try {
    const handler = require(`./handlers/${req.params.route}`).default;
    return handler(req, res);
  } catch (e){
    console.error(e);
    return res.status(404).json({
      message: 'not found'
    });
  } 
})

app.listen(PORT);
