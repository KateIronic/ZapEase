var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Router } from "express";
import { authMiddleware } from "../middleware.js";
import { ZapCreateSchema } from "../types/index.js";
import { PrismaClient } from "@prisma/client";
const client = new PrismaClient();
const router = Router();
router.post("/", authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // @ts-ignore
    const id = req.id;
    const body = req.body;
    const parsedData = ZapCreateSchema.safeParse(body);
    if (!parsedData.success) {
        return res.status(411).json({
            message: "Incorrect inputs",
        });
    }
    const zapId = yield client.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        const zap = yield client.zap.create({
            data: {
                name: "",
                description: "",
                userId: parseInt(id),
                triggerId: "",
                actions: {
                    create: parsedData.data.actions.map((x, index) => ({
                        actionId: x.availableActionId,
                        sortingOrder: index,
                        metadata: x.actionMetadata,
                    })),
                },
            },
        });
        const trigger = yield tx.trigger.create({
            data: {
                triggerId: parsedData.data.availableTriggerId,
                zapId: zap.id,
            },
        });
        yield tx.zap.update({
            where: {
                id: zap.id,
            },
            data: {
                triggerId: trigger.id,
            },
        });
        return zap.id;
    }));
    return res.json({
        zapId,
    });
}));
router.get("/", authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // @ts-ignore
    const id = req.id;
    const zaps = yield client.zap.findMany({
        where: {
            userId: id,
        },
        include: {
            actions: {
                include: {
                    type: true,
                },
            },
            trigger: {
                include: {
                    type: true,
                },
            },
        },
    });
    return res.json({
        zaps,
    });
}));
router.get("/:zapId", authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //@ts-ignore
    const id = req.id;
    const zapId = req.params.zapId;
    const zap = yield client.zap.findFirst({
        where: {
            id: zapId,
            userId: id,
        },
        include: {
            actions: {
                include: {
                    type: true,
                },
            },
            trigger: {
                include: {
                    type: true,
                },
            },
        },
    });
    return res.json({
        zap,
    });
}));
export const zapRouter = router;
