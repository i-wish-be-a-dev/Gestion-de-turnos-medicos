import React, { useState, useEffect } from 'react';


const TurnosList = () => {
    const [turnos, setTurnos] = useState([]);
    const role = localStorage.getItem("role");
    const token = localStorage.getItem("token");
    // const    

    console.log("Role:", role);
    console.log("Token:", token);
    useEffect(() => {
        const fetchTurnos = async () => {
            try {
                let url;


                if (role === "ADMIN") {
                    url = "http://localhost:8090/admin/turnos";
                } else if (role === "MEDICO") {
                    url = "http://localhost:8090/medico/turnos";
                } else {
                    url = "http://localhost:8090/paciente/turnos";
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

   

         console.log('Token:', token);
         console.log('Role:', role);

         // Optional: Save them to localStorage or state
         localStorage.setItem('authToken', token);
         localStorage.setItem('userRole', role);





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
        <div>
            <h2>Lista de Turnos</h2>
            <ul>
                {turnos.map((turno, idx) => (
                    <li key={idx}>{JSON.stringify(turno)}</li>
                ))}
            </ul>
        </div>
    );
};

export default TurnosList;