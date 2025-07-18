import { VercelRequest, VercelResponse } from '@vercel/node';
import { createServer } from '../server';
import { Server } from 'http';
import type { Request, Response } from 'express';

const app = createServer();

export default function handler(req: VercelRequest, res: VercelResponse) {
  // @ts-ignore
  app(req as Request, res as Response);
} 