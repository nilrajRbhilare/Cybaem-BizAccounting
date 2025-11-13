import { ExpenseChart } from "../expense-chart";

export default function ExpenseChartExample() {
  //todo: remove mock functionality
  const mockData = [
    { name: "Inventory", value: 45000 },
    { name: "Salaries", value: 35000 },
    { name: "Utilities", value: 15000 },
    { name: "Marketing", value: 20000 },
    { name: "Others", value: 10000 },
  ];

  return (
    <div className="p-8">
      <ExpenseChart data={mockData} />
    </div>
  );
}
