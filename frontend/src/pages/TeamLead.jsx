import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Use React Router for navigation
import Map from '../components/StructuralRepresentation'

export default function TeamLeadPage() {
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const empId = localStorage.getItem("teamLeadEmpId");
    const navigate = useNavigate();  // Initialize navigate for navigation

    useEffect(() => {
        // Fetch project details for the team lead (empid)
        const fetchProject = async () => {
            try {
                setLoading(true); // Start loading before the request
                const response = await axios.post("http://localhost:8080/api/teamLead/project", { empid: empId });

                if (response.data.project) {
                    setProject(response.data.project);  // Set the project details if found
                } else {
                    setProject(null);  // If no project is found
                }
            } catch (error) {
                console.error("Error fetching project:", error);
                setProject(null);  // If there’s an error
            } finally {
                setLoading(false);  // End loading
            }
        };

        fetchProject();
    }, [empId]); // Re-fetch if empId changes

    const startProject = () => {
        // Navigate to the employee list page
        navigate("/employee-list");
    };

    if (loading) {
        return <div className="text-center p-4">Loading...</div>;  // Show loading while fetching data
    }

    if (!project) {
        return (
            <div className="text-center p-4 bg-yellow-100 text-yellow-800 rounded shadow-md">
                No ongoing project found for this team lead.
            </div>
        );
    }

    return (
        <div>
            <div className="p-6 bg-gray-100 rounded-lg shadow-lg">
                <h2 className="text-3xl font-bold text-center text-green-700 mb-6">Ongoing Project</h2>

                <div className="bg-white p-4 rounded-lg shadow-md mb-6">
                    <p className="text-lg font-semibold text-gray-700">
                        <strong>Team Lead:</strong> {project.teamLead}
                    </p>
                    <p className="text-lg font-semibold text-gray-700">
                        <strong>Project Duration:</strong> {project.duration} weeks
                    </p>

                    <div className="mt-4">
                        <strong className="text-lg text-gray-700">Team Members:</strong>
                        <ul className="list-disc pl-6 mt-2">
                            {project.coworkers.map((coworker, index) => (
                                <li key={index} className="text-gray-700">{coworker.empname} ({coworker.empid})</li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Show "Start Project" button only if coworkers is empty */}
                {project.coworkers.length === 0 ? (
                    <button
                        onClick={startProject}
                        className="bg-green-600 text-white py-3 px-6 rounded-lg mt-4 hover:bg-green-700 transition-all"
                    >
                        Start Project
                    </button>
                ) : (
                    <div className="text-center text-lg text-red-600 font-semibold mt-4">
                        Project Already In Progress
                    </div>
                )}
            </div>
            <div>
                <Map />
            </div>
        </div>
    );
}
