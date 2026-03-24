import React, {useState} from "react";


const TurnoSearch = ({ turno, renderTurno, onSearch }) => {
   
    const [searchTerm, setSearchTerm] = useState("");

    const filteredSearchTerm = turno.filter(t =>
       // t.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        //t.apellido.toLowerCase().includes(searchTerm.toLowerCase())
        t.id.toString().includes(searchTerm)
    );

    const handleSearch = () => {
        if (onSearch) {
            onSearch(filteredSearchTerm);
        }
    };

    return (
        <div>
            <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Buscar turno..."
            />
            <button onClick={handleSearch}>Buscar</button>
        </div>
    );
};

export default TurnoSearch;