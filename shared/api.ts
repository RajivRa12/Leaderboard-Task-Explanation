export interface User {
  id: string;
  name: string;
  totalPoints: number;
  rank: number;
  createdAt: Date;
}

export interface ClaimHistory {
  id: string;
  userId: string;
  userName: string;
  pointsAwarded: number;
  timestamp: Date;
}

export interface CreateUserRequest {
  name: string;
}

export interface CreateUserResponse {
  user: User;
  message: string;
}

export interface ClaimPointsRequest {
  userId: string;
}

export interface ClaimPointsResponse {
  user: User;
  pointsAwarded: number;
  newRank: number;
  history: ClaimHistory;
  message: string;
}

export interface GetUsersResponse {
  users: User[];
}

export interface GetHistoryResponse {
  history: ClaimHistory[];
}

export interface DemoResponse {
  message: string;
}
