"use client";

import React from 'react';
import { Trash2, CheckCircle2, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { showError } from '@/utils/toast';

interface TodoItemProps {
  todo: {
    id: string;
    text: string;
    completed: boolean;
  };
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

const TodoItem = ({ todo, onToggle, onDelete }: TodoItemProps) => {
  const handleDelete = () => {
    onDelete(todo.id);
    showError("Tarefa removida.");
  };

  return (
    <div className={cn(
      "flex items-center justify-between p-4 mb-3 rounded-2xl transition-all duration-200 border group",
      todo.completed ? "bg-gray-50 border-transparent" : "bg-white border-gray-100 shadow-sm hover:shadow-md"
    )}>
      <div className="flex items-center gap-3 flex-1 cursor-pointer" onClick={() => onToggle(todo.id)}>
        {todo.completed ? (
          <CheckCircle2 className="w-6 h-6 text-green-500" />
        ) : (
          <Circle className="w-6 h-6 text-gray-300 group-hover:text-indigo-400" />
        )}
        <span className={cn(
          "text-lg transition-all",
          todo.completed ? "text-gray-400 line-through" : "text-gray-700"
        )}>
          {todo.text}
        </span>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={handleDelete}
        className="text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <Trash2 className="w-5 h-5" />
      </Button>
    </div>
  );
};

export default TodoItem;