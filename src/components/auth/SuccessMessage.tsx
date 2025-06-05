
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';

interface SuccessMessageProps {
  onBackToForm: () => void;
}

export function SuccessMessage({ onBackToForm }: SuccessMessageProps) {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="pt-6">
        <div className="text-center space-y-4">
          <CheckCircle className="h-12 w-12 text-green-600 mx-auto" />
          <h3 className="text-lg font-semibold text-green-600">
            Cadastro realizado com sucesso!
          </h3>
          <p className="text-gray-600">
            Sua conta foi criada. Você já pode fazer login.
          </p>
          <Button 
            onClick={onBackToForm}
            className="w-full"
          >
            Fazer outro cadastro
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
