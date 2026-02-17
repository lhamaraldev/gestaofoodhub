"use client";

import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { showSuccess } from '@/utils/toast';

interface TodoInputProps {
  onAdd: (text: string) => void;
}

const TodoInput = ({ onAdd }: TodoInputProps) => {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onAdd(text.trim());
      setText('');
      showSuccess("Tarefa adicionada com sucesso!");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
      <Input
        type="text"
        placeholder="O que precisa ser feito?"
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="flex-1 rounded-xl border-gray-200 focus-visible:ring-indigo-500"
      />
      <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-6">
        <Plus className="w-5 h-5 mr-2" />
        Adicionar
      </Button>
    </form>
  );
};

export default TodoInput;