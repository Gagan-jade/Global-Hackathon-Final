import { useEffect, useState } from "react";
import axios from "axios";

export default function Building() {
    const [buildings, setBuildings] = useState([]);
    const [selectedBuilding, setSelectedBuilding] = useState(null);

    useEffect(() => {
        axios.get("http://localhost:8080/api/architecture")
            .then(response => setBuildings(response.data))
            .catch(error => console.error("Error fetching buildings:", error));
    }, []);

    return (
        <div className="p-6 bg-black min-h-screen text-white flex flex-col items-center">
            <h1 className="text-4xl font-extrabold mb-8 text-center text-white border-b-4 border-white pb-2">Select a Building</h1>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-6xl">
                {buildings.map((building, index) => (
                    <div
                        key={building._id}
                        className="p-10 bg-white text-black border-4 border-white rounded-xl shadow-lg cursor-pointer hover:bg-gray-300 transition-all transform hover:scale-105 text-center relative h-48 flex items-center justify-center border-b-2 border-black"
                        onClick={() => setSelectedBuilding(building)}
                    >
                        <h2 className="text-3xl font-bold absolute top-2 left-2">{`Building ${index + 1}`}</h2>
                    </div>
                ))}
            </div>
            {selectedBuilding && <Floors building={selectedBuilding} />}
        </div>
    );
}

function Floors({ building }) {
    return (
        <div className="mt-8 p-6 bg-white text-black rounded-xl w-full max-w-5xl shadow-lg animate-fade-in border-4 border-white">
            <h2 className="text-3xl font-bold mb-4 text-center">{building.name} - Floors</h2>
            <div className="grid grid-cols-1 gap-6">
                {building.floors.map((floor, index) => (
                    <div key={index} className="mt-4 p-4 bg-gray-200 rounded-lg shadow-md transition-transform hover:scale-105 border-2 border-black">
                        <h3 className="text-2xl font-semibold mb-2">Floor {floor.floor}</h3>
                        <Desks desks={floor.desks} building={building.name} floor={floor.floor} />
                    </div>
                ))}
            </div>
        </div>
    );
}

function Desks({ desks, building, floor }) {
    console.log(desks, floor)
    const updateDeskStatus = (deskNumber, allocated) => {
        axios.put("http://localhost:8080/api/architecture/updateDesk", {
            building, floor, deskNumber, allocated: !allocated
        })
            .then(() => window.location.reload())
            .catch(error => console.error("Error updating desk allocation:", error));
    };

    return (
        <div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-8 gap-4 mt-3 p-4 bg-gray-300 rounded-md border-1 border-black">
            {desks.map(desk => (
                <button
                    key={desk.deskNumber}
                    className={`p-4 rounded-lg transition-all transform shadow-md border-[1px] border-black ${desk.allocated ? 'bg-red-400' : 'bg-green-400'
                        }`}
                    onClick={() => updateDeskStatus(desk.deskNumber, desk.allocated)}
                >
                    {desk.deskNumber}
                </button>
            ))}
        </div>

    );
}
