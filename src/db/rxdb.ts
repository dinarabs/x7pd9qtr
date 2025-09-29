import  { createRxDatabase, type RxDatabase, addRxPlugin } from "rxdb";
import { getRxStorageDexie } from "rxdb/plugins/storage-dexie";
import { commentSchema, type CommentDocType } from "./schema";
import type { RxCollection } from "rxdb";
import { RxDBQueryBuilderPlugin } from "rxdb/plugins/query-builder";

// Add the query builder plugin
addRxPlugin(RxDBQueryBuilderPlugin);

type Collections = {
  comments: RxCollection<CommentDocType>;
};

// Promise to ensure we only create the database once
let dbPromise: Promise<RxDatabase<Collections>> | null = null;

// Get the database
export const getDB = () => {
  // If the database doesn't exist, create it
  if (!dbPromise) {
    dbPromise = (async () => {
      const db = await createRxDatabase<Collections>({
        name: "autarc-comments",
        storage: getRxStorageDexie(),
        // enables cross-tab sync via BroadcastChannel
        multiInstance: true,
      });

      // Add the comments collection
      await db.addCollections({
        comments: {
          schema: commentSchema
        }
      });

      return db;
    })();
  }

  // Caches and returns the same DB promise every time
  return dbPromise;
};

// Helpers
export async function addComment(text: string, parentId: string | null = null) {
  const db = await getDB();

  // Create a new comment document
  const doc: CommentDocType = {
    id: crypto.randomUUID(),
    text: text.trim(),
    parentId,
    createdAt: Date.now()
  };

  // Insert the comment document
  await db.comments.insert(doc);
}

// When deleting a comment then also delete all the replies
export async function deleteCommentCascade(id: string) {
  const db = await getDB();

  // Collect all comments
  const allComments = await db.comments.find().exec();
  const commentReplies = new Set<string>();

  // Collect all the replies to the given comment id
  const collectRepliesToCommentId = (cid: string) => {
    commentReplies.add(cid);
    allComments.forEach(comment => {
        if (comment.parentId === cid) collectRepliesToCommentId(comment.id);
    });
  };
  collectRepliesToCommentId(id);

  // Delete all the replies
  await db.comments.bulkRemove(Array.from(commentReplies));
}

// Get all the comments in chronological order (oldest to newest)
export async function getAllComments() {
  const db = await getDB()
  return db.comments.find().sort({ createdAt: "asc" }).exec();
}