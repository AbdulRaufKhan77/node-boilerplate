const express = require("express");
const app = express();
const connectToMongo = require("./src/connections");
const routes = require("./src/routes");
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectToMongo();

app.get("/ping", (req, res) => {
  res.send("Hello World!");
});

app.use("/api", routes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
