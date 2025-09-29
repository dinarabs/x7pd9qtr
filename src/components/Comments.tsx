import { useState } from "react";
import { useComments } from "../hooks/useComments";
import { CommentItem } from "../components/CommentItem";


export default function Comments() {
  const { tree, add, remove } = useComments();
  const [text, setText] = useState("");

  // Add a top level comment
  const addTop = async () => {
    if (!text.trim()) return;
    
    await add(text.trim(), null);
    setText("");
  };

  const onReply = async (parentId: string, replyText: string) => {
    await add(replyText.trim(), parentId);
  };

  const onDelete = async (id: string) => {
    await remove(id);
  };

  return (
    <div style={{ 
        width: "100%",
        maxWidth: 800,
        margin: "0 auto", 
        padding: "32px",
        backgroundColor: "white",
        borderRadius: "16px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        border: "1px solid #e1e5e9"
      }}>
    <h2 style={{ 
        margin: "0 0 24px 0", 
        fontSize: "28px", 
        fontWeight: "600", 
        color: "#1a1a1a" 
      }}>Comments</h2>
      <div style={{ 
        display: "flex", 
        gap: 12, 
        marginBottom: 24,
        padding: "16px",
        backgroundColor: "#f8f9fa",
        borderRadius: "12px",
        border: "1px solid #e9ecef"
      }}>
        <input
          aria-label="new-comment"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write a comment…"
          style={{ 
            flex: 1,
            padding: "12px 16px",
            border: "1px solid #d1d5db",
            borderRadius: "8px",
            fontSize: "16px",
            outline: "none",
            transition: "border-color 0.2s"
          }}
        />
        <button 
        onClick={addTop} 
        disabled={!text.trim()}
        style={{
            padding: "12px 24px",
            backgroundColor: text.trim() ? "#3b82f6" : "#9ca3af",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontSize: "16px",
            fontWeight: "500",
            cursor: text.trim() ? "pointer" : "not-allowed",
            transition: "background-color 0.2s"
          }}
        >
          Add
        </button>
      </div>

      <ul style={{ listStyle: "none", padding: 0 }}>
        {tree.map((node) => (
          <CommentItem
            key={node.id}
            node={node}
            onReply={onReply}
            onDelete={onDelete}
          />
        ))}
      </ul>
    </div>
  );
}