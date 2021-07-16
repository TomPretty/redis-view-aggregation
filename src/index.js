const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const views = require("./views");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const ONE_MINUTE_MS = 60 * 1000

const viewLogger = views({ windowTimeMs: ONE_MINUTE_MS });

app.get("/views", async (req, res) => {
  const views = await viewLogger.getAllViews();

  res.json({ views });
});

app.post("/views", async (req, res) => {
  const { test } = req.body;

  await viewLogger.logView(test);

  res.sendStatus(201);
});

const PORT = 8080;

app.listen(PORT, () => {
  console.log(`listening on: http://localhost:${PORT}`);
});
