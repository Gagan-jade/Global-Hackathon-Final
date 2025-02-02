'use client'

import React, { useState, useEffect } from 'react'
import axios from 'axios'

function EmployeePage() {
    const [employees, setEmployees] = useState([])
    const [searchTerm, setSearchTerm] = useState('')

    useEffect(() => {
        axios.get('http://localhost:8080/api/employees')
            .then(response => {
                setEmployees(response.data)
            })
            .catch(err => {
                console.error("Error fetching employees", err)
            })
    }, [])

    const handleRemoveEmployee = (empid) => {
        // Implement remove employee logic here
        console.log(`Remove employee with ID: ${empid}`)
    }

    const filteredEmployees = employees.filter(employee =>
        employee.empname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.empid.toString().includes(searchTerm) ||
        (employee.designation && employee.designation.toLowerCase().includes(searchTerm.toLowerCase()))
    )

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">Employee Directory</h1>
            <div className="max-w-4xl mx-auto mb-8">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search by name, ID, or designation"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <svg
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        width="20"
                        height="20"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        ></path>
                    </svg>
                </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
                {filteredEmployees.map(employee => (
                    <div key={employee.empid} className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
                        <div className="p-6">
                            <div className="flex items-center justify-center w-16 h-16 bg-blue-500 rounded-full mb-4 mx-auto">
                                <span className="text-2xl font-bold text-white">
                                    {employee.empname.charAt(0)}
                                </span>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-800 text-center mb-2">{employee.empname}</h3>
                            <p className="text-sm text-gray-600 text-center mb-2">{employee.email}</p>
                            {employee.designation && (
                                <p className="text-sm text-gray-500 text-center mb-4">{employee.designation}</p>
                            )}
                            <button 
                                className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out flex items-center justify-center"
                                onClick={() => handleRemoveEmployee(employee.empid)}
                            >
                                <svg
                                    className="w-5 h-5 mr-2"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                    ></path>
                                </svg>
                                Remove
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default EmployeePage
