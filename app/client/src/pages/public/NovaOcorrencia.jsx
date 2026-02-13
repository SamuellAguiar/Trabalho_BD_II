import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
import 'leaflet/dist/leaflet.css';
import 'leaflet-geosearch/dist/geosearch.css';
import { UploadCloud, MapPin, AlertCircle, CheckCircle, ArrowLeft, Search } from 'lucide-react';
import api from '../../services/api';
import './NovaOcorrencia.css';

const SearchField = ({ setPosition }) => {
     const map = useMap();
     useEffect(() => {
          const provider = new OpenStreetMapProvider();
          const searchControl = new GeoSearchControl({
               provider: provider,
               style: 'bar',
               showMarker: false,
               autoClose: true,
               retainZoomLevel: false,
               animateZoom: true,
               keepResult: true,
               searchLabel: 'Busque um endereço...',
          });
          map.addControl(searchControl);
          map.on('geosearch/showlocation', (result) => {
               if (result.location) setPosition({ lat: result.location.y, lng: result.location.x });
          });
          return () => map.removeControl(searchControl);
     }, [map, setPosition]);
     return null;
};

function LocationMarker({ position, setPosition }) {
     const map = useMapEvents({
          click(e) {
               setPosition(e.latlng);
               map.flyTo(e.latlng, map.getZoom());
          },
     });
     return position === null ? null : <Marker position={position}></Marker>;
}

const NovaOcorrencia = () => {
     const navigate = useNavigate();
     const [loading, setLoading] = useState(false);
     const [error, setError] = useState('');

     const [descricao, setDescricao] = useState('');
     const [dataOcorrencia, setDataOcorrencia] = useState(''); // Estado para Data Manual
     const [setorId, setSetorId] = useState('');
     const [categoriaId, setCategoriaId] = useState('');
     const [fotos, setFotos] = useState([]);
     const [previewFotos, setPreviewFotos] = useState([]);
     const [position, setPosition] = useState(null);

     const [setores, setSetores] = useState([]);
     const [categorias, setCategorias] = useState([]);

     const centroInicial = [-20.398, -43.508];

     useEffect(() => {
          api.get('/setores').then(res => setSetores(res.data));
          api.get('/categorias').then(res => setCategorias(res.data));
     }, []);

     const handleFileChange = (e) => {
          const files = Array.from(e.target.files);
          if (files.length + fotos.length > 3) {
               alert("Máximo de 3 fotos permitidas.");
               return;
          }
          setFotos([...fotos, ...files]);
          const newPreviews = files.map(file => URL.createObjectURL(file));
          setPreviewFotos([...previewFotos, ...newPreviews]);
     };

     const handleSubmit = async (e) => {
          e.preventDefault();
          if (!descricao || !setorId || !categoriaId) {
               setError("Preencha todos os campos obrigatórios (*).");
               return;
          }
          if (!position) {
               setError("A localização é obrigatória. Marque no mapa.");
               return;
          }

          setLoading(true);
          const formData = new FormData();
          formData.append('descricao', descricao);

          if (dataOcorrencia) {
               formData.append('data_ocorrencia', dataOcorrencia);
          }

          formData.append('setorId', setorId);
          formData.append('categoriaId', categoriaId);
          formData.append('lat', position.lat);
          formData.append('lng', position.lng);
          fotos.forEach(foto => formData.append('fotos', foto));

          try {
               await api.post('/ocorrencias', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
               });
               alert("Ocorrência registrada!");
               navigate('/lista');
          } catch (err) {
               console.error(err);
               setError("Erro ao enviar. Tente novamente.");
          } finally {
               setLoading(false);
          }
     };

     return (
          <div className="nova-ocorrencia-wrapper">
               <div className="form-card">

                    <div className="form-header">
                         <h1>Registrar Nova Ocorrência</h1>
                         <p>Preencha o formulário abaixo com os detalhes da ocorrência</p>
                    </div>

                    {error && <div className="error-banner"><AlertCircle size={18} /> {error}</div>}

                    <form onSubmit={handleSubmit}>

                         <div className="form-group">
                              <label>Descrição <span className="required">*</span></label>
                              <textarea
                                   rows="4"
                                   placeholder="Descreva a ocorrência com o máximo de detalhes possível..."
                                   value={descricao}
                                   onChange={e => setDescricao(e.target.value)}
                              ></textarea>
                         </div>

                         <div className="form-group">
                              <label>Quando aconteceu? (Opcional)</label>
                              <input
                                   type="datetime-local"
                                   className="form-input-date"
                                   value={dataOcorrencia}
                                   onChange={e => setDataOcorrencia(e.target.value)}
                                   style={{
                                        padding: '12px',
                                        border: '1px solid #d1d5db',
                                        borderRadius: '8px',
                                        width: '100%',
                                        maxWidth: '300px'
                                   }}
                              />
                              <p style={{ fontSize: '0.8rem', color: '#9ca3af', marginTop: '4px' }}>
                                   Deixe em branco para usar a data de hoje (registro).
                              </p>
                         </div>

                         <div className="form-row">
                              <div className="form-group">
                                   <label>Categoria <span className="required">*</span></label>
                                   <select value={categoriaId} onChange={e => setCategoriaId(e.target.value)}>
                                        <option value="">Selecione...</option>
                                        {categorias.map(c => <option key={c._id} value={c._id}>{c.nome}</option>)}
                                   </select>
                              </div>

                              <div className="form-group">
                                   <label>Setor <span className="required">*</span></label>
                                   <select value={setorId} onChange={e => setSetorId(e.target.value)}>
                                        <option value="">Selecione...</option>
                                        {setores.map(s => <option key={s._id} value={s._id}>{s.nome}</option>)}
                                   </select>
                              </div>
                         </div>

                         <div className="form-group">
                              <label>Anexos (Fotos, Documentos)</label>
                              <div className="upload-container">
                                   <input
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        id="file-upload"
                                   />
                                   <label htmlFor="file-upload" className="upload-box">
                                        <div className="upload-icon-circle">
                                             <UploadCloud size={28} color="#6c63ff" />
                                        </div>
                                        <span>Clique para selecionar arquivos</span>
                                        <button type="button" className="btn-small-upload" onClick={() => document.getElementById('file-upload').click()}>
                                             Selecionar Arquivos
                                        </button>
                                   </label>
                              </div>

                              {previewFotos.length > 0 && (
                                   <div className="preview-row">
                                        {previewFotos.map((src, idx) => (
                                             <div key={idx} className="preview-thumb">
                                                  <img src={src} alt="preview" />
                                             </div>
                                        ))}
                                   </div>
                              )}
                         </div>

                         <div className="form-group">
                              <label>Geolocalização <span className="required">*</span></label>
                              <div className="map-frame">
                                   <MapContainer center={centroInicial} zoom={15} style={{ height: '300px', width: '100%' }}>
                                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OpenStreetMap' />
                                        <SearchField setPosition={setPosition} />
                                        <LocationMarker position={position} setPosition={setPosition} />
                                   </MapContainer>

                                   <div className={`geo-status ${position ? 'geo-ok' : ''}`}>
                                        {position ? (
                                             <><CheckCircle size={16} /> Localização capturada: {position.lat.toFixed(4)}, {position.lng.toFixed(4)}</>
                                        ) : (
                                             <><Search size={16} /> Pesquise ou clique no mapa para marcar</>
                                        )}
                                   </div>
                              </div>
                         </div>

                         <div className="form-actions">
                              <button type="submit" className="btn-primary" disabled={loading}>
                                   {loading ? 'Enviando...' : 'Registrar Ocorrência'}
                              </button>
                              <button type="button" className="btn-secondary" onClick={() => navigate('/')}>
                                   Cancelar
                              </button>
                         </div>

                    </form>
               </div>
          </div>
     );
};

export default NovaOcorrencia;