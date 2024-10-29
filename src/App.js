import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import MainPage from './pages/MainPage';
import CreateStudy from './pages/CreateStudy';
import ManageStudy from './pages/ManageStudy';

const App = () => {
  return (
    <Router>
      <header className="bg-gray-800 text-white p-4">
        <nav className="flex space-x-4">
          <Link to="/" className="hover:text-gray-400">메인 페이지</Link>
          <Link to="/create-study" className="hover:text-gray-400">스터디 생성</Link>
          <Link to="/manage-study" className="hover:text-gray-400">스터디 관리</Link>
        </nav>
      </header>
      <main className="p-4">
      <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/create-study" element={<CreateStudy />} />
          <Route path="/manage-study" element={<ManageStudy />} />
      </Routes>
      </main>
    </Router>
  );
};


export default App;