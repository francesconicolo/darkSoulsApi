import { Request } from "express";
import supabase from "../config/supabase-client";
import { filterCriteria } from "../utils/utils";
import { WeaponScalingEnum, WeaponTypeEnum } from "../models/weapon.model";

const getAll = async (req: Request) => {
  const params = req.query;
  let query = supabase.from("weapon").select("*");
  Object.entries(params).forEach(([key, value]) => {
    const filterFunction = filterCriteria[key];
    if (filterFunction) {
      query = filterFunction(
        query,
        value as string | number | WeaponTypeEnum | WeaponScalingEnum
      );
    }
  });

  const { data, error } = await query;
  if (error) {
    throw error;
  }
  return data;
};

export const weaponService = {
  getAll,
};
