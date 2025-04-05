import express from "express";
import { armorController } from "../controllers/armor.controller";

export const armorRoute = express.Router();

armorRoute.get("/", armorController.getAll);
armorRoute.get("/categories", armorController.getCategories);
armorRoute.get("/upgrades/", armorController.getUpgrades);
armorRoute.get("/:id", armorController.getById);
