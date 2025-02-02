require('dotenv').config()  // Load environment variables from .env file
const express = require('express')
const cors = require('cors')
const { MongoClient } = require('mongodb')

const app = express()

app.use(cors({ origin: 'http://localhost:5173' }))
app.use(express.json())

// Corrected MongoDB Connection URI
const MONGO_URI = process.env.MONGO_STRING  // Remove quotes
const DATABASE_NAME = 'Seatify'
const PORT = 8080

let db



// Connect to MongoDB
MongoClient.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(client => {
        //('Connected to MongoDB');
        db = client.db(DATABASE_NAME); // Assign DB instance
    })
    .catch(err => console.error('MongoDB connection error:', err));








// API Route























app.post('/api/login', async (req, res) => {
    try {
        const data = req.body;

        // Log the incoming data for debugging
        //("Request Data: ", data);

        const employee = await db.collection('employee').findOne({ empid: data.empId });
        
        // Check if employee exists and the password matches
        if (employee && employee.password === data.password) {
            //(employee.Role)
            res.send({ role: employee.Role });
        } 
        else
            res.send({role: "NAH"})
    } catch (err) {
        console.error("Error:", err);
        res.status(500).json({ error: 'Failed to fetch data' });
    }
});

// Add Employee
app.post('/api/employee/add', async (req, res) => {
    try {
        const newEmployee = req.body;
        await db.collection('employee').insertOne(newEmployee);
        res.status(200).send({ message: 'Employee added successfully' });
    } catch (err) {
        console.error('Error adding employee:', err);
        res.status(500).json({ error: 'Failed to add employee' });
    }
});

// Edit Employee
app.put('/api/employee/edit/:empid', async (req, res) => {
    try {
        const { empid } = req.params;
        const updatedDetails = req.body;
        const result = await db.collection('employee').updateOne(
            { empid: empid },
            { $set: updatedDetails }
        );
        if (result.matchedCount > 0) {
            res.status(200).send({ message: 'Employee updated successfully' });
        } else {
            res.status(404).send({ message: 'Employee not found' });
        }
    } catch (err) {
        console.error('Error updating employee:', err);
        res.status(500).json({ error: 'Failed to update employee' });
    }
});

// Delete Employee
app.delete('/api/employee/delete/:empid', async (req, res) => {
    try {
        const { empid } = req.params;
        const result = await db.collection('employee').deleteOne({ empid: empid });
        if (result.deletedCount > 0) {
            res.status(200).send({ message: 'Employee deleted successfully' });
        } else {
            res.status(404).send({ message: 'Employee not found' });
        }
    } catch (err) {
        console.error('Error deleting employee:', err);
        res.status(500).json({ error: 'Failed to delete employee' });
    }
});

// API Route to get all employees
app.get('/api/employees', async (req, res) => {
    try {
        // Fetch employees with only selected fields (empid, empname, position)
        const employees = await db.collection('employee').find({}, {
            projection: { empid: 1, empname: 1, position: 1 }
        }).toArray();

        // Check if there are no employees
        if (employees.length === 0) {
            return res.status(404).json({ message: 'No employees found' });
        }

        // Send the list of employees with the required fields as a response
        res.status(200).json(employees);
    } catch (err) {
        console.error("Error:", err);
        res.status(500).json({ error: 'Failed to fetch employees' });
    }
});



// Allocate Project

// Route to get ongoing project for a team lead
app.post('/api/teamLead/project', async (req, res) => {
    try {
        const { empid } = req.body;  // Get the empid from the request body
        //(empid)
        // Check if a team lead with this empid has an ongoing project
        const project = await db.collection('projects').findOne({ empid });

        if (!project) {
            return res.status(404).json({ message: 'No ongoing project found for this team lead.' });
        }

        // Return the project details
        res.status(200).json({
            message: 'Ongoing project found.',
            project: project
        });
    } catch (err) {
        console.error('Error fetching project:', err);
        res.status(500).json({ error: 'Failed to fetch project' });
    }
});

// Allocate Project
app.post('/api/project/allocate', async (req, res) => {
    try {
        const { teamLeadEmpId, coworkers, duration } = req.body;  // Getting teamLeadEmpId, coworkers, and duration

        // Find project by empid (teamLeadEmpId)
        const teamLeadProject = await db.collection('projects').findOne({ empid: teamLeadEmpId });

        //(teamLeadProject);  // Debugging the project found in the database

        if (teamLeadProject) {
            // If a project already exists, update it with coworkers and duration
            const updatedProject = await db.collection('projects').updateOne(
                { empid: teamLeadEmpId },  // Match by teamLeadEmpId (empid)
                { 
                    $push: { coworkers: { $each: coworkers } },  // Add coworkers to the project
                    $set: { duration }  // Set the project duration
                }
            );

            if (updatedProject.modifiedCount > 0) {
                return res.status(200).send({ message: 'Project updated successfully' });
            } else {
                return res.status(500).send({ message: 'Failed to update project' });
            }
        } else {
            // Return an error if no project exists for the given empid
            return res.status(404).send({ message: 'No project found for this team lead' });
        }
    } catch (err) {
        console.error('Error allocating project:', err);
        res.status(500).json({ error: 'Failed to allocate project' });
    }
});

app.post('/api/project/create', async (req, res) => {
    try {
        const { empid } = req.body; // Get empid from the request body
        
        // Fetch all employee data
        const allData = await db.collection('employee').find().toArray();
        
        // Find the employee by empid
        const file = allData.filter(emp => emp.empid === empid);
        
        // Check if employee is found
        if (file.length === 0) {
            return res.status(404).send("Employee not found.");
        }

        // Create a new project document
        const newProject = {
            empid: empid,            // Empid of the project (e.g., VC0002)
            teamLead: file[0].empname, // Access the team lead's name (first element)
            coworkers: [],           // Empty array for coworkers
            duration: ""             // Empty string for duration
        };

        // Insert the new project into the 'projects' collection
        await db.collection('projects').insertOne(newProject);

        // Respond with a success message
        res.status(201).json({
            message: "Project created successfully!",
            project: newProject
        });
    } catch (err) {
        console.error("Error creating project:", err);
        res.status(500).json({ error: "Failed to create project." });
    }
});



app.get('/api/employees/teamLeads',async (req,res)=>{
    const data = await db.collection('employee').find({Role : "team lead"}).toArray()
    //(data)
    res.send(data)
})

// Get All Projects
app.get('/api/projects', async (req, res) => {
    try {
        const projects = await db.collection('projects').find().toArray();
        res.status(200).send(projects);
    } catch (err) {
        console.error('Error fetching projects:', err);
        res.status(500).json({ error: 'Failed to fetch projects' });
    }
});



// API Route to add a new employee
app.post('/api/employee/add', async (req, res) => {
    try {
        const newEmployee = req.body; // Get the new employee data from the request body

        // Validate the incoming data (you can customize validation as needed)
        if (!newEmployee.empid || !newEmployee.empname || !newEmployee.email) {
            return res.status(400).json({ error: 'Missing required fields (empid, empname, email)' });
        }

        // Check if the employee already exists in the database
        const existingEmployee = await db.collection('employee').findOne({ empid: newEmployee.empid });
        if (existingEmployee) {
            return res.status(400).json({ error: 'Employee with this empid already exists' });
        }

        // Insert the new employee into the 'employee' collection
        const result = await db.collection('employee').insertOne(newEmployee);

        // Respond with a success message and the inserted employee's details
        res.status(201).json({ message: 'Employee added successfully', employee: result.ops[0] });
    } catch (err) {
        console.error("Error:", err);
        res.status(500).json({ error: 'Failed to add employee' });
    }
});

// Fetch Building Architecture
app.get('/api/architecture', async (req, res) => {
    try {
        const architecture = await db.collection('Architecture').find().toArray();
        res.status(200).json(architecture);
    } catch (err) {
        console.error('Error fetching architecture:', err);
        res.status(500).json({ error: 'Failed to fetch building architecture' });
    }
});


// app.post('/api/project/allocate/architecture', async (req, res) => {
//     try {
//         const { teamLeadEmpId, coworkers, duration } = req.body;
//         console.log(teamLeadEmpId, coworkers, duration, "SO YEAHA");

//         // Combine team lead and coworkers to calculate total team size
//         const totalTeamSize = coworkers.length + 1; // Including the team lead

//         // Fetch all architecture details
//         const architecture = await db.collection('Architecture').find({}).toArray();

//         let allocated = false;
//         let deskLocation = '';
//         let allocatedBuilding = '';
//         let allocatedFloor = '';
//         let allocatedSeats = [];

//         // Try to find the first available block of desks that can fit the team size
//         for (const building of architecture) {
//             for (const floor of building.floors) {
//                 // Filter available desks
//                 let availableDesks = floor.desks.filter(desk => !desk.allocated);
//                 console.log(availableDesks, "LOL");

//                 if (availableDesks.length >= totalTeamSize) {
//                     // Allocate the required desks
//                     for (let i = 0; i < totalTeamSize; i++) {
//                         availableDesks[i].allocated = true;  // Mark desk as allocated
//                     }

//                     // Update the available seats in the floor
//                     floor.availableSeats -= totalTeamSize;

//                     // Update the architecture document with the new desk allocation
//                     await db.collection('Architecture').updateOne(
//                         { "_id": building._id, "floors.floor": floor.floor },
//                         { $set: { "floors.$.desks": floor.desks, "floors.$.availableSeats": floor.availableSeats } }
//                     );

//                     // Construct desk location (e.g., Building 1, 2nd Floor, D1, D2, ...)
//                     deskLocation = `${building.building}, ${floor.floor}th floor, `;
//                     const deskNames = availableDesks.slice(0, totalTeamSize).map(desk => desk.deskNumber).join(", ");
//                     console.log(deskNames, "HAHAHAHA");

//                     // Store allocated building, floor, and desk names
//                     allocatedBuilding = building.building;
//                     allocatedFloor = floor.floor;
//                     allocatedSeats = availableDesks.slice(0, totalTeamSize).map(desk => desk.deskNumber);  // Array of desk names

//                     // Update employee desk locations (team lead + coworkers)
//                     const employees = [teamLeadEmpId, ...coworkers.map(c => c.empid)];
//                     await db.collection('employee').updateMany(
//                         { empid: { $in: employees } },
//                         {
//                             $set: {
//                                 deskLocation: deskLocation,
//                                 projectDuration: duration,
//                             },
//                         }
//                     );

//                     // Flag that allocation was successful
//                     allocated = true;
//                     break;
//                 }
//             }
//             if (allocated) break;
//         }

//         if (allocated) {
//             res.status(200).send({
//                 message: 'Project allocated and desks assigned successfully!',
//                 allocatedBuilding: allocatedBuilding,
//                 allocatedFloor: allocatedFloor,
//                 allocatedSeats: allocatedSeats,  // Now it's an array of desk names
//             });
//         } else {
//             res.status(400).send({ message: 'No sufficient available desks for the team size.' });
//         }
//     } catch (err) {
//         console.error("Error:", err);
//         res.status(500).json({ error: 'Failed to allocate desks for the project.' });
//     }
// });






// Update Desk Allocation


app.post('/api/project/allocate/architecture', async (req, res) => {
    try {
        const { teamLeadEmpId, coworkers, duration } = req.body;
        console.log(teamLeadEmpId, coworkers, duration, "SO YEAHA");

        // Combine team lead and coworkers to calculate total team size
        const totalTeamSize = coworkers.length + 1; // Including the team lead

        // Fetch all architecture details and precompute the available desks for each floor and building
        const architecture = await db.collection('Architecture').find({}).toArray();

        let allocated = false;
        let deskLocation = '';
        let allocatedBuilding = '';
        let allocatedFloor = '';
        let allocatedSeats = [];

        // Priority queue or sorting can be used to prioritize buildings/floors with enough desks
        let availableFloors = [];

        // Step 1: Precompute all available desks in each floor and building
        architecture.forEach(building => {
            building.floors.forEach(floor => {
                const availableDesks = floor.desks.filter(desk => !desk.allocated);
                if (availableDesks.length >= totalTeamSize) {
                    // Push floor details to the list of available floors
                    availableFloors.push({
                        building: building.building,
                        floor: floor.floor,
                        availableDesks: availableDesks,
                        availableSeats: floor.availableSeats,
                        buildingCapacity: building.floors.reduce((acc, f) => acc + f.desks.filter(d => !d.allocated).length, 0), // Track the building's remaining capacity
                    });
                }
            });
        });

        // Step 2: Sort available floors by their total remaining capacity (greedy method)
        availableFloors.sort((a, b) => b.buildingCapacity - a.buildingCapacity);  // Sort by most remaining available desks

        // Step 3: Try to allocate desks from the most optimal floors and buildings
        for (const availableFloor of availableFloors) {
            let availableDesks = availableFloor.availableDesks;

            // If there are enough desks on this floor, allocate them
            if (availableDesks.length >= totalTeamSize) {
                for (let i = 0; i < totalTeamSize; i++) {
                    availableDesks[i].allocated = true;  // Mark desk as allocated
                }

                // Update the available seats in the floor
                availableFloor.availableSeats -= totalTeamSize;

                // Update the architecture document with the new desk allocation
                await db.collection('Architecture').updateOne(
                    { "building": availableFloor.building, "floors.floor": availableFloor.floor },
                    { $set: { "floors.$.desks": availableDesks, "floors.$.availableSeats": availableFloor.availableSeats } }
                );

                // Construct desk location (e.g., Building 1, 2nd Floor, D1, D2, ...)
                deskLocation = `${availableFloor.building}, ${availableFloor.floor}th floor, `;
                const deskNames = availableDesks.slice(0, totalTeamSize).map(desk => desk.deskNumber).join(", ");
                console.log(deskNames, "HAHAHAHA");

                // Store allocated building, floor, and desk names
                allocatedBuilding = availableFloor.building;
                allocatedFloor = availableFloor.floor;
                allocatedSeats = availableDesks.slice(0, totalTeamSize).map(desk => desk.deskNumber);  // Array of desk names

                // Update employee desk locations (team lead + coworkers)
                const employees = [teamLeadEmpId, ...coworkers.map(c => c.empid)];
                await db.collection('employee').updateMany(
                    { empid: { $in: employees } },
                    {
                        $set: {
                            deskLocation: deskLocation,
                            projectDuration: duration,
                        },
                    }
                );

                // Flag that allocation was successful
                allocated = true;
                break;
            }
        }

        if (allocated) {
            res.status(200).send({
                message: 'Project allocated and desks assigned successfully!',
                allocatedBuilding: allocatedBuilding,
                allocatedFloor: allocatedFloor,
                allocatedSeats: allocatedSeats,  // Now it's an array of desk names
            });
        } else {
            res.status(400).send({ message: 'No sufficient available desks for the team size.' });
        }
    } catch (err) {
        console.error("Error:", err);
        res.status(500).json({ error: 'Failed to allocate desks for the project.' });
    }
});



app.put('/api/architecture/updateDesk', async (req, res) => {
    try {
        const { building, floor, deskNumber, allocated } = req.body;

        const result = await db.collection('Architecture').updateOne(
            { "building": building, "floors.floor": floor, "floors.desks.deskNumber": deskNumber },
            { $set: { "floors.$.desks.$[desk].allocated": allocated } },
            { arrayFilters: [{ "desk.deskNumber": deskNumber }] }
        );

        if (result.modifiedCount > 0) {
            res.status(200).json({ message: 'Desk allocation updated successfully' });
        } else {
            res.status(404).json({ message: 'Desk not found or already in the requested state' });
        }
    } catch (err) {
        console.error('Error updating desk allocation:', err);
        res.status(500).json({ error: 'Failed to update desk allocation' });
    }
});

app.get('/api/employee/:empid', async (req, res) => {
    try {
        const { empid } = req.params;
        
        // Find the project that the employee is working on
        const project = await db.collection('projects').findOne({ 
            empid: empid 
        });

        if (!project) {
            return res.status(404).send({ message: 'Project not found for this employee.' });
        }

        // Get employee's desk location details
        const employee = await db.collection('employee').findOne({ empid: empid });

        if (!employee || !employee.deskLocation) {
            return res.status(404).send({ message: 'Desk not allocated to this employee.' });
        }

        res.status(200).send({
            project: {
                teamLead: project.teamLead,
                coworkers: project.coworkers,
                duration: project.duration
            },
            deskLocation: employee.deskLocation
        });

    } catch (err) {
        console.error("Error:", err);
        res.status(500).json({ error: 'Failed to fetch employee details.' });
    }
});


app.post('/api/employee/allocate/seat', async (req, res) => {
    try {
        const { empid } = req.body;

        // Fetch all architecture details and precompute available desks for allocation
        const architecture = await db.collection('Architecture').find({}).toArray();
        
        let availableDesks = [];
        let allocatedBuilding = '';
        let allocatedFloor = '';
        let deskLocation = '';
        
        // Find available desks across all floors and buildings
        architecture.forEach(building => {
            building.floors.forEach(floor => {
                const desks = floor.desks.filter(desk => !desk.allocated);
                if (desks.length > 0) {
                    availableDesks.push({
                        building: building.building,
                        floor: floor.floor,
                        desks: desks
                    });
                }
            });
        });

        if (availableDesks.length === 0) {
            return res.status(400).send({ message: 'No available desks to allocate.' });
        }

        // Randomly pick a floor and desk
        const randomFloor = availableDesks[Math.floor(Math.random() * availableDesks.length)];
        const randomDesk = randomFloor.desks[0];  // Pick the first available desk (can be random too)
        
        // Mark the desk as allocated
        randomDesk.allocated = true;

        // Update the architecture with the new allocation
        await db.collection('Architecture').updateOne(
            { "building": randomFloor.building, "floors.floor": randomFloor.floor },
            { $set: { "floors.$.desks": randomFloor.desks } }
        );

        // Construct the desk location string
        deskLocation = `${randomFloor.building}, ${randomFloor.floor}th floor, Desk: ${randomDesk.deskNumber}`;

        // Update employee's desk location
        await db.collection('employee').updateOne(
            { empid: empid },
            { $set: { deskLocation: deskLocation } }
        );

        res.status(200).send({
            message: 'Seat allocated successfully!',
            deskLocation: deskLocation
        });

    } catch (err) {
        console.error("Error:", err);
        res.status(500).json({ error: 'Failed to allocate seat for the employee.' });
    }
});

app.post('/api/employee/deallocate/seat', async (req, res) => {
    try {
        const { empid } = req.body;

        // Get employee's current desk location
        const employee = await db.collection('employee').findOne({ empid: empid });

        if (!employee || !employee.deskLocation) {
            return res.status(404).send({ message: 'No desk allocated to this employee.' });
        }

        // Parse the desk location to extract building and floor
        const [building, floor, deskNumber] = employee.deskLocation.split(', ');

        const floorNum = parseInt(floor.split(' ')[0]);
        const deskNum = parseInt(deskNumber.split(' ')[1]);

        // Fetch the architecture details
        const architecture = await db.collection('Architecture').find({}).toArray();

        let deskDeallocated = false;

        // Deallocate the desk
        architecture.forEach(buildingData => {
            if (buildingData.building === building) {
                buildingData.floors.forEach(floorData => {
                    if (floorData.floor === floorNum) {
                        floorData.desks.forEach(desk => {
                            if (desk.deskNumber === deskNum && desk.allocated) {
                                desk.allocated = false;
                                deskDeallocated = true;
                            }
                        });
                    }
                });
            }
        });

        if (deskDeallocated) {
            // Update the architecture
            await db.collection('Architecture').updateOne(
                { "building": building, "floors.floor": floorNum },
                { $set: { "floors.$.desks": architecture.find(b => b.building === building).floors.find(f => f.floor === floorNum).desks } }
            );

            // Clear employee's desk location
            await db.collection('employee').updateOne(
                { empid: empid },
                { $unset: { deskLocation: "" } }
            );

            res.status(200).send({ message: 'Seat deallocated successfully.' });
        } else {
            res.status(400).send({ message: 'Failed to deallocate desk.' });
        }

    } catch (err) {
        console.error("Error:", err);
        res.status(500).json({ error: 'Failed to deallocate seat.' });
    }
});


// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
