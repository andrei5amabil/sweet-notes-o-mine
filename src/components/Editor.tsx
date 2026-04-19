import { useEffect, useState } from "react";
import { BlockNoteView } from "@blocknote/mantine";
import { useCreateBlockNote } from "@blocknote/react";
import { writeTextFile, mkdir, BaseDirectory, readTextFile } from "@tauri-apps/plugin-fs";
import "@blocknote/mantine/style.css";

export default function Editor({ initialFile }: { initialFile?: string | null }) {

  const [difficulty, setDifficulty] = useState("");
  const [fileName, setFileName] = useState("pico-challenge-01");

  const handleUpload = async (file: File) => {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = () => reject("Failed to read file");
      reader.readAsDataURL(file);
    });
  };

  const editor = useCreateBlockNote({
    uploadFile: handleUpload,
  });

  const saveToLocalFolder = async () => {
    try {
      const markdown = await editor.blocksToMarkdownLossy(editor.document);
      
      const frontmatter = [
        "---",
        `difficulty: ${difficulty}`,
        "---",
        ""
      ].join("\n");

      const fullFileContent = frontmatter + markdown;

      await mkdir("picoCTF", { 
        baseDir: BaseDirectory.Document, 
        recursive: true 
      });
      
      const cleanName = fileName.replace(/\.md$/, "");
      const path = `picoCTF/${cleanName}.md`;

      await writeTextFile(path, fullFileContent, {
        baseDir: BaseDirectory.Document,
      });

      alert(`Successfully saved to Documents/${path}`);
    } catch (err) {
      console.error("Save Error:", err);
      alert(`Save failed. Error: ${err}`);
    }
  };

  useEffect(() => {
    const loadSelectedFile = async () => {
      if (initialFile) {
        try {
          const content = await readTextFile(`picoCTF/${initialFile}`, { 
            baseDir: BaseDirectory.Document 
          });

          const diffMatch = content.match(/difficulty:\s*(\w+)/);
          if (diffMatch) {
            setDifficulty(diffMatch[1]); 
          }

          const cleanBody = content.replace(/^---[\s\S]*?---/, "").trim();

          const blocks = await editor.tryParseMarkdownToBlocks(cleanBody);

          editor.replaceBlocks(editor.document, blocks);

          setFileName(initialFile.replace(".md", ""));
          
          console.log(`Loaded: ${initialFile}`);
        } catch (err) {
          console.error("Failed to load file:", err);
        }
      } else {
        setFileName(`challenge-${Date.now()}`);
        setDifficulty("Medium");
        editor.replaceBlocks(editor.document, editor.tryParseMarkdownToBlocks(""));
        console.log("New empty note prepared.");
      }
    };

    loadSelectedFile();
  }, [initialFile, editor]);

  return (
    <div style={{ 
      display: "flex", 
      flexDirection: "column", 
      height: "100vh",
      backgroundColor: "#fff" 
    }}>
      <div style={{ 
        display: "flex", 
        gap: "10px", 
        padding: "15px", 
        borderBottom: "1px solid #eee",
        alignItems: "center" 
      }}>
        <label style={{ fontWeight: "bold" }}>Filename:</label>
        <input 
          type="text" 
          value={fileName}
          onChange={(e) => setFileName(e.target.value)}
          placeholder="challenge-name"
          style={{ 
            padding: "8px", 
            flex: 1, 
            borderRadius: "4px", 
            border: "1px solid #ccc" 
          }}
        />
        <select 
          value={difficulty} 
          onChange={(e) => setDifficulty(e.target.value)}
          style={{ 
            padding: "8px", 
            borderRadius: "4px", 
            border: "1px solid #ddd",
            backgroundColor: difficulty === "Hard" ? "#fee2e2" : difficulty === "Easy" ? "#f0fdf4" : "#fff" 
          }}
        >
          <option value="Easy">🟢 Easy</option>
          <option value="Medium">🟡 Medium</option>
          <option value="Hard">🔴 Hard</option>
        </select>
        <button 
          onClick={saveToLocalFolder}
          style={{ 
            padding: "8px 20px", 
            backgroundColor: "#2ea44f", 
            color: "white", 
            border: "none", 
            borderRadius: "4px", 
            cursor: "pointer",
            fontWeight: "bold"
          }}
        >
          Save Write-up
        </button>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "20px" }}>
        <BlockNoteView editor={editor} theme="light" />
      </div>
    </div>
  );
}