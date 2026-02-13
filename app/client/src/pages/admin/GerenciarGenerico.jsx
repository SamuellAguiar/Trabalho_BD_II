import { useEffect, useState } from 'react';
import { Trash2, Plus, Save, X, Pencil } from 'lucide-react';
import api from '../../services/api';
import './GerenciarGenerico.css';
import Button from '../../components/ui/Button';
import { toast } from 'react-toastify'; 

const GerenciarGenerico = ({ titulo, endpoint, tipo }) => {
     const [itens, setItens] = useState([]);
     const [loading, setLoading] = useState(true);

     // Estado para Adição
     const [adicionando, setAdicionando] = useState(false);
     const [novoNome, setNovoNome] = useState('');

     // Estado para Edição
     const [editandoId, setEditandoId] = useState(null);
     const [nomeEdicao, setNomeEdicao] = useState('');

     const carregarDados = async () => {
          setLoading(true);
          try {
               const response = await api.get(endpoint);
               const lista = response.data[tipo] || response.data;
               setItens(lista);
          } catch (error) {
               console.error("Erro ao carregar:", error);
               toast.error("Erro ao carregar dados.");
          } finally {
               setLoading(false);
          }
     };

     useEffect(() => {
          carregarDados();
          setAdicionando(false);
          setEditandoId(null);
     }, [endpoint]);


     const handleAdicionar = async () => {
          if (!novoNome.trim()) return;
          try {
               await api.post(endpoint, { nome: novoNome });
               setNovoNome('');
               setAdicionando(false);
               carregarDados();
               toast.success(`${titulo} adicionado com sucesso!`);
          } catch (error) {
               const msg = error.response?.data?.erro || error.message;
               toast.error(`Erro ao cadastrar: ${msg}`);
          }
     };

     const handleExcluir = async (id) => {
          if (!confirm('Tem certeza? Se houver ocorrências vinculadas, não será possível excluir.')) return;
          try {
               await api.delete(`${endpoint}/${id}`);
               carregarDados();
               toast.success('Excluído com sucesso!');
          } catch (error) {
               const msg = error.response?.data?.erro || "Erro desconhecido";
               toast.error(`Erro ao excluir: ${msg}`);
          }
     };

     const startEdit = (item) => {
          setEditandoId(item._id);
          setNomeEdicao(item.nome);
     };

     const handleSalvarEdicao = async () => {
          try {
               await api.put(`${endpoint}/${editandoId}`, { nome: nomeEdicao });
               setEditandoId(null);
               carregarDados();
               toast.success('Atualizado com sucesso!');
          } catch (error) {
               const msg = error.response?.data?.erro || error.message;
               toast.error(`Erro ao atualizar: ${msg}`);
          }
     };

     return (
          <div className="gerenciar-container">
               <header className="gerenciar-header">
                    <div>
                         <h1>Gerenciar {titulo}</h1>
                         <p>Adicione, atualize ou remova registros do sistema</p>
                    </div>
                    <Button onClick={() => setAdicionando(true)} variant="solid">
                         <Plus size={18} style={{ marginRight: 8 }} /> Novo {titulo}
                    </Button>
               </header>

               {adicionando && (
                    <div className="add-card">
                         <input
                              type="text"
                              placeholder={`Nome do novo ${titulo}...`}
                              value={novoNome}
                              onChange={e => setNovoNome(e.target.value)}
                              className="input-add"
                              autoFocus
                         />
                         <div className="add-actions">
                              <button className="btn-save" onClick={handleAdicionar}>
                                   <Save size={18} /> Salvar
                              </button>
                              <button className="btn-cancel-icon" onClick={() => setAdicionando(false)}>
                                   <X size={18} />
                              </button>
                         </div>
                    </div>
               )}

               {/* Lista de Itens */}
               <div className="items-list">
                    {loading ? <p>Carregando...</p> : itens.map(item => (
                         <div key={item._id} className="item-card">

                              {editandoId === item._id ? (
                                   <div className="edit-mode-row">
                                        <input
                                             value={nomeEdicao}
                                             onChange={e => setNomeEdicao(e.target.value)}
                                             className="input-edit"
                                        />
                                        <button className="btn-mini-save" onClick={handleSalvarEdicao}>
                                             <Save size={16} />
                                        </button>
                                        <button className="btn-mini-cancel" onClick={() => setEditandoId(null)}>
                                             <X size={16} />
                                        </button>
                                   </div>
                              ) : (
                                   <span className="item-name">{item.nome}</span>
                              )}

                              {/* Botões de Ação */}
                              <div className="card-actions">
                                   <button
                                        className="btn-edit"
                                        onClick={() => startEdit(item)}
                                        disabled={editandoId !== null}
                                        title="Editar"
                                   >
                                        <Pencil size={18} />
                                   </button>
                                   <button
                                        className="btn-delete"
                                        onClick={() => handleExcluir(item._id)}
                                        disabled={editandoId !== null}
                                        title="Excluir"
                                   >
                                        <Trash2 size={18} />
                                   </button>
                              </div>
                         </div>
                    ))}
                    {!loading && itens.length === 0 && <p className="empty">Nenhum registro encontrado.</p>}
               </div>
          </div>
     );
};

export default GerenciarGenerico;