import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Pencil } from 'lucide-react';

interface Setting {
  id: number;
  key: string;
  value: string;
  category: string;
  description: string | null;
  updatedAt: number;
}

interface EditDialogProps {
  setting: Setting | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (key: string, value: string) => Promise<void>;
  isLoading: boolean;
}

const EditDialog: React.FC<EditDialogProps> = ({ setting, isOpen, onClose, onSave, isLoading }) => {
  const [value, setValue] = React.useState(setting?.value ?? '');
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (setting) {
      setValue(setting.value);
      setError(null);
    }
  }, [setting]);

  const handleSave = async () => {
    if (!setting) return;
    if (!value.trim()) {
      setError('El valor no puede estar vacío');
      return;
    }

    try {
      await onSave(setting.key, value.trim());
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Configuración</DialogTitle>
          <DialogDescription>
            {setting?.description || 'Modifica el valor de la configuración'}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="key">Clave</Label>
            <Input id="key" value={setting?.key || ''} disabled />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="value">Valor</Label>
            <div className="space-y-2">
              <Input
                id="value"
                value={value}
                onChange={(e) => {
                  setValue(e.target.value);
                  setError(null);
                }}
                placeholder="Ingrese el nuevo valor"
                className={error ? 'border-destructive' : ''}
              />
              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            disabled={isLoading}
          >
            {isLoading ? 'Guardando...' : 'Guardar Cambios'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export const SettingsManager: React.FC = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingSetting, setEditingSetting] = React.useState<Setting | null>(null);

  const { data: settings = [], isLoading: isLoadingSettings, error: queryError } = useQuery<Setting[]>({
    queryKey: ['settings'],
    queryFn: async () => {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('No hay sesión activa');
      }

      const response = await fetch('/api/settings', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('adminToken');
          throw new Error('Sesión expirada');
        }
        throw new Error('Error al cargar configuraciones');
      }
      
      const data = await response.json();
      if (!Array.isArray(data)) {
        throw new Error('Formato de datos inválido');
      }
      
      return data;
    },
    retry: (failureCount, error) => {
      if (error instanceof Error && error.message === 'Sesión expirada') {
        return false;
      }
      return failureCount < 3;
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ key, value }: { key: string; value: string }) => {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('No hay sesión activa');
      }

      const response = await fetch(`/api/settings/${key}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ value })
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('adminToken');
          throw new Error('Sesión expirada');
        }
        throw new Error('Error al actualizar configuración');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
      toast({
        title: "Configuración actualizada",
        description: "Los cambios se han guardado correctamente.",
      });
      setEditingSetting(null);
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Error al actualizar configuración"
      });
    }
  });

  const handleSave = async (key: string, value: string) => {
    await updateMutation.mutateAsync({ key, value });
  };

  React.useEffect(() => {
    if (queryError) {
      toast({
        variant: "destructive",
        title: "Error",
        description: queryError instanceof Error ? queryError.message : "Error al cargar configuraciones"
      });
    }
  }, [queryError, toast]);

  if (isLoadingSettings) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
      </div>
    );
  }

  if (!settings.length) {
    return (
      <div className="p-6">
        <h2 className="text-3xl font-bold mb-4">Configuración</h2>
        <Card>
          <CardContent className="py-10">
            <div className="text-center text-muted-foreground">
              No hay configuraciones disponibles
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Agrupar configuraciones por categoría
  const groupedSettings = settings.reduce((acc, setting) => {
    const category = setting.category || 'General';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(setting);
    return acc;
  }, {} as Record<string, Setting[]>);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Configuración</h2>
          <p className="text-muted-foreground">
            Gestiona las configuraciones del sistema
          </p>
        </div>
      </div>

      <Tabs defaultValue={Object.keys(groupedSettings)[0]} className="space-y-4">
        <TabsList>
          {Object.keys(groupedSettings).map((category) => (
            <TabsTrigger key={category} value={category} className="capitalize">
              {category}
            </TabsTrigger>
          ))}
        </TabsList>

        {Object.entries(groupedSettings).map(([category, categorySettings]) => (
          <TabsContent key={category} value={category}>
            <Card>
              <CardHeader>
                <CardTitle className="capitalize">{category}</CardTitle>
                <CardDescription>
                  Configuraciones relacionadas con {category.toLowerCase()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Configuración</TableHead>
                      <TableHead>Valor</TableHead>
                      <TableHead>Última Actualización</TableHead>
                      <TableHead className="w-[100px]">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {categorySettings.map((setting) => (
                      <TableRow key={setting.key}>
                        <TableCell>
                          <div className="font-medium">{setting.key}</div>
                          <div className="text-sm text-muted-foreground">
                            {setting.description}
                          </div>
                        </TableCell>
                        <TableCell>{setting.value}</TableCell>
                        <TableCell>
                          {new Date(setting.updatedAt * 1000).toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setEditingSetting(setting)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      <EditDialog
        setting={editingSetting}
        isOpen={!!editingSetting}
        onClose={() => setEditingSetting(null)}
        onSave={handleSave}
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}; 