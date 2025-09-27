
import { useState, useEffect } from 'react';


const Dashboard: React.FC = () => {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex-shrink-0 flex flex-col p-6">
        <h2 className="text-2xl font-bold mb-8">Dashboard</h2>
        <nav className="flex flex-col gap-4 flex-1">
          <a href="#github" className="hover:text-primary transition-colors">Github</a>
          <a href="#health" className="hover:text-primary transition-colors">Health</a>
          <a href="#transaction" className="hover:text-primary transition-colors">Transaction</a>
        </nav>
        <button
          className="mt-8 py-2 px-4 bg-red-600 hover:bg-red-700 rounded text-white font-semibold transition-colors"
          onClick={() => {
            // TODO: Add logout logic here
            window.location.href = "/";
          }}
        >
          Logout
        </button>
      </aside>
      {/* Main Area */}
      <main className="flex-1 bg-background p-8 overflow-y-auto">
        <h1 className="text-3xl font-bold mb-6">Deployments</h1>
        <div className="overflow-x-auto">
          <DeploymentsTable />
        </div>
      </main>
    </div>
  );
};



function DeploymentsTable() {
  const [deployments, setDeployments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
  fetch("https://8589d4996986.ngrok-free.app/api/deployments")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then((data) => {
        setDeployments(data);
        setError("");
      })
      .catch((err) => {
        setError(err.message || "Unknown error");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;
  if (!deployments.length) return <div className="p-4">No deployments found.</div>;

  return (
    <table className="min-w-full bg-white dark:bg-gray-800 rounded shadow">
      <thead>
        <tr>
          <th className="px-4 py-2 border-b">ID</th>
          <th className="px-4 py-2 border-b">Project Name</th>
          <th className="px-4 py-2 border-b">Status</th>
          <th className="px-4 py-2 border-b">Type</th>
          <th className="px-4 py-2 border-b">Network</th>
          <th className="px-4 py-2 border-b">Gas Used</th>
          <th className="px-4 py-2 border-b">Error Message</th>
          <th className="px-4 py-2 border-b">Created At</th>
          <th className="px-4 py-2 border-b">Updated At</th>
        </tr>
      </thead>
      <tbody>
        {deployments.map((item) => (
          <tr key={item.id} className="border-b last:border-b-0">
            <td className="px-4 py-2">{item.id}</td>
            <td className="px-4 py-2">{item.project_name}</td>
            <td className="px-4 py-2 capitalize">
              <span className={
                item.status === 'pending' ? 'text-yellow-500' :
                item.status === 'failed' ? 'text-red-500' :
                'text-green-500'
              }>
                {item.status}
              </span>
            </td>
            <td className="px-4 py-2">{item.deployment_type}</td>
            <td className="px-4 py-2">{item.blockchain_network}</td>
            <td className="px-4 py-2">{item.gas_used}</td>
            <td className="px-4 py-2 text-xs max-w-xs truncate" title={item.error_message}>{item.error_message}</td>
            <td className="px-4 py-2 text-xs">{new Date(item.created_at).toLocaleString()}</td>
            <td className="px-4 py-2 text-xs">{new Date(item.updated_at).toLocaleString()}</td>
          </tr>
        ))}
      </tbody>

    </table>
  );
}

export default Dashboard;
