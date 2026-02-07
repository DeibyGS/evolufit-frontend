import React, { useState, useEffect, useMemo } from 'react';
import { 
  PieChart, Pie, Cell, XAxis, YAxis, Tooltip, 
  ResponsiveContainer, Legend, AreaChart, Area, 
  CartesianGrid, LineChart, Line 
} from 'recharts';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { MUSCLE_GROUPS } from '../../data/exercises';
import { useAuthStore } from '../../store/authStore';
import styles from './Dashboard.module.scss';
import { BASE_URL } from '../../api/API';

const COLORS = ['#FFA500', '#FF8C00', '#FF4500', '#FFD700', '#DAA520', '#B8860B'];

export const Dashboard = () => {
  const { token, user } = useAuthStore();
  const [workouts, setWorkouts] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState('Pecho');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => { 
    if (token) fetchWorkouts(); 
  }, [token]);

  const fetchWorkouts = async () => {
    try {
      // Pedimos un límite de 50 para tener datos suficientes para las gráficas
      const res = await fetch(`${BASE_URL}/workouts/my-workouts?limit=50`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      
      if (res.ok) {
        // Accedemos a .workouts por la paginación del backend
        const workoutsData = data.workouts || []; 
        setWorkouts(workoutsData);
      } 
    } catch (error) { 
      console.error("Error Dashboard Fetch:", error); 
    }
  };

  // FILTRADO LÓGICO DE WORKOUTS
  const filteredWorkouts = useMemo(() => {
    if (!workouts.length) return [];

    const result = workouts.filter(w => {
      const dateRaw = w.createdAt || w.date;
      if (!dateRaw) return false;

      const workoutDate = new Date(dateRaw);
      workoutDate.setHours(0, 0, 0, 0);

      // Normalización de fechas para evitar desfases de zona horaria (UTC vs Local)
      if (startDate) {
        const start = new Date(startDate);
        start.setMinutes(start.getMinutes() + start.getTimezoneOffset());
        start.setHours(0, 0, 0, 0);
        if (workoutDate < start) return false;
      }

      if (endDate) {
        const end = new Date(endDate);
        end.setMinutes(end.getMinutes() + end.getTimezoneOffset());
        end.setHours(0, 0, 0, 0);
        if (workoutDate > end) return false;
      }

      return true;
    });

    // Ordenamos cronológicamente para que Recharts dibuje bien la línea de tiempo
    return result.sort((a, b) => new Date(a.createdAt || a.date) - new Date(b.createdAt || b.date));
  }, [workouts, startDate, endDate]);

  // ESTADÍSTICAS KPI
  const groupStats = useMemo(() => {
    return filteredWorkouts.reduce((acc, w) => {
      w.exercises?.forEach(ex => {
        if (ex.muscleGroup === selectedGroup) {
          acc.series += ex.sets.length;
          ex.sets.forEach(s => {
            acc.reps += (Number(s.reps) || 0);
            acc.volumen += (Number(s.reps) * Number(s.weight)) || 0;
          });
        }
      });
      return acc;
    }, { series: 0, reps: 0, volumen: 0 });
  }, [filteredWorkouts, selectedGroup]);

  // DATOS PARA PIE CHART
  const pieData = useMemo(() => {
    const counts = {};
    filteredWorkouts.forEach(w => {
      w.exercises?.forEach(ex => {
        counts[ex.muscleGroup] = (counts[ex.muscleGroup] || 0) + ex.sets.length;
      });
    });
    return Object.keys(counts).map(key => ({ name: key, value: counts[key] }));
  }, [filteredWorkouts]);

  // DATOS PARA EVOLUCIÓN (LINE/AREA)
  const evolutionData = useMemo(() => {
    return filteredWorkouts.map(w => {
      let v = 0, r = 0, s = 0;
      w.exercises?.forEach(ex => {
        if (ex.muscleGroup === selectedGroup) {
          s += ex.sets.length;
          ex.sets.forEach(set => { 
            r += (Number(set.reps) || 0); 
            v += (Number(set.reps) * Number(set.weight)) || 0; 
          });
        }
      });
      return {
        fecha: new Date(w.createdAt || w.date).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' }),
        volumen: v, 
        repeticiones: r, 
        series: s
      };
    }).filter(d => d.volumen > 0 || d.series > 0);
  }, [filteredWorkouts, selectedGroup]);

  const downloadSessionsPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(`EvolutFit - Reporte de Rendimiento: ${user?.name || 'Usuario'}`, 14, 20);
    doc.setFontSize(11);
    doc.text(`Enfoque: ${selectedGroup} | Datos filtrados: ${filteredWorkouts.length} sesiones`, 14, 28);

    const tableRows = [];
    filteredWorkouts.forEach(w => {
      w.exercises.forEach(ex => {
        if (ex.muscleGroup === selectedGroup || !selectedGroup) {
          ex.sets.forEach((s, i) => {
            tableRows.push([
              new Date(w.createdAt || w.date).toLocaleDateString(), 
              ex.muscleGroup, 
              ex.exerciseName, 
              i+1, 
              `${s.weight}kg`, 
              s.reps, 
              `${s.weight * s.reps}kg`
            ]);
          });
        }
      });
    });

    autoTable(doc, { 
      head: [['Fecha', 'Músculo', 'Ejercicio', 'Set', 'Kg', 'Reps', 'Volumen']], 
      body: tableRows, 
      startY: 35, 
      headStyles: { fillColor: [255, 165, 0] } 
    });
    doc.save(`EvolutFit_Report_${selectedGroup}.pdf`);
  };

  const tooltipStyle = {
    contentStyle: { backgroundColor: 'rgba(20, 20, 20, 0.95)', border: '1px solid rgba(255, 165, 0, 0.2)', borderRadius: '8px', padding: '10px' },
    itemStyle: { color: '#fff', fontSize: '0.9rem' },
    labelStyle: { color: '#FFA500', marginBottom: '5px', fontWeight: 'bold' }
  };

  return (
    <div className={styles.dashboardContainer}>
      <header className={styles.header}>
        <div className={styles.titleSection}>
          <h2>Dashboard <span>Evolutivo</span></h2>
          <p>Analiza tu progreso y toma decisiones basadas en datos.</p>
        </div>
        <div className={styles.reportActions}>
           <button onClick={downloadSessionsPDF} className={styles.btnDownload}>📄 Exportar PDF</button>
        </div>
      </header>

      <section className={styles.filterSection}>
        <div className={styles.dateFilterContainer}>
          <div className={styles.dateInputs}>
            {/* Agregamos onClick para asegurar que el foco se dispare en móviles */}
            <input 
              type="date" 
              value={startDate} 
              onChange={(e) => setStartDate(e.target.value)} 
              onClick={(e) => e.target.showPicker?.()} 
            />
            <span className={styles.separator}>a</span>
            <input 
              type="date" 
              value={endDate} 
              onChange={(e) => setEndDate(e.target.value)} 
              onClick={(e) => e.target.showPicker?.()}
            />
          </div>
          {(startDate || endDate) && (
            <button className={styles.clearBtn} onClick={() => {setStartDate(''); setEndDate('');}}>✕</button>
          )}
        </div>
      </section>

      <nav className={styles.muscleFilters}>
        <div className={styles.tagChips}>
          {MUSCLE_GROUPS.map(group => (
            <button 
              key={group} 
              className={selectedGroup === group ? styles.tagActive : ''} 
              onClick={() => setSelectedGroup(group)}
            >
              {group}
            </button>
          ))}
        </div>
      </nav>

      <div className={styles.kpiGrid}>
        <div className={`${styles.kpiCard} ${styles.highlight}`}>
          <span className={styles.label}>Volumen {selectedGroup}</span>
          <h4>{groupStats.volumen.toLocaleString()} <small>kg</small></h4>
        </div>
        <div className={styles.kpiCard}>
          <span className={styles.label}>Series Totales</span>
          <h4>{groupStats.series}</h4>
        </div>
        <div className={styles.kpiCard}>
          <span className={styles.label}>Repeticiones</span>
          <h4>{groupStats.reps.toLocaleString()}</h4>
        </div>
      </div>

      <div className={styles.chartsGrid}>
        <div className={styles.chartCard}>
          <h3>Distribución de Esfuerzo</h3>
          
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={pieData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" stroke="none">
                {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip {...tooltipStyle} />
              <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '0.8rem' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className={styles.chartCard}>
          <h3>Progresión de Carga</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={evolutionData}>
              <defs>
                <linearGradient id="colorVol" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FFA500" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#FFA500" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#222" />
              <XAxis dataKey="fecha" stroke="#666" fontSize={11} axisLine={false} tickMargin={10} />
              <Tooltip {...tooltipStyle} />
              <Area type="monotone" dataKey="volumen" stroke="#FFA500" fill="url(#colorVol)" strokeWidth={3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className={`${styles.chartCard} ${styles.fullWidth}`}>
          <h3>Métricas Combinadas: <span>{selectedGroup}</span></h3>
          
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={evolutionData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
              <XAxis dataKey="fecha" stroke="#666" fontSize={11} axisLine={false} tickMargin={10} />
              <YAxis yId="left" stroke="#666" fontSize={11} axisLine={false} />
              <YAxis yId="right" orientation="right" stroke="#666" fontSize={11} axisLine={false} />
              <Tooltip {...tooltipStyle} />
              <Legend wrapperStyle={{ paddingTop: '10px' }} />
              <Line yId="left" type="monotone" dataKey="volumen" stroke="#FFA500" strokeWidth={3} dot={{r: 4, fill: '#FFA500'}} name="Volumen (kg)" />
              <Line yId="right" type="monotone" dataKey="repeticiones" stroke="#00C49F" strokeWidth={2} name="Reps" />
              <Line yId="right" type="monotone" dataKey="series" stroke="#FFBB28" strokeWidth={2} name="Series" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};