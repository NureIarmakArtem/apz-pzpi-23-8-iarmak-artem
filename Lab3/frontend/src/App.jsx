import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard'; // 1. ДОДАЛИ ІМПОРТ
import Header from './components/Header'; // (якщо він у тебе є)

function App() {
  return (
    <BrowserRouter>
      <Header /> 
      
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Dashboard />} />
        <Route path="/admin" element={<AdminDashboard />} /> 
      </Routes>
    </BrowserRouter>
  );
}

export default App;