import { Outlet } from 'react-router-dom';
import NavBar from './Navbar';

export default function Layout({ children }) {
  return (
    <>
      <NavBar />
      <div className="container mt-5">
        {children || <Outlet />}
      </div>
    </>
  );
}
