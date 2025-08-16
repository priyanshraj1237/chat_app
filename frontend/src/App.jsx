import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

import Login from './Pages/Login';
import Signup from './Pages/Signup';
import Message from './Pages/Messages';
import { AuthProvider } from './AuthContext';
import { SocketProvider } from './SocketContext';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route 
              path="/message" 
              element={
                <ProtectedRoute>
                  <Message />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </Router>
      </SocketProvider>
    </AuthProvider>
  );
}

export default App;
