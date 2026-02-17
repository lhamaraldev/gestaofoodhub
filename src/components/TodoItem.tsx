"use client";

import React from 'react';
import { Calendar, CheckCircle2, Circle, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Todo } from '@/pages/Index';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

const TodoItem = ({ todo, onToggle, onDelete }: TodoItemProps) => {
  const priorityColors = {
    'Baixa': 'border-l-green-500 bg-green-50/30',
    'Média': 'border-l-orange-500 bg-orange-50/30',
    'Alta': 'border-l-red-500 bg-red-50/30'
  };

  const badgeColors = {
    'Baixa': 'bg-green-100 text-green-700 hover:bg-green-100',
    'Média': 'bg-orange-100 text-orange-700 hover:bg-orange-100',
    'Alta': 'bg-red-100 text-red-700 hover:bg-red-100'
  };

  return (
    <div className={cn(
      "group relative bg-white rounded-2xl border border-gray-100 border-l-4 p-5 transition-all hover:shadow-md flex items-start gap-4",
      priorityColors[todo.priority],
      todo.completed && "opacity-60 grayscale-[0.5]"
    )}>
      <button 
        onClick={() => onToggle(todo.id)}
        className="mt-1 text-blue-500 hover:scale-110 transition-transform"
      >
        {todo.completed ? (
          <CheckCircle2 className="w-6 h-6 fill-blue-500 text-white" />
        ) : (
          <Circle className="w-6 h-6 text-blue-300" />
        )}
      </button>

      <div className="flex-1 min-w-0">
        <h3 className={cn(
          "text-lg font-semibold text-gray-900 truncate",
          todo.completed && "line-through text-gray-400"
        )}>
          {todo.title}
        </h3>
        
        {todo.description && (
          <p className="text-gray-500 text-sm mt-1 line-clamp-2">
            {todo.description}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-3 mt-3">
          <Badge className={cn("rounded-lg px-2.5 py-0.5 text-xs font-bold border-none", badgeColors[todo.priority])}>
            {todo.priority}
          </Badge>
          
          {todo.dueDate && (
            <div className="flex items-center gap-1.5 text-gray-400 text-xs font-medium">
              <Calendar className="w-3.5 h-3.5" />
              {format(new Date(todo.dueDate), "dd/MM/yyyy", { locale: ptBR })}
            </div>
          )}
        </div>
      </div>

      <button 
        onClick={() => onDelete(todo.id)}
        className="opacity-0 group-hover:opacity-100 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
      >
        <Trash2 className="w-5 h-5" />
      </button>
    </div>
  );
};

export default TodoItem;