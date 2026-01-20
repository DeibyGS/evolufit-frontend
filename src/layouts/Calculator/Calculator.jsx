import React, { useState, useEffect } from 'react';
import styles from './Calculator.module.scss';
import { toast } from 'sonner';
import { useAuthStore } from '../../store/authStore';
import Swal from 'sweetalert2';

export const Calculator = () => {
  const { token } = useAuthStore();
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
      const res = await fetch('http://localhost:8080/api/health', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        const records = Array.isArray(data) ? data : (data ? [data] : []);
        setHistory(records);
      }
    } catch (error) {
      console.error("Error al cargar historial" + error.message);
    }
  };

  const handleCalculate = (e) => {
    e.preventDefault();
    const { weight, height, age, gender, activity } = formData;
    if (!weight || !height || !age) {
      toast.error('Rellena todos los campos');
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
    try {
      const res = await fetch('http://localhost:8080/api/health', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          ...results,
          age: Number(formData.age),
          height: Number(formData.height),
          gender: formData.gender,
          activity: Number(formData.activity)
        })
      });
      if (res.ok) {
        toast.success('¡Progreso guardado! 🔥');
        setIsCalculated(false);
        setResults(null);
        fetchFullHistory();
      }
    } catch (error) {
      toast.error('Error al guardar' + error.message);
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: '¿Eliminar registro?',
      text: "Esta acción no se puede deshacer",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#FFA500',
      cancelButtonColor: '#333',
      confirmButtonText: 'Sí, borrar',
      background: '#111',
      color: '#fff'
    });

    if (result.isConfirmed) {
      try {
        const res = await fetch(`http://localhost:8080/api/health/${id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          toast.success("Registro eliminado");
          fetchFullHistory();
        }
      } catch (error) {
        toast.error("Error al eliminar" + error.message);
      }
    }
  };

  const getMedal = (currentImc, currentId) => {
    if (history.length < 3) return null;
    const sortedByImc = [...history].sort((a, b) => a.imc - b.imc);
    const rankIndex = sortedByImc.findIndex(r => (r._id || r.id) === currentId);
    if (rankIndex === 0) return { type: styles.gold, label: 'ORO', icon: '🥇' };
    if (rankIndex === 1) return { type: styles.silver, label: 'PLATA', icon: '🥈' };
    if (rankIndex === 2) return { type: styles.bronze, label: 'BRONCE', icon: '🥉' };
    return null;
  };

  return (
    <div className={styles.calculatorContainer}>
      <header className={styles.header}>
        <h2>Calculadora <span>Salud & Fitness</span></h2>
        <p>Gestiona tus métricas y compite por tus mejores marcas.</p>
      </header>

      <div className={styles.mainGrid}>
        <div className={styles.formSide}>
          <form className={styles.form} onSubmit={isCalculated ? (e) => { e.preventDefault(); saveResults(); } : handleCalculate}>
            <div className={styles.radioGroupContainer}>
              <div className={styles.radioOptions}>
                {['hombre', 'mujer'].map(g => (
                  <label key={g} className={`${styles.radioLabel} ${formData.gender === g ? styles.active : ''}`}>
                    <input type="radio" name="gender" value={g} checked={formData.gender === g} onChange={(e) => setFormData({ ...formData, gender: e.target.value })} />
                    <span>{g === 'hombre' ? 'Hombre' : 'Mujer'}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className={styles.row}>
              <div className={styles.inputGroup}><label>Edad</label><input type="number" value={formData.age} onChange={(e) => setFormData({ ...formData, age: e.target.value })} /></div>
              <div className={styles.inputGroup}><label>Peso (kg)</label><input type="number" value={formData.weight} onChange={(e) => setFormData({ ...formData, weight: e.target.value })} /></div>
            </div>
            <div className={styles.inputGroup}><label>Altura (cm)</label><input type="number" value={formData.height} onChange={(e) => setFormData({ ...formData, height: e.target.value })} /></div>
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
            <button type="submit" className={isCalculated ? styles.saveBtnActive : styles.calcBtn}>
              {isCalculated ? '💾 GUARDAR RESULTADOS' : 'CALCULAR MÉTRICAS'}
            </button>
            {isCalculated && <button type="button" className={styles.clearBtn} onClick={() => setIsCalculated(false)}>CANCELAR</button>}
          </form>
        </div>

        <div className={styles.resultsSide}>
          {results ? (
            <div className={styles.resultsGrid}>
              <div className={styles.resultCard}><span>IMC</span><h3>{results.imc}</h3></div>
              <div className={styles.resultCard}><span>CALORÍAS REPOSO</span><h3>{results.tmb} <small>kcal</small></h3></div>
              <div className={styles.resultCard}><span>GASTO TOTAL DIARIO</span><h3>{results.tdee} <small>kcal</small></h3></div>
            </div>
          ) : (
            <div className={styles.placeholder}><p>Completa el formulario para ver tu análisis.</p></div>
          )}
        </div>
      </div>

      <div className={styles.historySection}>
        <h3>Historial de <span>Evolución</span></h3>
        <div className={styles.historyList}>
          {history.length > 0 ? (
            history.map((record) => {
              const medal = getMedal(record.imc, record._id || record.id);
              return (
                <div key={record._id || record.id} className={`${styles.historyCard} ${medal ? medal.type : ''}`}>
                  {medal && <div className={styles.medalBadge}>{medal.icon} TOP {medal.label}</div>}
                  <button className={styles.deleteBtn} onClick={() => handleDelete(record._id || record.id)}>✕</button>
                  <div className={styles.dateBadge}>{record.createdAt ? new Date(record.createdAt).toLocaleDateString() : 'Sin fecha'}</div>
                  <div className={styles.dataGroup}>
                    <div className={styles.dataItem}><small>Peso</small><strong>{record.weight}kg</strong></div>
                    <div className={styles.dataItem}><small>IMC (Grasa)</small><strong>{record.imc}</strong></div>
                    <div className={styles.dataItem}><small>Reposo (TMB)</small><strong>{record.tmb}kcal</strong></div>
                    <div className={styles.dataItem}><small>Gasto Total</small><strong className={styles.orange}>{record.tdee}kcal</strong></div>
                  </div>
                </div>
              );
            })
          ) : (
            <p className={styles.noHistory}>Aún no hay registros. ¡Haz tu primer cálculo!</p>
          )}
        </div>
      </div>
    </div>
  );
};