import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Map from '../components/StructuralRepresentation'

const EmployeePage = ({ empid }) => {
    const [project, setProject] = useState(null);
    const [deskLocation, setDeskLocation] = useState('');

    useEffect(() => {
        // Fetch employee project and desk information (Simulating project data here)
        axios.get(`/api/employee/${empid}`)
            .then(res => {
                setProject(res.data.project);
                // Set random desk location for testing
                setDeskLocation(generateRandomDeskLocation());
            })
            .catch(err => console.error(err));
    }, [empid]);

    const generateRandomDeskLocation = () => {
        const buildings = ['Building 1', 'Building 2', 'Building 3', 'Building 4'];
        const floors = [1, 2, 3, 4];
        const seats = ['D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7', 'D8', 'D9', 'D10'];

        const building = buildings[Math.floor(Math.random() * buildings.length)];
        const floor = floors[Math.floor(Math.random() * floors.length)];
        const seat = seats[Math.floor(Math.random() * seats.length)];

        return `${building}, Floor ${floor}, Seat ${seat}`;
    };

    const allocateSeat = async () => {
        try {
            const res = await axios.post('/api/employee/allocate/seat', { empid });
            setDeskLocation(generateRandomDeskLocation());  // Update desk location with random value
            alert(res.data.message);
        } catch (err) {
            alert('Error allocating seat');
        }
    };

    const deallocateSeat = async () => {
        try {
            const res = await axios.post('/api/employee/deallocate/seat', { empid });
            setDeskLocation('');  // Remove desk location on deallocation
            alert(res.data.message);
        } catch (err) {
            alert('Error deallocating seat');
        }
    };

    return (
        <div>
            <div>
                <h1>Employee Details</h1>
                <h2>Project: {project ? project.teamLead : 'N/A'}</h2>
                <p>Team: {project ? project.coworkers.map(coworker => coworker.empname).join(', ') : 'N/A'}</p>
                <p>Project Duration: {project ? project.duration : 'N/A'}</p>
                <p>Current Desk Location: {deskLocation || 'Not Allocated'}</p>

                {!deskLocation && <button onClick={allocateSeat}>Allocate Seat</button>}
                {deskLocation && <button onClick={deallocateSeat}>Deallocate Seat</button>}
            </div>
            <div>
                <Map />
            </div>
        </div>
    );
};

export default EmployeePage;
