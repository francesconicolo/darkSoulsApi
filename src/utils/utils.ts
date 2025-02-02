import { PostgrestFilterBuilder } from "@supabase/postgrest-js";
import { WeaponScalingEnum, WeaponTypeEnum } from "../models/weapon.model";

type FilterCriteria = {
  [key: string]: (
    query: PostgrestFilterBuilder<any, any, any[], any, unknown>,
    value: string | number | WeaponTypeEnum | WeaponScalingEnum
  ) => PostgrestFilterBuilder<any, any, any[], any, unknown>;
};

export const filterCriteria: FilterCriteria = {
  idWeapon: (query, value) => query.eq("idWeapon", value),
  name: (query, value) => query.ilike("name", `%${value}%`),
  reinforce: (query, value) =>
    Array.isArray(value)
      ? query.in("reinforce", value)
      : query.eq("reinforce", value),
  type: (query, value) =>
    Array.isArray(value) ? query.in("type", value) : query.eq("type", value),
  reqStr: (query, value) => query.lt("reqStr", value),
  reqDex: (query, value) => query.lt("reqDex", value),
  reqInt: (query, value) => query.lt("reqInt", value),
  reqFth: (query, value) => query.lt("reqFth", value),
  scaStr: (query, value) =>
    Array.isArray(value)
      ? query.in("scaStr", value)
      : query.eq("scaStr", value),
  scaDex: (query, value) =>
    Array.isArray(value)
      ? query.in("scaDex", value)
      : query.eq("scaDex", value),
  scaInt: (query, value) =>
    Array.isArray(value)
      ? query.in("scaInt", value)
      : query.eq("scaInt", value),
  scaFth: (query, value) =>
    Array.isArray(value)
      ? query.in("scaFth", value)
      : query.eq("scaFth", value),
  // physicalAtk: (query, value) => query.eq("physicalAtk", value),
  // magicAtk: (query, value) => query.eq("magicAtk", value),
  // fireAtk: (query, value) => query.eq("fireAtk", value),
  // lightningAtk: (query, value) => query.eq("lightningAtk", value),
  // totalAtk: (query, value) => query.eq("totalAtk", value),
  // bleed: (query, value) => query.eq("bleed", value),
  // poison: (query, value) => query.eq("poison", value),
  // divine: (query, value) => query.eq("divine", value),
  // occult: (query, value) => query.eq("occult", value),
  // magAdjust: (query, value) => query.eq("magAdjust", value),
  weight: (query, value) => query.lt("weight", value),
};
