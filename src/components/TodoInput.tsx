"use client";

import React, { useState } from 'react';
import { Plus } from 'lucide-react';

interface TodoInputProps {
  onAdd: (text: string) => void;
}

const TodoInput = ({ onAdd }: TodoInputProps) => {
  const [text, setText] = useState('');

  const handleAdd = () => {
    const trimmedText = text.trim();
    if (trimmedText) {
      console.log("Adicionando tarefa:", trimmedText);
      onAdd(trimmedText);
      setText('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAdd();
    }
  };

  return (
    <div className="flex gap-2 mb-6">
      <input
        type="text"
        placeholder="O que precisa ser feito?"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        className="flex-1 px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-gray-900"
      />
      <button 
        type="button"
        onClick={handleAdd}
        className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-6 py-2 flex items-center font-medium transition-colors active:scale-95"
      >
        <Plus className="w-5 h-5 mr-2" />
        Adicionar
      </button>
    </div>
  );
};

export default TodoInput;