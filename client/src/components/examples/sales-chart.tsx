import { SalesChart } from "../sales-chart";

export default function SalesChartExample() {
  //todo: remove mock functionality
  const mockData = [
    { date: "Jan", sales: 45000 },
    { date: "Feb", sales: 52000 },
    { date: "Mar", sales: 48000 },
    { date: "Apr", sales: 61000 },
    { date: "May", sales: 55000 },
    { date: "Jun", sales: 67000 },
    { date: "Jul", sales: 72000 },
  ];

  return (
    <div className="p-8">
      <SalesChart data={mockData} />
    </div>
  );
}
