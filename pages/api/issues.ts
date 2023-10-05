import type { NextApiRequest, NextApiResponse } from "next";
import type { Issue } from "../../interfaces";
import clientPromise from "../../lib/mongodb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Issue[]>
) {
  // Get data from your database

  const client = await clientPromise;

  const { method, body } = req;

  switch (method) {
    case "GET":
      // Update or create data in your database
      const { page = 1 } = req.query;
      const limit = 10;
      const skip = (+page - 1) * limit;
      const issues = await client
        .db()
        .collection<Issue>("issues")
        .find({})
        .skip(+skip)
        .limit(+limit)
        .sort({ _id: 1 })
        .toArray();
      res.status(200).json(issues);
      break;
    case "POST":
      // add new issue
      const { title, description } = body;
      await client.db().collection("issues").insertOne({ title, description });

      res.status(200).json([]);
      break;
    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
