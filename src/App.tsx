import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Home } from './pages/public/Home';
import { Rooms } from './pages/public/Rooms';
import { RoomDetails } from './pages/public/RoomDetails';
import { Booking } from './pages/public/Booking';
import { Confirmation } from './pages/public/Confirmation';
import { ToastContainer } from './components/ui/ToastContainer';
import { Regulamin } from './pages/public/Regulamin';
import { PolitykaPrywatnosci } from './pages/public/PolitykaPrywatnosci';
import { FAQ } from './pages/public/FAQ';

function App() {
  return (
    <Router>
      <ToastContainer />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="rooms" element={<Rooms />} />
          <Route path="room/:id" element={<RoomDetails />} />
          <Route path="booking" element={<Booking />} />
          <Route path="confirmation" element={<Confirmation />} />
          <Route path="regulamin" element={<Regulamin />} />
          <Route path="polityka-prywatnosci" element={<PolitykaPrywatnosci />} />
          <Route path="faq" element={<FAQ />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
