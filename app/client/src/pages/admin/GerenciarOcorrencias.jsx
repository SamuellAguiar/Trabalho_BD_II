import { useEffect, useState } from 'react';
import { Trash2, Save, X, Plus, ImageOff } from 'lucide-react'; 
import { useNavigate } from 'react-router-dom';
import api, { getImageUrl } from '../../services/api';
import './GerenciarGenerico.css';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { toast } from 'react-toastify';

const GerenciarOcorrencias = () => {
     const navigate = useNavigate();
     const [ocorrencias, setOcorrencias] = useState([]);
     const [loading, setLoading] = useState(true);

     const [editandoId, setEditandoId] = useState(null);
     const [novoStatus, setNovoStatus] = useState('');

     const confirmToast = (mensagem) => new Promise((resolve) => {
          const toastId = toast.info(({ closeToast }) => (
               <div className="toast-confirm">
                    <p>{mensagem}</p>
                    <div className="toast-confirm__actions">
                         <button
                              className="toast-btn toast-btn-danger"
                              onClick={() => {
                                   resolve(true);
                                   toast.dismiss(toastId);
                                   closeToast();
                              }}
                         >
                              Remover
                         </button>
                         <button
                              className="toast-btn"
                              onClick={() => {
                                   resolve(false);
                                   toast.dismiss(toastId);
                                   closeToast();
                              }}
                         >
                              Cancelar
                         </button>
                    </div>
               </div>
          ), {
               autoClose: false,
               closeOnClick: false,
               draggable: false,
          });
     });

     const carregarDados = async () => {
          setLoading(true);
          try {
               const response = await api.get('/ocorrencias');
               setOcorrencias(response.data);
          } catch (error) {
               console.error("Erro ao carregar:", error);
               toast.error("Erro ao carregar ocorrências.");
          } finally {
               setLoading(false);
          }
     };

     useEffect(() => {
          carregarDados();
     }, []);

     const handleExcluir = async (id) => {
          const confirmado = await confirmToast("Deseja excluir esta ocorrência? Isso é irreversível.");
          if (!confirmado) return;
          try {
               await api.delete(`/ocorrencias/${id}`);
               carregarDados();
               toast.success("Ocorrência excluída.");
          } catch (error) {
               toast.error('Erro ao excluir.');
          }
     };

     const startEdit = (item) => {
          setEditandoId(item._id);
          setNovoStatus(item.status);
     };

     const handleSalvarStatus = async () => {
          try {
               await api.patch(`/ocorrencias/${editandoId}/status`, { status: novoStatus });
               setEditandoId(null);
               carregarDados();
               toast.success("Status atualizado!");
          } catch (error) {
               toast.error('Erro ao atualizar status.');
          }
     };

     const handleDeletarFoto = async (idOcorrencia, nomeArquivo) => {
          const confirmado = await confirmToast("Deseja remover esta imagem?");
          if (!confirmado) return;
          try {
               await api.delete(`/ocorrencias/${idOcorrencia}/fotos/${nomeArquivo}`);
               toast.success("Imagem removida.");
               carregarDados();
          } catch (error) {
               console.error(error);
               toast.error("Erro ao remover imagem.");
          }
     };

     return (
          <div className="gerenciar-container full-width-list">
               <header className="gerenciar-header">
                    <div>
                         <h1>Gerenciar Ocorrências</h1>
                         <p>Monitore, atualize status ou remova registros</p>
                    </div>
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

                                   {item.anexos && item.anexos.length > 0 && (
                                        <div className="admin-photos-row">
                                             {item.anexos.map((anexo, idx) => {
                                                  const nomeArquivo = anexo.caminho_arquivo.split('/').pop();
                                                  return (
                                                       <div key={idx} className="admin-thumb-wrapper">
                                                            <a href={getImageUrl(anexo.caminho_arquivo)} target="_blank" rel="noreferrer">
                                                                 <img
                                                                      src={getImageUrl(anexo.caminho_arquivo)}
                                                                      alt="Evidência"
                                                                      className="admin-thumb"
                                                                      onError={(e) => e.target.style.display = 'none'} 
                                                                 />
                                                            </a>
                                                            <button
                                                                 className="btn-delete-photo"
                                                                 onClick={() => handleDeletarFoto(item._id, nomeArquivo)}
                                                                 title="Remover foto imprópria"
                                                            >
                                                                 <ImageOff size={12} />
                                                            </button>
                                                       </div>
                                                  );
                                             })}
                                        </div>
                                   )}
                              </div>

                              <div className="occurrence-actions">
                                   {editandoId === item._id ? (
                                        <div className="status-edit-group">
                                             <select
                                                  value={novoStatus}
                                                  onChange={e => setNovoStatus(e.target.value)}
                                                  className="select-mini"
                                             >
                                                  <option value="PENDENTE">Pendente</option>
                                                  <option value="ANALISANDO">Em Andamento</option>
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