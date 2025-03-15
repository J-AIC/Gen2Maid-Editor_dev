import React, { useEffect, useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import MermaidGraphEditor from './components/MermaidGraphEditor';
import { ThemeProvider } from './context/ThemeContext';
import './App.css';

function App() {
  const [initialCode, setInitialCode] = useState('');

  useEffect(() => {
    // Get the code from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    if (code) {
      // Decode the URL-encoded code
      const decodedCode = decodeURIComponent(code);
      setInitialCode(decodedCode);
    }
  }, []);

  return (
    <ThemeProvider>
      <DndProvider backend={HTML5Backend}>
        <div className="App">
          <MermaidGraphEditor initialCode={initialCode} />
        </div>
      </DndProvider>
    </ThemeProvider>
  );
}

export default App;