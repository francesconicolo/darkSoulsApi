import { Request, Response } from "express";
import { armorService } from "../services/armor.service";
import { get } from "http";

const getAll = async (req: Request, res: Response) => {
  try {
    const response = await armorService.getAll(req);
    res.status(200).send(response);
  } catch (e) {
    res.status(500).send(e);
  }
};

const getById = async (req: Request, res: Response) => {
  try {
    const response = await armorService.getById(req);
    res.status(200).send(response);
  } catch (e) {
    res.status(500).send(e);
  }
};

const getUpgrades = async (req: Request, res: Response) => {
  try {
    const response = await armorService.getUpgrades(req);
    res.status(200).send(response);
  } catch (e) {
    res.status(500).send(e);
  }
};

const getCategories = async (req: Request, res: Response) => {
  try {
    const response = await armorService.getCategories();
    res.status(200).send(response);
  } catch (e) {
    res.status(500).send(e);
  }
};
export const armorController = {
  getAll,
  getUpgrades,
  getCategories,
  getById
};
