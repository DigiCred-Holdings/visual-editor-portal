import React, { useEffect } from 'react';
import { registerSyncfusionLicense } from './syncfusion-license';
import Default from './components/DiagramEditor';
import '@syncfusion/ej2-base/styles/material.css';
import '@syncfusion/ej2-react-diagrams/styles/material.css';
import '@syncfusion/ej2-react-navigations/styles/material.css';
import './App.css';

function App() {
  useEffect(() => {
    registerSyncfusionLicense();
  }, []);

  return (
    <div className="App">
      <Default />
    </div>
  );
}

export default App;