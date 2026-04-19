import { useState, useEffect } from "react";
import { readDir, readTextFile, BaseDirectory } from "@tauri-apps/plugin-fs";

interface FileItem {
  name: string;
  difficulty: string;
}

interface LibraryProps {
  onSelectFile: (name: string) => void;
  onNewNote: () => void;
}

export default function Library({ onSelectFile, onNewNote }: LibraryProps) {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadFiles = async () => {
    setLoading(true);
    try {
      const entries = await readDir("picoCTF", { baseDir: BaseDirectory.Document });
      const mdFiles = entries.filter(e => e.name?.endsWith(".md"));
      const fileData = await Promise.all(
        mdFiles.map(async (entry) => {
          const content = await readTextFile(`picoCTF/${entry.name}`, { 
            baseDir: BaseDirectory.Document 
          });
          
          const match = content.match(/difficulty:\s*(\w+)/);
          return {
            name: entry.name!,
            difficulty: match ? match[1] : "Unset"
          };
        })
      );
      setFiles(fileData);
    } catch (e) {
      console.error("Could not read directory", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadFiles(); }, []);

  const getTagStyle = (diff: string) => {
    const colors: Record<string, { bg: string, text: string }> = {
      Easy: { bg: "#dcfce7", text: "#166534" },   // Green
      Medium: { bg: "#fef9c3", text: "#854d0e" }, // Yellow
      Hard: { bg: "#fee2e2", text: "#991b1b" },   // Red
      Unset: { bg: "#f3f4f6", text: "#374151" }   // Gray
    };
    const theme = colors[diff] || colors.Unset;
    
    return {
      padding: "2px 8px",
      borderRadius: "12px",
      fontSize: "12px",
      fontWeight: "bold" as const,
      backgroundColor: theme.bg,
      color: theme.text,
      textTransform: "uppercase" as const
    };
  };

  if (loading) return <div style={{ padding: "40px" }}>Scanning Files...</div>;

  return (
    <div style={{ padding: "40px", maxWidth: "900px", margin: "0 auto" }}>
      <h2 style={{ color: "#333", borderBottom: "2px solid #eee", paddingBottom: "10px" }}>
        Challenge Vault
      </h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "20px", marginTop: "20px" }}>
        <div 
          onClick={onNewNote}
          style={{ 
            padding: "20px", 
            border: "2px dashed #007bff", // Dashed border to look like a "placeholder"
            borderRadius: "10px", 
            cursor: "pointer", 
            backgroundColor: "#f0f7ff", 
            display: "flex", 
            flexDirection: "column", 
            alignItems: "center", 
            justifyContent: "center",
            gap: "10px",
            transition: "all 0.2s"
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#e1effe"}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#f0f7ff"}
        >
          <div style={{ fontSize: "2.5rem", color: "#007bff" }}>+</div>
          <div style={{ fontWeight: "bold", color: "#007bff" }}>New Write-up</div>
        </div>

        {files.map(file => (
          <div 
            key={file.name}
            onClick={() => onSelectFile(file.name)}
            style={{ 
              padding: "20px", border: "1px solid #ddd", borderRadius: "8px", 
              cursor: "pointer", backgroundColor: "#fff", textAlign: "center",
              transition: "transform 0.1s, box-shadow 0.1s"
            }}
            onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "none"; }}
          >
            <div style={{ fontSize: "2rem", marginBottom: "10px" }}>📄</div>
            <div style={{ fontWeight: "bold", wordBreak: "break-all" }}>{file.name.replace(".md", "")}</div>

            <span style={getTagStyle(file.difficulty)}>
              {file.difficulty}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}