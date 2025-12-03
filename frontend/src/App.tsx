import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Factures from './pages/Factures';
import Reservations from './pages/Reservations';
import MoteurReservation from './pages/MoteurReservation';
import Login from './pages/Login';
import { ToastContainer } from './shared/components/Toast';
import { ProtectedRoute } from './shared/components/ProtectedRoute';

function App(): JSX.Element {
  return (
    <Router>
      <Routes>
        {/* Public login page without sidebar layout */}
        <Route path="/login" element={<Login />} />

        {/* Redirect root to dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* Protected routes wrapped with layout */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/factures"
          element={
            <ProtectedRoute>
              <Layout>
                <Factures />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/reservations"
          element={
            <ProtectedRoute>
              <Layout>
                <Reservations />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/moteur-reservation"
          element={
            <ProtectedRoute>
              <Layout>
                <MoteurReservation />
              </Layout>
            </ProtectedRoute>
          }
        />
      </Routes>

      <ToastContainer />
    </Router>
  );
}

export default App;
