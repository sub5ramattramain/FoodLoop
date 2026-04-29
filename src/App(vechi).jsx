import { BrowserRouter, Routes, Route } from 'react-router';
import Home from './pages/Home';
import Navbar from './Navbar';
import About from './pages/About';
import Login from './pages/Login';

function App() {
  return(
    <BrowserRouter>
    <Navbar />
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/about" element={<About />} />
    <Route path="/login" element={<Login />} />
  </Routes>
 </BrowserRouter>
  );
}

export default App;