import { Request, Response } from "express";

import { generalService } from "../services/general.service";


const getCategories = async (req: Request, res: Response) => {
  try {
    const response = await generalService.getCategories();
    res.status(200).send(response);
  } catch (e) {
    res.status(500).send(e);
  }
};
const getLightInfo = async (req: Request, res: Response) => {
  try {
    const response = await generalService.getLightInfo(req);
    res.status(200).send(response);
  } catch (e) {
    res.status(500).send(e);
  }
};

export const generalController = {
  getCategories,
  getLightInfo,
};