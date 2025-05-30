
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { LoginForm } from '@/components/auth/LoginForm';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { StudentDashboard } from '@/components/dashboard/StudentDashboard';
import { TeacherDashboard } from '@/components/dashboard/TeacherDashboard';
import { AdminDashboard } from '@/components/dashboard/AdminDashboard';
import { CardShop } from '@/components/sections/CardShop';
import { Collection } from '@/components/sections/Collection';

const Index = () => {
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState('dashboard');

  if (!user) {
    return <LoginForm />;
  }

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        if (user.role === 'student') return <StudentDashboard onSectionChange={setActiveSection} />;
        if (user.role === 'teacher') return <TeacherDashboard />;
        if (user.role === 'admin') return <AdminDashboard onSectionChange={setActiveSection} />;
        break;
      case 'shop':
        return <CardShop />;
      case 'collection':
        return <Collection />;
      case 'give-coins':
        return <TeacherDashboard />;
      case 'manage-students':
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">Gerenciar Estudantes</h2>
            <p className="text-gray-600">Funcionalidade em desenvolvimento...</p>
          </div>
        );
      case 'manage-cards':
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">Gerenciar Cartas</h2>
            <p className="text-gray-600">Funcionalidade em desenvolvimento...</p>
          </div>
        );
      case 'trades':
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">Sistema de Trocas</h2>
            <p className="text-gray-600">Funcionalidade em desenvolvimento...</p>
          </div>
        );
      case 'rankings':
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">Rankings</h2>
            <p className="text-gray-600">Funcionalidade em desenvolvimento...</p>
          </div>
        );
      case 'events':
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">Eventos</h2>
            <p className="text-gray-600">Funcionalidade em desenvolvimento...</p>
          </div>
        );
      case 'settings':
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">Configurações</h2>
            <p className="text-gray-600">Funcionalidade em desenvolvimento...</p>
          </div>
        );
      default:
        return <StudentDashboard onSectionChange={setActiveSection} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex w-full">
      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default Index;
