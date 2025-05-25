import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";

const f = createUploadthing();

export const ourFileRouter = {
  // Image uploads for general use
  imageUploader: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 10,
    }
  })
    .middleware(async ({ req }) => {
      // Get user from session using NextAuth
      const session = await auth();
      const user = session?.user;

      // Check if user is authenticated
      if (!user || !user.id) {
        throw new UploadThingError("Unauthorized");
      }

      // Return user data as metadata
      return { 
        userId: user.id,
        userRole: user.role || "user" 
      };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // Save file info to database
      await db.media.create({
        data: {
          userId: metadata.userId,
          name: file.name,
          key: file.key,
          url: file.ufsUrl,
          size: file.size,
          type: file.type,
          uploadedAt: new Date(),
        }
      });

      return {
        url: file.ufsUrl,
        name: file.name,
        size: file.size,
        key: file.key,
      };
    }),

  // Document uploads (PDF, DOCX, etc.)
  documentUploader: f({
    "image": {
      maxFileSize: "4MB",
      maxFileCount: 3,
    },
    "pdf": {
      maxFileSize: "8MB",
      maxFileCount: 3,
    },
    "audio": {
      maxFileSize: "8MB",
      maxFileCount: 2,
    },
    "video": {
      maxFileSize: "16MB",
      maxFileCount: 1,
    }
  })
    .middleware(async ({ req }) => {
      const session = await auth();
      const user = session?.user;

      if (!user || !user.id) {
        throw new UploadThingError("Unauthorized");
      }

      if (user.role !== "admin") {
        throw new UploadThingError("Only admins can upload documents");
      }

      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      await db.media.create({
        data: {
          userId: metadata.userId,
          name: file.name,
          key: file.key,
          url: file.ufsUrl,
          size: file.size,
          type: file.type,
          uploadedAt: new Date(),
        }
      });

      return {
        url: file.ufsUrl,
        name: file.name,
        size: file.size,
        key: file.key,
      };
    }),
  
  // Avatar uploads (stricter size limits)
  avatarUploader: f({
    image: {
      maxFileSize: "2MB",
      maxFileCount: 1,
    }
  })
    .middleware(async ({ req }) => {
      const session = await auth();
      const user = session?.user;

      if (!user || !user.id) {
        throw new UploadThingError("Unauthorized");
      }

      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // Update user avatar
      await db.user.update({
        where: { id: metadata.userId },
        data: { image: file.ufsUrl }
      });

      return { url: file.ufsUrl };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
