import express from "express";
import { armorController } from "../controllers/armor.controller";

export const armorRoute = express.Router();

armorRoute.get("/", armorController.getAll);
armorRoute.get("/upgrades/", armorController.getUpgrades);
