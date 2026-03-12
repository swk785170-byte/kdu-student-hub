import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Hub from './pages/Hub';
import DocumentViewer from './pages/DocumentViewer';
import Forum from './pages/Forum';
import PostDetail from './pages/PostDetail';

// Protected Route wrapper
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  
  if (loading) return <div className="app-layout flex-center">Loading...</div>;
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
}

function MainLayout() {
  return (
    <DataProvider>
      <div className="app-layout">
        <Sidebar />
        <div className="main-content">
          <Navbar />
          <Routes>
            <Route path="/" element={<Hub />} />
            <Route path="/subject/:subjectId" element={<Hub />} />
            <Route path="/view/:fileId" element={<DocumentViewer />} />
            <Route path="/forum" element={<Forum />} />
            <Route path="/post/:postId" element={<PostDetail />} />
          </Routes>
        </div>
      </div>
    </DataProvider>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route 
            path="/*" 
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
