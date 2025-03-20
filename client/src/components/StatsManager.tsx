import React, { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { useToast } from './ui/use-toast';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';

interface PropertyStats {
  totalProperties: number;
  activeProperties: number;
  soldProperties: number;
  totalValue: number;
  averagePrice: number;
  propertiesByType: Array<{ type: string; count: number }>;
  propertiesByStatus: Array<{ status: string; count: number }>;
  recentActivity: Array<{ date: string; property: string; action: string }>;
  monthlyStats: Array<{ month: string; sales: number; listings: number }>;
  priceRanges: Array<{ range: string; count: number }>;
  topAreas: Array<{ area: string; count: number; value: number }>;
  propertyFeatures: Array<{ feature: string; count: number }>;
}

const STATUS_COLORS: Record<string, string> = {
  active: '#10B981',
  sold: '#6366F1',
  inactive: '#EF4444'
};

const TYPE_COLORS = ['#3B82F6', '#F59E0B', '#EC4899', '#8B5CF6'];

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('es-MX', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const StatsManager: React.FC = () => {
  const { toast } = useToast();

  const { data: stats, isLoading, error } = useQuery<PropertyStats>({
    queryKey: ['stats'],
    queryFn: async () => {
      try {
        console.log('Fetching stats data...');
        const token = localStorage.getItem('adminToken');
        console.log('Token available:', !!token);
        
        const response = await fetch('/api/stats', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        console.log('Response status:', response.status);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Error response:', errorText);
          throw new Error(`Error al cargar estadísticas: ${response.status} ${errorText}`);
        }

        const data = await response.json();
        console.log('Stats data received:', data);
        return data;
      } catch (err) {
        console.error('Error in stats query:', err);
        throw err;
      }
    },
    retry: false // Disable retries for debugging
  });

  useEffect(() => {
    if (error) {
      console.error('Stats error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "No se pudieron cargar las estadísticas"
      });
    }
  }, [error, toast]);

  if (isLoading) {
    console.log('Loading stats...');
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    console.log('Error state:', error);
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline"> No se pudieron cargar las estadísticas</span>
        </div>
      </div>
    );
  }

  if (!stats) {
    console.log('No stats data available');
    return (
      <div className="p-6">
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded relative">
          No hay datos disponibles
        </div>
      </div>
    );
  }

  console.log('Rendering stats component with data:', stats);

  return (
    <div className="p-6 space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Propiedades</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProperties}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Propiedades Activas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.activeProperties}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Propiedades Vendidas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.soldProperties}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Precio Promedio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.averagePrice)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Properties by Type Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Propiedades por Tipo</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.propertiesByType}
                  dataKey="count"
                  nameKey="type"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {stats.propertiesByType.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={TYPE_COLORS[index % TYPE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Monthly Stats Line Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Estadísticas Mensuales</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats.monthlyStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="sales" stroke="#8884d8" name="Ventas" />
                <Line type="monotone" dataKey="listings" stroke="#82ca9d" name="Listados" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Price Ranges Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Rangos de Precios</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.priceRanges}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="range" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Areas */}
        <Card>
          <CardHeader>
            <CardTitle>Áreas Principales</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.topAreas}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="area" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#82ca9d" name="Cantidad" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Actividad Reciente</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats.recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center justify-between border-b pb-2">
                <div>
                  <p className="font-medium">{activity.property}</p>
                  <p className="text-sm text-gray-500">{activity.action}</p>
                </div>
                <span className="text-sm text-gray-500">{formatDate(activity.date)}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Property Features */}
      <Card>
        <CardHeader>
          <CardTitle>Características más Comunes</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats.propertyFeatures} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="feature" type="category" />
              <Tooltip />
              <Bar dataKey="count" fill="#6366F1" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
} 