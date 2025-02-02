import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import LandingPage from './pages/LandingPage'
import LoginForm from "./components/LoginForm";
import EmployeePage from "./pages/EmployeePage";
import TeamLead from "./pages/TeamLead";
import MainManager from "./pages/MainManager";
import Employees from "./pages/Employees";
import AddProject from "./pages/AddProject";
import EmployeeListPage from "./pages/EmployeeListPage";
import StructuralRepresentation from './components/StructuralRepresentation'


function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage  /> }/>
        <Route path="/employee" element={<EmployeePage />} />
        <Route path="/teamlead" element={ <TeamLead /> } />
        <Route path="/manager" element={ <MainManager /> } />
        <Route path="/employees" element={<Employees />}  />
        <Route path="/allocateProject" element={<AddProject />}  />
        <Route path="/employee-list" element={<EmployeeListPage />}  />
        <Route path="/demo" element={<StructuralRepresentation />}  />
      </Routes>
    </Router>
  );
}

export default App;
