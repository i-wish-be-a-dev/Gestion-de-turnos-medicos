import { useState } from "react";

import '../Styles/LoginForm.css';
import { useNavigate } from "react-router-dom";
import TurnosList from './TurnoList';
import { buildApiUrl } from '../config/api';

export default function Login({}) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
      const navigate = useNavigate();
   
      const handleSubmit = async (e) => {
        e.preventDefault();
   
        try {
            const response = await fetch(buildApiUrl('/auth/login'), {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });
            if (!response.ok) {
                throw new Error("Login failed");
               }

            const data = await response.json();
            const authPayload = extractAuthPayload(data);
            const token = authPayload.token;
            const role = normalizeRole(authPayload.role);

            if (!token || !role) {
                throw new Error("La respuesta de autenticación no contiene token o rol válido.");
            }

            localStorage.setItem("token", token);
            localStorage.setItem("role", role);

            navigate(getDashboardRouteByRole(role));
         } catch (error) {
            console.error("Error during login:", error);
        }
    };

   return (
<div id="content" className="container">
   <div className="login-card">
      <div className="login-header">
         <h1 className="login-title">Gestion de turnos médicos</h1>
         <p className="login-subtitle">Login to your account</p>
      </div>
      
      <div className="card-body">
         <form onSubmit={handleSubmit}>
            <div className="form-group">
               <label htmlFor="username" className="form-label">Username</label>
               <input 
                  type="text" 
                  className="form-control" 
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  aria-describedby="emailHelp"
                  placeholder="Enter your username"
               /> 
            </div>
                         
            <div className="form-group">
               <label htmlFor="password" className="form-label">Password</label>
               <input 
                  type="password" 
                  className="form-control" 
                  id="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter your password" 
               /> 
            </div>
            
            <button type="submit" className="btn btn-primary btn-block">
               Submit
            </button>
            
            <a href="#" className="forgot-password">
               ¿Olvidaste tu contraseña?
            </a>
         </form>
      </div>
   </div>
</div>
);


}

function extractAuthPayload(data) {
   return (
      data?.data?.body ||
      data?.data?.authResponse ||
      data?.data ||
      data?.body ||
      data
   );
}

function normalizeRole(role) {
   const normalizedRole = role?.toUpperCase();

   if (normalizedRole === "MEDICO") {
      return "DOCTOR";
   }

   return normalizedRole;
}

function getDashboardRouteByRole(role) {
   switch (role) {
      case "ADMIN":
         return "/admin/turnos";
      case "DOCTOR":
         return "/doctor/dashboard";
      case "PACIENTE":
         return "/paciente/dashboard";
      default:
         throw new Error(`Rol no soportado: ${role}`);
   }
}