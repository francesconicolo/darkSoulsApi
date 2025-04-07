
import { Request } from "express";
import getMongoClient from "../config/mongodb-client";
import { lightFilters } from "../utils/utils";
import { WithId, Document } from "mongodb";


const getCategories = async () => {
  const client = await getMongoClient();
  const db = client.db("DarkSouls");
  const collection = db.collection("categories");
  const data = await collection.find().toArray();
  return data;
};

const getLightInfo = async (req: Request) => {
  const params = req.query;

  const page = parseInt(params.page as string) || 1;
  const limit = (parseInt(params.limit as string)>50 ? 50 : parseInt(params.limit as string)) || 30;

  const client = await getMongoClient();
  const db = client.db("DarkSouls");
  const collectionsToCheck = ["weapons", "shields", "armors"];
  const response = [] as WithId<Document>[]
  let query = lightFilters(params);
  let totalCount = 0;

  const pipeline = [
    { $match: query },
    {
      $project: {
        _id: 1,
        name: 1,
        url_image: { $concat: [process.env.ASSETS_BASE_URL || "", { $toLower: { $replaceAll: { input: "$name", find: " ", replacement: "_" } } }, ".png"] },
        type: 1,
        category: 1
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
        },
      }
    },
    { $replaceRoot: { newRoot: "$orderedFields" } },
    { $skip: (page - 1) * limit },
    { $limit: limit }
  ];

  for (const collectionName of collectionsToCheck) {
    const collection = db.collection(collectionName);
    const data= await collection.aggregate(pipeline).toArray();
    const partialCount = await collection.countDocuments(query);
    totalCount += partialCount;
    response.push(...data.filter((item): item is WithId<Document> => item._id !== undefined))
  }

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
    response
  };
};

export const generalService = {
  getCategories,
  getLightInfo,
};