import express from "express";

const port = 8080;

const initServer = async () => {
  const app = express();

  app.get("/", () => {
    return 0;
  });

  return app;
};

initServer().then((app) => {
  app.listen(port, () =>
    console.log(`Example app listening at http://localhost:${port}`)
  );
});
