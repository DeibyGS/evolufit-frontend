import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import styles from './Calculator.module.scss';
import { useAuthStore } from '../../store/authStore';
import { toast } from 'sonner';
import Swal from 'sweetalert2';
import { BASE_URL } from '../../api/API';

export const Calculator = () => {
  const { token } = useAuthStore();
  
  // Estados de Formulario
  const [formData, setFormData] = useState({
    weight: '', height: '', age: '', gender: 'hombre', activity: '1.2'
  });
  const [errors, setErrors] = useState({});

  // Estados de Datos y Paginación (Modelo RM)
  const [results, setResults] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [isCalculated, setIsCalculated] = useState(false);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const LIMIT = 5;

  // Lógica de Paginación (Fetch Estilo RM)
  const fetchHistory = useCallback(async (isNextPage = false) => {
    if (!token) return;
    isNextPage ? setLoadingMore(true) : setLoading(true);

    try {
      const currentPage = isNextPage ? page + 1 : 1;
      const response = await fetch(`${BASE_URL}/health?page=${currentPage}&limit=${LIMIT}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      
      if (response.ok) {
        // Asumiendo que el backend devuelve { records: [], hasNextPage: boolean }
        // Si devuelve el array directo, ajustamos la lógica
        const newRecords = Array.isArray(data) ? data : (data.records || []);
        const hasMore = data.hasNextPage || false;

        setHistory(prev => isNextPage ? [...prev, ...newRecords] : newRecords);
        setHasNextPage(hasMore);
        setPage(currentPage);
      }
    } catch (error) { 
      toast.error("Error al cargar historial");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [token, page]);

  useEffect(() => {
    fetchHistory(false);
  }, [token]);

  // Memorias para el gráfico y medallas
  const chartData = useMemo(() => {
    return [...history]
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
      .map(record => ({
        fecha: new Date(record.createdAt).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' }),
        peso: record.weight,
        imc: record.imc
      }));
  }, [history]);

  const sortedHistory = useMemo(() => {
    return [...history].sort((a, b) => a.imc - b.imc);
  }, [history]);

  // Lógica de Cálculo
  const handleCalculate = (e) => {
    if(e) e.preventDefault();
    setErrors({});

    const { weight, height, age, gender, activity } = formData;
    const newErrors = {};

    if (!weight || parseFloat(weight) <= 0) newErrors.weight = "Peso requerido";
    if (!height || parseFloat(height) <= 0) newErrors.height = "Altura requerida";
    if (!age || parseInt(age) <= 0) newErrors.age = "Edad requerida";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return toast.error("Completa los datos correctamente 📊");
    }

    const w = Number(weight);
    const hMeters = Number(height) / 100;
    const imc = (w / (hMeters ** 2)).toFixed(1);
    const tmb = gender === 'hombre'
      ? (10 * w) + (6.25 * Number(height)) - (5 * Number(age)) + 5
      : (10 * w) + (6.25 * Number(height)) - (5 * Number(age)) - 161;
    
    setResults({
      weight: w,
      imc: Number(imc),
      tmb: Math.round(tmb),
      tdee: Math.round(tmb * Number(activity))
    });
    setIsCalculated(true);
    toast.success('Análisis listo para guardar');
  };

  const saveResults = async () => {
    try {
      const payload = {
        ...formData,
        ...results,
        weight: Number(formData.weight),
        height: Number(formData.height),
        age: Number(formData.age),
        activity: Number(formData.activity)
      };

      const res = await fetch(`${BASE_URL}/health`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json', 
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.errors && Array.isArray(data.errors)) {
          const apiErrors = {};
          data.errors.forEach(err => apiErrors[err.path] = err.message);
          setErrors(apiErrors);
        }
        throw new Error(data.message || 'Error al guardar');
      }

      toast.success('¡Evolución guardada! 🔥');
      setIsCalculated(false);
      setResults(null);
      setFormData({ weight: '', height: '', age: '', gender: 'hombre', activity: '1.2' });
      fetchHistory(false);
      
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: '¿Eliminar registro?',
      text: "Esta acción no se puede deshacer.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#FFA500',
      cancelButtonColor: '#222',
      confirmButtonText: 'Sí, borrar',
      background: '#141414', color: '#fff'
    });

    if (result.isConfirmed) {
      try {
        const res = await fetch(`${BASE_URL}/health/${id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          toast.success("Registro eliminado");
          fetchHistory(false);
        }
      } catch (error) { toast.error("Error al eliminar"); }
    }
  };

  const getMedalByIndex = (index) => {
    if (sortedHistory.length < 3) return null;
    if (index === 0) return { type: styles.gold, label: 'ORO', icon: '🥇' };
    if (index === 1) return { type: styles.silver, label: 'PLATA', icon: '🥈' };
    if (index === 2) return { type: styles.bronze, label: 'BRONCE', icon: '🥉' };
    return null;
  };

  return (
    <div className={styles.calculatorContainer}>
      <header className={styles.header}>
        <div className={styles.titleSection}>
          <h2>Calculadora <span>Salud & Fitness</span></h2>
          <p>Gestiona tus métricas y compite por tus mejores marcas.</p>
        </div>
      </header>

      <main className={styles.mainGrid}>
        <section className={styles.formSide}>
          <div className={styles.form}>
            <div className={styles.radioOptions}>
              {['hombre', 'mujer'].map(g => (
                <label key={g} className={`${styles.radioLabel} ${formData.gender === g ? styles.active : ''}`}>
                  <input 
                    type="radio" 
                    value={g} 
                    checked={formData.gender === g} 
                    onChange={(e) => {
                      setFormData({ ...formData, gender: e.target.value });
                      setIsCalculated(false);
                    }} 
                  />
                  <span>{g === 'hombre' ? 'Hombre' : 'Mujer'}</span>
                </label>
              ))}
            </div>

            <div className={styles.row}>
              <div className={styles.inputGroup}>
                <label>Edad</label>
                <input 
                  type="number" 
                  value={formData.age} 
                  className={errors.age ? styles.inputError : ''}
                  onChange={(e) => {
                    setFormData({ ...formData, age: e.target.value });
                    setErrors(prev => ({...prev, age: ''}));
                    setIsCalculated(false);
                  }} 
                />
                {errors.age && <span className={styles.errorText}>{errors.age}</span>}
              </div>
              <div className={styles.inputGroup}>
                <label>Peso (kg)</label>
                <input 
                  type="number" 
                  value={formData.weight} 
                  className={errors.weight ? styles.inputError : ''}
                  onChange={(e) => {
                    setFormData({ ...formData, weight: e.target.value });
                    setErrors(prev => ({...prev, weight: ''}));
                    setIsCalculated(false);
                  }} 
                />
                {errors.weight && <span className={styles.errorText}>{errors.weight}</span>}
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label>Altura (cm)</label>
              <input 
                type="number" 
                value={formData.height} 
                className={errors.height ? styles.inputError : ''}
                onChange={(e) => {
                  setFormData({ ...formData, height: e.target.value });
                  setErrors(prev => ({...prev, height: ''}));
                  setIsCalculated(false);
                }} 
              />
              {errors.height && <span className={styles.errorText}>{errors.height}</span>}
            </div>

            <div className={styles.inputGroup}>
              <label>Actividad</label>
              <select 
                className={styles.fullWidthSelect} 
                value={formData.activity} 
                onChange={(e) => {
                  setFormData({ ...formData, activity: e.target.value });
                  setIsCalculated(false);
                }}
              >
                <option value="1.2">Sedentario</option>
                <option value="1.375">Ligero</option>
                <option value="1.55">Moderado</option>
                <option value="1.725">Fuerte</option>
                <option value="1.9">Élite</option>
              </select>
            </div>

            <div className={styles.actionGroup}>
              <button 
                type="button"
                onClick={isCalculated ? saveResults : handleCalculate} 
                className={isCalculated ? styles.saveBtnActive : styles.calcBtn}
              >
                {isCalculated ? '💾 GUARDAR PROGRESO' : 'CALCULAR MÉTRICAS'}
              </button>
              {isCalculated && (
                <button type="button" className={styles.cancelBtn} onClick={() => setIsCalculated(false)}>
                  CANCELAR
                </button>
              )}
            </div>
          </div>
        </section>

        <section className={styles.resultsSide}>
          {results ? (
            <div className={styles.resultsGrid}>
              <div className={styles.resultCard}><span>IMC</span><h3>{results.imc}</h3></div>
              <div className={styles.resultCard}><span>TMB</span><h3>{results.tmb} <small>kcal</small></h3></div>
              <div className={styles.resultCard}><span>TDEE</span><h3>{results.tdee} <small>kcal</small></h3></div>
            </div>
          ) : (
            <div className={styles.placeholder}><p>Completa el formulario para ver tu análisis.</p></div>
          )}
        </section>
      </main>

      {history.length > 1 && (
        <section className={styles.chartSection}>
          <div className={styles.sectionHeader}><h3>Tendencia de <span>Peso (kg)</span></h3></div>
          <div className={styles.chartWrapper}>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorPeso" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FFA500" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#FFA500" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#222" />
                <XAxis dataKey="fecha" stroke="#666" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis hide domain={['dataMin - 5', 'dataMax + 5']} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '8px' }}
                  itemStyle={{ color: '#FFA500', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="peso" stroke="#FFA500" fillOpacity={1} fill="url(#colorPeso)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>
      )}

      <section className={styles.historySection}>
        <div className={styles.sectionHeader}><h3>Historial de <span>Evolución</span></h3></div>
        <div className={styles.historyList}>
          {loading && page === 1 ? (
             <p className={styles.emptyHistory}>Cargando historial...</p>
          ) : sortedHistory.map((record, index) => {
            const medal = getMedalByIndex(index);
            return (
              <article key={record._id} className={`${styles.historyCard} ${medal ? medal.type : ''}`}>
                {medal && <div className={styles.medalBadge}>{medal.icon} TOP {medal.label}</div>}
                <button className={styles.deleteBtn} onClick={() => handleDelete(record._id)}>✕</button>
                <div className={styles.dateBadge}>{new Date(record.createdAt).toLocaleDateString()}</div>
                <div className={styles.dataGroup}>
                  <div className={styles.dataItem}><small>Peso</small><strong>{record.weight}kg</strong></div>
                  <div className={styles.dataItem}><small>IMC</small><strong>{record.imc}</strong></div>
                  <div className={styles.dataItem}><small>Reposo</small><strong>{record.tmb}kcal</strong></div>
                  <div className={styles.dataItem}><small>Gasto Total</small><strong className={styles.orange}>{record.tdee}kcal</strong></div>
                </div>
              </article>
            );
          })}
          
          {hasNextPage && (
            <button 
              type="button" 
              className={styles.loadMoreBtn} 
              onClick={() => fetchHistory(true)} 
              disabled={loadingMore}
            >
              {loadingMore ? 'Cargando...' : 'Ver más registros'}
            </button>
          )}
        </div>
      </section>
    </div>
  );
};