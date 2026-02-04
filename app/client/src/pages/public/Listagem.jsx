import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
     Search, Filter, MapPin, Calendar, Tag, AlertCircle,
     ChevronDown, Image as ImageIcon
} from 'lucide-react';
import api, { getImageUrl } from '../../services/api';
import './Listagem.css';

const Listagem = () => {
     const navigate = useNavigate();
     const [ocorrencias, setOcorrencias] = useState([]);
     const [loading, setLoading] = useState(true);

     // Filtros
     const [busca, setBusca] = useState('');
     const [filtroStatus, setFiltroStatus] = useState('');
     const [filtroCategoria, setFiltroCategoria] = useState('');
     const [filtroSetor, setFiltroSetor] = useState('');
     const [dataInicio, setDataInicio] = useState('');
     const [dataFim, setDataFim] = useState('');

     // Listas auxiliares para selects
     const [categorias, setCategorias] = useState([]);
     const [setores, setSetores] = useState([]);

     useEffect(() => {
          carregarAuxiliares();
          carregarOcorrencias();
     }, []);

     // Recarrega sempre que um filtro mudar
     useEffect(() => {
          const delayDebounce = setTimeout(() => {
               carregarOcorrencias();
          }, 500); // Espera usuário parar de digitar
          return () => clearTimeout(delayDebounce);
     }, [busca, filtroStatus, filtroCategoria, filtroSetor, dataInicio, dataFim]);

     async function carregarAuxiliares() {
          try {
               const [resCat, resSet] = await Promise.all([
                    api.get('/categorias'),
                    api.get('/setores')
               ]);
               setCategorias(resCat.data);
               setSetores(resSet.data);
          } catch (error) {
               console.error("Erro ao carregar filtros", error);
          }
     }

     async function carregarOcorrencias() {
          setLoading(true);
          try {
               // Monta a Query String
               const params = new URLSearchParams();
               if (busca) params.append('busca', busca);
               if (filtroStatus) params.append('status', filtroStatus);
               if (filtroCategoria) params.append('categoriaId', filtroCategoria);
               if (filtroSetor) params.append('setorId', filtroSetor);
               if (dataInicio) params.append('dataInicio', dataInicio);
               if (dataFim) params.append('dataFim', dataFim);

               const response = await api.get(`/ocorrencias?${params.toString()}`);
               setOcorrencias(response.data);
          } catch (error) {
               console.error("Erro ao listar", error);
          } finally {
               setLoading(false);
          }
     }

     const getStatusColor = (status) => {
          switch (status) {
               case 'PENDENTE': return 'status-pendente';
               case 'ANALISANDO': return 'status-analisando';
               case 'RESOLVIDO': return 'status-resolvido';
               default: return 'status-default';
          }
     };

     // --- NOVA LÓGICA DE DATA PARA LISTAGEM ---
     const formatarData = (item) => {
          // Se o usuário informou "quando aconteceu", mostramos essa data.
          // Se não, mostramos a data de registro (data_criacao).
          // Se for um dado antigo que só tem data_hora, usamos ela.
          const dataParaExibir = item.data_ocorrencia || item.data_criacao || item.data_hora;

          if (!dataParaExibir) return 'Data N/D';

          return new Date(dataParaExibir).toLocaleString('pt-BR', {
               day: '2-digit', month: '2-digit', year: 'numeric',
               hour: '2-digit', minute: '2-digit'
          });
     };

     // Função para checar e exibir localização
     const renderLocalizacao = (geo) => {
          // GeoJSON no Mongo é { type: 'Point', coordinates: [lng, lat] }
          if (geo && geo.coordinates && geo.coordinates.length === 2) {
               const [lng, lat] = geo.coordinates;
               return (
                    <span className="geo-tag">
                         <MapPin size={14} style={{ marginRight: 4 }} />
                         {lat.toFixed(4)}, {lng.toFixed(4)}
                    </span>
               );
          }
          return <span className="geo-tag empty">Sem localização</span>;
     };

     return (
          <div className="listagem-wrapper">

               {/* Cabeçalho */}
               <div className="page-header">
                    <h1>Ocorrências</h1>
                    <p>Visualize e acompanhe todas as ocorrências registradas</p>
               </div>

               {/* Card de Filtros */}
               <div className="filters-card">
                    <div className="filters-title">
                         <Filter size={18} /> Filtros
                    </div>

                    <div className="filters-grid">
                         {/* Busca Textual */}
                         <div className="search-col">
                              <input
                                   type="text"
                                   className="form-input"
                                   placeholder="🔍 Buscar ocorrências..."
                                   value={busca}
                                   onChange={(e) => setBusca(e.target.value)}
                              />
                         </div>

                         {/* Selects */}
                         <select className="form-input" value={filtroStatus} onChange={e => setFiltroStatus(e.target.value)}>
                              <option value="">Todos os Status</option>
                              <option value="PENDENTE">Pendente</option>
                              <option value="ANALISANDO">Em Andamento</option>
                              <option value="RESOLVIDO">Resolvido</option>
                         </select>

                         <select className="form-input" value={filtroCategoria} onChange={e => setFiltroCategoria(e.target.value)}>
                              <option value="">Todas as Categorias</option>
                              {categorias.map(c => <option key={c._id} value={c._id}>{c.nome}</option>)}
                         </select>

                         <select className="form-input" value={filtroSetor} onChange={e => setFiltroSetor(e.target.value)}>
                              <option value="">Todos os Setores</option>
                              {setores.map(s => <option key={s._id} value={s._id}>{s.nome}</option>)}
                         </select>

                         {/* Datas */}
                         <div className="date-filter-group">
                              <input type="date" className="form-input" value={dataInicio} onChange={e => setDataInicio(e.target.value)} />
                              <span className="date-separator">até</span>
                              <input type="date" className="form-input" value={dataFim} onChange={e => setDataFim(e.target.value)} />
                         </div>
                    </div>
               </div>

               {/* Lista de Cards */}
               <div className="results-count">Mostrando {ocorrencias.length} ocorrência(s)</div>

               <div className="occurrences-list">
                    {loading ? (
                         <div className="loading-text">Carregando dados...</div>
                    ) : ocorrencias.length === 0 ? (
                         <div className="empty-state">Nenhuma ocorrência encontrada.</div>
                    ) : (
                         ocorrencias.map((item) => (
                              <div key={item._id} className="occurrence-card" onClick={() => navigate(`/ocorrencias/${item._id}`)}>

                                   <div className="card-header">
                                        <div className="occurrence-title">
                                             Ocorrência #{item._id.slice(-6).toUpperCase()}
                                        </div>
                                        <span className={`status-badge ${getStatusColor(item.status)}`}>
                                             {item.status === 'ANALISANDO' ? 'Em Andamento' :
                                                  item.status.charAt(0) + item.status.slice(1).toLowerCase()}
                                        </span>
                                   </div>

                                   <div className="occurrence-desc">
                                        {item.descricao}
                                   </div>

                                   {/* Miniatura da Foto (Se houver) */}
                                   {item.anexos && item.anexos.length > 0 && (
                                        <div className="card-attachment-preview">
                                             <img
                                                  src={getImageUrl(item.anexos[0].caminho_arquivo)}
                                                  alt="Anexo"
                                                  className="thumb-img"
                                             />
                                             {item.anexos.length > 1 && <span className="more-photos">+{item.anexos.length - 1}</span>}
                                        </div>
                                   )}

                                   <div className="card-footer">
                                        <div className="meta-item">
                                             <Tag size={16} /> {item.nome_categoria || 'Sem Categoria'}
                                        </div>
                                        <div className="meta-item">
                                             <MapPin size={16} /> {item.nome_setor || 'Sem Setor'}
                                        </div>

                                        {/* AQUI É ONDE APARECE A LOCALIZAÇÃO GPS */}
                                        <div className="meta-item">
                                             {renderLocalizacao(item.localizacao_geo)}
                                        </div>

                                        {/* AQUI USAMOS A NOVA FUNÇÃO DE DATA */}
                                        <div className="meta-item date">
                                             <Calendar size={16} /> {formatarData(item)}
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