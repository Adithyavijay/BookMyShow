interface MetricCardProps {
    title: string;
    value: number;
    icon: React.ReactNode;
  }
  
  const MetricCard: React.FC<MetricCardProps> = ({ title, value, icon }) => (
    <div className="bg-white p-4 rounded-lg shadow flex items-center">
      <div className="text-3xl text-blue-500 mr-4">{icon}</div>
      <div>
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  ); 

  export default MetricCard;