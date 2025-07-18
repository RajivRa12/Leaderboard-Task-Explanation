import { RequestHandler } from "express";
import { ClaimPointsRequest, ClaimPointsResponse, ClaimHistory } from "@shared/api";
import { getUserById, updateUserPoints, getAllUsers } from "./users";
import { getDb } from "./db";
import { ObjectId } from "mongodb";

const HISTORY_COLLECTION = "claimHistory";

const generateRandomPoints = (): number => {
  return Math.floor(Math.random() * 10) + 1; // Random number between 1 and 10
};

export const claimPoints: RequestHandler = async (req, res) => {
  const db = await getDb();
  const { userId }: ClaimPointsRequest = req.body;

  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  const user = await getUserById(userId);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  const pointsAwarded = generateRandomPoints();
  const updatedUser = await updateUserPoints(userId, pointsAwarded);

  if (!updatedUser) {
    return res.status(500).json({ error: "Failed to update user points" });
  }

  // Create history record
  const historyRecord: ClaimHistory = {
    id: new ObjectId().toString(),
    userId: userId,
    userName: updatedUser.name,
    pointsAwarded: pointsAwarded,
    timestamp: new Date(),
  };

  await db.collection(HISTORY_COLLECTION).insertOne(historyRecord);

  const response: ClaimPointsResponse = {
    user: updatedUser,
    pointsAwarded: pointsAwarded,
    newRank: updatedUser.rank,
    history: historyRecord,
    message: `${updatedUser.name} earned ${pointsAwarded} points! New rank: #${updatedUser.rank}`,
  };

  res.json(response);
};

export const getHistory: RequestHandler = async (_req, res) => {
  const db = await getDb();
  const history = await db.collection(HISTORY_COLLECTION).find().sort({ timestamp: -1 }).toArray();
  res.json({ history });
};
