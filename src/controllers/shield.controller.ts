import { Request, Response } from "express";
import { shieldService } from "../services/shield.service";
import { get } from "http";

const getAll = async (req: Request, res: Response) => {
  try {
    const response = await shieldService.getAll(req);
    res.status(200).send(response);
  } catch (e) {
    res.status(500).send(e);
  }
};

const getById = async (req: Request, res: Response) => {
  try {
    const response = await shieldService.getById(req);
    res.status(200).send(response);
  } catch (e) {
    res.status(500).send(e);
  }
};

const getUpgrades = async (req: Request, res: Response) => {
  try {
    const response = await shieldService.getUpgrades(req);
    res.status(200).send(response);
  } catch (e) {
    res.status(500).send(e);
  }
};

const getCategories = async (req: Request, res: Response) => {
  try {
    const response = await shieldService.getCategories();
    res.status(200).send(response);
  } catch (e) {
    res.status(500).send(e);
  }
};

export const shieldController = {
  getAll,
  getUpgrades,
  getCategories,
  getById
};
