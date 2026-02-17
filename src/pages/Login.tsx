"use client";

import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/integrations/supabase/client';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/components/AuthProvider';
import { ClipboardList } from 'lucide-react';

const Login = () => {
  const { session } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (session) {
      navigate('/');
    }
  }, [session, navigate]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-[2.5rem] p-10 shadow-xl shadow-blue-100/50 border border-gray-100">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-blue-600 p-3 rounded-2xl mb-4 shadow-lg shadow-blue-200">
            <ClipboardList className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Bem-vindo</h1>
          <p className="text-gray-500 mt-2">Gerencie suas tarefas com facilidade</p>
        </div>

        <Auth
          supabaseClient={supabase}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: '#3B82F6',
                  brandAccent: '#2563EB',
                },
                radii: {
                  buttonRadius: '1rem',
                  inputRadius: '1rem',
                }
              }
            }
          }}
          localization={{
            variables: {
              sign_in: {
                email_label: 'E-mail',
                password_label: 'Senha',
                email_input_placeholder: 'Seu endereço de e-mail',
                password_input_placeholder: 'Sua senha',
                button_label: 'Entrar',
                loading_button_label: 'Entrando...',
                social_provider_text: 'Entrar com {{provider}}',
                link_text: 'Não tem uma conta? Cadastre-se',
              },
              sign_up: {
                email_label: 'E-mail',
                password_label: 'Senha',
                email_input_placeholder: 'Seu endereço de e-mail',
                password_input_placeholder: 'Sua senha',
                button_label: 'Cadastrar',
                loading_button_label: 'Cadastrando...',
                link_text: 'Já tem uma conta? Entre',
              },
              forgotten_password: {
                email_label: 'E-mail',
                password_label: 'Senha',
                email_input_placeholder: 'Seu endereço de e-mail',
                button_label: 'Enviar instruções de recuperação',
                loading_button_label: 'Enviando...',
                link_text: 'Esqueceu sua senha?',
              },
              update_password: {
                password_label: 'Nova senha',
                password_input_placeholder: 'Sua nova senha',
                button_label: 'Atualizar senha',
                loading_button_label: 'Atualizando...',
              },
            }
          }}
          providers={[]}
          theme="light"
        />
      </div>
    </div>
  );
};

export default Login;