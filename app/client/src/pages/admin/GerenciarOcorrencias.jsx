import { useEffect, useState } from 'react';
import { Trash2, Search, Save, X, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import './GerenciarGenerico.css'; // Reusa o mesmo CSS!
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';

const GerenciarOcorrencias = () => {
     const navigate = useNavigate();
     const [ocorrencias, setOcorrencias] = useState([]);
     const [loading, setLoading] = useState(true);

     // Estado para Edição Rápida de Status
     const [editandoId, setEditandoId] = useState(null);
     const [novoStatus, setNovoStatus] = useState('');

     const carregarDados = async () => {
          setLoading(true);
          try {
               const response = await api.get('/ocorrencias'); // Traz todas
               setOcorrencias(response.data);
          } catch (error) {
               console.error("Erro ao carregar:", error);
          } finally {
               setLoading(false);
          }
     };

     useEffect(() => {
          carregarDados();
     }, []);

     const handleExcluir = async (id) => {
          if (!confirm('Tem certeza que deseja apagar esta ocorrência? Isso é irreversível.')) return;
          try {
               await api.delete(`/ocorrencias/${id}`);
               carregarDados();
          } catch (error) {
               alert('Erro ao excluir.');
          }
     };

     const startEdit = (item) => {
          setEditandoId(item._id);
          setNovoStatus(item.status);
     };

     const handleSalvarStatus = async () => {
          try {
               // Chama a rota PATCH que criamos no backend
               await api.patch(`/ocorrencias/${editandoId}/status`, { status: novoStatus });
               setEditandoId(null);
               carregarDados();
          } catch (error) {
               alert('Erro ao atualizar status.');
          }
     };

     return (
          <div className="gerenciar-container full-width-list">
               <header className="gerenciar-header">
                    <div>
                         <h1>Gerenciar Ocorrências</h1>
                         <p>Monitore, atualize status ou remova registros</p>
                    </div>
                    {/* Botão para Adicionar Nova (Redireciona para o form público) */}
                    <Button onClick={() => navigate('/nova')} variant="solid">
                         <Plus size={18} style={{ marginRight: 8 }} /> Nova Ocorrência
                    </Button>
               </header>

               <div className="items-list">
                    {loading ? <p>Carregando...</p> : ocorrencias.map(item => (
                         <div key={item._id} className="item-card occurrence-admin-row">

                              <div className="occurrence-info">
                                   <span className="item-desc">{item.descricao}</span>
                                   <div className="item-meta">
                                        <span className="meta-tag">{item.nome_setor}</span>
                                        <span className="meta-tag">{item.nome_categoria}</span>
                                        <span className="meta-date">{new Date(item.data_hora).toLocaleDateString()}</span>
                                   </div>
                              </div>

                              <div className="occurrence-actions">
                                   {/* Se estiver editando, mostra Select. Se não, mostra Badge */}
                                   {editandoId === item._id ? (
                                        <div className="status-edit-group">
                                             <select
                                                  value={novoStatus}
                                                  onChange={e => setNovoStatus(e.target.value)}
                                                  className="select-mini"
                                             >
                                                  <option value="PENDENTE">Pendente</option>
                                                  <option value="ANALISANDO">Analisando</option>
                                                  <option value="RESOLVIDO">Resolvido</option>
                                             </select>
                                             <button className="btn-mini-save" onClick={handleSalvarStatus}><Save size={16} /></button>
                                             <button className="btn-mini-cancel" onClick={() => setEditandoId(null)}><X size={16} /></button>
                                        </div>
                                   ) : (
                                        <div className="status-display" onClick={() => startEdit(item)} title="Clique para alterar status">
                                             <Badge status={item.status} />
                                        </div>
                                   )}

                                   <button className="btn-delete" onClick={() => handleExcluir(item._id)}>
                                        <Trash2 size={18} />
                                   </button>
                              </div>

                         </div>
                    ))}
               </div>
          </div>
     );
};

export default GerenciarOcorrencias;