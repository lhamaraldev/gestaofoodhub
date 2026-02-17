"use client";

import React, { useState, useEffect } from 'react';
import { ClipboardList, Plus, Search, Moon, LogOut, User, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import TodoItem from '@/components/TodoItem';
import CreateTodoModal from '@/components/CreateTodoModal';
import { MadeWithDyad } from "@/components/made-with-dyad";
import { useAuth } from '@/components/AuthProvider';

export type Priority = 'Baixa' | 'Média' | 'Alta';

export interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: Priority;
  dueDate?: string;
}

const Index = () => {
  const { user, signOut } = useAuth();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'Todas' | 'Pendentes' | 'Concluídas'>('Todas');
  const [priorityFilter, setPriorityFilter] = useState<string>('Todas');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Usando o ID do usuário para salvar tarefas específicas por conta
    const storageKey = `dyad-tasks-${user?.id}`;
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        setTodos(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
    setIsLoaded(true);
  }, [user?.id]);

  useEffect(() => {
    if (isLoaded && user?.id) {
      const storageKey = `dyad-tasks-${user?.id}`;
      localStorage.setItem(storageKey, JSON.stringify(todos));
    }
  }, [todos, isLoaded, user?.id]);

  const addTodo = (newTodo: Omit<Todo, 'id' | 'completed'>) => {
    const task: Todo = {
      ...newTodo,
      id: Math.random().toString(36).substring(2, 9),
      completed: false,
    };
    setTodos(prev => [task, ...prev]);
  };

  const toggleTodo = (id: string) => {
    setTodos(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTodo = (id: string) => {
    setTodos(prev => prev.filter(t => t.id !== id));
  };

  const filteredTodos = todos.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase()) || 
                         (t.description?.toLowerCase().includes(search.toLowerCase()) ?? false);
    const matchesStatus = filter === 'Todas' ? true : 
                         filter === 'Concluídas' ? t.completed : !t.completed;
    const matchesPriority = priorityFilter === 'Todas' ? true : t.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const completedCount = todos.filter(t => t.completed).length;

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-1.5 rounded-lg">
              <ClipboardList className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-900">Tarefas</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-xl border border-gray-100">
              <div className="w-6 h-6 bg-slate-900 rounded-full flex items-center justify-center">
                <User className="w-3 h-3 text-white" />
              </div>
              <span className="text-xs font-medium text-gray-600 truncate max-w-[100px]">
                {user?.email?.split('@')[0]}
              </span>
            </div>
            <button className="text-gray-400 hover:text-gray-600 transition-colors">
              <Moon className="w-5 h-5" />
            </button>
            <button 
              onClick={() => signOut()}
              className="text-gray-400 hover:text-red-500 transition-colors"
              title="Sair"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-6">
        {/* Stats & Action */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4 text-sm text-gray-500 font-medium">
            <span>{todos.length} tarefas</span>
            <span className="flex items-center gap-1 text-green-600">
              <div className="w-4 h-4 rounded-full border-2 border-green-600 flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-green-600 rounded-full" />
              </div>
              {completedCount} concluídas
            </span>
          </div>
          <Button 
            onClick={() => setIsModalOpen(true)}
            className="bg-[#3B82F6] hover:bg-blue-700 text-white rounded-xl px-6 py-6 h-auto font-semibold flex items-center gap-2 shadow-lg shadow-blue-200"
          >
            <Plus className="w-5 h-5" />
            Nova tarefa
          </Button>
        </div>

        {/* Search & Filters */}
        <div className="space-y-4 mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input 
              placeholder="Buscar tarefas..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-12 py-6 rounded-2xl border-gray-200 bg-white focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex bg-gray-100 p-1 rounded-xl">
              {['Todas', 'Pendentes', 'Concluídas'].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f as any)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    filter === f ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>

            <div className="relative">
              <select 
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="appearance-none bg-white border border-gray-200 rounded-xl px-10 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Todas">Todas</option>
                <option value="Baixa">Baixa</option>
                <option value="Média">Média</option>
                <option value="Alta">Alta</option>
              </select>
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Task List */}
        <div className="space-y-4">
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
            <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-gray-200">
              <p className="text-gray-400 text-lg">Nenhuma tarefa encontrada.</p>
            </div>
          )}
        </div>
      </main>

      <CreateTodoModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onAdd={addTodo} 
      />

      <footer className="py-8">
        <MadeWithDyad />
      </footer>
    </div>
  );
};

export default Index;