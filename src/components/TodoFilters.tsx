"use client";

import React from 'react';
import { Button } from '@/components/ui/button';

export type FilterType = 'all' | 'active' | 'completed';

interface TodoFiltersProps {
  currentFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  total: number;
}

const TodoFilters = ({ currentFilter, onFilterChange, total }: TodoFiltersProps) => {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-6 border-t border-gray-100">
      <span className="text-sm text-gray-500 font-medium">
        {total} {total === 1 ? 'tarefa' : 'tarefas'}
      </span>
      <div className="flex bg-gray-100 p-1 rounded-xl">
        {(['all', 'active', 'completed'] as FilterType[]).map((filter) => (
          <Button
            key={filter}
            variant="ghost"
            size="sm"
            onClick={() => onFilterChange(filter)}
            className={cn(
              "rounded-lg px-4 py-1 text-sm font-medium transition-all",
              currentFilter === filter 
                ? "bg-white text-indigo-600 shadow-sm" 
                : "text-gray-500 hover:text-gray-700"
            )}
          >
            {filter === 'all' ? 'Todas' : filter === 'active' ? 'Ativas' : 'Concluídas'}
          </Button>
        ))}
      </div>
    </div>
  );
};

import { cn } from '@/lib/utils';
export default TodoFilters;