import React, { useState, useEffect, useRef, useMemo } from 'react';
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
      const res = await fetch('http://localhost:8080/api/workouts/my-workouts', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok && Array.isArray(data)) setWorkouts(data);
    } catch (error) { 
      console.error("Error al obtener entrenamientos", error); 
    }
  };

  const filteredWorkouts = useMemo(() => {
    return workouts.filter(w => {
      if (!startDate && !endDate) return true;
      const workoutDate = new Date(w.createdAt);
      workoutDate.setHours(0, 0, 0, 0);

      if (startDate) {
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        if (workoutDate < start) return false;
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(0, 0, 0, 0);
        if (workoutDate > end) return false;
      }
      return true;
    }).reverse();
  }, [workouts, startDate, endDate]);

  const groupStats = useMemo(() => {
    return filteredWorkouts.reduce((acc, w) => {
      w.exercises.forEach(ex => {
        if (ex.muscleGroup === selectedGroup) {
          acc.series += ex.sets.length;
          ex.sets.forEach(s => {
            acc.reps += s.reps;
            acc.volumen += (s.reps * s.weight);
          });
        }
      });
      return acc;
    }, { series: 0, reps: 0, volumen: 0 });
  }, [filteredWorkouts, selectedGroup]);

  const pieData = useMemo(() => {
    const counts = {};
    filteredWorkouts.forEach(w => {
      w.exercises.forEach(ex => {
        counts[ex.muscleGroup] = (counts[ex.muscleGroup] || 0) + ex.sets.length;
      });
    });
    return Object.keys(counts).map(key => ({ name: key, value: counts[key] }));
  }, [filteredWorkouts]);

  const evolutionData = useMemo(() => {
    return filteredWorkouts.map(w => {
      let v = 0, r = 0, s = 0;
      w.exercises.forEach(ex => {
        if (ex.muscleGroup === selectedGroup) {
          s += ex.sets.length;
          ex.sets.forEach(set => {
            r += set.reps;
            v += (set.reps * set.weight);
          });
        }
      });
      return {
        fecha: new Date(w.createdAt).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' }),
        volumen: v,
        repeticiones: r,
        series: s
      };
    }).filter(d => d.volumen > 0 || d.series > 0);
  }, [filteredWorkouts, selectedGroup]);

  const downloadSessionsPDF = () => {
    const doc = new jsPDF();
    doc.text(`Reporte de Evolución: ${user?.name || 'Usuario'}`, 14, 20);
    const tableRows = [];
    filteredWorkouts.forEach(w => {
      w.exercises.forEach(ex => {
        ex.sets.forEach((s, i) => {
          tableRows.push([new Date(w.createdAt).toLocaleDateString(), ex.muscleGroup, ex.exerciseName, i+1, s.weight, s.reps, s.weight*s.reps]);
        });
      });
    });
    autoTable(doc, { 
        head: [['Fecha', 'Músculo', 'Ejercicio', 'Set', 'Kg', 'Reps', 'Volumen']], 
        body: tableRows, 
        startY: 30,
        headStyles: { fillColor: [255, 165, 0] } 
    });
    doc.save(`Workout_Report_${selectedGroup}.pdf`);
  };

  return (
    <div className={styles.dashboardContainer}>
      <header className={styles.header}>
        <div className={styles.welcome}>
          <h2>Dashboard <span>Evolutivo</span></h2>
          <p>Filtrando desde <strong>{startDate || 'el inicio'}</strong> hasta <strong>{endDate || 'hoy'}</strong></p>
        </div>

        <div className={styles.reportActions}>
          <div className={styles.dateFilterContainer}>
            <div className={styles.dateInputs}>
              <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
              <span className={styles.separator}>a</span>
              <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </div>
            {(startDate || endDate) && (
              <button className={styles.clearBtn} onClick={() => {setStartDate(''); setEndDate('');}}>
                ✕
              </button>
            )}
          </div>
          <button onClick={downloadSessionsPDF} className={styles.btnDownload}>📄 PDF</button>
        </div>
      </header>

      <div className={styles.kpiGrid}>
        <div className={`${styles.kpiCard} ${styles.highlight}`}>
          <span className={styles.label}>Volumen {selectedGroup}</span>
          <h4>{groupStats.volumen.toLocaleString()} <small>kg</small></h4>
        </div>
        <div className={styles.kpiCard}>
          <span className={styles.label}>Total Series</span>
          <h4>{groupStats.series}</h4>
        </div>
        <div className={styles.kpiCard}>
          <span className={styles.label}>Total Repeticiones</span>
          <h4>{groupStats.reps.toLocaleString()}</h4>
        </div>
      </div>

      <nav className={styles.muscleFilters}>
        {MUSCLE_GROUPS.map(group => (
          <button 
            key={group} 
            className={selectedGroup === group ? styles.active : ''} 
            onClick={() => setSelectedGroup(group)}
          >
            {group}
          </button>
        ))}
      </nav>

      <div className={styles.chartsGrid}>
        <div className={styles.chartCard}>
          <h3>Esfuerzo por Grupo</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={pieData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" stroke="none">
                {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '8px' }} />
              <Legend verticalAlign="bottom" height={36}/>
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className={styles.chartCard}>
          <h3>Tendencia de Volumen</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={evolutionData}>
              <defs>
                <linearGradient id="colorVol" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FFA500" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#FFA500" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="fecha" stroke="#666" fontSize={11} axisLine={false} />
              <Tooltip contentStyle={{ backgroundColor: '#111', border: '1px solid #333' }} />
              <Area type="monotone" dataKey="volumen" stroke="#FFA500" fill="url(#colorVol)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className={`${styles.chartCard} ${styles.fullWidth}`}>
          <div className={styles.chartHeader}>
            <h3>Métricas Combinadas: <span>{selectedGroup}</span></h3>
          </div>
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={evolutionData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
              <XAxis dataKey="fecha" stroke="#666" fontSize={11} axisLine={false} />
              <YAxis yId="left" stroke="#666" fontSize={11} axisLine={false} />
              <YAxis yId="right" orientation="right" stroke="#666" fontSize={11} axisLine={false} />
              <Tooltip contentStyle={{backgroundColor: '#111', border: '1px solid #333'}} />
              <Legend />
              <Line yId="left" type="monotone" dataKey="volumen" stroke="#FFA500" strokeWidth={3} dot={{r: 4}} name="Volumen (kg)" />
              <Line yId="right" type="monotone" dataKey="repeticiones" stroke="#00C49F" strokeWidth={2} name="Reps" />
              <Line yId="right" type="monotone" dataKey="series" stroke="#FFBB28" strokeWidth={2} name="Series" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};