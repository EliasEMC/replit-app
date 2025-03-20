import React, { useState, useEffect } from 'react';
import {
  CurrencyDollarIcon,
  HomeIcon,
  UserGroupIcon,
  EyeIcon,
} from '@heroicons/react/24/outline';

interface DashboardMetric {
  title: string;
  value: string | number;
  change: number;
  icon: React.ForwardRefExoticComponent<any>;
  color: string;
}

export const AdminDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<DashboardMetric[]>([
    {
      title: 'Propiedades Activas',
      value: 0,
      change: 0,
      icon: HomeIcon,
      color: 'bg-blue-500',
    },
    {
      title: 'Valor Total',
      value: '$0',
      change: 0,
      icon: CurrencyDollarIcon,
      color: 'bg-green-500',
    },
    {
      title: 'Visitas Mensuales',
      value: 0,
      change: 0,
      icon: EyeIcon,
      color: 'bg-purple-500',
    },
    {
      title: 'Usuarios Registrados',
      value: 0,
      change: 0,
      icon: UserGroupIcon,
      color: 'bg-orange-500',
    },
  ]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/dashboard/metrics', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      
      if (!response.ok) throw new Error('Error al cargar métricas');
      
      const data = await response.json();
      // Actualizar métricas con datos reales
      setMetrics(prev => prev.map(metric => ({
        ...metric,
        value: data[metric.title.toLowerCase().replace(/\s+/g, '_')] || metric.value,
        change: data[`${metric.title.toLowerCase().replace(/\s+/g, '_')}_change`] || 0
      })));
    } catch (error) {
      console.error('Error al cargar métricas:', error);
    }
  };

  return (
    <main className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-600">
          Resumen general del sistema
        </p>
      </div>

      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {metrics.map((metric, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-sm p-6 transition-transform hover:scale-105"
          >
            <div className="flex items-center">
              <div className={`${metric.color} p-3 rounded-lg`}>
                <metric.icon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  {metric.title}
                </p>
                <p className="text-2xl font-semibold text-gray-900">
                  {metric.value}
                </p>
              </div>
            </div>
            <div className="mt-4">
              <div className={`text-sm ${metric.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {metric.change >= 0 ? '↑' : '↓'} {Math.abs(metric.change)}%
                <span className="text-gray-600 ml-2">vs mes anterior</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Gráficos y estadísticas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Propiedades por tipo */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Propiedades por Tipo
          </h2>
          <div className="h-64 flex items-center justify-center">
            {/* Aquí irá un gráfico de pastel */}
            <p className="text-gray-500">Gráfico de distribución</p>
          </div>
        </div>

        {/* Visitas mensuales */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Visitas Mensuales
          </h2>
          <div className="h-64 flex items-center justify-center">
            {/* Aquí irá un gráfico de líneas */}
            <p className="text-gray-500">Gráfico de tendencias</p>
          </div>
        </div>

        {/* Últimas actividades */}
        <div className="bg-white rounded-lg shadow-sm p-6 lg:col-span-2">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Actividad Reciente
          </h2>
          <div className="space-y-4">
            {/* Lista de actividades recientes */}
            <div className="flex items-center py-3 border-b">
              <div className="bg-blue-100 p-2 rounded-lg">
                <HomeIcon className="h-5 w-5 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-900">
                  Nueva propiedad agregada
                </p>
                <p className="text-sm text-gray-500">
                  Casa Moderna en el Centro - hace 2 horas
                </p>
              </div>
            </div>
            <div className="flex items-center py-3 border-b">
              <div className="bg-green-100 p-2 rounded-lg">
                <CurrencyDollarIcon className="h-5 w-5 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-900">
                  Propiedad vendida
                </p>
                <p className="text-sm text-gray-500">
                  Departamento Vista al Mar - hace 5 horas
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}; 