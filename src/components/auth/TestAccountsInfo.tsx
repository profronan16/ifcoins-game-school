
import React from 'react';

export function TestAccountsInfo() {
  return (
    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
      <div className="text-sm text-gray-600 space-y-2">
        <h4 className="font-medium text-gray-800">Contas de Teste:</h4>
        <ul className="space-y-1">
          <li><strong>Admin:</strong> paulocauan39@gmail.com</li>
          <li><strong>Professor:</strong> professor@ifpr.edu.br</li>
          <li><strong>Estudante:</strong> estudante@estudantes.ifpr.edu.br</li>
        </ul>
        <p className="text-xs text-gray-500 mt-2">
          Senha: qualquer (para testes). O tipo de conta é definido automaticamente pelo email.
        </p>
      </div>
    </div>
  );
}
