import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, ArrowRight } from 'lucide-react';
import './LoginAdmin.css';
import Button from '../../components/ui/Button';
import { Input, FormGroup } from '../../components/ui/FormComponents';
import { toast } from 'react-toastify';

const LoginAdmin = () => {
     const navigate = useNavigate();
     const [email, setEmail] = useState('');
     const [senha, setSenha] = useState('');
     const [error, setError] = useState('');

     const handleLogin = (e) => {
          e.preventDefault();

          if (email === 'admin' && senha === '1234') {
               localStorage.setItem('admin_token', 'true');
               toast.success("Bem-vindo de volta, Administrador!");
               navigate('/admin');
          } else {
               toast.error('Credenciais inválidas.');
               setError('Credenciais inválidas.');
          }
     };

     return (
          <div className="login-wrapper">
               <div className="login-card">
                    <header className="login-header">
                         <div className="login-icon-bg">
                              <Lock size={32} color="#6c63ff" />
                         </div>
                         <h2>Acesso Administrativo</h2>
                         <p>Entre com suas credenciais para gerenciar o sistema</p>
                    </header>

                    <form onSubmit={handleLogin}>
                         <FormGroup label="Usuário">
                              <Input
                                   icon={User}
                                   placeholder="Digite seu usuário"
                                   value={email}
                                   onChange={e => setEmail(e.target.value)}
                              />
                         </FormGroup>

                         <FormGroup label="Senha">
                              <Input
                                   icon={Lock}
                                   type="password"
                                   placeholder="Digite sua senha"
                                   value={senha}
                                   onChange={e => setSenha(e.target.value)}
                              />
                         </FormGroup>

                         {error && <div className="login-error">{error}</div>}

                         <div className="login-actions">
                              <Button type="submit" variant="solid" style={{ width: '100%' }}>
                                   Entrar no Sistema <ArrowRight size={18} style={{ marginLeft: 8 }} />
                              </Button>
                         </div>
                    </form>

                    <div className="login-footer">
                         <span onClick={() => navigate('/')}>Voltar para o site</span>
                    </div>
               </div>
          </div>
     );
};

export default LoginAdmin;