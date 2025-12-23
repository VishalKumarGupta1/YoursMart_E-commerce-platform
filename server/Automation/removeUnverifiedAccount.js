import { User } from "../models/user.model.js";
import cron from "node-cron";

export const removeUnverifiedAccount = () => {
  cron.schedule("*/30 * * * *", async () => {
    const thirtyMinutesAgo = Date.now() - 30 * 60 * 1000;
    const userToDelete = await User.deleteMany({
      accountVerified: false,
      createdAt: { $lt: thirtyMinutesAgo },
    });
  });
};
