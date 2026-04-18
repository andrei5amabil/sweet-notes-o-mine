interface NavbarProps {
  currentView: string;
  setView: (view: "editor" | "library") => void;
}

export default function Navbar({ currentView, setView }: NavbarProps) {
  const btnStyle = (active: boolean) => ({
    padding: "8px 16px",
    cursor: "pointer",
    border: "none",
    borderRadius: "4px",
    backgroundColor: active ? "#007bff" : "transparent",
    color: active ? "white" : "#555",
    fontWeight: "bold" as const,
  });

  return (
    <nav style={{ 
      display: "flex", alignItems: "center", gap: "15px", padding: "10px 20px", 
      backgroundColor: "#f8f9fa", borderBottom: "1px solid #ddd" 
    }}>
      <div style={{ fontSize: "1.2rem", fontWeight: "bold", marginRight: "20px" }}>🧁 Sweet Notes</div>
      <button style={btnStyle(currentView === "editor")} onClick={() => setView("editor")}>Write</button>
      <button style={btnStyle(currentView === "library")} onClick={() => setView("library")}>Vault</button>
    </nav>
  );
}