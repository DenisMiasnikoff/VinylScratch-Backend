import { Request, Response, NextFunction } from 'express';
import jwt, { SignOptions } from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { prisma } from '../lib/prisma';

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

interface JwtPayload {
  id: string;
  iat: number;
  exp: number;
}

const signToken = (id: string): string => {
  const secret = process.env.JWT_SECRET as string;
  const expiresIn = process.env.JWT_EXPIRES_IN || '90d';
  return jwt.sign({ id }, secret, { expiresIn } as SignOptions);
};

const sendTokenCookie = (res: Response, token: string) => {
  res.cookie('jwt', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 90 * 24 * 60 * 60 * 1000,
  });
};

export const signup = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await prisma.user.findFirst({
      where: { OR: [{ email }, { username }] }
    });

    if (existingUser) {
      res.status(400).json({ status: 'fail', message: 'Email or username already taken' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = await prisma.user.create({
      data: { username, email, password: hashedPassword },
      select: { id: true, username: true, email: true, createdAt: true }
    });

    const token = signToken(newUser.id);
    sendTokenCookie(res, token);

    res.status(201).json({ status: 'success', data: { user: newUser } });
  } catch (err) {
    const error = err as Error;
    res.status(400).json({ status: 'fail', message: error.message });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ status: 'fail', message: 'Please provide email and password' });
      return;
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      res.status(401).json({ status: 'fail', message: 'Incorrect email or password' });
      return;
    }

    const token = signToken(user.id);
    sendTokenCookie(res, token);

    res.status(200).json({ status: 'success' });
  } catch (err) {
    const error = err as Error;
    res.status(400).json({ status: 'fail', message: error.message });
  }
};

export const protect = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    let token: string | undefined;

    if (req.cookies?.jwt) {
      token = req.cookies.jwt;
    } else if (req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      res.status(401).json({ status: 'fail', message: 'You are not logged in!' });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;

    const currentUser = await prisma.user.findUnique({ where: { id: decoded.id } });

    if (!currentUser) {
      res.status(401).json({ status: 'fail', message: 'User no longer exists.' });
      return;
    }

    req.user = currentUser;
    next();
  } catch (err) {
    res.status(401).json({ status: 'fail', message: 'Invalid token.' });
  }
};

export const logout = (req: Request, res: Response): void => {
  res.cookie('jwt', '', { httpOnly: true, expires: new Date(0) });
  res.status(200).json({ status: 'success' });
};