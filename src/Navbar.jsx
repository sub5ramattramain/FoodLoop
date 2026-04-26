import { NavLink } from 'react-router';
import './Navbar.css'; 

function Navbar() {
  return (
    <nav className="navbar-container">
      <div className="nav-zone">
        <NavLink to="/about" className="nav-link">About</NavLink>
      </div>

      <div className="nav-zone nav-center">
        <NavLink to="/" className="nav-logo">FoodLoop</NavLink>
      </div>

      <div className="nav-zone nav-right">
        <NavLink to="/login" className="nav-link">Login</NavLink>
      </div>
    </nav>
  );
}

export default Navbar;