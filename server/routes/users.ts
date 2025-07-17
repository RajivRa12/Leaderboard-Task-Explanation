import { RequestHandler } from "express";
import {
  User,
  CreateUserRequest,
  CreateUserResponse,
  GetUsersResponse,
} from "@shared/api";

let users: User[] = [
  { id: "1", name: "Rahul", totalPoints: 0, rank: 1, createdAt: new Date() },
  { id: "2", name: "Kamal", totalPoints: 0, rank: 1, createdAt: new Date() },
  { id: "3", name: "Sanak", totalPoints: 0, rank: 1, createdAt: new Date() },
  { id: "4", name: "Priya", totalPoints: 0, rank: 1, createdAt: new Date() },
  { id: "5", name: "Amit", totalPoints: 0, rank: 1, createdAt: new Date() },
  { id: "6", name: "Neha", totalPoints: 0, rank: 1, createdAt: new Date() },
  { id: "7", name: "Ravi", totalPoints: 0, rank: 1, createdAt: new Date() },
  { id: "8", name: "Anita", totalPoints: 0, rank: 1, createdAt: new Date() },
  { id: "9", name: "Vikram", totalPoints: 0, rank: 1, createdAt: new Date() },
  { id: "10", name: "Meera", totalPoints: 0, rank: 1, createdAt: new Date() },
];

const updateRanks = () => {
  // Sort users by total points in descending order
  const sortedUsers = [...users].sort((a, b) => b.totalPoints - a.totalPoints);

  // Update ranks
  sortedUsers.forEach((user, index) => {
    const userIndex = users.findIndex((u) => u.id === user.id);
    if (userIndex !== -1) {
      users[userIndex].rank = index + 1;
    }
  });
};

export const getUsers: RequestHandler = (req, res) => {
  updateRanks();
  const sortedUsers = [...users].sort((a, b) => a.rank - b.rank);
  const response: GetUsersResponse = {
    users: sortedUsers,
  };
  res.json(response);
};

export const createUser: RequestHandler = (req, res) => {
  const { name }: CreateUserRequest = req.body;

  if (!name || name.trim().length === 0) {
    return res.status(400).json({ error: "Name is required" });
  }

  // Check if user already exists
  const existingUser = users.find(
    (u) => u.name.toLowerCase() === name.toLowerCase(),
  );
  if (existingUser) {
    return res
      .status(400)
      .json({ error: "User with this name already exists" });
  }

  const newUser: User = {
    id: (users.length + 1).toString(),
    name: name.trim(),
    totalPoints: 0,
    rank: users.length + 1,
    createdAt: new Date(),
  };

  users.push(newUser);
  updateRanks();

  const response: CreateUserResponse = {
    user: newUser,
    message: `User ${name} created successfully!`,
  };

  res.status(201).json(response);
};

export const getUserById = (id: string): User | undefined => {
  return users.find((user) => user.id === id);
};

export const updateUserPoints = (
  userId: string,
  points: number,
): User | null => {
  const userIndex = users.findIndex((user) => user.id === userId);
  if (userIndex === -1) return null;

  users[userIndex].totalPoints += points;
  updateRanks();

  return users[userIndex];
};

export const getAllUsers = (): User[] => {
  updateRanks();
  return [...users].sort((a, b) => a.rank - b.rank);
};
