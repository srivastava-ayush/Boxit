import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router";
import Select from "./components/pages/Select";
import Train from "./components/pages/Train";
import Home from "./components/pages/Home";
import Learn from "./components/pages/Learn";
import Navbar from "./components/ui/Navbar";
import Login from "./components/pages/Login";
import Signup from "./components/pages/Signup";
import { ReactLenis } from 'lenis/react';
import { useAuthStore } from "./stores/authStore";
import ProfilePage from "./components/pages/Profile";
import Test from "./components/pages/Test";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const fetchUser = useAuthStore((state) => state.fetchUser);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return (
    <>
      <ReactLenis root />
      <Router>
       
        <Routes>
          <Route path="/" element={<><Navbar /><Home /></>} />
          <Route path="/learn" element={<><Navbar /><Learn /> </>} />
          <Route path="/select" element={<><Navbar /><Select /> </>} />
          <Route path="/train" element={<><Navbar /><Train /> </>} />
          <Route path="/login" element={ <><Navbar /><Login /> </>} />
          <Route path="/signup" element={<><Navbar /><Signup /> </>} />
          <Route path="/profile" element={
  <ProtectedRoute>
    <ProfilePage />
  </ProtectedRoute>
}/>
          <Route path="/test" element={<Test/>} />
          <Route path="*" element={<div className="p-6">404 Not Found go to 
            <Link className="border p-4 m-4" to="/">Home</Link>
          </div>} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
