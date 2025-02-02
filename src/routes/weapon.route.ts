import express from "express";
import { weaponController } from "../controllers/weapon.controller";

export const weaponRoute = express.Router();

weaponRoute.get("/", weaponController.getAll);
