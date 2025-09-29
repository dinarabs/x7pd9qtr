import Comments from "./components/Comments";

export default function App() {
  return (
      <div style={{ 
        padding: "150px",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
      }}>
        <Comments />
      </div>
  );
}