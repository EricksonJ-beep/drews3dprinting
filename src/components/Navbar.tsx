import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../lib/auth';

export default function Navbar() {
  const { user, logout } = useAuth();
  return (
    <header className="bg-white/80 backdrop-blur border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-brand-blue">Drew's 3D Printing</Link>
        <nav className="flex items-center gap-4">
          <NavLink to="/categories" className={({isActive}) => isActive ? 'text-brand-blue font-medium' : 'text-gray-700 hover:text-brand-blue'}>Categories</NavLink>
          <NavLink to="/custom-order" className={({isActive}) => isActive ? 'text-brand-blue font-medium' : 'text-gray-700 hover:text-brand-blue'}>Custom Order</NavLink>
          <NavLink to="/cart" className={({isActive}) => isActive ? 'text-brand-blue font-medium' : 'text-gray-700 hover:text-brand-blue'}>Cart</NavLink>
          {user && <NavLink to="/orders" className={({isActive}) => isActive ? 'text-brand-blue font-medium' : 'text-gray-700 hover:text-brand-blue'}>Orders</NavLink>}
          {!user ? (
            <NavLink to="/auth" className={({isActive}) => isActive ? 'text-brand-blue font-medium' : 'text-gray-700 hover:text-brand-blue'}>Sign In</NavLink>
          ) : (
            <button className="text-gray-700 hover:text-brand-blue" onClick={() => logout()}>Sign Out</button>
          )}
        </nav>
      </div>
    </header>
  );
}
