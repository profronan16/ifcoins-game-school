
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Settings as SettingsIcon, Save, RefreshCw, Database, Shield, Bell } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export function Settings() {
  const { user } = useAuth();
  const [settings, setSettings] = useState({
    siteName: 'IFCoins',
    maxCoinsPerHour: 10,
    packLimitPerMonth: 3,
    rarityProbabilities: {
      common: 60,
      rare: 30,
      legendary: 9,
      mythic: 1
    },
    emailNotifications: true,
    autoBackup: true,
    maintenanceMode: false
  });

  if (user?.role !== 'admin') {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Acesso Negado</h2>
        <p className="text-gray-600">Apenas administradores podem acessar as configurações.</p>
      </div>
    );
  }

  const handleSaveSettings = () => {
    // Aqui você salvaria as configurações no banco de dados
    toast({
      title: "Sucesso",
      description: "Configurações salvas com sucesso!",
    });
  };

  const handleBackup = () => {
    toast({
      title: "Backup Iniciado",
      description: "O backup dos dados foi iniciado. Você receberá uma notificação quando concluído.",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Configurações do Sistema</h1>
        <p className="text-gray-600 mt-1">
          Configure as opções gerais do sistema IFCoins
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <SettingsIcon className="h-5 w-5" />
              Configurações Gerais
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="siteName">Nome do Sistema</Label>
              <Input
                id="siteName"
                value={settings.siteName}
                onChange={(e) => setSettings({...settings, siteName: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="maxCoins">Máximo de Moedas por Hora (por estudante)</Label>
              <Input
                id="maxCoins"
                type="number"
                min="1"
                max="100"
                value={settings.maxCoinsPerHour}
                onChange={(e) => setSettings({...settings, maxCoinsPerHour: parseInt(e.target.value)})}
              />
            </div>
            <div>
              <Label htmlFor="packLimit">Limite de Pacotes por Mês (por estudante)</Label>
              <Input
                id="packLimit"
                type="number"
                min="1"
                max="20"
                value={settings.packLimitPerMonth}
                onChange={(e) => setSettings({...settings, packLimitPerMonth: parseInt(e.target.value)})}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Modo de Manutenção</Label>
                <p className="text-sm text-gray-600">Desabilita o acesso ao sistema</p>
              </div>
              <Button
                variant={settings.maintenanceMode ? "destructive" : "outline"}
                onClick={() => setSettings({...settings, maintenanceMode: !settings.maintenanceMode})}
              >
                {settings.maintenanceMode ? "Ativo" : "Inativo"}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Probabilidades das Cartas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="common">Comum (%)</Label>
              <Input
                id="common"
                type="number"
                min="0"
                max="100"
                value={settings.rarityProbabilities.common}
                onChange={(e) => setSettings({
                  ...settings,
                  rarityProbabilities: {
                    ...settings.rarityProbabilities,
                    common: parseInt(e.target.value)
                  }
                })}
              />
            </div>
            <div>
              <Label htmlFor="rare">Rara (%)</Label>
              <Input
                id="rare"
                type="number"
                min="0"
                max="100"
                value={settings.rarityProbabilities.rare}
                onChange={(e) => setSettings({
                  ...settings,
                  rarityProbabilities: {
                    ...settings.rarityProbabilities,
                    rare: parseInt(e.target.value)
                  }
                })}
              />
            </div>
            <div>
              <Label htmlFor="legendary">Lendária (%)</Label>
              <Input
                id="legendary"
                type="number"
                min="0"
                max="100"
                value={settings.rarityProbabilities.legendary}
                onChange={(e) => setSettings({
                  ...settings,
                  rarityProbabilities: {
                    ...settings.rarityProbabilities,
                    legendary: parseInt(e.target.value)
                  }
                })}
              />
            </div>
            <div>
              <Label htmlFor="mythic">Mítica (%)</Label>
              <Input
                id="mythic"
                type="number"
                min="0"
                max="100"
                value={settings.rarityProbabilities.mythic}
                onChange={(e) => setSettings({
                  ...settings,
                  rarityProbabilities: {
                    ...settings.rarityProbabilities,
                    mythic: parseInt(e.target.value)
                  }
                })}
              />
            </div>
            <div className="text-sm text-gray-600">
              Total: {Object.values(settings.rarityProbabilities).reduce((a, b) => a + b, 0)}%
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notificações
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Notificações por Email</Label>
                <p className="text-sm text-gray-600">Enviar notificações importantes por email</p>
              </div>
              <Button
                variant={settings.emailNotifications ? "default" : "outline"}
                onClick={() => setSettings({...settings, emailNotifications: !settings.emailNotifications})}
              >
                {settings.emailNotifications ? "Ativo" : "Inativo"}
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Backup Automático</Label>
                <p className="text-sm text-gray-600">Backup diário automático dos dados</p>
              </div>
              <Button
                variant={settings.autoBackup ? "default" : "outline"}
                onClick={() => setSettings({...settings, autoBackup: !settings.autoBackup})}
              >
                {settings.autoBackup ? "Ativo" : "Inativo"}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Gerenciamento de Dados
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={handleBackup} className="w-full flex items-center gap-2">
              <Database className="h-4 w-4" />
              Fazer Backup dos Dados
            </Button>
            <Button variant="outline" className="w-full flex items-center gap-2">
              <RefreshCw className="h-4 w-4" />
              Restaurar Backup
            </Button>
            <Button variant="outline" className="w-full flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Verificar Integridade
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSaveSettings} className="flex items-center gap-2">
          <Save className="h-4 w-4" />
          Salvar Configurações
        </Button>
      </div>
    </div>
  );
}
