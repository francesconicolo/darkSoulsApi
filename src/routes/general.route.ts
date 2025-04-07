import express from "express";
import { generalController } from "../controllers/general.controller";


export const generalRoute = express.Router();

generalRoute.get("/categories", generalController.getCategories);
generalRoute.get("/lightInfo", generalController.getLightInfo );