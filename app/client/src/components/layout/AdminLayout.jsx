import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Map, List, LogOut, FileText } from 'lucide-react';
import './AdminLayout.css';

const AdminLayout = () => {
     const location = useLocation();
     const navigate = useNavigate();

     // Função para marcar o link ativo
     const isActive = (path) => {
          // Verifica se a URL atual é exatamente o path ou se começa com ele (para sub-rotas)
          // O 'end' prop do NavLink faria isso, mas com Link manual fazemos assim:
          if (path === '/admin' && location.pathname !== '/admin') return '';
          return location.pathname.startsWith(path) ? 'active' : '';
     };

     const handleLogout = (e) => {
          e.preventDefault();
          // Limpa o token de autenticação
          localStorage.removeItem('admin_token');
          // Redireciona para a tela de login
          navigate('/login-admin');
     };

     return (
          <div className="admin-layout">
               {/* --- SIDEBAR FIXA --- */}
               <aside className="admin-sidebar">
                    <div className="sidebar-header">
                         <h3>Painel Admin</h3>
                    </div>

                    <nav className="sidebar-nav">
                         <Link to="/admin" className={`sidebar-link ${isActive('/admin')}`}>
                              <LayoutDashboard size={20} />
                              <span>Visão Geral</span>
                         </Link>

                         <Link to="/admin/ocorrencias" className={`sidebar-link ${isActive('/admin/ocorrencias')}`}>
                              <FileText size={20} />
                              <span>Ocorrências</span>
                         </Link>

                         <Link to="/admin/setores" className={`sidebar-link ${isActive('/admin/setores')}`}>
                              <Map size={20} />
                              <span>Gerenciar Setores</span>
                         </Link>

                         <Link to="/admin/categorias" className={`sidebar-link ${isActive('/admin/categorias')}`}>
                              <List size={20} />
                              <span>Gerenciar Categorias</span>
                         </Link>
                    </nav>

                    <div className="sidebar-footer">
                         <a href="#" onClick={handleLogout} className="sidebar-link logout">
                              <LogOut size={20} />
                              <span>Sair do Sistema</span>
                         </a>
                    </div>
               </aside>

               {/* --- ÁREA DE CONTEÚDO --- */}
               <main className="admin-content">
                    <header className="admin-topbar">
                         <h2>Área Restrita</h2>
                         <span className="badge-user">Administrador</span>
                    </header>

                    <div className="content-wrapper">
                         {/* Aqui as páginas (Dashboard, GerenciarSetores, etc) são renderizadas */}
                         <Outlet />
                    </div>
               </main>
          </div>
     );
};

export default AdminLayout;