import express from "express";
import cors from "cors";
import http from "http";
import { weaponRoute } from "./routes/weapon.route";
import { armorRoute } from "./routes/armor.route";
import { shieldRoute } from "./routes/shield.route";
import { generalRoute } from "./routes/general.route";




const port = 3001;
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/weapon", weaponRoute);
// Routes
app.use("/api/armor", armorRoute);
// Routes
app.use("/api/shield", shieldRoute);
// Routes
app.use("/api/general", generalRoute);




app.get("/ping", (req, res) => {
  res.status(200).send({ ping: "pong" });
});

http
  .createServer(app)
  .listen(port, () => console.log(`Server is running on port ${port}`));
