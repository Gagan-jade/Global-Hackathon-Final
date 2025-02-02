// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";

// export default function LoginForm() {
//     const [empId, setEmpId] = useState("");
//     const [password, setPassword] = useState("");
//     const [showPassword, setShowPassword] = useState(false);
//     const navigate = useNavigate();

//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         try {
//             // Call the login API (replace with your backend API)
//             const response = await axios.post("http://localhost:8080/api/login", {
//                 empId: empId,
//                 password: password
//             });

//             const { role } = response.data;

//             if (role) {
//                 // Save empId in localStorage
//                 localStorage.setItem("teamLeadEmpId", empId);


//                 // Redirect based on role
//                 if (role === "employee") navigate("/employee");
//                 else if (role === "team lead") navigate("/teamlead");
//                 else if (role === "main manager") navigate("/manager");
//                 else if (role === "NAH") alert("Invalid Credentials");
//             }
//         } catch (error) {
//             console.error("Login failed:", error);
//             alert("Error logging in!");
//         }
//     };

//     return (
//         <div className="flex items-center justify-center min-h-screen backdrop-blur-md">
//             <div className="w-[600px] bg-black/50 backdrop-blur-md border border-gray-700 p-6 rounded-lg shadow-lg">
//                 <h2 className="text-2xl font-bold text-center text-white mb-4">Login</h2>
//                 <form onSubmit={handleSubmit} className="space-y-4">
//                     <input
//                         type="text"
//                         placeholder="Employee ID"
//                         value={empId}
//                         onChange={(e) => setEmpId(e.target.value)}
//                         className="w-full p-3 bg-gray-800 border border-gray-700 text-white placeholder-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
//                         required
//                     />

//                     <div className="relative">
//                         <input
//                             type={showPassword ? "text" : "password"}
//                             placeholder="Password"
//                             value={password}
//                             onChange={(e) => setPassword(e.target.value)}
//                             className="w-full h-[45px] p-3 bg-gray-800 border border-gray-700 text-white placeholder-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
//                             required
//                         />
//                         <button
//                             type="button"
//                             className="absolute inset-y-0 right-3 flex items-center text-gray-400"
//                             onClick={() => setShowPassword(!showPassword)}
//                         >
//                             {showPassword ? "👁️" : "🙈"}
//                         </button>
//                     </div>

//                     <button
//                         type="submit"
//                         className="w-full p-3 rounded-md text-black font-semibold bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 transition-all"
//                     >
//                         Sign In
//                     </button>
//                 </form>
//             </div>
//         </div>
//     );
// }

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function LoginForm() {
    const [empId, setEmpId] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post("http://localhost:8080/api/login", {
                empId: empId,
                password: password
            });

            const { role } = response.data;

            if (role) {
                localStorage.setItem("teamLeadEmpId", empId);
                if (role === "employee") navigate("/employee");
                else if (role === "team lead") navigate("/teamlead");
                else if (role === "main manager") navigate("/manager");
                else if (role === "NAH") alert("Invalid Credentials");
            }
        } catch (error) {
            console.error("Login failed:", error);
            alert("Error logging in!");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen backdrop-blur-md">
            <div className="w-[400px] bg-white p-6 rounded-lg shadow-lg border-2 border-gray-700">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">Welcome,</h2>
                <p className="text-center text-gray-600 mb-6">Sign in to continue</p>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        placeholder="Employee ID"
                        value={empId}
                        onChange={(e) => setEmpId(e.target.value)}
                        className="w-full p-3 border border-gray-300 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />

                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-3 border border-gray-300 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                        <button
                            type="button"
                            className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? "👁️" : "🙈"}
                        </button>
                    </div>

                    <button
                        type="submit"
                        className="w-full p-3 rounded-md text-white font-semibold bg-blue-500 hover:bg-blue-700 transition-all"
                    >
                        Sign In
                    </button>
                </form>
            </div>
        </div>
    );
}
