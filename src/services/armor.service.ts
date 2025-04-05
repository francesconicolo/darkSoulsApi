import { Request } from "express";
import getMongoClient from "../config/mongodb-client";
import { Filter, WithId, Document, ObjectId } from "mongodb";
import { extractOperator, filtersGetAllArmor } from "../utils/utils"; // Ensure filtersGetAll is a function


const getAll = async (req: Request) => {

  const params = req.query;
  const page = parseInt(params.page as string) || 1;  // Pagina predefinita: 1
  const limit = parseInt(params.limit as string) || 10; // Limite predefinito: 10

  const client = await getMongoClient();
  const db = client.db("DarkSouls");
  const collection = db.collection("armors");


  let query = filtersGetAllArmor(params);
  
  const pipeline = [
    { $match:query},
    {
      $project: {
        name: 1,
        url_image: { $concat: [process.env.ASSETS_BASE_URL || "", { $toLower: { $replaceAll: { input: "$name", find: " ", replacement: "_" } } }, ".png"] },
        type: 1,
        category: 1,
        weight: 1,
        poise_ratio: 1,
        total_poise: 1,
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
          weight: "$weight",
          poise_ratio: "$poise_ratio",
          total_poise: "$total_poise",
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
  const limit = parseInt(params.limit as string) || 10;

  const client = await getMongoClient();
  const db = client.db("DarkSouls");
  const collection = db.collection("armors");

  const createFilter = () => ({
    $filter: {
      input: "$upgrade",
      as: "item",
      cond: {
        [extractOperator(params.operator)]: [
          params.level ? { $gte: ["$$item.level", params.level] } : extractOperator(params.operator) === '$or' ? false : true,
          params.physical_defense ? { $gte: ["$$item.physical_defense", parseInt(params.physical_defense as string)] } : extractOperator(params.operator) === '$or' ? false : true,
          params.strike_defense ? { $gte: ["$$item.strike_defense", parseInt(params.strike_defense as string)] } : extractOperator(params.operator) === '$or' ? false : true,
          params.slash_defense ? { $gte: ["$$item.slash_defense", parseInt(params.slash_defense as string)] } : extractOperator(params.operator) === '$or' ? false : true,
          params.thrust_defense ? { $gte: ["$$item.thrust_defense", parseInt(params.thrust_defense as string)] } : extractOperator(params.operator) === '$or' ? false : true,
          params.magic_defense ? { $gte: ["$$item.magic_defense", parseInt(params.magic_defense as string)] } : extractOperator(params.operator) === '$or' ? false : true,
          params.fire_defense ? { $gte: ["$$item.fire_defense", parseInt(params.fire_defense as string)] } : extractOperator(params.operator) === '$or' ? false : true,
          params.lightning_defense ? { $gte: ["$$item.lightning_defense", parseInt(params.lightning_defense as string)] } : extractOperator(params.operator) === '$or' ? false : true,
          params.bleed_resistance ? { $gte: ["$$item.bleed_resistance", parseInt(params.bleed_resistance as string)] } : extractOperator(params.operator) === '$or' ? false : true,
          params.poison_resistance ? { $gte: ["$$item.poison_resistance", parseInt(params.poison_resistance as string)] } : extractOperator(params.operator) === '$or' ? false : true,
          params.curse_resistance ? { $gte: ["$$item.curse_resistance", parseInt(params.curse_resistance as string)] } : extractOperator(params.operator) === '$or' ? false : true,
        ],
      },
    },
  });

  let query=filtersGetAllArmor(params);
  
  const pipeline = [
    { $match:query},
    {
      $project: {
        name: 1,
        url_image: { $concat: [process.env.ASSETS_BASE_URL || "", { $toLower: { $replaceAll: { input: "$name", find: " ", replacement: "_" } } }, ".png"] },
        type: 1,
        category: 1,
        weight: 1,
        poise_ratio: 1,
        total_poise: 1,
        upgrade: createFilter(),
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
          weight: "$weight",
          poise_ratio: "$poise_ratio",
          total_poise: "$total_poise",
          upgrade: "$upgrade",
        },
      },
    },
    { $replaceRoot: { newRoot: "$orderedFields" } },
    { $skip: (page - 1) * limit },
    { $limit: limit },
  ];
  
  
  let data = await collection.aggregate(pipeline).toArray();
  const totalCount = await collection.countDocuments(filtersGetAllArmor(params) as Filter<WithId<Document>>);
  const totalPages = Math.ceil(totalCount / limit);
 
  return {
    info: {
      pagination: {
        currentPage: page,
        totalPages: totalPages,
        totalCount: totalCount,
        limit: limit,
      },
    },
    data,
  };
};

const getById = async (req: Request) => {
  const params = req.query;
  const client = await getMongoClient();
  const db = client.db("DarkSouls");
  const collection = db.collection("armors");

  const pipeline = [
    { $match: { _id: new ObjectId(params.id as string) } },
    {
      $project: {
        name: 1,
        url_image: { $concat: [process.env.ASSETS_BASE_URL || "", { $toLower: { $replaceAll: { input: "$name", find: " ", replacement: "_" } } }, ".png"] },
        type: 1,
        category: 1,
        weight: 1,
        poise_ratio: 1,
        total_poise: 1,
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
          weight: "$weight",
          poise_ratio: "$poise_ratio",
          total_poise: "$total_poise",
          upgrade: "$upgrade",
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

const getCategories = async () => {
  const client = await getMongoClient();
  const db = client.db("DarkSouls");
  const collection = db.collection("categories");
  const data = await collection.find({name:"armors"}).toArray();
  return data;
};

export const armorService = {
  getAll,
  getUpgrades,
  getCategories,
  getById
};