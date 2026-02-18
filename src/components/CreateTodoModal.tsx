"use client";

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar as CalendarIcon, Loader2 } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Priority } from '@/pages/Index';
import { cn } from '@/lib/utils';

interface CreateTodoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (todo: { title: string; description: string; priority: Priority; dueDate: string }) => Promise<void>;
}

const CreateTodoModal = ({ isOpen, onClose, onAdd }: CreateTodoModalProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('Média');
  const [date, setDate] = useState<Date>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || isSubmitting) return;

    try {
      setIsSubmitting(true);
      await onAdd({
        title: title.trim(),
        description: description.trim(),
        priority,
        dueDate: date ? date.toISOString() : '',
      });

      // Reset form apenas se tiver sucesso
      setTitle('');
      setDescription('');
      setPriority('Média');
      setDate(undefined);
      onClose();
    } catch (error) {
      console.error("Erro ao submeter:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !isSubmitting && onClose()}>
      <DialogContent className="w-[95%] max-w-[480px] rounded-[1.5rem] sm:rounded-[2rem] p-6 sm:p-8 border-none shadow-2xl overflow-y-auto max-h-[90vh]">
        <DialogHeader className="flex flex-row items-center justify-between mb-4 sm:mb-6">
          <DialogTitle className="text-xl sm:text-2xl font-bold text-gray-900">Nova tarefa</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
          <div className="space-y-2">
            <Input
              placeholder="Título da tarefa"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="h-12 sm:h-14 px-4 sm:px-5 rounded-xl sm:rounded-2xl border-2 border-blue-100 focus:border-blue-500 focus:ring-0 text-base sm:text-lg font-medium placeholder:text-gray-300"
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Textarea
              placeholder="Descrição (opcional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[100px] sm:min-h-[120px] px-4 sm:px-5 py-3 sm:py-4 rounded-xl sm:rounded-2xl border-gray-100 bg-gray-50/50 focus:bg-white focus:border-blue-500 focus:ring-0 resize-none placeholder:text-gray-400 text-sm sm:text-base"
              disabled={isSubmitting}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  type="button"
                  disabled={isSubmitting}
                  className="h-12 sm:h-14 rounded-xl sm:rounded-2xl border-gray-100 bg-gray-50/50 justify-start text-left font-normal px-4 sm:px-5 hover:bg-white"
                >
                  <CalendarIcon className="mr-2 h-5 w-5 text-gray-400" />
                  {date ? (
                    <span className="text-gray-900">{format(date, "dd/MM/yyyy")}</span>
                  ) : (
                    <span className="text-gray-400">Data</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 rounded-2xl border-none shadow-xl" align="center">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                  locale={ptBR}
                />
              </PopoverContent>
            </Popover>

            <Select 
              value={priority} 
              onValueChange={(v: Priority) => setPriority(v)}
              disabled={isSubmitting}
            >
              <SelectTrigger className="h-12 sm:h-14 rounded-xl sm:rounded-2xl border-gray-100 bg-gray-50/50 px-4 sm:px-5 focus:ring-0">
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
            disabled={isSubmitting || !title.trim()}
            className="w-full h-12 sm:h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-xl sm:rounded-2xl text-base sm:text-lg font-bold transition-all shadow-lg shadow-blue-100 mt-2 sm:mt-4"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Criando...
              </>
            ) : (
              'Criar tarefa'
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTodoModal;