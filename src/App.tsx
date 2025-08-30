import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { UserProvider } from './context/UserContext';
import { Navigation } from './components/Navigation';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Login } from './pages/Login.tsx';
import { Dashboard } from './pages/Dashboard.tsx';
import { Users } from './pages/Users.tsx';
import { CreateUser } from './pages/CreateUser.tsx';
import { MyProfile } from './pages/MyProfile.tsx';
import { Forbidden } from './pages/Forbidden.tsx';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <UserProvider>
        <Router>
          <div className="App">
            <Navigation />
            <main className="main-content">
              <Routes>

                {/* // Public routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/forbidden" element={<Forbidden />} />

                {/* Below all routes are protected routes */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/users"
                  element={
                    <ProtectedRoute requiredPermission="canView">
                      <Users />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/create-user"
                  element={
                    <ProtectedRoute requiredPermission="canAdd">
                      <CreateUser />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/my-profile"
                  element={
                    <ProtectedRoute>
                      <MyProfile />
                    </ProtectedRoute>
                  }
                />

                {/* Default redirects */}
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </main>
          </div>
        </Router>
      </UserProvider>
    </AuthProvider>
  );
}

export default App;
