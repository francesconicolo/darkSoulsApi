export type Armor = {
  name:string,
  type:string,
  category: ArmorCategoryEnum,
  weight: number,
  poise_ratio: number,
  total_poise:number,
  upgrade:Upgrade[]
}


export type Upgrade = {
  level: number,
  physical_defense: number,
  strike_defense: number,
  slash_defense: number,
  thrust_defense: number,
  magic_defense: number,
  fire_defense: number,
  lightning_defense: number,
  bleed_resistance: number,
  poison_resistance: number,
  curse_resistance: number
}

export enum ArmorCategoryEnum {
  HEAD = "Head",
  CHEST = "Chest",
  LEGS = "Legs",
  ARMS = "Arms"
}