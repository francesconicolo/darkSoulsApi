import express from "express";
import cors from "cors";
import http from "http";
import { weaponRoute } from "./routes/weapon.route";

const port = 3000;
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/weapons", weaponRoute);

app.get("/ping", (req, res) => {
  res.status(200).send({ prova: "ciao" });
});

http
  .createServer(app)
  .listen(port, () => console.log(`Server is running on port ${port}`));
