import { Router } from "express";
import { PrismaClient } from "@prisma/client";
const client = new PrismaClient();


const router = Router();

router.get("/available", async (req, res) => {
  const availableActions = await client.availableAction.findMany({});
  res.json({
    availableActions,
  });
});

export const actionRouter = router;
