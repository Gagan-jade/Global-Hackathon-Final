

// import { useState, useEffect } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";  // Import useNavigate for navigation

// export default function EmployeeListPage() {
//     const [employees, setEmployees] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [selectedEmployees, setSelectedEmployees] = useState([]);  // For storing selected employees
//     const [duration, setDuration] = useState("");  // For storing project duration
//     const [isConfirmEnabled, setIsConfirmEnabled] = useState(false);  // To enable the confirm button
//     const [responseMessage, setResponseMessage] = useState("");  // For displaying the response message on screen
//     const Navigate = useNavigate();  // Use Navigate for navigation

//     useEffect(() => {
//         // Fetch employee data from the database
//         const fetchEmployees = async () => {
//             try {
//                 setLoading(true); // Start loading before the request
//                 const response = await axios.get("http://localhost:8080/api/employees");

//                 if (response.data) {
//                     setEmployees(response.data);  // Set the employee data if found
//                 }
//             } catch (error) {
//                 console.error("Error fetching employees:", error);
//                 setEmployees([]);
//             } finally {
//                 setLoading(false);  // End loading
//             }
//         };

//         fetchEmployees();
//     }, []);

//     // Handle checkbox change for employee selection
//     const handleEmployeeSelection = (empid, empname) => {
//         setSelectedEmployees((prevSelected) => {
//             if (prevSelected.some((emp) => emp.empid === empid)) {
//                 return prevSelected.filter((emp) => emp.empid !== empid);  // Deselect employee
//             } else {
//                 return [...prevSelected, { empid, empname }];  // Select employee
//             }
//         });
//     };

//     // Handle duration input change (ensure only numbers are entered)
//     const handleDurationChange = (e) => {
//         const value = e.target.value;
//         if (value === "" || /^[0-9]+$/.test(value)) {  // Allow only numeric input
//             setDuration(value);
//         }
//     };

//     // Enable confirm button if there are selected employees and duration is provided
//     useEffect(() => {
//         if (selectedEmployees.length > 0 && duration) {
//             setIsConfirmEnabled(true);
//         } else {
//             setIsConfirmEnabled(false);
//         }
//     }, [selectedEmployees, duration]);

//     // Handle confirm button click
//     const handleConfirm = async () => {
//         // Get teamLead's empId from localStorage
//         const teamLeadEmpId = localStorage.getItem('teamLeadEmpId'); // Assuming the teamLead's empId is stored in localStorage during login
//         if (!teamLeadEmpId) {
//             setResponseMessage("Team Lead empId not found!");  // Set error message to state
//             Navigate('/login');
//             return;
//         }
    
//         const projectData = {
//             teamLeadEmpId, // Send the teamLead's empId
//             coworkers: selectedEmployees,  // Send selected employees for the project
//             duration: duration,  // Send the project duration
//         };
    
//         try {
//             await axios.post("http://localhost:8080/api/project/allocate", projectData);
//             const response = await axios.post("http://localhost:8080/api/project/allocate/architecture", projectData);
//             if (response.status === 200) {
//                 alert(`Building No ${response.data.allocatedBuilding} \nFloor No ${response.data.allocatedFloor} \nAllocated Seats: ${response.data.allocatedSeats.join(', ')}`);
//             }
            
//             setResponseMessage(prevMessage => prevMessage + "\nCoworkers added successfully");
//             Navigate("/teamLead");
//         } catch (error) {
//             console.error("Error allocating project:", error);
//             setResponseMessage("There was an error while allocating the project.");  // Set error message to state
//         }
//     };

//     // Categorize employees by their position
//     const categorizeEmployees = () => {
//         const categorized = {};
//         employees.forEach(emp => {
//             const position = emp.position;
//             if (!categorized[position]) {
//                 categorized[position] = [];
//             }
//             categorized[position].push(emp);
//         });
//         return categorized;
//     };

//     const categorizedEmployees = categorizeEmployees();

//     if (loading) {
//         return <div className="text-center p-4">Loading...</div>;
//     }

//     return (
//         <div className="min-h-screen bg-black text-white p-8 relative flex flex-col items-center">
//             {/* Starry background animation */}
//             <div className="absolute inset-0 w-full flex flex-wrap overflow-hidden">
//                 {[...Array(50)].map((_, i) => (
//                     <div
//                         key={i}
//                         className="absolute rounded-full bg-white opacity-20"
//                         style={{
//                             top: `${Math.random() * 100}%`,
//                             left: `${Math.random() * 100}%`,
//                             width: `${Math.random() * 10 + 5}px`,
//                             height: `${Math.random() * 10 + 5}px`,
//                             animation: `twinkle ${Math.random() * 5 + 3}s linear infinite`,
//                         }}
//                     ></div>
//                 ))}
//             </div>

//             <div className="relative z-10 w-full max-w-6xl">
//                 <h2 className="text-2xl font-bold text-blue-400 mb-6 text-center">
//                     Employee List
//                 </h2>

//                 <div className="grid grid-cols-3 gap-6 overflow-hidden">
//                     {Object.keys(categorizedEmployees).map((position) => (
//                         <div key={position} className="flex flex-col space-y-4">
//                             <h3 className="text-xl font-semibold mb-2 bg-gradient-to-r from-purple-600 to-blue-500 text-white p-2 rounded-lg shadow-md">
//                                 {position}
//                             </h3>
//                             <div className="overflow-y-auto max-h-96">
//                                 <ul className="space-y-2">
//                                     {categorizedEmployees[position].map((emp) => (
//                                         <li
//                                             key={emp.empid}
//                                             className="p-3 border rounded shadow-md hover:shadow-xl hover:bg-gray-700 transition-all cursor-pointer transform hover:scale-105"
//                                             onClick={() => handleEmployeeSelection(emp.empid, emp.empname)}
//                                         >
//                                             <input
//                                                 type="checkbox"
//                                                 checked={selectedEmployees.some((e) => e.empid === emp.empid)}  // Checked if employee is selected
//                                                 onChange={() => handleEmployeeSelection(emp.empid, emp.empname)}
//                                                 className="mr-2"
//                                             />
//                                             <p><strong>Employee Name:</strong> {emp.empname}</p>
                                        
//                                         </li>
//                                     ))}
//                                 </ul>
//                             </div>
//                         </div>
//                     ))}
//                 </div>

//                 {/* Duration input */}
//                 <div className="mt-6">
//                     <label className="block text-lg font-medium mb-2">Project Duration (in months)</label>
//                     <input
//                         type="text"
//                         value={duration}
//                         onChange={handleDurationChange}
//                         className="p-3 border rounded w-full bg-gray-800 text-white"
//                         placeholder="Enter project duration in months"
//                     />
//                 </div>

//                 {/* Selected Employees Display */}
//                 <div className="mt-6">
//                     {selectedEmployees.length > 0 && (
//                         <div>
//                             <h3 className="text-lg font-semibold mb-2">Selected Employees:</h3>
//                             <ul>
//                                 {selectedEmployees.map((emp) => (
//                                     <li key={emp.empid} className="p-2 border rounded shadow-md mb-2 bg-gray-800">
//                                         {emp.empname}
//                                     </li>
//                                 ))}
//                             </ul>
//                         </div>
//                     )}
//                 </div>

//                 {/* Confirm button */}
//                 <button
//                     onClick={handleConfirm}
//                     disabled={!isConfirmEnabled}
//                     className={`mt-6 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all ${!isConfirmEnabled ? "opacity-50 cursor-not-allowed" : ""}`}
//                 >
//                     Confirm
//                 </button>

//                 {/* Display response message */}
//                 {responseMessage && (
//                     <div className="mt-6 p-4 border rounded bg-gray-800">
//                         <h4 className="font-semibold">Response:</h4>
//                         <pre>{responseMessage}</pre>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// }

import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";  // Import useNavigate for navigation

export default function EmployeeListPage() {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedEmployees, setSelectedEmployees] = useState([]);  // For storing selected employees
    const [duration, setDuration] = useState("");  // For storing project duration
    const [isConfirmEnabled, setIsConfirmEnabled] = useState(false);  // To enable the confirm button
    const [responseMessage, setResponseMessage] = useState("");  // For displaying the response message on screen
    const [searchTerm, setSearchTerm] = useState("");  // For storing the search term
    const Navigate = useNavigate();  // Use Navigate for navigation

    useEffect(() => {
        // Fetch employee data from the database
        const fetchEmployees = async () => {
            try {
                setLoading(true); // Start loading before the request
                const response = await axios.get("http://localhost:8080/api/employees");

                if (response.data) {
                    setEmployees(response.data);  // Set the employee data if found
                }
            } catch (error) {
                console.error("Error fetching employees:", error);
                setEmployees([]);
            } finally {
                setLoading(false);  // End loading
            }
        };

        fetchEmployees();
    }, []);

    // Handle checkbox change for employee selection
    const handleEmployeeSelection = (empid, empname) => {
        setSelectedEmployees((prevSelected) => {
            if (prevSelected.some((emp) => emp.empid === empid)) {
                return prevSelected.filter((emp) => emp.empid !== empid);  // Deselect employee
            } else {
                return [...prevSelected, { empid, empname }];  // Select employee
            }
        });
    };

    // Handle duration input change (ensure only numbers are entered)
    const handleDurationChange = (e) => {
        const value = e.target.value;
        if (value === "" || /^[0-9]+$/.test(value)) {  // Allow only numeric input
            setDuration(value);
        }
    };

    // Enable confirm button if there are selected employees and duration is provided
    useEffect(() => {
        if (selectedEmployees.length > 0 && duration) {
            setIsConfirmEnabled(true);
        } else {
            setIsConfirmEnabled(false);
        }
    }, [selectedEmployees, duration]);

    // Handle confirm button click
    const handleConfirm = async () => {
        const teamLeadEmpId = localStorage.getItem('teamLeadEmpId'); // Assuming the teamLead's empId is stored in localStorage during login
        if (!teamLeadEmpId) {
            setResponseMessage("Team Lead empId not found!");  // Set error message to state
            Navigate('/login');
            return;
        }
    
        const projectData = {
            teamLeadEmpId, // Send the teamLead's empId
            coworkers: selectedEmployees,  // Send selected employees for the project
            duration: duration,  // Send the project duration
        };
    
        try {
            await axios.post("http://localhost:8080/api/project/allocate", projectData);
            const response = await axios.post("http://localhost:8080/api/project/allocate/architecture", projectData);
            if (response.status === 200) {
                alert(`Building No ${response.data.allocatedBuilding} \nFloor No ${response.data.allocatedFloor} \nAllocated Seats: ${response.data.allocatedSeats.join(', ')}`);
            }
            
            setResponseMessage(prevMessage => prevMessage + "\nCoworkers added successfully");
            Navigate("/teamLead");
        } catch (error) {
            console.error("Error allocating project:", error);
            setResponseMessage("There was an error while allocating the project.");  // Set error message to state
        }
    };

    // Categorize employees by their position
    const categorizeEmployees = (employeesList) => {
        const categorized = {};
        employeesList.forEach(emp => {
            const position = emp.position;
            if (!categorized[position]) {
                categorized[position] = [];
            }
            categorized[position].push(emp);
        });
        return categorized;
    };

    // Filter employees based on the search term
    const filteredEmployees = employees.filter(emp => 
        emp.empname.toLowerCase().includes(searchTerm.toLowerCase()) || 
        emp.position.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const categorizedEmployees = categorizeEmployees(filteredEmployees);

    if (loading) {
        return <div className="text-center p-4">Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-black text-white p-8 relative flex flex-col items-center">
            {/* Starry background animation */}
            <div className="absolute inset-0 w-full flex flex-wrap overflow-hidden">
                {[...Array(50)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute rounded-full bg-white opacity-20"
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
                <h2 className="text-2xl font-bold text-blue-400 mb-6 text-center">
                    Employee List
                </h2>

                {/* Search Bar */}
                <div className="mb-6">
                    <input
                        type="text"
                        placeholder="Search by name or position"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="p-3 w-full border rounded bg-gray-800 text-white"
                    />
                </div>

                <div className="grid grid-cols-3 gap-6 overflow-hidden">
                    {Object.keys(categorizedEmployees).map((position) => (
                        <div key={position} className="flex flex-col space-y-4">
                            <h3 className="text-xl font-semibold mb-2 bg-gradient-to-r from-purple-600 to-blue-500 text-white p-2 rounded-lg shadow-md">
                                {position}
                            </h3>
                            <div className="overflow-y-auto max-h-96">
                                <ul className="space-y-2">
                                    {categorizedEmployees[position].map((emp) => (
                                        <li
                                            key={emp.empid}
                                            className="p-3 border rounded shadow-md hover:shadow-xl hover:bg-gray-700 transition-all cursor-pointer transform hover:scale-105"
                                            onClick={() => handleEmployeeSelection(emp.empid, emp.empname)}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={selectedEmployees.some((e) => e.empid === emp.empid)}  // Checked if employee is selected
                                                onChange={() => handleEmployeeSelection(emp.empid, emp.empname)}
                                                className="mr-2"
                                            />
                                            <p><strong>Employee Name:</strong> {emp.empname}</p>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Duration input */}
                <div className="mt-6">
                    <label className="block text-lg font-medium mb-2">Project Duration (in months)</label>
                    <input
                        type="text"
                        value={duration}
                        onChange={handleDurationChange}
                        className="p-3 border rounded w-full bg-gray-800 text-white"
                        placeholder="Enter project duration in months"
                    />
                </div>

                {/* Selected Employees Display */}
                <div className="mt-6">
                    {selectedEmployees.length > 0 && (
                        <div>
                            <h3 className="text-lg font-semibold mb-2">Selected Employees:</h3>
                            <ul>
                                {selectedEmployees.map((emp) => (
                                    <li key={emp.empid} className="p-2 border rounded shadow-md mb-2 bg-gray-800">
                                        {emp.empname}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                {/* Confirm button */}
                <button
                    onClick={handleConfirm}
                    disabled={!isConfirmEnabled}
                    className={`mt-6 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all ${!isConfirmEnabled ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                    Confirm
                </button>

                {/* Display response message */}
                {responseMessage && (
                    <div className="mt-6 p-4 border rounded bg-gray-800">
                        <h4 className="font-semibold">Response:</h4>
                        <pre>{responseMessage}</pre>
                    </div>
                )}
            </div>
        </div>
    );
}
