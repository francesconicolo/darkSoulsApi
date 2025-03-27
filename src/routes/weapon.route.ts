import express from "express";
import { weaponController } from "../controllers/weapon.controller";

export const weaponRoute = express.Router();

weaponRoute.get("/", weaponController.getAll);
weaponRoute.get("/upgrades/", weaponController.getUpgrades);
weaponRoute.get("/upgrades/type",weaponController.getUpgradesType)

