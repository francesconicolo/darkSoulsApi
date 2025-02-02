import { Request, Response } from "express";
import { weaponService } from "../services/weapon.service";

const getAll = async (req: Request, res: Response) => {
  try {
    const weapon = await weaponService.getAll(req);
    res.status(200).send(weapon);
  } catch (e) {
    res.status(500).send(e);
  }
};

export const weaponController = {
  getAll,
};
