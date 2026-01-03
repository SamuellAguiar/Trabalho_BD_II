import { useState, useEffect } from 'react';
import { Search, MapPin, Calendar, Tag } from 'lucide-react';
import api from '../../services/api';
import './Listagem.css';

// Componentes
import { Select, Input } from '../../components/ui/FormComponents';
import Badge from '../../components/ui/Badge';

const Listagem = () => {
     // Estados de Dados
     const [ocorrencias, setOcorrencias] = useState([]);
     const [setores, setSetores] = useState([]);
     const [categorias, setCategorias] = useState([]);
     const [loading, setLoading] = useState(true);

     // Estados de Filtro
     const [busca, setBusca] = useState('');
     const [filtroStatus, setFiltroStatus] = useState('');
     const [filtroCategoria, setFiltroCategoria] = useState('');
     const [filtroSetor, setFiltroSetor] = useState('');

     // 1. Carregar Metadados (Selects)
     useEffect(() => {
          api.get('/metadados').then(res => {
               setSetores(res.data.setores);
               setCategorias(res.data.categorias);
          });
     }, []);

     // 2. Carregar Ocorrências (Sempre que um filtro mudar)
     useEffect(() => {
          const fetchOcorrencias = async () => {
               setLoading(true);
               try {
                    // Monta a Query String
                    const params = {
                         busca: busca,
                         status: filtroStatus,
                         categoriaId: filtroCategoria,
                         setorId: filtroSetor
                    };

                    const response = await api.get('/ocorrencias', { params });
                    setOcorrencias(response.data);
               } catch (error) {
                    console.error("Erro ao buscar:", error);
               } finally {
                    setLoading(false);
               }
          };

          // Pequeno delay para busca de texto (Debounce)
          const timeoutId = setTimeout(() => {
               fetchOcorrencias();
          }, 500);

          return () => clearTimeout(timeoutId);
     }, [busca, filtroStatus, filtroCategoria, filtroSetor]);

     // Função auxiliar para formatar data
     const formatData = (isoDate) => {
          const d = new Date(isoDate);
          return `${d.toLocaleDateString('pt-BR')} ${d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
     };

     return (
          <div className="listagem-wrapper centered-content">

               {/* Cabeçalho */}
               <header className="page-header">
                    <h1>Ocorrências</h1>
                    <p>Visualize e acompanhe todas as ocorrências registradas</p>
               </header>

               {/* Área de Filtros (Card Branco) */}
               <div className="filters-card">
                    <div className="filters-title">
                         <Search size={18} className="filter-icon-title" />
                         <span>Filtros</span>
                    </div>

                    <div className="filters-grid">
                         {/* Busca por Texto */}
                         <div className="search-col">
                              <Input
                                   icon={Search}
                                   placeholder="Buscar ocorrências..."
                                   value={busca}
                                   onChange={e => setBusca(e.target.value)}
                              />
                         </div>

                         {/* Selects */}
                         <div className="select-col">
                              <select
                                   className="form-input"
                                   value={filtroStatus}
                                   onChange={e => setFiltroStatus(e.target.value)}
                              >
                                   <option value="">Todos os Status</option>
                                   <option value="PENDENTE">Pendente</option>
                                   <option value="ANALISANDO">Em Andamento</option>
                                   <option value="RESOLVIDO">Resolvido</option>
                              </select>
                         </div>

                         <div className="select-col">
                              <Select
                                   options={categorias}
                                   placeholder="Todas as Categorias"
                                   value={filtroCategoria}
                                   onChange={e => setFiltroCategoria(e.target.value)}
                              />
                         </div>

                         <div className="select-col">
                              <Select
                                   options={setores}
                                   placeholder="Todos os Setores"
                                   value={filtroSetor}
                                   onChange={e => setFiltroSetor(e.target.value)}
                              />
                         </div>
                    </div>
               </div>

               {/* Contador de Resultados */}
               <div className="results-count">
                    Mostrando {ocorrencias.length} ocorrência(s)
               </div>

               {/* Lista de Cards */}
               <div className="occurrences-list">
                    {loading ? (
                         <p className="loading-text">Carregando...</p>
                    ) : ocorrencias.length === 0 ? (
                         <div className="empty-state">Nenhuma ocorrência encontrada.</div>
                    ) : (
                         ocorrencias.map((item, index) => (
                              <div key={item._id} className="occurrence-card">
                                   <div className="card-header">
                                        <h3 className="occurrence-title">
                                             Ocorrência #{item._id.slice(-6).toUpperCase()}
                                        </h3>
                                        <Badge status={item.status} />
                                   </div>

                                   <p className="occurrence-desc">{item.descricao}</p>

                                   <div className="card-footer">
                                        <div className="meta-item">
                                             <Tag size={16} />
                                             <span>{item.nome_categoria}</span>
                                        </div>

                                        <div className="meta-item">
                                             <MapPin size={16} />
                                             <span>{item.nome_setor}</span>
                                        </div>

                                        <div className="meta-item date">
                                             <Calendar size={16} />
                                             <span>{formatData(item.data_hora)}</span>
                                        </div>
                                   </div>
                              </div>
                         ))
                    )}
               </div>
          </div>
     );
};

export default Listagem;