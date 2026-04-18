import { useState } from "react";
import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import Editor from "./components/Editor";
import Library from "./components/Library";
import Navbar from "./components/Navbar";

function App() {
  const [view, setView] = useState<"editor" | "library">("editor");
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  const handleSelectFile = (name: string) => {
    setSelectedFile(name);
    setView("editor"); 
  };

  return (
    <MantineProvider defaultColorScheme="light">
      <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
        <Navbar currentView={view} setView={setView} />
        
        <main style={{ flex: 1, overflowY: "auto", backgroundColor: view === "library" ? "#f1f3f5" : "#fff" }}>
          {view === "editor" ? (
            <Editor initialFile={selectedFile} />
          ) : (
            <Library onSelectFile={handleSelectFile} />
          )}
        </main>
      </div>
    </MantineProvider>
  );
}

export default App;
