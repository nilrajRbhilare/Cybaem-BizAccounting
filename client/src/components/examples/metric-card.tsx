import { MetricCard } from "../metric-card";
import { DollarSign, TrendingUp, Package, Wallet } from "lucide-react";

export default function MetricCardExample() {
  return (
    <div className="p-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <MetricCard
        title="Total Sales"
        value="₹2,45,680"
        icon={DollarSign}
        trend={{ value: "12.5%", isPositive: true }}
      />
      <MetricCard
        title="Total Expenses"
        value="₹1,25,340"
        icon={TrendingUp}
        trend={{ value: "8.2%", isPositive: false }}
      />
      <MetricCard
        title="Stock Value"
        value="₹3,45,000"
        icon={Package}
        trend={{ value: "5.1%", isPositive: true }}
      />
      <MetricCard
        title="Cash Flow"
        value="₹1,20,340"
        icon={Wallet}
        trend={{ value: "15.8%", isPositive: true }}
      />
    </div>
  );
}
