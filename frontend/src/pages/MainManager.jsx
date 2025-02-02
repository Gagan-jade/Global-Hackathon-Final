"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function MainManager() {
    const navigate = useNavigate();
    const [projects, setProjects] = useState([]);
    const [architecture, setArchitecture] = useState([]);

    useEffect(() => {
        fetch("http://localhost:8080/api/projects")
            .then((response) => response.json())
            .then((data) => setProjects(data))
            .catch((err) => console.error("Error fetching projects", err));

        fetch("http://localhost:8080/api/architecture")
            .then((response) => response.json())
            .then((data) => setArchitecture(data))
            .catch((err) => console.error("Error fetching architecture", err));
    }, []);

    const handleAllocateProject = () => {
        navigate('/allocateProject')
    };

    const navigateToEmployeePage = () => {
        navigate("/employees");
    };
    const showOnGoingProjects = () =>{
        navigate('/showProjects')
    }

    return (
        <div className="min-h-screen bg-black text-white p-8 relative flex flex-col items-center">
            <div className="absolute inset-0 w-full flex flex-wrap overflow-hidden">
                {[...Array(50)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute rounded-full bg-yellow-400 opacity-20"
                        style={{
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                            width: `${Math.random() * 10 + 5}px`,
                            height: `${Math.random() * 10 + 5}px`,
                            animation: `twinkle ${Math.random() * 5 + 3}s linear infinite`,
                        }}
                    ></div>
                ))}
            </div>
            <div className="relative z-10 w-full max-w-6xl">
                <h1 className="text-4xl font-bold text-yellow-400 mb-8 text-center">
                    Main Manager Dashboard
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* Employee Management Section */}
                    <div className="bg-gray-900 rounded-lg shadow-lg p-6 border border-yellow-400 w-full">
                        <h2 className="text-2xl font-semibold text-yellow-400 mb-4">
                            Employee Management
                        </h2>
                        <button
                            onClick={navigateToEmployeePage}
                            className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-2 px-4 rounded transition duration-300 ease-in-out w-full"
                        >
                            View All Employees
                        </button>
                    </div>

                    {/* Project Allocation Section */}
                    <div className="bg-gray-900 rounded-lg shadow-lg p-6 border border-yellow-400 w-full">
                        <h2 className="text-2xl font-semibold text-yellow-400 mb-4">
                            Project Allocation
                        </h2>
                        <button
                            onClick={handleAllocateProject}
                            className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-2 px-4 rounded transition duration-300 ease-in-out w-full mb-4"
                        >
                            Allocate New Project
                        </button>
                        
                    </div>

                   

                    <div className="bg-gray-900 rounded-lg shadow-lg p-6 border border-yellow-400 w-full">
                        <h2 className="text-2xl font-semibold text-yellow-400 mb-4">
                            Ongoing Projects
                        </h2>
                        <button
                            onClick={showOnGoingProjects}
                            className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-2 px-4 rounded transition duration-300 ease-in-out w-full mb-4"
                        >
                            View Ongoing Projects
                        </button>
                        <div className="space-y-4">
                            {projects.map((project, index) => (
                                <div key={index} className="border-l-4 border-yellow-400 pl-4">
                                    <h3 className="font-semibold text-yellow-400">
                                        Team Lead: {project.teamLead}
                                    </h3>
                                    <p className="text-sm text-gray-400">
                                        Duration: {project.duration}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MainManager;
