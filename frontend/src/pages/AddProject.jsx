import { useEffect, useState } from "react";

const TeamLeadAllocation = () => {
  const [teamLeads, setTeamLeads] = useState([]);
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

  const allocateProject = async (teamLeadName,teamLeadEmpId) => {
    try {
      const response = await fetch("http://localhost:8080/api/project/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({empid:teamLeadEmpId, teamLead: teamLeadName, coworkers: [], duration: "" })
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

  if (loading) return <p className="text-center text-gray-500">Loading team leads...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center">Team Leads</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {teamLeads.map((lead) => (
          <div
            key={lead.empid}
            className="bg-white shadow-lg rounded-lg p-4 text-center cursor-pointer hover:bg-green-100"
            onClick={() => allocateProject(lead.empname,lead.empid)}
          >
            <h3 className="text-lg font-semibold">{lead.empname}</h3>
            <p className="text-gray-600">Position: {lead.position}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamLeadAllocation;
