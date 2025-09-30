import { useState, useEffect } from "react";
import { Search, Github, ExternalLink, CheckCircle2, Clock, XCircle, Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { TransactionCard } from "@/components/TransactionCard";
import { StatsCard } from "@/components/StatsCard";

interface Deployment {
  id: number;
  project_name: string;
  status: "deployed" | "deploying" | "failed";
  url: string;
  contract_addresses: Record<string, string>;
  deployment_type: "dapp" | "static";
  timestamp: string;
  github_repo: string;
  github_branch: string;
  tx_hash: string;
  gas_used: string;
}

const Dashboard = () => {
  const [deployments, setDeployments] = useState<Deployment[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDeployments = async () => {
      try {
        const response = await fetch("/api/deployments");
        const data = await response.json();
        setDeployments(data);
      } catch (error) {
        // Mock data for demo
        setDeployments([
          {
            id: 1,
            project_name: "DeFi Dashboard",
            status: "deployed",
            url: "https://app-1.deploychain.locci.cloud",
            contract_addresses: {
              "Token": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
              "Staking": "0x8A791620dd6260079BF849Dc5567aDC3F2FdC318"
            },
            deployment_type: "dapp",
            timestamp: new Date(Date.now() - 3600000).toISOString(),
            github_repo: "user/defi-dashboard",
            github_branch: "main",
            tx_hash: "0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b",
            gas_used: "2,456,789"
          },
          {
            id: 2,
            project_name: "NFT Marketplace",
            status: "deployed",
            url: "https://app-2.deploychain.locci.cloud",
            contract_addresses: {
              "NFTCollection": "0x9f2df0fed2c77648de5860a4cc508cd0818c85b8"
            },
            deployment_type: "dapp",
            timestamp: new Date(Date.now() - 7200000).toISOString(),
            github_repo: "user/nft-marketplace",
            github_branch: "main",
            tx_hash: "0x2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c",
            gas_used: "3,123,456"
          },
          {
            id: 3,
            project_name: "DAO Governance",
            status: "deploying",
            url: "",
            contract_addresses: {},
            deployment_type: "dapp",
            timestamp: new Date().toISOString(),
            github_repo: "user/dao-platform",
            github_branch: "develop",
            tx_hash: "",
            gas_used: ""
          },
          {
            id: 4,
            project_name: "Token Swap",
            status: "failed",
            url: "",
            contract_addresses: {},
            deployment_type: "dapp",
            timestamp: new Date(Date.now() - 1800000).toISOString(),
            github_repo: "user/token-swap",
            github_branch: "main",
            tx_hash: "",
            gas_used: ""
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchDeployments();
  }, []);

  const filteredDeployments = deployments.filter(dep =>
    dep.project_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dep.github_repo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    total: deployments.length,
    deployed: deployments.filter(d => d.status === "deployed").length,
    deploying: deployments.filter(d => d.status === "deploying").length,
    failed: deployments.filter(d => d.status === "failed").length
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
                <Activity className="text-primary" />
                DeployChain Explorer
              </h1>
              <p className="text-muted-foreground mt-1">Sepolia Testnet Deployment Dashboard</p>
            </div>
            <Badge variant="outline" className="text-primary border-primary">
              <div className="w-2 h-2 rounded-full bg-primary mr-2 animate-pulse" />
              Network: Sepolia
            </Badge>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="text"
              placeholder="Search by project name or GitHub repo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-background"
            />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <StatsCard
            title="Total Deployments"
            value={stats.total}
            icon={Activity}
            color="primary"
          />
          <StatsCard
            title="Deployed"
            value={stats.deployed}
            icon={CheckCircle2}
            color="success"
          />
          <StatsCard
            title="In Progress"
            value={stats.deploying}
            icon={Clock}
            color="warning"
          />
          <StatsCard
            title="Failed"
            value={stats.failed}
            icon={XCircle}
            color="destructive"
          />
        </div>

        {/* Transactions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Github className="h-5 w-5 text-primary" />
              Recent Deployment Transactions
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-12 text-muted-foreground">
                Loading transactions...
              </div>
            ) : filteredDeployments.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                No deployments found
              </div>
            ) : (
              <div className="space-y-4">
                {filteredDeployments.map((deployment) => (
                  <TransactionCard key={deployment.id} deployment={deployment} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Network Info */}
        <div className="mt-8 p-4 bg-muted rounded-lg border border-border">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Network</span>
            <span className="font-mono text-foreground">Sepolia Testnet</span>
          </div>
          <div className="flex items-center justify-between text-sm mt-2">
            <span className="text-muted-foreground">Chain ID</span>
            <span className="font-mono text-foreground">11155111</span>
          </div>
          <div className="flex items-center justify-between text-sm mt-2">
            <span className="text-muted-foreground">Explorer</span>
            <a
              href="https://sepolia.etherscan.io"
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-primary hover:underline flex items-center gap-1"
            >
              sepolia.etherscan.io
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;