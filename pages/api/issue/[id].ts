import type { NextApiRequest, NextApiResponse } from "next";
import type { Issue } from "../../../interfaces";
import clientPromise from "../../../lib/mongodb";
import { ObjectId } from "mongodb";

export default async function issueHandler(
  req: NextApiRequest,
  res: NextApiResponse<Issue>
) {
  const { query, method } = req;
  const id = query.id as string;
  const client = await clientPromise;
  switch (method) {
    case "GET":
      // Get data from your database
      const issue = await client
        .db()
        .collection<Issue>("issues")
        .findOne({ _id: new ObjectId(id) });
      res.status(200).json(issue);
      break;
    case "PUT":
      // Update or create data in your database
      const { title, description } = req.body;
      // update issue
      const updatedIssue = await client
        .db()
        .collection<Issue>("issues")
        .findOneAndUpdate(
          { _id: new ObjectId(id) },
          { $set: { title, description } }
        );

      res.status(200).json(updatedIssue);
      break;
    case "DELETE":
      // Delete data from your database
      const deletedIssue = await client
        .db()
        .collection<Issue>("issues")
        .findOneAndDelete({ _id: new ObjectId(id) });
      res.status(200).json(deletedIssue);
      break;
    default:
      res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
