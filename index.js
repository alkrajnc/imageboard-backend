import express, { json, urlencoded } from "express";
import cors from "cors";

const app = express();
const port = 3000;

import posts from "./routes/posts/route.js";
import auth from "./routes/auth/route.js";
import user from "./routes/user/route.js";
app.use(
  cors({
    origin: "http://localhost:5173",
  })
);
app.use(json());
app.use(
  urlencoded({
    extended: true,
  })
);

app.get("/", async (req, res) => {
  res.json(await insertPost());
});
app.use("/storage", express.static("storage"));

app.use("/api/posts", posts);
app.use("/api/auth", auth);
app.use("/api/user", user);
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  console.error(err.message, err.stack);
  res.status(statusCode).json({ message: err.message });
  return;
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
