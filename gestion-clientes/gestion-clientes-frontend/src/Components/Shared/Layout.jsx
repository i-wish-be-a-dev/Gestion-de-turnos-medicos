import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

export default function Layout({ children }) {
  return (
    <>
      <Navbar />
      <div className="container mt-5">
        {children || <Outlet />}
      </div>
    </>
  );
}
