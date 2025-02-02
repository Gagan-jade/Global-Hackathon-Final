
import { useEffect, useState } from "react";

const TeamLeadAllocation = () => {
  const [teamLeads, setTeamLeads] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTeamLeads = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/employees/teamLeads");
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch employees");
        }
        setTeamLeads(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTeamLeads();
  }, []);

  const allocateProject = async (teamLeadName, teamLeadEmpId) => {
    try {
      const response = await fetch("http://localhost:8080/api/project/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ empid: teamLeadEmpId, teamLead: teamLeadName, coworkers: [], duration: "" })
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Failed to allocate project");
      }
      alert("Project allocated successfully to " + teamLeadName);
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  if (loading) return <p className="text-center text-gray-400">Loading team leads...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  const filteredTeamLeads = teamLeads.filter((lead) =>
    lead.empname.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black/50 backdrop-blur-md p-6">
      <h2 className="text-3xl font-bold text-white mb-6">Team Leads</h2>
      <input
        type="text"
        placeholder="Search team leads..."
        className="mb-4 p-2 w-80 rounded-md border border-gray-600 focus:ring-2 focus:ring-blue-500"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
        {filteredTeamLeads.map((lead) => (
          <div
            key={lead.empid}
            className="bg-gray-800 text-white shadow-xl rounded-lg p-6 text-center cursor-pointer hover:bg-blue-700 hover:scale-105 transition-all duration-300 ease-in-out transform"
            onClick={() => allocateProject(lead.empname, lead.empid)}
          >
            <h3 className="text-xl font-semibold">{lead.empname}</h3>
            <p className="text-gray-400">Position: {lead.position}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamLeadAllocation;

