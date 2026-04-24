import { NavLink } from 'react-router';
import './Navbar.css'; 

function Navbar() {
  return (
    <nav className="navbar-container">
      {/* Left Zone */}
      <div className="nav-zone">
        <NavLink to="/about" className="nav-link">About</NavLink>
      </div>

      {/* Center Zone */}
      <div className="nav-zone nav-center">
        <NavLink to="/" className="nav-logo">FoodLoop</NavLink>
      </div>

      {/* Right Zone */}
      <div className="nav-zone nav-right">
        <NavLink to="/login" className="nav-link">Login</NavLink>
      </div>
    </nav>
  );
}

export default Navbar;