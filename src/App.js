import { Routes, Route, Navigate } from 'react-router-dom';

// Компоненты
import Header from "./components/Header/Header";
import Monitoring from "./components/Monitoring/Monitoring";
import Reports from "./components/Reports/Reports";

// Стили
import './main.css';

function App() {
  return (
    <div className="App">
      <Header />
      <div className='fixed-container'>
        <Routes>
          <Route path="/monitoring" element={<Monitoring />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="*" element={<Navigate to="/monitoring" replace />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
