const express = require("express");
const bodyParser = require("body-parser");
const views = require("./views");

const app = express();
app.use(bodyParser.json());

const viewLogger = views({ windowTimeMs: 15_000 });

app.post("/epic", async (req, res) => {
  const { url } = req.body;

  const numViews = await viewLogger.getViews(url);

  if (numViews > 5) {
    res.json({ epic: "supermode epic" });
  } else {
    res.json({ epic: "regular epic" });
  }
});

app.get("/views", async (req, res) => {
  const { url } = req.query;

  const numViews = await viewLogger.getViews(url);

  res.json({ views: numViews });
});

app.post("/views", async (req, res) => {
  const { url } = req.body;

  await viewLogger.logView(url);

  res.sendStatus(201);
});

const PORT = 8080;

app.listen(PORT, () => {
  console.log(`listening on: http://localhost:${PORT}`);
});
