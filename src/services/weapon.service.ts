import { Request } from "express";
import getMongoClient from "../config/mongodb-client";
import { Filter, WithId, Document } from "mongodb";
import { extractOperator, filtersByScaling, filtersGetAllWeapon } from "../utils/utils"; // Ensure filtersGetAll is a function


const getAll = async (req: Request) => {

  const params = req.query;
  const page = parseInt(params.page as string) || 1;  // Pagina predefinita: 1
  const limit = parseInt(params.limit as string) || 5; // Limite predefinito: 10

  const client = await getMongoClient();
  const db = client.db("DarkSouls");
  const collection = db.collection("weapons");

  //CREO LA QUERY
  let queryBasic = filtersGetAllWeapon(params);
  let queryScaling = filtersByScaling(params);
  let query = { $and: [queryBasic, queryScaling] };

  // Calcola l'offset
  const skip = (page - 1) * limit;

  const data = await collection.find( query as Filter<Document>)
  .skip(skip) //salto i risultati precedenti
  .limit(limit) //limito il numero di risultati
  .toArray();

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
  const collection = db.collection("weapons");

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
        }
      }
    },
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

const getUpgradesType = async (req: Request) => {
  const client = await getMongoClient();
  const db = client.db("DarkSouls");
  const collection = db.collection("upgrades");
  const data = await collection.find().toArray();
  return data;
};

export const weaponService = {
  getAll,
  getUpgrades,
  getUpgradesType
};
