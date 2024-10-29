import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainPage from './pages/MainPage';
import CreateStudy from './pages/CreateStudy';
import ManageStudy from './pages/ManageStudy';
import Header from './components/Header';

const App = () => {
  return (
    <Router>
      <Header />

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
