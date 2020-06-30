import express from "express";

const port = 3000;

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  if (
    !req.headers["x-auth-token"] ||
    req.headers["x-auth-token"] !== "PasswordX"
  )
    return res.status(401).json({ message: "Unauthorized" }).end();
  next();
});

app.post("/", (req, res) => {
  console.log(req.body);
  const resp = {};
  resp[req.body.device] = { downlinkData: 5 };
  res.status(200).json(resp);
});

app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);
