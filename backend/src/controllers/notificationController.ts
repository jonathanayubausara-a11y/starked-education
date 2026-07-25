import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/auth";
import { notificationService } from "../services/notificationService";
import logger from "../utils/logger";

export class NotificationController {
  public async getNotifications(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user.id;
      const { category, isRead, priority, limit, skip } = req.query;

      const result = await notificationService.getNotifications({
        userId,
        category: category as any,
        isRead:
          isRead === "true" ? true : isRead === "false" ? false : undefined,
        priority: priority as any,
        limit: limit ? parseInt(limit as string) : 20,
        skip: skip ? parseInt(skip as string) : 0,
      });

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      logger.error("Error in getNotifications controller:", error);
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }

  public async markAsRead(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { notificationId } = req.params;
      const userId = req.user.id;

      const success = await notificationService.markAsRead(
        notificationId,
        userId,
      );
      res.status(200).json({ success });
    } catch (error) {
      logger.error("Error in markAsRead controller:", error);
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }

  public async markAllAsRead(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user.id;
      const count = await notificationService.markAllAsRead(userId);
      res.status(200).json({ success: true, count });
    } catch (error) {
      logger.error("Error in markAllAsRead controller:", error);
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }

  public async getPreferences(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user.id;
      const preferences = await notificationService.getUserPreferences(userId);
      res.status(200).json({ success: true, data: preferences });
    } catch (error) {
      logger.error("Error in getPreferences controller:", error);
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }

  public async updatePreferences(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user.id;
      const preferences = req.body;

      await notificationService.setNotificationPreferences(userId, preferences);
      res.status(200).json({ success: true, message: "Preferences updated" });
    } catch (error) {
      logger.error("Error in updatePreferences controller:", error);
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }

  public async deleteNotification(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { notificationId } = req.params;
      const userId = req.user.id;

      const success = await notificationService.deleteNotification(
        notificationId,
        userId,
      );
      res.status(200).json({ success });
    } catch (error) {
      logger.error("Error in deleteNotification controller:", error);
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }
}

export const notificationController = new NotificationController();
