"use client";

import React, { useState, useEffect } from 'react';
import { ClipboardList, Plus, Search, LogOut, User, Filter, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import TodoItem from '@/components/TodoItem';
import CreateTodoModal from '@/components/CreateTodoModal';
import { MadeWithDyad } from "@/components/made-with-dyad";
import { useAuth } from '@/components/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { showSuccess, showError } from '@/utils/toast';

export type Priority = 'Baixa' | 'Média' | 'Alta';

export interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: Priority;
  dueDate?: string;
  user_id: string;
}

const Index = () => {
  const { user, signOut } = useAuth();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'Todas' | 'Pendentes' | 'Concluídas'>('Todas');
  const [priorityFilter, setPriorityFilter] = useState<string>('Todas');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchTodos = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('todos')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Erro Supabase:", error);
        throw error;
      }
      
      const mappedTodos = (data || []).map(t => ({
        id: t.id,
        title: t.title || 'Sem título',
        description: t.description || '',
        completed: !!t.completed,
        priority: (t.priority as Priority) || 'Média',
        dueDate: t.due_date || '',
        user_id: t.user_id
      }));

      setTodos(mappedTodos);
    } catch (error: any) {
      showError("Erro ao carregar tarefas. Verifique se a tabela 'todos' existe no Supabase.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, [user]);

  const addTodo = async (newTodo: { title: string; description: string; priority: Priority; dueDate: string }) => {
    try {
      const { data, error } = await supabase
        .from('todos')
        .insert([{
          title: newTodo.title,
          description: newTodo.description,
          priority: newTodo.priority,
          due_date: newTodo.dueDate || null,
          user_id: user?.id,
          completed: false
        }])
        .select()
        .single();

      if (error) throw error;

      const task: Todo = {
        id: data.id,
        title: data.title,
        description: data.description,
        completed: data.completed,
        priority: data.priority as Priority,
        dueDate: data.due_date,
        user_id: data.user_id
      };

      setTodos(prev => [task, ...prev]);
      showSuccess("Tarefa criada com sucesso!");
    } catch (error: any) {
      showError("Erro ao criar tarefa: " + error.message);
    }
  };

  const toggleTodo = async (id: string) => {
    const todo = todos.find(t => t.id === id);
    if (!todo) return;

    try {
      const { error } = await supabase
        .from('todos')
        .update({ completed: !todo.completed })
        .eq('id', id);

      if (error) throw error;

      setTodos(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
    } catch (error: any) {
      showError("Erro ao atualizar tarefa.");
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      const { error } = await supabase
        .from('todos')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setTodos(prev => prev.filter(t => t.id !== id));
      showSuccess("Tarefa excluída!");
    } catch (error: any) {
      showError("Erro ao excluir tarefa.");
    }
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
      <header className="bg-white border-b border-gray-100 px-4 py-4 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-1.5 rounded-lg">
              <ClipboardList className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-lg font-bold text-gray-900">Tarefas</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-xl border border-gray-100">
              <div className="w-6 h-6 bg-slate-900 rounded-full flex items-center justify-center">
                <User className="w-3 h-3 text-white" />
              </div>
              <span className="text-xs font-medium text-gray-600 truncate max-w-[100px]">
                {user?.email?.split('@')[0]}
              </span>
            </div>
            <button 
              onClick={() => signOut()}
              className="p-2 text-gray-400 hover:text-red-500 transition-colors"
              title="Sair"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
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
            className="bg-[#3B82F6] hover:bg-blue-700 text-white rounded-xl px-6 py-6 h-auto font-semibold flex items-center justify-center gap-2 shadow-lg shadow-blue-200 w-full sm:w-auto"
          >
            <Plus className="w-5 h-5" />
            Nova tarefa
          </Button>
        </div>

        <div className="space-y-4 mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input 
              placeholder="Buscar tarefas..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-12 py-6 rounded-2xl border-gray-200 bg-white focus:ring-blue-500 text-base"
            />
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex bg-gray-100 p-1 rounded-xl overflow-x-auto no-scrollbar">
              {['Todas', 'Pendentes', 'Concluídas'].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f as any)}
                  className={`flex-1 min-w-[100px] px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                    filter === f ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>

            <div className="relative w-full">
              <select 
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="w-full appearance-none bg-white border border-gray-200 rounded-xl px-10 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Todas">Todas as Prioridades</option>
                <option value="Baixa">Baixa</option>
                <option value="Média">Média</option>
                <option value="Alta">Alta</option>
              </select>
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
              <Loader2 className="w-10 h-10 animate-spin mb-4" />
              <p>Carregando suas tarefas...</p>
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