const handler = (req, resp) => {
  // You can access ther request body at req.body
  return resp.json({
    data: {
      // spread your output type here
    }
  });
};

export default handler;
