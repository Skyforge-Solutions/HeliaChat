import { ThemeProvider } from './context/ThemeContext';
import { ChatProvider } from './context/ChatContext';
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import ChatArea from './components/chat/ChatArea';
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is already logged in
    const userData = localStorage.getItem('heliaUser');
    if (userData) {
      try {
        setUser(JSON.parse(userData));
        setIsAuthenticated(true);
      } catch (e) {
        console.error('Error parsing user data:', e);
      }
    }
  }, []);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleLogin = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
  };

  const handleSignup = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('heliaUser');
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <ThemeProvider>
      <ChatProvider>
        <Router>
          <Routes>
            <Route 
              path="/login" 
              element={
                isAuthenticated ? 
                <Navigate to="/" /> : 
                <Login onLogin={handleLogin} />
              } 
            />
            <Route 
              path="/signup" 
              element={
                isAuthenticated ? 
                <Navigate to="/" /> : 
                <Signup onSignup={handleSignup} />
              } 
            />
            <Route 
              path="/*" 
              element={
                isAuthenticated ? (
                  <div className="h-screen flex flex-col bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark">
                    <Navbar user={user} onLogout={handleLogout} />
                    <div className="flex flex-1 overflow-hidden">
                      <div
                        className={`transition-all duration-300 ${sidebarCollapsed ? 'w-0 md:w-16' : 'w-0 md:w-64'}`}
                      >
                        <Sidebar collapsed={sidebarCollapsed} />
                      </div>

                      <button
                        onClick={toggleSidebar}
                        className="hidden md:flex items-center justify-center absolute left-0 top-1/2 transform -translate-y-1/2 ml-2 z-30 bg-gray-200 dark:bg-gray-700 rounded-full p-1 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                        style={{
                          left: sidebarCollapsed ? '3.5rem' : '15rem',
                          transition: 'left 0.3s ease',
                        }}
                      >
                        {sidebarCollapsed ? (
                          <FiChevronRight size={16} />
                        ) : (
                          <FiChevronLeft size={16} />
                        )}
                      </button>

                      <main className="flex-1 overflow-hidden">
                        <ChatArea sidebarCollapsed={sidebarCollapsed} />
                      </main>
                    </div>
                  </div>
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
          </Routes>
        </Router>
      </ChatProvider>
    </ThemeProvider>
  );
}

export default App;
