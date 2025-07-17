import { RequestHandler } from "express";
import {
  ClaimPointsRequest,
  ClaimPointsResponse,
  ClaimHistory,
} from "@shared/api";
import { getUserById, updateUserPoints, getAllUsers } from "./users";

let claimHistory: ClaimHistory[] = [];

const generateRandomPoints = (): number => {
  return Math.floor(Math.random() * 10) + 1; // Random number between 1 and 10
};

export const claimPoints: RequestHandler = (req, res) => {
  const { userId }: ClaimPointsRequest = req.body;

  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  const user = getUserById(userId);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  const pointsAwarded = generateRandomPoints();
  const updatedUser = updateUserPoints(userId, pointsAwarded);

  if (!updatedUser) {
    return res.status(500).json({ error: "Failed to update user points" });
  }

  // Create history record
  const historyRecord: ClaimHistory = {
    id: (claimHistory.length + 1).toString(),
    userId: userId,
    userName: updatedUser.name,
    pointsAwarded: pointsAwarded,
    timestamp: new Date(),
  };

  claimHistory.unshift(historyRecord); // Add to beginning for latest first

  const response: ClaimPointsResponse = {
    user: updatedUser,
    pointsAwarded: pointsAwarded,
    newRank: updatedUser.rank,
    history: historyRecord,
    message: `${updatedUser.name} earned ${pointsAwarded} points! New rank: #${updatedUser.rank}`,
  };

  res.json(response);
};

export const getHistory: RequestHandler = (req, res) => {
  res.json({
    history: claimHistory,
  });
};
