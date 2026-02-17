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
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<FilterType>('all');
  const [isLoaded, setIsLoaded] = useState(false);

  // Carregamento inicial
  useEffect(() => {
    try {
      const saved = localStorage.getItem('dyad-todos-v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setTodos(parsed);
        }
      }
    } catch (e) {
      console.error("Erro ao carregar:", e);
    }
    setIsLoaded(true);
  }, []);

  // Persistência
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem('dyad-todos-v2', JSON.stringify(todos));
      } catch (e) {
        console.error("Erro ao salvar:", e);
      }
    }
  }, [todos, isLoaded]);

  const addTodo = (text: string) => {
    const newTodo: Todo = {
      id: Date.now().toString() + Math.random().toString(36).substring(2),
      text,
      completed: false,
    };
    
    // Usando a função de atualização de estado para garantir que pegamos o estado mais recente
    setTodos(currentTodos => [newTodo, ...currentTodos]);
  };

  const toggleTodo = (id: string) => {
    setTodos(currentTodos => currentTodos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id: string) => {
    setTodos(currentTodos => currentTodos.filter(todo => todo.id !== id));
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

          <div className="space-y-1 min-h-[200px]">
            {!isLoaded ? (
              <div className="flex items-center justify-center h-[200px] text-gray-400">
                <p>Carregando...</p>
              </div>
            ) : filteredTodos.length > 0 ? (
              filteredTodos.map(todo => (
                <TodoItem 
                  key={todo.id} 
                  todo={todo} 
                  onToggle={toggleTodo} 
                  onDelete={deleteTodo} 
                />
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-[200px] text-gray-400 text-center">
                <p className="text-lg">Nenhuma tarefa encontrada.</p>
                <p className="text-sm">Digite algo e clique em Adicionar!</p>
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