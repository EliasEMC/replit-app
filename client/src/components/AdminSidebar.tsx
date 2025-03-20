import React from 'react';
import { Link, useLocation } from 'wouter';
import {
  HomeIcon,
  BuildingOfficeIcon,
  ChartBarIcon,
  UserGroupIcon,
  Cog6ToothIcon,
  ArrowLeftOnRectangleIcon
} from '@heroicons/react/24/outline';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: HomeIcon },
  { name: 'Propiedades', href: '/admin/properties', icon: BuildingOfficeIcon },
  { name: 'Usuarios', href: '/admin/users', icon: UserGroupIcon },
  { name: 'Estadísticas', href: '/admin/stats', icon: ChartBarIcon },
  { name: 'Configuración', href: '/admin/settings', icon: Cog6ToothIcon },
];

export const AdminSidebar: React.FC = () => {
  const [location] = useLocation();
  const [showLogoutDialog, setShowLogoutDialog] = React.useState(false);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    window.location.href = '/admin/login';
  };

  return (
    <div className="flex h-full flex-col bg-gray-900">
      <div className="flex flex-1 flex-col overflow-y-auto">
        <div className="flex flex-1 flex-col">
          <nav className="flex-1 space-y-1 px-2 py-4">
            {navigation.map((item) => {
              const isActive = location === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`
                    group flex items-center px-2 py-2 text-sm font-medium rounded-md
                    ${isActive
                      ? 'bg-gray-800 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }
                  `}
                >
                  <item.icon
                    className={`
                      mr-3 h-6 w-6 flex-shrink-0
                      ${isActive
                        ? 'text-white'
                        : 'text-gray-400 group-hover:text-gray-300'
                      }
                    `}
                    aria-hidden="true"
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
      <div className="flex flex-shrink-0 bg-gray-800 p-4">
        <button
          onClick={() => setShowLogoutDialog(true)}
          className="group flex w-full items-center px-2 py-2 text-sm font-medium rounded-md text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
        >
          <ArrowLeftOnRectangleIcon
            className="mr-3 h-6 w-6 flex-shrink-0 text-gray-400 group-hover:text-gray-300"
            aria-hidden="true"
          />
          Cerrar Sesión
        </button>
      </div>

      <Dialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Cierre de Sesión</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas cerrar sesión?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowLogoutDialog(false)}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleLogout}
            >
              Cerrar Sesión
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}; 