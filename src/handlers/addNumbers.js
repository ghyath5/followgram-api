const handler = (req, resp) => {
  // You can access ther request body at req.body
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
};

module.exports = handler;
