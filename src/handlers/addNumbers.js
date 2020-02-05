const handler = (req, resp) => {
  // You can access ther request body at req.body
  const { numbers } = req.body.input;
  try {
    return resp.json({
      data: {
        sum: numbers.reduce((s, n) => s + n)
      }
    });
  } catch(_) {
    return resp.status(500).json({
      message: 'unexpected'
    })
  }
};

export default handler;
