import { query, Request } from "express";
import getMongoClient from "../config/mongodb-client";
import { Filter, WithId, Document, ObjectId } from "mongodb";
import { extractOperator, filtersByScaling, filtersGetAllWeapon } from "../utils/utils"; // Ensure filtersGetAll is a function



const getAll = async (req: Request) => {

  const params = req.query;
  const page = parseInt(params.page as string) || 1;  // Pagina predefinita: 1
  const limit = (parseInt(params.limit as string)>6 ? 6 : parseInt(params.limit as string)) || 3; // Limite predefinito: 3

  const client = await getMongoClient();
  const db = client.db("DarkSouls");
  const collection = db.collection("weapons");

  // //CREO LA QUERY
  let queryBasic = filtersGetAllWeapon(params);
  let tempQuery = filtersByScaling(params);
  let queryScaling = tempQuery.$or.length > 0 ? tempQuery : {};
  let query = { $and: [queryBasic, queryScaling] };

  //COSTRUZIONE DELLA PIPELINE
  const pipeline = [
    { $match: query },
    {
      $project: {
        name: 1,
        url_image: { $concat: [process.env.ASSETS_BASE_URL || "", { $toLower: { $replaceAll: { input: "$name", find: " ", replacement: "_" } } }, ".png"] },
        type: 1,
        category: 1,
        attack_type: 1,
        enchantable: 1,
        special: 1,
        weight: 1,
        durability: 1,
        stability: 1,
        requirements: 1,
        upgrade: 1,
        
      },
    },
    {
      $addFields: {
        orderedFields: {
          _id: "$_id",
          name: "$name",
          url_image: "$url_image",
          type: "$type",
          category: "$category",
          attack_type: "$attack_type",
          enchantable: "$enchantable",
          special: "$special",
          weight: "$weight",
          durability: "$durability",
          stability: "$stability",
          requirements: "$requirements",
          upgrade: "$upgrade",
        
        },
      },
    },
    { $replaceRoot: { newRoot: "$orderedFields" } },
    { $skip: (page - 1) * limit },
    { $limit: limit },
  ];

  let data = await collection.aggregate(pipeline).toArray();

  const totalCount = await collection.countDocuments( query as Filter<WithId<Document>>);

  // Calcola il numero totale di pagine
  const totalPages = Math.ceil(totalCount / limit);

  const info ={
      pagination: {
      currentPage: page,
      totalPages: totalPages,
      totalCount: totalCount,
      limit: limit
    }
  }
  return {info,data};
};

const getUpgrades = async (req: Request) => {
  const params = req.query;

  const page = parseInt(params.page as string) || 1;
  const limit = (parseInt(params.limit as string)>6 ? 6 : parseInt(params.limit as string)) || 3;

  const client = await getMongoClient();
  const db = client.db("DarkSouls");
  const collection = db.collection("weapons");

  let queryBasic = filtersGetAllWeapon(params);
  let tempQuery = filtersByScaling(params);
  let queryScaling = tempQuery.$or.length > 0 ? tempQuery : {};
  let query = { $and: [queryBasic, queryScaling] };

  const createFilter = (upgradeType: string) => ({
    $filter: {
      input: `$upgrade.${upgradeType}`,
      as: "item",
      cond: {
        [extractOperator(params.operator)]: [
          params.strength ? { $eq: ["$$item.scalings.strength", params.strength] } : extractOperator(params.operator) === '$or' ? false : true,
          params.dexterity ? { $eq: ["$$item.scalings.dexterity", params.dexterity] } : extractOperator(params.operator) === '$or' ? false : true,
          params.intelligence ? { $eq: ["$$item.scalings.intelligence", params.intelligence] } : extractOperator(params.operator) === '$or' ? false : true,
          params.faith ? { $eq: ["$$item.scalings.faith", params.faith] } : extractOperator(params.operator) === '$or' ? false : true,
          params.physical_def ? { $gte: ["$$item.defensive_stats.physical", Number(params.physical_def)] } : extractOperator(params.operator) === '$or' ? false : true,
          params.magic_def ? { $gte: ["$$item.defensive_stats.magic", Number(params.magic_def)] }: extractOperator(params.operator)  === '$or' ? false : true,
          params.fire_def ? { $gte: ["$$item.defensive_stats.fire", Number(params.fire_def)] } : extractOperator(params.operator) === '$or' ? false : true,
          params.lightning_def ? { $gte: ["$$item.defensive_stats.lightning", Number(params.lightning_def)] } : extractOperator(params.operator)  === '$or' ? false : true,
          params.physical_damage ? { $gte: ["$$item.offensive_stats.physical_damage", Number(params.physical_damage)] } : extractOperator(params.operator) === '$or' ? false : true,
          params.magic_damage ? { $gte: ["$$item.offensive_stats.magic_damage", Number(params.magic_damage)] } : extractOperator(params.operator) === '$or' ? false : true,
          params.fire_damage ? { $gte: ["$$item.offensive_stats.fire_damage", Number(params.fire_damage)] } : extractOperator(params.operator) === '$or' ? false : true,
          params.lightning_damage ? { $gte: ["$$item.offensive_stats.lightning_damage", Number(params.lightning_damage)] } : extractOperator(params.operator) === '$or' ? false : true,
          params.bleed ? { $gte: ["$$item.offensive_stats.bleed", Number(params.bleed)] } : extractOperator(params.operator) === '$or' ? false : true,
          params.poison ? { $gte: ["$$item.offensive_stats.poison", Number(params.poison)] } : extractOperator(params.operator) === '$or' ? false : true,
          params.occult ? { $gte: ["$$item.offensive_stats.occult", Number(params.occult)] } : extractOperator(params.operator) === '$or' ? false : true,
          params.divine ? { $gte: ["$$item.offensive_stats.divine", Number(params.divine)] } : extractOperator(params.operator) === '$or' ? false : true,
          params.critical ? { $gte: ["$$item.offensive_stats.critical", Number(params.critical)] } : extractOperator(params.operator) === '$or' ? false : true,
          params.magic_adjustment ? { $gte: ["$$item.offensive_stats.magic_adjustment", Number(params.magic_adjustment)] } : extractOperator(params.operator) === '$or' ? false : true,
        ]
      }
    }
  });
  const pipeline = [
    { $match: query },
    {
      $project: {
        name: 1,
        url_image: { $concat: [process.env.ASSETS_BASE_URL || "", { $toLower: { $replaceAll: { input: "$name", find: " ", replacement: "_" } } }, ".png"] },
        type: 1,
        category: 1,
        attack_type: 1,
        enchantable: 1,
        special: 1,
        weight: 1,
        durability: 1,
        stability: 1,
        requirements: 1,
        upgrade: {
          regular: createFilter("regular"),
          chaos: createFilter("chaos"),
          raw: createFilter("raw"),
          crystal: createFilter("crystal"),
          divine: createFilter("divine"),
          occult: createFilter("occult"),
          lightning: createFilter("lightning"),
          magic: createFilter("magic"),
          enchanted: createFilter("enchanted"),
          fire: createFilter("fire")
        },
      }
    },
    {
      $addFields: {
        orderedFields: {
          _id: "$_id",
          name: "$name",
          url_image: "$url_image",
          type: "$type",
          category: "$category",
          attack_type: "$attack_type",
          enchantable: "$enchantable",
          special: "$special",
          weight: "$weight",
          durability: "$durability",
          stability: "$stability",
          requirements: "$requirements",
          upgrade: "$upgrade"
        },
      }
    },
    { $replaceRoot: { newRoot: "$orderedFields" } },
    { $skip: (page - 1) * limit },
    { $limit: limit }
  ];

  const data = await collection.aggregate(pipeline).toArray();
  const totalCount = await collection.countDocuments(query as Filter<WithId<Document>>);

  const totalPages = Math.ceil(totalCount / limit);

  return {
    info: {
      pagination: {
        currentPage: page,
        totalPages: totalPages,
        totalCount: totalCount,
        limit: limit
      }
    },
    data
  }; 
};

const getById = async (req: Request) => {
  const params = req.params;
  const client = await getMongoClient();
  const db = client.db("DarkSouls");
  const collection = db.collection("weapons");
  const pipeline = [
    { $match: { _id: new ObjectId(params.id as string) } },
    {
      $project: {
        name: 1,
        url_image: { $concat: [process.env.ASSETS_BASE_URL || "", { $toLower: { $replaceAll: { input: "$name", find: " ", replacement: "_" } } }, ".png"] },
        type: 1,
        category: 1,
        attack_type: 1,
        enchantable: 1,
        special: 1,
        weight: 1,
        durability: 1,
        stability: 1,
        requirements: 1,
        upgrade: 1,
      },
    },
    {
      $addFields: {
        orderedFields: {
          _id: "$_id",
          name: "$name",
          url_image: "$url_image",
          type: "$type",
          category: "$category",
          attack_type: "$attack_type",
          enchantable: "$enchantable",
          special: "$special",
          weight: "$weight",
          durability: "$durability",
          stability: "$stability",
          requirements: "$requirements",
          upgrade: "$upgrade"
        },
      },
    },
    { $replaceRoot: { newRoot: "$orderedFields" } },
  ];

  let data = await collection.aggregate(pipeline).toArray();
  const info ={
      pagination: {
      currentPage: 1,
      totalPages: 1,
      totalCount: 1,
      limit: 1
    }
  }
  return {info,data};
}

const getUpgradesType = async (req: Request) => {
  const client = await getMongoClient();
  const db = client.db("DarkSouls");
  const collection = db.collection("upgrades");
  const data = await collection.find().toArray();
  return data;
};

const getCategories = async () => {
  const client = await getMongoClient();
  const db = client.db("DarkSouls");
  const collection = db.collection("categories");
  const data = await collection.find({name:"weapons"}).toArray();
  return data;
};

export const weaponService = {
  getAll,
  getUpgrades,
  getUpgradesType,
  getCategories,
  getById
};
