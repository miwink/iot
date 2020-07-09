import express from "express";
import cors from "cors";
import influx from "./db";
import { buffToInts, addMinutes } from "./utils";

const port = 3000;

const app = express();

app.use(cors());
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
  if (req.body.device && req.body.device != null) {
    const resp = {};
    resp[req.body.device] = { downlinkData: "0011223344556677" };
    res.status(200).json(resp);
  } else {
    res.status(204).end();
  }
});

app.put("/", async (req, res) => {
  const measurements = req.body.measurements;
  const timestamp = new Date(req.body.timestamp * 1000);
  const start_time = addMinutes(timestamp, -15);
  const interval = 15 / measurements;

  const data = buffToInts(Buffer.from(req.body.data, "hex"));

  for (let i = 0; i < data.length; i++) {
    await influx.writePoints([
      {
        measurement: "waterlevel",
        tags: { device: req.body.device },
        fields: { level: data[i] },
        timestamp: addMinutes(start_time, i * interval),
      },
    ]);
  }

  res.status(200).json({ message: "success" });
});

app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);
