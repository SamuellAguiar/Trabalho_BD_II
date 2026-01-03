import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Map, List, LogOut } from 'lucide-react';
import './AdminLayout.css';

const AdminLayout = () => {
     const location = useLocation();
     const isActive = (path) => location.pathname === path ? 'active' : '';

     return (
          <div className="admin-container">
               {/* Sidebar Lateral */}
               <aside className="admin-sidebar">
                    <div className="sidebar-header">
                         <h3>Painel Admin</h3>
                    </div>

                    <nav className="sidebar-nav">
                         <Link to="/admin" className={`sidebar-link ${isActive('/admin')}`}>
                              <LayoutDashboard size={20} />
                              <span>Visão Geral</span>
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
                         <Link to="/" className="sidebar-link logout">
                              <LogOut size={20} />
                              <span>Sair do Sistema</span>
                         </Link>
                    </div>
               </aside>

               {/* Área de Conteúdo */}
               <main className="admin-content">
                    <header className="admin-topbar">
                         <h2>Olá, Administrador</h2>
                         <span className="badge-user">Admin</span>
                    </header>

                    <div className="admin-page-wrapper">
                         <Outlet /> {/* Aqui entra o Dashboard.jsx ou as tabelas */}
                    </div>
               </main>
          </div>
     );
};

export default AdminLayout;