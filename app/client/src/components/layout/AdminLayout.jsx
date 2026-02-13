import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Map, List, LogOut, FileText } from 'lucide-react'; 
import './AdminLayout.css';

const AdminLayout = () => {
     const location = useLocation();
     const navigate = useNavigate();

     const isActive = (path) => {
          if (path === '/admin' && location.pathname !== '/admin') return '';
          return location.pathname.startsWith(path) ? 'active' : '';
     };

     const handleLogout = (e) => {
          e.preventDefault();
          localStorage.removeItem('admin_token');
          navigate('/login-admin');
     };

     return (
          <div className="admin-layout">
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
                              <span>Setores</span>
                         </Link>

                         <Link to="/admin/categorias" className={`sidebar-link ${isActive('/admin/categorias')}`}>
                              <List size={20} />
                              <span>Categorias</span>
                         </Link>
                    </nav>
               </aside>

               <main className="admin-content">
                    <header className="admin-topbar">
                         <h2>Área Restrita</h2>

                         <div className="topbar-actions">
                              <span className="badge-user">Administrador</span>

                              <button onClick={handleLogout} className="btn-header-logout" title="Sair do Sistema">
                                   <LogOut size={20} />
                              </button>
                         </div>
                    </header>

                    <div className="content-wrapper">
                         <Outlet />
                    </div>
               </main>
          </div>
     );
};

export default AdminLayout;