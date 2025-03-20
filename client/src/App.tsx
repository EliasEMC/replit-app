import React from 'react';
import { Switch, Route, useLocation } from 'wouter';
import { AdminDashboard } from './components/AdminDashboard';
import { PropertyForm } from './components/properties/PropertyForm';
import { PropertyManager } from './components/PropertyManager';
import { UserManager } from './components/UserManager';
import { StatsManager } from './components/StatsManager';
import { SettingsManager } from './components/SettingsManager';
import { AdminLayout } from './components/AdminLayout';
import { AdminLogin } from './components/AdminLogin';
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { I18nextProvider } from "react-i18next";
import i18n from "./lib/i18n";
import { ThemeProvider } from "next-themes";
import Home from "@/pages/home";
import Industrial from "@/pages/industrial";
import NotFound from "@/pages/not-found";
import NewProperty from "@/pages/properties/new";

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const adminToken = localStorage.getItem('adminToken');
  const [, setLocation] = useLocation();

  React.useEffect(() => {
    if (!adminToken) {
      setLocation('/admin/login');
    }
  }, [adminToken, setLocation]);

  if (!adminToken) {
    return null;
  }

  return children;
};

export const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <I18nextProvider i18n={i18n}>
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/industrial" component={Industrial} />
            <Route path="/admin/login" component={AdminLogin} />
            <Route path="/admin">
              {() => (
                <AdminLayout>
                  <ProtectedRoute>
                    <AdminDashboard />
                  </ProtectedRoute>
                </AdminLayout>
              )}
            </Route>
            <Route path="/admin/properties">
              {() => (
                <AdminLayout>
                  <ProtectedRoute>
                    <PropertyManager />
                  </ProtectedRoute>
                </AdminLayout>
              )}
            </Route>
            <Route path="/admin/property/new">
              {() => (
                <AdminLayout>
                  <ProtectedRoute>
                    <NewProperty />
                  </ProtectedRoute>
                </AdminLayout>
              )}
            </Route>
            <Route path="/admin/property/:id">
              {(params) => (
                <AdminLayout>
                  <ProtectedRoute>
                    <PropertyForm id={params.id} />
                  </ProtectedRoute>
                </AdminLayout>
              )}
            </Route>
            <Route path="/admin/users">
              {() => (
                <AdminLayout>
                  <ProtectedRoute>
                    <UserManager />
                  </ProtectedRoute>
                </AdminLayout>
              )}
            </Route>
            <Route path="/admin/stats">
              {() => (
                <AdminLayout>
                  <ProtectedRoute>
                    <StatsManager />
                  </ProtectedRoute>
                </AdminLayout>
              )}
            </Route>
            <Route path="/admin/settings">
              {() => (
                <AdminLayout>
                  <ProtectedRoute>
                    <SettingsManager />
                  </ProtectedRoute>
                </AdminLayout>
              )}
            </Route>
            <Route>
              {() => <NotFound />}
            </Route>
          </Switch>
          <Toaster />
        </I18nextProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;