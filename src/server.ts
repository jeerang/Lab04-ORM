import express, { type Request, type Response } from "express";
import routes from "./routes";

const app = express();
const port = 3000;

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

// Use all routes
app.use(routes);

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
