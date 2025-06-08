import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router';
import { getUser } from '../../services/authService';
import HomePage from '../HomePage/HomePage';
import SignUpPage from '../SignUpPage/SignUpPage';
import LogInPage from '../LogInPage/LogInPage';
import NavBar from '../../components/NavBar/NavBar';
import HootList from '../HootList/HootList';
import HootDetails from '../HootDetails/HootDetails';
import NewHootPage from '../NewHootPage/NewHootPage';
import CommentForm from '../../components/CommentForm/CommentForm';
import * as hootService from '../../services/hootService';
import './App.css';

export default function App() {
  const [user, setUser] = useState(getUser());
  const [hoots, setHoots] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllHoots = async () => {
      const hootsData = await hootService.index();
      setHoots(hootsData);
    };
    if (user) fetchAllHoots();
  }, [user]);

  const handleAddHoot = async (hootFormData) => {
    const newHoot = await hootService.create(hootFormData);
    setHoots([newHoot, ...hoots]);
    navigate('/hoots');
  };

  const handleDeleteHoot = async (hootId) => {
    console.log('hootId', hootId);
    setHoots(hoots.filter((hoot) => hoot._id !== hootId));
    navigate('/hoots');
  };

  const handleUpdateHoot = async (hootId, hootFormData) => {
    const updatedHoot = await hootService.update(hootId, hootFormData);
    setHoots(hoots.map((hoot) => (hootId === hoot._id ? updatedHoot : hoot)));
    navigate(`/hoots/${hootId}`);
  };

  return (
    <main className="App">
      <NavBar user={user} setUser={setUser} />
      <section id="main-section">
        {user ? (
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/hoots" element={<HootList hoots={hoots} />} />
            <Route
              path="/hoots/new"
              element={<NewHootPage handleAddHoot={handleAddHoot} />}
            />
            <Route
              path="/hoots/:hootId"
              element={
                <HootDetails
                  handleDeleteHoot={handleDeleteHoot}
                  hoots={hoots}
                  user={user}
                />
              }
            />
            <Route
              path="/hoots/:hootId/edit"
              element={
                <NewHootPage
                  handleUpdateHoot={handleUpdateHoot}
                  hoots={hoots}
                  user={user}
                />
              }
            />

            <Route
              path="/hoots/:hootId/comments/:commentId/edit"
              element={<CommentForm />}
            />
            <Route path="*" element={null} />
          </Routes>
        ) : (
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/signup" element={<SignUpPage setUser={setUser} />} />
            <Route path="/login" element={<LogInPage setUser={setUser} />} />
            <Route path="*" element={null} />
          </Routes>
        )}
      </section>
    </main>
  );
}
