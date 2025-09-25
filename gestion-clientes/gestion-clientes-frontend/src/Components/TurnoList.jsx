import React, { useState, useEffect } from 'react';

const TurnosList = () => {
    const [turnos, setTurnos] = useState([]);

    useEffect(() => {
        const fetchTurnos = async () => {
            try {
                const res = await fetch("http://localhost:8080/api/turnos");
                const data = await res.json();
                setTurnos(data);
                console.log(data);


            } catch (error) {
                console.error("Error fetching turnos:", error);
            }
        };
        fetchTurnos();
    }, []);

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