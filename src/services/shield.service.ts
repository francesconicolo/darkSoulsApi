import { query, Request } from "express";
import getMongoClient from "../config/mongodb-client";
import { Filter, WithId, Document, ObjectId } from "mongodb";
import { extractOperator, filtersByScaling, filtersGetAllWeapon } from "../utils/utils"; // Ensure filtersGetAll is a function
import { get } from "http";


const getAll = async (req: Request) => {

  const params = req.query;
  const page = parseInt(params.page as string) || 1;  // Pagina predefinita: 1
  const limit = parseInt(params.limit as string) || 3; // Limite predefinito: 3

  const client = await getMongoClient();
  const db = client.db("DarkSouls");
  const collection = db.collection("shields");

  // //CREO LA QUERY
  let queryBasic = filtersGetAllWeapon(params);
  let queryScaling = filtersByScaling(params);
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
        defensive_stats: 1,
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
          defensive_stats: "$defensive_stats",
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
  const limit = parseInt(params.limit as string) || 5;

  const client = await getMongoClient();
  const db = client.db("DarkSouls");
  const collection = db.collection("shields");

  let queryBasic = filtersGetAllWeapon(params);
  let queryScaling = filtersByScaling(params);
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
        defensive_stats: 1,
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
          upgrade: "$upgrade",
          defensive_stats: "$defensive_stats",
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
  const collection = db.collection("shields");
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
        defensive_stats: 1,
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
          defensive_stats: "$defensive_stats",
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
  const data = await collection.find({name:"shields"}).toArray();
  return data;
};



export const shieldService = {
  getAll,
  getUpgrades,
  getUpgradesType,
  getCategories,
  getById
};
