import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Calendar, Tag, ArrowLeft, Image as ImageIcon } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import api, { getImageUrl } from '../../services/api';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import './DetalhesOcorrencia.css';
import { toast } from 'react-toastify';

const DetalhesOcorrencia = () => {
     const { id } = useParams();
     const navigate = useNavigate();
     const [ocorrencia, setOcorrencia] = useState(null);
     const [loading, setLoading] = useState(true);

     useEffect(() => {
          api.get(`/ocorrencias/${id}`)
               .then(res => setOcorrencia(res.data))
               .catch(err => toast.error("Erro ao carregar detalhes."))
               .finally(() => setLoading(false));
     }, [id]);

     if (loading) return <div className="loading-centered">Carregando detalhes...</div>;
     if (!ocorrencia) return <div className="loading-centered">Ocorrência não encontrada.</div>;

     const lat = ocorrencia.localizacao_geo?.coordinates[1];
     const lng = ocorrencia.localizacao_geo?.coordinates[0];

     // --- LÓGICA DE DATA PARA DETALHES ---
     // Verifica qual data exibir
     const dataExibicao = ocorrencia.data_ocorrencia || ocorrencia.data_criacao || ocorrencia.data_hora;
     const labelData = ocorrencia.data_ocorrencia ? "Data do Ocorrido" : "Data do Registro";

     const dataFormatada = dataExibicao
          ? new Date(dataExibicao).toLocaleString('pt-BR')
          : 'N/D';

     return (
          <div className="detalhes-container centered-content">
               <Button onClick={() => navigate(-1)} variant="outline" style={{ marginBottom: '2rem' }}>
                    <ArrowLeft size={18} style={{ marginRight: 8 }} /> Voltar
               </Button>

               <div className="detalhes-card">
                    {/* Cabeçalho */}
                    <header className="detalhes-header">
                         <div className="header-top">
                              <h1>Detalhes da Ocorrência</h1>
                              <Badge status={ocorrencia.status} />
                         </div>
                         <span className="id-label">ID: {ocorrencia._id}</span>
                    </header>

                    {/* Informações Principais */}
                    <div className="detalhes-grid">
                         <div className="info-section">
                              <h3>Descrição</h3>
                              <p className="desc-text">{ocorrencia.descricao}</p>

                              <div className="meta-info">
                                   <div className="meta-row">
                                        <Tag size={18} /> <strong>Categoria:</strong> {ocorrencia.nome_categoria}
                                   </div>
                                   <div className="meta-row">
                                        <MapPin size={18} /> <strong>Setor:</strong> {ocorrencia.nome_setor}
                                   </div>
                                   <div className="meta-row">
                                        <Calendar size={18} /> <strong>{labelData}:</strong> {dataFormatada}
                                   </div>
                              </div>
                         </div>

                         {/* Mapa */}
                         <div className="map-section">
                              {lat && lng ? (
                                   <MapContainer center={[lat, lng]} zoom={16} style={{ height: '100%', width: '100%', borderRadius: '12px' }}>
                                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                        <Marker position={[lat, lng]}>
                                             <Popup>Local da Ocorrência</Popup>
                                        </Marker>
                                   </MapContainer>
                              ) : <p>Sem localização</p>}
                         </div>
                    </div>

                    {/* Galeria de Fotos */}
                    <div className="fotos-section">
                         <h3><ImageIcon size={20} style={{ marginRight: 8 }} /> Evidências / Fotos</h3>
                         <div className="fotos-grid">
                              {ocorrencia.anexos && ocorrencia.anexos.length > 0 ? (
                                   ocorrencia.anexos.map((anexo, index) => (
                                        <div key={index} className="foto-item">
                                             <a href={getImageUrl(anexo.caminho_arquivo)} target="_blank" rel="noopener noreferrer">
                                                  <img src={getImageUrl(anexo.caminho_arquivo)} alt={`Evidência ${index + 1}`} />
                                             </a>
                                        </div>
                                   ))
                              ) : (
                                   <p className="no-photos">Nenhuma foto anexada.</p>
                              )}
                         </div>
                    </div>
               </div>
          </div>
     );
};

export default DetalhesOcorrencia;