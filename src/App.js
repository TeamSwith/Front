import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainPage from './pages/MainPage';
import CreateStudy from './pages/CreateStudy';
import ManageStudy from './pages/ManageStudy';
import Header from './components/Header';
import Footer from './components/Footer'; 

const App = () => {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
      <Header /> 
      <main className="flex-grow overflow-hidden">
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/create-study" element={<CreateStudy />} />
          <Route path="/manage-study" element={<ManageStudy />} />
        </Routes>
      </main>
      <Footer /> 
      </div>
    </Router>
  );
};

export default App;