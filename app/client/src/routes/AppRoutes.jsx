import { Routes, Route, Navigate } from 'react-router-dom';

// Páginas Públicas
import Home from '../pages/public/Home';
import NovaOcorrencia from '../pages/public/NovaOcorrencia'; // Certifique-se que este arquivo existe
import Listagem from '../pages/public/Listagem';             // Certifique-se que este arquivo existe

import PublicLayout from '../components/layout/PublicLayout';

// Placeholder para Admin (Faremos depois)
const AdminLayout = () => <div style={{ padding: 20 }}><h1>Área Admin (Em construção)</h1></div>;
const LoginAdmin = () => <div style={{ padding: 20 }}><h1>Login (Em construção)</h1></div>;

const AppRoutes = () => {
     return (
          <Routes>
               {/* --- FLUXO PÚBLICO --- */}
               {/* O PublicLayout contém o Header e Footer */}
               <Route path="/" element={<PublicLayout />}>

                    {/* Rota Index: É a Home Page */}
                    <Route index element={<Home />} />

                    {/* Rota: /nova -> Tela de Cadastro */}
                    <Route path="nova" element={<NovaOcorrencia />} />

                    {/* Rota: /lista -> Tela de Visualização  */}
                    <Route path="lista" element={<Listagem />} /> 

               </Route>

               {/* --- FLUXO ADMIN (Futuro) --- */}
               <Route path="/admin" element={<AdminLayout />} />
               <Route path="/login-admin" element={<LoginAdmin />} />

               {/* Rota de Erro (404) - Redireciona para Home */}
               <Route path="*" element={<Navigate to="/" replace />} />
          </Routes >
     );
};

export default AppRoutes;