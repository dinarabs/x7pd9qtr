import { useState } from "react";
import type { CommentDocType } from "../db/schema";

// Tree structure where each comment can have multiple replies
type TreeNode = CommentDocType & { children: TreeNode[] };

export function CommentItem({
  node,
  onReply,
  onDelete
}: {
  node: TreeNode;
  onReply: (parentId: string, text: string) => void;
  onDelete: (id: string) => void;
}) {
  const [reply, setReply] = useState("");

  return (
    <li style={{ 
        marginBottom: "16px",
        padding: "16px",
        backgroundColor: "#f8f9fa",
        borderRadius: "12px",
        border: "1px solid #e9ecef",
        marginLeft: node.parentId ? "24px" : "0"
      }}>
      <div style={{ 
        display: "flex", 
        alignItems: "flex-start", 
        gap: 12,
        marginBottom: "12px"
      }}>
        <span style={{ 
          flex: 1,
          fontSize: "16px",
          lineHeight: "1.5",
          color: "#374151"
        }}>
            {node.text}</span>
        <button
          aria-label={`delete-${node.id}`}
          onClick={() => onDelete(node.id)}
          style={{
            padding: "6px 12px",
            backgroundColor: "#ef4444",
            color: "white",
            border: "none",
            borderRadius: "6px",
            fontSize: "14px",
            cursor: "pointer",
            transition: "background-color 0.2s"
          }}
        >
          Delete
        </button>
      </div>

      <div style={{ 
        display: "flex", 
        gap: 8,
        marginTop: "12px"
      }}>
        <input
          aria-label={`reply-input-${node.id}`}
          value={reply}
          onChange={(e) => setReply(e.target.value)}
          placeholder="Reply…"
          style={{
            flex: 1,
            padding: "8px 12px",
            border: "1px solid #d1d5db",
            borderRadius: "6px",
            fontSize: "14px",
            outline: "none"
          }}
        />
        <button
          onClick={() => {
            if (!reply.trim()) return;
            onReply(node.id, reply);
            setReply("");
          }}
          disabled={!reply.trim()}
          style={{
            padding: "8px 16px",
            backgroundColor: reply.trim() ? "#10b981" : "#9ca3af",
            color: "white",
            border: "none",
            borderRadius: "6px",
            fontSize: "14px",
            cursor: reply.trim() ? "pointer" : "not-allowed"
          }}
        >
          Send
        </button>
      </div>

      {node.children.length > 0 && (
        <ul style={{
            listStyle: "none", 
            marginTop: "16px", 
            padding: 0,
            borderLeft: "2px solid #e5e7eb",
            paddingLeft: "16px"
          }}>
          {node.children.map((child) => (
            <CommentItem
              key={child.id}
              node={child}
              onReply={onReply}
              onDelete={onDelete}
            />
          ))}
        </ul>
      )}
    </li>
  );
}