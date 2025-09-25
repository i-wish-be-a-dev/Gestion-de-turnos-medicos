import { useNavigate, Link, useParams, useLocation } from "react-router-dom";


export default function Navbar() {

const navigate = useNavigate();
const location = useLocation();


return (
<nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm">
       <div className="container-fluid px-3">
        <i className="bi bi-journal-bookmark px-3"></i>
           <span className="fw-bold">Gestor de turnos medicos</span>
        <a className="navbar-brand d-flex align-items-center" href="/">
        </a>

    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
      <span className="navbar-toggler-icon"></span>
    </button>
    <div className="collapse navbar-collapse" id="navbarNav">
      <ul className="navbar-nav ms-auto">
        <li className="nav-item">
          {location.pathname === "/turno/nuevo" || location.pathname.includes('/turno/') ? (
            <button
              className="nav-link active btn btn-link"

              onClick={() => navigate("/")}
            >
              Volver
            </button>
          ) : (
            <button
              className="nav-link active btn btn-link"

              onClick={() => navigate("/turno/nuevo")}
            >
              Crear Turno
            </button>
          )}
        </li>
      </ul>




    </div>
  </div>
</nav>

  );
}
