// import { createContext, useContext, useState, useEffect } from "react";
// import axios from "axios";

// const UserContext = createContext();

// export const UserProvider = ({ children }) => {
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     async function fetchUser() {
//       try {
//         const response = await axios.get("http://localhost:8080/api/whoLoggedIn");
//         setUser(response.data); // Assuming API returns { name, role }
//       } catch (error) {
//         console.error("Error fetching user:", error);
//       }
//     }

//     fetchUser();
//   }, []);

//   return <UserContext.Provider value={{ user }}>{children}</UserContext.Provider>;
// };

// export const useUser = () => useContext(UserContext);
