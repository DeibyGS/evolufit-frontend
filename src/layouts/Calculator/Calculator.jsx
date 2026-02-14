import React, { useState, useEffect, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import styles from './Calculator.module.scss';
import { toast } from 'sonner';
import { useAuthStore } from '../../store/authStore';
import Swal from 'sweetalert2';
import { BASE_URL } from '../../api/API';

export const Calculator = () => {
  const { token } = useAuthStore();
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    weight: '', height: '', age: '', gender: 'hombre', activity: '1.2'
  });

  const [results, setResults] = useState(null);
  const [history, setHistory] = useState([]);
  const [isCalculated, setIsCalculated] = useState(false);

  useEffect(() => {
    if (token) fetchFullHistory();
  }, [token]);

  const fetchFullHistory = async () => {
    try {
      const res = await fetch(`${BASE_URL}/health`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        const records = Array.isArray(data) ? data : (data ? [data] : []);
        setHistory(records);
      }
    } catch (error) {
      console.error("Error al cargar historial: " + error.message);
    }
  };

  const chartData = useMemo(() => {
    return [...history]
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
      .map(record => ({
        fecha: new Date(record.createdAt).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' }),
        peso: record.weight,
        imc: record.imc
      }));
  }, [history]);

  const sortedHistory = useMemo(() => {
    return [...history].sort((a, b) => a.imc - b.imc);
  }, [history]);

  const handleCalculate = (e) => {
    e.preventDefault();
    const { weight, height, age, gender, activity } = formData;
    if (!weight || !height || !age) {
      toast.error('Rellena todos los campos obligatorios');
      return;
    }
    const hMeters = Number(height) / 100;
    const imc = (Number(weight) / (hMeters ** 2)).toFixed(1);
    const tmb = gender === 'hombre'
      ? (10 * Number(weight)) + (6.25 * Number(height)) - (5 * Number(age)) + 5
      : (10 * Number(weight)) + (6.25 * Number(height)) - (5 * Number(age)) - 161;
    const tdee = Math.round(tmb * Number(activity));

    setResults({ weight: Number(weight), imc: Number(imc), tmb: Math.round(tmb), tdee, activity });
    setIsCalculated(true);
    toast.success('¡Análisis completado!');
  };

 const saveResults = async () => {
    setErrors({});

    const newErrors = {};
  if (!formData.weight) newErrors.weight = "El peso es obligatorio";
  if (!formData.height) newErrors.height = "La altura es obligatoria";
  if (!formData.age) newErrors.age = "La edad es obligatoria";

  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    return toast.error('Por favor, rellena todos los campos');
  }

    try {
      
      const weightNum = Number(formData.weight);
      const heightNum = Number(formData.height);
      const ageNum = Number(formData.age);
      const hMeters = heightNum / 100;

      const currentIMC = (weightNum / (hMeters ** 2)).toFixed(1);
      const currentTMB = formData.gender === 'hombre'
        ? (10 * weightNum) + (6.25 * heightNum) - (5 * ageNum) + 5
        : (10 * weightNum) + (6.25 * heightNum) - (5 * ageNum) - 161;
      const currentTDEE = Math.round(currentTMB * Number(formData.activity));

    
      const payload = {
  // 1. Datos de entrada (Inputs)
  weight: formData.weight === '' ? undefined : Number(formData.weight),
  height: formData.height === '' ? undefined : Number(formData.height),
  age:    formData.age === ''    ? undefined : Number(formData.age),
  gender: formData.gender,
  activity: Number(formData.activity),

  // 2. Datos calculados (Fix de NaN)
  // Usamos Number.isNaN() para verificar si el cálculo matemático falló
  imc:  Number.isNaN(Number(currentIMC))  ? undefined : Number(currentIMC),
  tmb:  Number.isNaN(Number(currentTMB))  ? undefined : Math.round(currentTMB),
  tdee: Number.isNaN(Number(currentTDEE)) ? undefined : Math.round(currentTDEE)
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

     // DENTRO DE saveResults en tu componente Calculator.jsx
if (!res.ok) {
  if (data.errors && Array.isArray(data.errors)) {
    const apiErrors = {};
    
    // Aquí es donde ocurre la magia: llenamos el objeto con todos los fallos
    data.errors.forEach(err => {
      // Usamos el path que viene del back (weight, height, age)
      apiErrors[err.path] = err.message;
    });

    setErrors(apiErrors); // Esto activa los estilos rojos en todos los inputs
    isCalculated && setIsCalculated(false); // Si ya se había calculado, lo reseteamos para que el usuario vea los errores
    return toast.error('Corrige los campos marcados');
  }
  throw new Error(data.message || 'Error inesperado');
}
    setErrors({});

      // 3. ÉXITO
      toast.success('¡Progreso guardado! 🔥');
      setIsCalculated(false);
      setResults(null);
      fetchFullHistory();
      formData.weight = '';
      formData.height = '';
      formData.age = '';
      formData.activity = '1.2';
      
    } catch (error) {
      console.error("Fallo en saveResults:", error);
      toast.error(error.message || 'Error de conexión');
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: '¿Eliminar?', icon: 'warning', showCancelButton: true,
      confirmButtonColor: '#FFA500', confirmButtonText: 'Sí, borrar',
      background: '#111', color: '#fff'
    });
    if (result.isConfirmed) {
      try {
        const res = await fetch(`${BASE_URL}/health/${id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          toast.success("Registro eliminado");
          fetchFullHistory();
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
          <form className={styles.form} onSubmit={isCalculated ? (e) => { e.preventDefault(); saveResults(); } : handleCalculate}>
            <div className={styles.radioOptions}>
              {['hombre', 'mujer'].map(g => (
                <label key={g} className={`${styles.radioLabel} ${formData.gender === g ? styles.active : ''}`}>
                  <input type="radio" name="gender" value={g} checked={formData.gender === g} onChange={(e) => setFormData({ ...formData, gender: e.target.value })} />
                  <span>{g === 'hombre' ? 'Hombre' : 'Mujer'}</span>
                </label>
              ))}
            </div>

            <div className={styles.row}>
              <div className={styles.inputGroup}>
                <label>Edad</label>
                <input type="number" value={formData.age} onChange={(e) => setFormData({ ...formData, age: e.target.value })} className={errors.age ? styles.inputError : ''} />
                {errors.age && <span className={styles.errorText}>{errors.age}</span>}
              </div>
              <div className={styles.inputGroup}>
                <label>Peso (kg)</label>
                <input type="number" value={formData.weight} onChange={(e) => setFormData({ ...formData, weight: e.target.value })} className={errors.weight ? styles.inputError : ''} />
                {errors.weight && <span className={styles.errorText}>{errors.weight}</span>}
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label>Altura (cm)</label>
              <input type="number" value={formData.height} onChange={(e) => setFormData({ ...formData, height: e.target.value })} className={errors.height ? styles.inputError : ''} />
              {errors.height && <span className={styles.errorText}>{errors.height}</span>}
            </div>

            <div className={styles.inputGroup}>
              <label>Actividad</label>
              <select className={styles.fullWidthSelect} value={formData.activity} onChange={(e) => setFormData({ ...formData, activity: e.target.value })}>
                <option value="1.2">Sedentario</option>
                <option value="1.375">Ligero</option>
                <option value="1.55">Moderado</option>
                <option value="1.725">Fuerte</option>
                <option value="1.9">Élite</option>
              </select>
            </div>

            <div className={styles.actionGroup}>
              <button type="submit" className={isCalculated ? styles.saveBtnActive : styles.calcBtn}>
                {isCalculated ? '💾 GUARDAR RESULTADOS' : 'CALCULAR MÉTRICAS'}
              </button>
              {isCalculated && <button type="button" className={styles.cancelBtn} onClick={() => setIsCalculated(false)}>CANCELAR</button>}
            </div>
          </form>
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
          <div className={styles.sectionHeader}>
            <h3>Tendencia de <span>Peso (kg)</span></h3>
          </div>
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
        <div className={styles.sectionHeader}>
          <h3>Historial de <span>Evolución</span></h3>
        </div>
        <div className={styles.historyList}>
          {sortedHistory.map((record, index) => {
            const medal = getMedalByIndex(index);
            return (
              <article key={record._id || record.id} className={`${styles.historyCard} ${medal ? medal.type : ''}`}>
                {medal && <div className={styles.medalBadge}>{medal.icon} TOP {medal.label}</div>}
                <button className={styles.deleteBtn} onClick={() => handleDelete(record._id || record.id)}>✕</button>
                <div className={styles.cardHeader}>
                  <div className={styles.dateBadge}>{new Date(record.createdAt).toLocaleDateString()}</div>
                </div>
                <div className={styles.dataGroup}>
                  <div className={styles.dataItem}><small>Peso</small><strong>{record.weight}kg</strong></div>
                  <div className={styles.dataItem}><small>IMC</small><strong>{record.imc}</strong></div>
                  <div className={styles.dataItem}><small>Reposo</small><strong>{record.tmb}kcal</strong></div>
                  <div className={styles.dataItem}><small>Gasto Total</small><strong className={styles.orange}>{record.tdee}kcal</strong></div>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
};