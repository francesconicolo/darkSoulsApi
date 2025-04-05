import express from "express";
import { shieldController } from "../controllers/shield.controller";

export const shieldRoute = express.Router();

shieldRoute.get("/", shieldController.getAll);
shieldRoute.get("/categories", shieldController.getCategories);
shieldRoute.get("/upgrades/", shieldController.getUpgrades);
shieldRoute.get("/:id", shieldController.getById);

