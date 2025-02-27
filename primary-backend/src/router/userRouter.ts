import { Router } from "express";
import { authMiddleware } from "../middleware.js";
import { SigninSchema, SignupSchema } from "../types/index.js";
import { PrismaClient } from "@prisma/client";
const client = new PrismaClient();
import jwt from "jsonwebtoken";
import { JWT_PASSWORD } from "../config.js";
import Cookies from "js-cookie";
const router = Router();

router.post("/signup", async (req, res) => {
  const body = req.body;
  const parsedData = SignupSchema.safeParse(body);

  if (!parsedData.success) {
    console.log(parsedData.error);
    return res.status(411).json({
      message: "Incorrect inputs",
    });
  }

  const userExists = await client.user.findFirst({
    where: {
      email: parsedData.data.email,
    },
  });

  if (userExists) {
    return res.status(403).json({
      message: "User already exists",
    });
  }

  await client.user.create({
    data: {
      email: parsedData.data.email,
      // TODO: Dont store passwords in plaintext, hash it
      password: parsedData.data.password,
      name: parsedData.data.name,
    },
  });

  // await sendEmail();

  return res.json({
    message: "Please verify your account by checking your email",
  });
});

router.post("/signin", async (req, res) => {
  const body = req.body;
  const parsedData = SigninSchema.safeParse(body);

  if (!parsedData.success) {
    return res.status(411).json({
      message: "Incorrect inputs",
    });
  }

  const user = await client.user.findFirst({
    where: {
      email: parsedData.data.email,
      password: parsedData.data.password,
    },
  });

  if (!user) {
    return res.status(403).json({
      message: "Sorry credentials are incorrect",
    });
  }

  // sign the jwt
  const token = jwt.sign(
    {
      id: user.id,
    },
    JWT_PASSWORD
  );
  Cookies.set("jwtToken", token, { expires: 7 });
  res.json({
    token: token,
  });
});

router.get("/", authMiddleware, async (req, res) => {
  // TODO: Fix the type
  // @ts-ignore
  const id = req.id;
  const user = await client.user.findFirst({
    where: {
      id,
    },
    select: {
      name: true,
      email: true,
    },
  });

  return res.json({
    user,
  });
});

// Route to remove profile image (DELETE)
router.delete("/profile-image/remove", authMiddleware, async (req, res) => {
  try {
    const id = req.id;

    if (!id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    await client.user.updateMany({
      where: { id },
      data: {
        profileImage: null,
      },
    });

    return res.json({ message: "Profile image removed successfully" });
  } catch (error) {
    console.error("Error removing profile image:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Route to upload profile image (POST)
router.post("/profile-image/upload", authMiddleware, async (req, res) => {
  try {
    const userId = req.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { profileImage } = req.body;
    if (!profileImage) {
      return res.status(400).json({ message: "Profile image is required" });
    }

    await client.user.updateMany({
      where: { id: userId },
      data: {
        profileImage, // Update the user's profile image
      },
    });

    return res.json({ message: "Profile image uploaded successfully" });
  } catch (error) {
    console.error("Error uploading profile image:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Route to update user details (PUT)
router.put("/update", authMiddleware, async (req, res) => {
  try {
    const userId = req.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({ message: "Name and email are required" });
    }

    await client.user.updateMany({
      where: { id: userId },
      data: {
        name,
        email,
      },
    });

    return res.json({ message: "User details updated successfully" });
  } catch (error) {
    console.error("Error updating user details:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

export const userRouter = router;
