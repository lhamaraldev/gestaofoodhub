"use client";

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar as CalendarIcon, X } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Priority } from '@/pages/Index';

interface CreateTodoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (todo: { title: string; description: string; priority: Priority; dueDate: string }) => void;
}

const CreateTodoModal = ({ isOpen, onClose, onAdd }: CreateTodoModalProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('Média');
  const [date, setDate] = useState<Date>();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAdd({
      title,
      description,
      priority,
      dueDate: date ? date.toISOString() : '',
    });

    // Reset form
    setTitle('');
    setDescription('');
    setPriority('Média');
    setDate(undefined);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[480px] rounded-[2rem] p-8 border-none shadow-2xl">
        <DialogHeader className="flex flex-row items-center justify-between mb-6">
          <DialogTitle className="text-2xl font-bold text-gray-900">Nova tarefa</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Input
              placeholder="Título da tarefa"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="h-14 px-5 rounded-2xl border-2 border-blue-100 focus:border-blue-500 focus:ring-0 text-lg font-medium placeholder:text-gray-300"
              required
            />
          </div>

          <div className="space-y-2">
            <Textarea
              placeholder="Descrição (opcional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[120px] px-5 py-4 rounded-2xl border-gray-100 bg-gray-50/50 focus:bg-white focus:border-blue-500 focus:ring-0 resize-none placeholder:text-gray-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="h-14 rounded-2xl border-gray-100 bg-gray-50/50 justify-start text-left font-normal px-5 hover:bg-white"
                >
                  <CalendarIcon className="mr-2 h-5 w-5 text-gray-400" />
                  {date ? format(date, "dd/MM/yyyy") : <span className="text-gray-400">Data de vencimento</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 rounded-2xl border-none shadow-xl" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                  locale={ptBR}
                />
              </PopoverContent>
            </Popover>

            <Select value={priority} onValueChange={(v: Priority) => setPriority(v)}>
              <SelectTrigger className="h-14 rounded-2xl border-gray-100 bg-gray-50/50 px-5 focus:ring-0">
                <div className="flex items-center gap-2">
                  <div className={cn(
                    "w-2.5 h-2.5 rounded-full",
                    priority === 'Baixa' ? "bg-green-500" : priority === 'Média' ? "bg-orange-500" : "bg-red-500"
                  )} />
                  <SelectValue placeholder="Prioridade" />
                </div>
              </SelectTrigger>
              <SelectContent className="rounded-xl border-none shadow-xl">
                <SelectItem value="Baixa">Baixa</SelectItem>
                <SelectItem value="Média">Média</SelectItem>
                <SelectItem value="Alta">Alta</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button 
            type="submit" 
            className="w-full h-14 bg-[#A5B4FC] hover:bg-blue-500 text-white rounded-2xl text-lg font-bold transition-all shadow-lg shadow-blue-100 mt-4"
          >
            Criar tarefa
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTodoModal;