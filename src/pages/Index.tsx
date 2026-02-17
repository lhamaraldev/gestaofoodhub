"use client";

import React, { useState, useEffect } from 'react';
import TodoInput from '@/components/TodoInput';
import TodoItem from '@/components/TodoItem';
import TodoFilters, { FilterType } from '@/components/TodoFilters';
import { MadeWithDyad } from "@/components/made-with-dyad";
import { ClipboardList } from 'lucide-react';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

const Index = () => {
  const [todos, setTodos] = useState<Todo[]>(() => {
    try {
      const saved = localStorage.getItem('dyad-todos');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });
  const [filter, setFilter] = useState<FilterType>('all');

  useEffect(() => {
    localStorage.setItem('dyad-todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = (text: string) => {
    const newTodo: Todo = {
      // Usando um fallback caso crypto.randomUUID não esteja disponível
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
      text,
      completed: false,
    };
    setTodos(prev => [newTodo, ...prev]);
  };

  const toggleTodo = (id: string) => {
    setTodos(prev => prev.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id: string) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <header className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-2xl mb-4">
            <ClipboardList className="w-8 h-8 text-indigo-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2 tracking-tight">Minhas Tarefas</h1>
          <p className="text-gray-500">Organize seu dia de forma simples e elegante.</p>
        </header>

        <main className="bg-white rounded-[2rem] shadow-xl shadow-indigo-100/50 p-6 md:p-8 border border-indigo-50/50">
          <TodoInput onAdd={addTodo} />

          <div className="space-y-1 min-h-[300px]">
            {filteredTodos.length > 0 ? (
              filteredTodos.map(todo => (
                <TodoItem 
                  key={todo.id} 
                  todo={todo} 
                  onToggle={toggleTodo} 
                  onDelete={deleteTodo} 
                />
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-[300px] text-gray-400">
                <p className="text-lg">Nenhuma tarefa encontrada.</p>
                <p className="text-sm">Comece adicionando algo novo acima!</p>
              </div>
            )}
          </div>

          <TodoFilters 
            currentFilter={filter} 
            onFilterChange={setFilter} 
            total={filteredTodos.length} 
          />
        </main>

        <footer className="mt-12">
          <MadeWithDyad />
        </footer>
      </div>
    </div>
  );
};

export default Index;