
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { User, Plus, Edit, Trash2, Mail, Search } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const mockStudents = [
  {
    uid: 'student1',
    name: 'Ana Costa',
    email: 'ana.costa@estudante.ifpr.edu.br',
    ra: '2024001',
    class: '3º INFO',
    coins: 150,
    status: 'active'
  },
  {
    uid: 'student2',
    name: 'Pedro Silva',
    email: 'pedro.silva@estudante.ifpr.edu.br',
    ra: '2024002',
    class: '2º INFO',
    coins: 200,
    status: 'active'
  },
  {
    uid: 'student3',
    name: 'Maria Santos',
    email: 'maria.santos@estudante.ifpr.edu.br',
    ra: '2024003',
    class: '1º INFO',
    coins: 80,
    status: 'inactive'
  }
];

export function ManageStudents() {
  const { profile, loading } = useAuth();
  const [students, setStudents] = useState(mockStudents);
  const [isCreating, setIsCreating] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [newStudent, setNewStudent] = useState({
    name: '',
    email: '',
    ra: '',
    class: ''
  });

  console.log('ManageStudents - profile:', profile);
  console.log('ManageStudents - loading:', loading);

  if (loading) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Carregando...</h2>
        <p className="text-gray-600">Verificando permissões...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Erro de Autenticação</h2>
        <p className="text-gray-600">Perfil não encontrado. Faça login novamente.</p>
      </div>
    );
  }

  // Permitir acesso para admin e teacher
  const canManageStudents = profile.role === 'admin' || profile.role === 'teacher';
  
  console.log('ManageStudents - canManageStudents:', canManageStudents);
  console.log('ManageStudents - profile.role:', profile.role);

  if (!canManageStudents) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Acesso Negado</h2>
        <p className="text-gray-600">Apenas administradores e professores podem gerenciar estudantes.</p>
        <p className="text-sm text-gray-500 mt-2">Seu perfil atual: {profile.role}</p>
        <p className="text-xs text-gray-400 mt-1">Email: {profile.email}</p>
      </div>
    );
  }

  const handleCreateStudent = () => {
    if (!newStudent.name || !newStudent.email || !newStudent.ra || !newStudent.class) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    const student = {
      uid: Date.now().toString(),
      ...newStudent,
      coins: 0,
      status: 'active'
    };

    setStudents([...students, student]);
    setNewStudent({ name: '', email: '', ra: '', class: '' });
    setIsCreating(false);
    
    toast({
      title: "Sucesso",
      description: "Estudante cadastrado com sucesso! Um email com instruções foi enviado.",
    });
  };

  const handleDeleteStudent = (studentId: string) => {
    setStudents(students.filter(s => s.uid !== studentId));
    toast({
      title: "Sucesso",
      description: "Estudante removido com sucesso!",
    });
  };

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.ra.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.class.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gerenciar Estudantes</h1>
          <p className="text-gray-600 mt-1">
            Cadastre e gerencie estudantes do sistema
          </p>
          <p className="text-sm text-green-600 mt-2">
            ✓ Acesso autorizado como {profile.role}
          </p>
        </div>
        <Button onClick={() => setIsCreating(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Cadastrar Estudante
        </Button>
      </div>

      {isCreating && (
        <Card>
          <CardHeader>
            <CardTitle>Cadastrar Novo Estudante</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Nome Completo</Label>
                <Input
                  id="name"
                  value={newStudent.name}
                  onChange={(e) => setNewStudent({...newStudent, name: e.target.value})}
                  placeholder="Ex: João da Silva"
                />
              </div>
              <div>
                <Label htmlFor="email">Email Institucional</Label>
                <Input
                  id="email"
                  type="email"
                  value={newStudent.email}
                  onChange={(e) => setNewStudent({...newStudent, email: e.target.value})}
                  placeholder="joao.silva@estudante.ifpr.edu.br"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="ra">Registro Acadêmico (RA)</Label>
                <Input
                  id="ra"
                  value={newStudent.ra}
                  onChange={(e) => setNewStudent({...newStudent, ra: e.target.value})}
                  placeholder="Ex: 2024001"
                />
              </div>
              <div>
                <Label htmlFor="class">Turma</Label>
                <Input
                  id="class"
                  value={newStudent.class}
                  onChange={(e) => setNewStudent({...newStudent, class: e.target.value})}
                  placeholder="Ex: 3º INFO"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleCreateStudent}>Cadastrar Estudante</Button>
              <Button variant="outline" onClick={() => setIsCreating(false)}>Cancelar</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Estudantes Cadastrados</CardTitle>
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-gray-500" />
              <Input
                placeholder="Buscar estudantes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>RA</TableHead>
                <TableHead>Turma</TableHead>
                <TableHead>IFCoins</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.map((student) => (
                <TableRow key={student.uid}>
                  <TableCell className="font-medium">{student.name}</TableCell>
                  <TableCell>{student.email}</TableCell>
                  <TableCell>{student.ra}</TableCell>
                  <TableCell>{student.class}</TableCell>
                  <TableCell>{student.coins}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      student.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {student.status === 'active' ? 'Ativo' : 'Inativo'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Mail className="h-4 w-4" />
                      </Button>
                      {profile.role === 'admin' && (
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteStudent(student.uid)}>
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
