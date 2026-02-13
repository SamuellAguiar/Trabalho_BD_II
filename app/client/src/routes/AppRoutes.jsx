import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import PublicLayout from '../components/layout/PublicLayout';
import AdminLayout from '../components/layout/AdminLayout';

// Páginas Públicas
import Home from '../pages/public/Home';
import NovaOcorrencia from '../pages/public/NovaOcorrencia';
import Listagem from '../pages/public/Listagem';

// Páginas Admin
import LoginAdmin from '../pages/admin/LoginAdmin';
import Dashboard from '../pages/admin/Dashboard';
import GerenciarGenerico from '../pages/admin/GerenciarGenerico';
import GerenciarOcorrencias from '../pages/admin/GerenciarOcorrencias';
import DetalhesOcorrencia from '../pages/public/DetalhesOcorrencia';

const PrivateRoute = ({ children }) => {
     const isAuthenticated = localStorage.getItem('admin_token') === 'true';

     return isAuthenticated ? children : <Navigate to="/login-admin" replace />;
};

const AppRoutes = () => {
     return (
          <Routes>
               <Route path="/" element={<PublicLayout />}>
                    <Route index element={<Home />} />
                    <Route path="nova" element={<NovaOcorrencia />} />
                    <Route path="lista" element={<Listagem />} />
                    <Route path="ocorrencias/:id" element={<DetalhesOcorrencia />} />
               </Route>

               <Route path="/login-admin" element={<LoginAdmin />} />

               <Route path="/admin" element={
                    <PrivateRoute>
                         <AdminLayout />
                    </PrivateRoute>
               }>
                    <Route index element={<Dashboard />} />
                    <Route path="ocorrencias" element={<GerenciarOcorrencias />} />
                    <Route path="setores" element={<GerenciarGenerico titulo="Setores" endpoint="/setores" tipo="setores" />} />
                    <Route path="categorias" element={<GerenciarGenerico titulo="Categorias" endpoint="/categorias" tipo="categorias" />} />
               </Route>

               <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
     );
};

export default AppRoutes;