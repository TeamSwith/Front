import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Link 제거
import MainPage from './pages/MainPage';
import CreateStudy from './pages/CreateStudy';
import ManageStudy from './pages/ManageStudy';
import Header from './components/Header';
import Footer from './components/Footer'; 

const App = () => {
  return (
    <Router>
      <Header /> {/* 헤더 컴포넌트 사용 */}
      <main className="p-4">
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/create-study" element={<CreateStudy />} />
          <Route path="/manage-study" element={<ManageStudy />} />
        </Routes>
      </main>
      <Footer /> {/* Footer 컴포넌트 추가 */}
    </Router>
  );
};

export default App;