import { Request, Response } from "express";
import { weaponService } from "../services/weapon.service";

const getAll = async (req: Request, res: Response) => {
  try {
    const response = await weaponService.getAll(req);
    res.status(200).send(response);
  } catch (e) {
    res.status(500).send(e);
  }
};

const getUpgrades = async (req: Request, res: Response) => {
  try {
    const response = await weaponService.getUpgrades(req);
    res.status(200).send(response);
  } catch (e) {
    res.status(500).send(e);
  }
};

const getUpgradesType = async (req: Request, res: Response) => {
  try {
    const response = await weaponService.getUpgradesType(req);
    res.status(200).send(response);
  } catch (e) {
    res.status(500).send(e);
  }
};

export const weaponController = {
  getAll,
  getUpgrades,
  getUpgradesType
};
