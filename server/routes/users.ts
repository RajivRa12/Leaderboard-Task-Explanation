import { RequestHandler } from "express";
import { User, CreateUserRequest, CreateUserResponse, GetUsersResponse } from "@shared/api";
import { getDb } from "./db";
import { ObjectId } from "mongodb";

const USERS_COLLECTION = "users";

const updateRanks = async (db: any) => {
  const users = await db.collection(USERS_COLLECTION).find().sort({ totalPoints: -1 }).toArray();
  for (let i = 0; i < users.length; i++) {
    await db.collection(USERS_COLLECTION).updateOne(
      { _id: users[i]._id },
      { $set: { rank: i + 1 } }
    );
  }
};

export const getUsers: RequestHandler = async (_req, res) => {
  const db = await getDb();
  await updateRanks(db);
  const users = await db.collection(USERS_COLLECTION).find().sort({ rank: 1 }).toArray();
  const response: GetUsersResponse = { users };
  res.json(response);
};

export const createUser: RequestHandler = async (req, res) => {
  const db = await getDb();
  const { name }: CreateUserRequest = req.body;
  if (!name || name.trim().length === 0) {
    return res.status(400).json({ error: "Name is required" });
  }
  const existingUser = await db.collection(USERS_COLLECTION).findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
  if (existingUser) {
    return res.status(400).json({ error: "User with this name already exists" });
  }
  const newUser: User = {
    id: new ObjectId().toString(),
    name: name.trim(),
    totalPoints: 0,
    rank: 0,
    createdAt: new Date(),
  };
  await db.collection(USERS_COLLECTION).insertOne(newUser);
  await updateRanks(db);
  const response: CreateUserResponse = { user: newUser, message: `User ${name} created successfully!` };
  res.status(201).json(response);
};

export const getUserById = async (id: string): Promise<User | undefined> => {
  const db = await getDb();
  return db.collection(USERS_COLLECTION).findOne({ id });
};

export const updateUserPoints = async (userId: string, points: number): Promise<User | null> => {
  const db = await getDb();
  const user = await db.collection(USERS_COLLECTION).findOne({ id: userId });
  if (!user) return null;
  await db.collection(USERS_COLLECTION).updateOne(
    { id: userId },
    { $inc: { totalPoints: points } }
  );
  await updateRanks(db);
  return db.collection(USERS_COLLECTION).findOne({ id: userId });
};

export const getAllUsers = async (): Promise<User[]> => {
  const db = await getDb();
  await updateRanks(db);
  return db.collection(USERS_COLLECTION).find().sort({ rank: 1 }).toArray();
};
