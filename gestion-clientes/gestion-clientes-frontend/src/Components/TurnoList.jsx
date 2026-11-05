import React, { useState, useEffect } from 'react';

import TurnoSearch from './TurnoSearch';
import { buildApiUrl } from '../config/api';

const TurnosList = () => {
    const [turnos, setTurnos] = useState([]);
    const role = localStorage.getItem("role");
    const token = localStorage.getItem("token");
    const [filterState, setFilterState] = useState('all');

    //console.log("Role:", role);
    //console.log("Token:", token);
    useEffect(() => {
        const fetchTurnos = async () => {
            try {
                let url;


                if (role === "ADMIN") {
                    url = buildApiUrl('/admin/turnos');
                } else if (role === "MEDICO") {
                    url = buildApiUrl('/medico/turnos');
                } else {
                    url = buildApiUrl('/paciente/turnos');
                }
                const res = await fetch(url, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                });

                if (!res.ok) {
                    throw new Error(`Er2ror HTTP: ${res.status}`);
                }


                const data = await res.json();
                setTurnos(data.data || []);
                console.log("Turnos:", data);


            } catch (error) {
                console.error("Error fetching turnos:", error);
            }
        };
        fetchTurnos();
    }, [role, token]);

    return (
       
       <div className='mb-3'>
       <div className="container mt-3">
          <h2>Lista de Turnos</h2>
          
            
         
         

         
         <ul className='list-group'>
                {turnos.map((turno, idx) => (
                    <li key={turno.id}>{JSON.stringify(turno)}</li>
                ))}
         </ul>




        </div>
    </div>
    );
};

export default TurnosList;