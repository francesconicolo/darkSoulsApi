export type Weapon = {
  idWeapon: string;
  name: string;
  reinforce: number;
  type: WeaponTypeEnum;
  reqStr: number;
  reqDex: number;
  reqInt: number;
  reqFth: number;
  scaStr: WeaponScalingEnum | null;
  scaDex: WeaponScalingEnum | null;
  scaInt: WeaponScalingEnum | null;
  scaFth: WeaponScalingEnum | null;
  physicalAtk: boolean;
  magicAtk: boolean;
  fireAtk: boolean;
  lightingAtk: boolean;
  totalAtk: boolean;
  bleed: number | null;
  poison: number | null;
  divine: number | null;
  occult: number | null;
  magAdjust: number | null;
  weight: boolean;
};

export enum WeaponTypeEnum {
  AXES = "Axes",
  BOWS = "Bows",
  CATALYST = "Catalyst",
  CROSSBOWS = "Crossbows",
  CURVED_GREATSWORD = "Curved Greatsword",
  CURVED_SWORDS = "Curved Swords",
  DAGGERS = "Daggers",
  FISTS = "Fists",
  GREAT_HAMMERS = "Great Hammers",
  GREATBOWS = "Greatbows",
  GREATSHIELDS = "Greatshields",
  GREATSWORDS = "Greatswords",
  HALBERDS = "Halberds",
  HAMMERS = "Hammers",
  KATANAS = "Katanas",
  LANTERNS = "Lanterns",
  PYROMANCY_FLAMES = "Pyromancy Flames",
  SHIELDS = "Shields",
  SMALL_SHIELDS = "Small Shields",
  SPEARS = "Spears",
  STRAIGHT_SWORDS = "Straight Swords",
  TALISMAN = "Talisman",
  THRUSTING_SWORDS = "Thrusting Swords",
  ULTRA_GREATSWORD = "Ultra Greatsword",
  WHIPS = "Whips",
}

export enum WeaponScalingEnum {
  S = "S",
  A = "A",
  B = "B",
  C = "C",
  D = "D",
  E = "E",
}
