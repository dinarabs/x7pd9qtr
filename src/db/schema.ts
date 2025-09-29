import type { RxJsonSchema } from "rxdb";

export type CommentDocType = {
  id: string;
  text: string;
  parentId: string | null;
  createdAt: number;
};

export const commentSchema: RxJsonSchema<CommentDocType> = {
  title: "comment schema",
  version: 0,
  type: "object",
  // to track the parent and child comments
  primaryKey: "id",
  properties: {
id: { type: "string", maxLength: 128 },
    text: { type: "string" },
    parentId: { type: ["string", "null"] },
    createdAt: { type: "number" }
  },
  required: ["id", "text", "createdAt"]
};