import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Factures from './pages/Factures';
import Reservations from './pages/Reservations';
import MoteurReservation from './pages/MoteurReservation';
import { ToastContainer } from './shared/components/Toast';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/factures" element={<Factures />} />
          <Route path="/reservations" element={<Reservations />} />
          <Route path="/moteur-reservation" element={<MoteurReservation />} />
        </Routes>
        <ToastContainer />
      </Layout>
    </Router>
  );
}

export default App;

