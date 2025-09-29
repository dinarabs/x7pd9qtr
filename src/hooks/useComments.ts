import { useEffect, useMemo, useState } from "react";
import { getDB, addComment, deleteCommentCascade } from "../db/rxdb";
import type { CommentDocType } from "../db/schema";

/** Live list of comments (reactive via RxDB query) */
export function useComments() {
  const [comments, setComments] = useState<CommentDocType[]>([]);

  useEffect(() => {
    let sub: { unsubscribe: () => void } | null = null;
    (async () => {
      const db = await getDB();
      const query = db.comments.find().sort({ createdAt: "asc" });
      sub = query.$.subscribe((docs) => {
        setComments(docs.map(d => d.toJSON()));
      });
    })();
    return () => sub?.unsubscribe();
  }, []);

  const tree = useMemo(() => buildTree(comments), [comments]);

  return {
    comments,
    tree,
    add: addComment,
    remove: deleteCommentCascade
  };
}

type TreeNode = CommentDocType & { children: TreeNode[] };

function buildTree(list: CommentDocType[]): TreeNode[] {
  const map = new Map<string, TreeNode>();
  const roots: TreeNode[] = [];

  for (const c of list) map.set(c.id, { ...c, children: [] });
  for (const c of map.values()) {
    if (c.parentId && map.has(c.parentId)) {
      map.get(c.parentId)!.children.push(c);
    } else {
      roots.push(c);
    }
  }
  return roots;
}