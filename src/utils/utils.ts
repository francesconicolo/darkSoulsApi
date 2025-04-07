import { Filter, Document, ObjectId } from 'mongodb';
import QueryString, { ParsedQs } from 'qs';

export const filtersGetAllWeapon = (params:QueryString.ParsedQs) => {
  let query: Filter<Document> = {};
// 🔍 Filtro per il nome (case-insensitive, cerca parzialmente)
  if (typeof params.name === "string" && params.name.trim() !== "") {
    query.name = { $regex: params.name, $options: "i" };
  }

  // 🔍 Filtri numerici
  const numericFilters: { [key: string]: string } = {
    "weight": "$gt",
    "durability": "$gte",
    "stability": "$gte",
    "requirements.strength": "$lte",
    "requirements.dexterity": "$lte",
    "requirements.intelligence": "$lte",
    "requirements.faith": "$lte"
  };

  for (const [key, operator] of Object.entries(numericFilters)) {
    if (params[key] !== undefined && !isNaN(Number(params[key])) && operator) {
      query[key] = { [operator]: Number(params[key]) };
    }
  }

  // 🔍 Filtri per valori stringa esatti (attack_type, category)
  const stringFilters = ["attack_type", "category"];

  for (const key of stringFilters) {
    if (typeof params[key] === "string" && params[key].trim() !== "") {
      query[key] = params[key];
    }
  }

  // 🔍 Filtro per valore booleano (enchantable)
  if (typeof params.enchantable === "string" && (params.enchantable === "true" || params.enchantable === "false")) {
    query.enchantable = params.enchantable === "true";
  }

  return query
};

export const filtersByScaling = (params:QueryString.ParsedQs) => {
  const upgradeType=['regular','chaos','raw','crystal','divine','occult','lightning','magic','enchanted','fire'];
  // const upgradeStat: { [key: string]: string[] }[] = [{'strength':['S','A','B','C','D','E','-']},{'dexterity':['S','A','B','C','D','E','-']},{'intelligence':['S','A','B','C','D','E','-']},{'faith':['S','A','B','C','D','E','-']}];
  const damageReduction=['physical_def','magic_def','fire_def','lightning_def']
  const damageDealing=["physical_damage","magic_damage","fire_damage","lightning_damage","bleed","poison","occult","divine","critical","magic_adjustment"]

  let operator = extractOperator(params.operator)
  let queryScaling: { $or : Array<{ [key: string]: Array<{ [key: string]: string }> }> } = { $or: [] };
  
  let stats: { [key: string]: string[] }[] = [];
  let damageReductionStats: { [key: string]: string[] }[] = [];
  let damageDealingStats: { [key: string]: string[] }[] = [];
  let type:string[]=[];
  //ELABORAZIONE DI PARAMETRI
  Object.entries(params).forEach(([key, value]) => {
    if (["strength", "dexterity", "intelligence", "faith"].includes(key)) {
      // Se value è un array, controlla che tutti gli elementi siano validi
      if (Array.isArray(value)) {
        const filteredValues = value
          .filter(v => ["S", "A", "B", "C", "D", "E","-"].includes(v.toString().toUpperCase()))
          .map(v => v.toString().toUpperCase());
        if (filteredValues.length > 0) {
          stats.push({ [key]: filteredValues });
        }
      } else if (value && ["S", "A", "B", "C", "D", "E","-"].includes(value.toString().toUpperCase())) {
        if (typeof value === 'string') {
          stats.push({ [key]: [value.toUpperCase()] }); // Trasforma in array se non lo è già
        }
      }
    }
    if(damageReduction.includes(key)){
      if (Array.isArray(value)) {
        damageReductionStats.push({ [key.replace('_def','')]: value.map(v => v.toString()) });
      }else{
        if (value && !isNaN(Number(value))) {
          damageReductionStats.push({ [key.replace('_def','')]: [value.toString()] });
        }
      }
    }
    if(damageDealing.includes(key)){
      if (Array.isArray(value)) {
        damageDealingStats.push({ [key]: value.map(v => v.toString()) });
      }else{
        if (value && !isNaN(Number(value))) {
          damageDealingStats.push({ [key]: [value.toString()] });
        }
      }
    }
    if (Array.isArray(value) && key === 'type') {
      const filteredTypes = value.filter(v => upgradeType.includes(v.toString()))
      if (filteredTypes.length > 0) {
        type = filteredTypes.map(v => v.toString())
      }
    } else if (value && upgradeType.includes(value.toString())) {
      type.push(value.toString()); // Trasforma in array se non lo è già
    }
  });
  
  type = type.length > 0 ? type : upgradeType; // Se non ci sono tipi specificati, usa tutti i tipi disponibili

  type.forEach((type) => {
    let conditions: Array<{ [key: string]: any }> = [];
    stats.forEach((element) => {
      let tempStats: { $or: Array<{ [key: string]: string }> } = { $or: [] };
      const key = Object.keys(element)[0];
      const values = element[key] as string[];
      values.forEach((value: string) => {
        tempStats.$or.push({ [`upgrade.${type}.scalings.${key}`]: value });
      });
      conditions.push(tempStats);
    });
    damageReductionStats.forEach((element) => {
      let tempReduction: { $or: Array<{ [key: string]: { [key: string]: Number } }> } = { $or: [] };
      const key = Object.keys(element)[0];
      const values = element[key] as string[];
      values.forEach((value: string) => {
      tempReduction.$or.push({ [`upgrade.${type}.defensive_stats.${key}`]: { $gte: Number(value) } });
      });
      conditions.push(tempReduction);
    });
    damageDealingStats.forEach((element) => {
      let tempDamageDealing: { $or: Array<{ [key: string]: { [key: string]: Number } }> } = { $or: [] };
      const key = Object.keys(element)[0];
      const values = element[key] as string[];
      values.forEach((value: string) => {
      tempDamageDealing.$or.push({ [`upgrade.${type}.offensive_stats.${key}`]: { $gte: Number(value) } });
      });
      conditions.push(tempDamageDealing);
    });
    if(conditions.length > 0) {
      queryScaling.$or.push({ [operator]: conditions });
    }
  });

  return queryScaling
}

export const extractOperator = (operator: string | ParsedQs | (string | ParsedQs)[] | undefined): string => {
  if(operator){
    if(typeof operator === 'string'){
      if(operator === 'and' || operator === 'or'){
        return '$'+operator;
      }
    } else {
      return '$or';	
    }
  }
  return '$or';
}


export const filtersGetAllArmor = (params:QueryString.ParsedQs) => {
  let query: Filter<Document> = {};
// 🔍 Filtro per il nome (case-insensitive, cerca parzialmente)
  if (typeof params.name === "string" && params.name.trim() !== "") {
    query.name = { $regex: params.name, $options: "i" };
  }

  const operator=extractOperator(params.operator)
  // 🔍 Filtri numerici
  const numericFilters: { [key: string]: string } = {
    "weight": "$gt",
    "poise_ratio": "$gte",
    "total_poise": "$gte",
    "level":"$eq",
    "physical_defense": "$gte",
    "strike_defense": "$gte",
    "magic_defense": "$gte",
    "fire_defense": "$gte",
    "lightning_defense": "$gte",
    "slash_defense": "$gte",
    "thrust_defense": "$gte",
    "bleed_resistance": "$gte",
    "poison_resistance": "$gte",
  };

  // Elenco dei campi che appartengono a "upgrade"
  const upgradeFields = [
    "level",
    "physical_defense",
    "strike_defense",
    "magic_defense",
    "fire_defense",
    "lightning_defense",
    "slash_defense",
    "thrust_defense",
    "bleed_resistance",
    "poison_resistance"
  ];

  let upgradeConditions=[]
  for (const [key, comparator] of Object.entries(numericFilters)) {
    if (params[key] !== undefined && !isNaN(Number(params[key])) && comparator) {
      if(upgradeFields.includes(key)){
        upgradeConditions.push({
          [`upgrade.${key}`]: { [comparator]: Number(params[key]) }
        })
      }else{
        query[key] = { [comparator]: Number(params[key]) };
      }
    }
  }

  if (upgradeConditions.length > 0) {
    query[operator] = upgradeConditions;
  }
  
  // 🔍 Filtri per valori stringa esatti (category)
  const stringFilters = ["category"];

  for (const key of stringFilters) {
    if (typeof params[key] === "string" && params[key].trim() !== "") {
      query[key] = params[key];
    }
  }

  return query
};
export const lightFilters = (params: any) => {
  const query: Filter<Document> = {};
  if (params.id) {
    try {
      query._id = new ObjectId(params.id as string); // Convert to ObjectId using createFromHexString
    } catch (error) {
      console.error("Invalid ID format:", params.id);
    }
  }
  if (params.name) {
    query.name = { $regex: params.name, $options: "i" }; // Case-insensitive search
  }
  if (params.type) {
    query.type = params.type;
  }
  if (params.category) {
    query.category = params.category;
  }
  console.log("Query:", query); // Log the query for debugging
  return query;
};