'use client'
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaUsers, FaTicketAlt, FaFilm, FaTheaterMasks } from 'react-icons/fa';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { PieChart, Pie, Cell } from 'recharts';
import MetricCard from './MetricCard';

interface DashboardData {
  totalUsers: number;
  totalTickets: number;
  totalMovies: number;
  totalTheaters: number;
  recentBookings: {
    movieName: string;
    count: number;
  }[];
  ticketStatusDistribution: {
    status: string;
    count: number;
  }[];
}

const Dashboard: React.FC = () => { 
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => { 
        
      try {
        const response = await axios.get('http://localhost:5000/api/admin/dashboard');
        setDashboardData(response.data);
        console.log(response.data)
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!dashboardData) {
    return <div>Error loading dashboard data</div>;
  }

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <MetricCard title="Total Users" value={dashboardData.totalUsers} icon={<FaUsers />} />
        <MetricCard title="Total Tickets" value={dashboardData.totalTickets} icon={<FaTicketAlt />} />
        <MetricCard title="Total Movies" value={dashboardData.totalMovies} icon={<FaFilm />} />
        <MetricCard title="Total Theaters" value={dashboardData.totalTheaters} icon={<FaTheaterMasks />} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Bar Chart: Recent Bookings */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Recent Bookings</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dashboardData.recentBookings}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="movieName" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart: Ticket Status Distribution */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Ticket Status Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={dashboardData.ticketStatusDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}       
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
              >
                {dashboardData.ticketStatusDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};



export default Dashboard;