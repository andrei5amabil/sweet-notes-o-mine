import { useState, useEffect } from "react";
import { readDir, BaseDirectory } from "@tauri-apps/plugin-fs";

interface LibraryProps {
  onSelectFile: (name: string) => void;
}

export default function Library({ onSelectFile }: LibraryProps) {
  const [files, setFiles] = useState<string[]>([]);

  const loadFiles = async () => {
    try {
      const entries = await readDir("picoCTF", { baseDir: BaseDirectory.Document });
      setFiles(entries.filter(e => e.name?.endsWith(".md")).map(e => e.name!));
    } catch (e) {
      console.error("Could not read directory", e);
    }
  };

  useEffect(() => { loadFiles(); }, []);

  return (
    <div style={{ padding: "40px", maxWidth: "900px", margin: "0 auto" }}>
      <h2 style={{ color: "#333", borderBottom: "2px solid #eee", paddingBottom: "10px" }}>
        Challenge Vault
      </h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "20px", marginTop: "20px" }}>
        {files.map(file => (
          <div 
            key={file}
            onClick={() => onSelectFile(file)}
            style={{ 
              padding: "20px", border: "1px solid #ddd", borderRadius: "8px", 
              cursor: "pointer", backgroundColor: "#fff", textAlign: "center",
              transition: "transform 0.1s, box-shadow 0.1s"
            }}
            onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "none"; }}
          >
            <div style={{ fontSize: "2rem", marginBottom: "10px" }}>📄</div>
            <div style={{ fontWeight: "bold", wordBreak: "break-all" }}>{file.replace(".md", "")}</div>
          </div>
        ))}
      </div>
    </div>
  );
}