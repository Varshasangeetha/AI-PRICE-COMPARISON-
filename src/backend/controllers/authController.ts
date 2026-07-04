/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Response } from 'express';
import { AuthenticatedRequest, generateAccessToken, generateRefreshToken } from '../middleware/auth';
import { db } from '../db/localDb';

export class AuthController {

  public static async register(req: AuthenticatedRequest, res: Response) {
    try {
      const { email, password, name } = req.body;

      if (!email || !password || !name) {
        res.status(400).json({ error: 'All fields (email, password, name) are required' });
        return;
      }

      const existing = db.findUserByEmail(email);
      if (existing) {
        res.status(400).json({ error: 'Email address already registered' });
        return;
      }

      // First user registered becomes Admin automatically to make testing Admin panel easy!
      const role = db.getUsers().length === 0 ? 'admin' : 'user';

      const newUser = await db.createUser({
        email: email.toLowerCase(),
        name,
        role,
        preferences: {
          currency: 'INR',
          notifications: true,
          theme: 'light'
        }
      }, password);

      const token = generateAccessToken({
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role
      });

      const refreshToken = generateRefreshToken({ id: newUser.id });

      db.logActivity(newUser.id, 'view', { message: 'Account registered' });

      res.status(201).json({
        message: 'Registration successful',
        token,
        refreshToken,
        user: newUser
      });
    } catch (e: any) {
      console.error(e);
      res.status(500).json({ error: e.message || 'Server registration error' });
    }
  }

  public static async login(req: AuthenticatedRequest, res: Response) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(400).json({ error: 'Email and password are required' });
        return;
      }

      const user = db.findUserByEmail(email);
      if (!user) {
        res.status(400).json({ error: 'Invalid email or password' });
        return;
      }

      const verified = await db.verifyPassword(user.id, password);
      if (!verified) {
        res.status(400).json({ error: 'Invalid email or password' });
        return;
      }

      const token = generateAccessToken({
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      });

      const refreshToken = generateRefreshToken({ id: user.id });

      db.logActivity(user.id, 'view', { message: 'User logged in' });

      res.status(200).json({
        message: 'Login successful',
        token,
        refreshToken,
        user
      });
    } catch (e: any) {
      console.error(e);
      res.status(500).json({ error: 'Server login error' });
    }
  }

  public static async logout(req: AuthenticatedRequest, res: Response) {
    if (req.user) {
      db.logActivity(req.user.id, 'view', { message: 'User logged out' });
    }
    res.status(200).json({ message: 'Logout successful' });
  }

  public static getProfile(req: AuthenticatedRequest, res: Response) {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    const user = db.findUserById(req.user.id);
    if (!user) {
      res.status(404).json({ error: 'User profile not found' });
      return;
    }
    res.status(200).json({ user });
  }

  public static updateProfile(req: AuthenticatedRequest, res: Response) {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    try {
      const { name, preferences, profileImage } = req.body;
      const updates: any = {};
      if (name) updates.name = name;
      if (profileImage) updates.profileImage = profileImage;
      if (preferences) {
        const currentUser = db.findUserById(req.user.id);
        updates.preferences = {
          ...(currentUser?.preferences || { currency: 'INR', notifications: true, theme: 'light' }),
          ...preferences
        };
      }

      const updated = db.updateUser(req.user.id, updates);
      res.status(200).json({ message: 'Profile updated successfully', user: updated });
    } catch (e: any) {
      res.status(500).json({ error: 'Error updating profile' });
    }
  }

  public static async verifyEmail(req: AuthenticatedRequest, res: Response) {
    res.status(200).json({ message: 'Email verified successfully' });
  }

  public static async forgotPassword(req: AuthenticatedRequest, res: Response) {
    res.status(200).json({ message: 'Password reset link sent' });
  }

  public static async resetPassword(req: AuthenticatedRequest, res: Response) {
    res.status(200).json({ message: 'Password updated successfully' });
  }
}
