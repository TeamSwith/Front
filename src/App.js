import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import MainPage from './pages/MainPage';
import CreateStudy from './pages/CreateStudy';
import ManageStudy from './pages/ManageStudy';
import logo from './assets/swithLogo.png';

const App = () => {
  return (
    <Router>
      <header className="bg-[#8CC29E] text-white p-4 flex justify-between items-center px-10">
        {/* 왼쪽: 로고와 네비게이션 링크 */}
        <div className="flex items-center space-x-4">
          {/* 로고 (메인 페이지로 이동) */}
          <Link to="/" className="flex items-center">
            <img src={logo} alt="Swith Logo" className="h-10 mr-2" />
          </Link>

          {/* 네비게이션 링크 */}
          <nav className="flex space-x-4">
            <Link to="/create-study" className="text-white hover:text-gray-100">스터디 생성</Link>
            <Link to="/manage-study" className="text-white hover:text-gray-100">스터디 관리</Link>
          </nav>
        </div>

        {/* 오른쪽: My Page 및 알람 버튼 */}
        <div className="flex space-x-4">
        <button className="bg-white text-black px-4 py-2 rounded-2xl hover:bg-gray-200 flex items-center space-x-2">
        <img src={require('./assets/account_circle.png')} alt="" className="w-5 h-5" />
        <span>My Page</span>
        </button>
        <button className="flex items-center">
          <img src={require('./assets/bell.png')} alt="알람" className="w-6 h-6" />
        </button>
        </div>
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
