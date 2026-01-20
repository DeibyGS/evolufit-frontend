const MUSCLE_GROUPS = [
  "Pecho",
  "Espalda",
  "Deltoides",
  "Bíceps",
  "Tríceps",
  "Cuádriceps",
  "Isquiotibiales",
  "Abdomen",
];

const EXERCISES_DB = [
  // PECHO
  { id: "p1", name: "Press de Banca Plano", group: "Pecho" },
  { id: "p2", name: "Press Inclinado con Mancuernas", group: "Pecho" },
  { id: "p3", name: "Aperturas en Peck Deck", group: "Pecho" },
  { id: "p4", name: "Cruces en Polea Alta", group: "Pecho" },
  { id: "p5", name: "Press Declinado con Barra", group: "Pecho" },
  { id: "p6", name: "Fondos en Paralelas (Pecho)", group: "Pecho" },
  { id: "p7", name: "Flexiones de Brazos", group: "Pecho" },
  { id: "p8", name: "Press de Banca en Máquina", group: "Pecho" },

  // ESPALDA
  { id: "e1", name: "Dominadas Lastradas", group: "Espalda" },
  { id: "e2", name: "Jalón al Pecho", group: "Espalda" },
  { id: "e3", name: "Remo con Barra", group: "Espalda" },
  { id: "e4", name: "Remo en Polea Baja", group: "Espalda" },
  { id: "e5", name: "Remo con Mancuerna a una Mano", group: "Espalda" },
  { id: "e6", name: "Pull-over en Polea Alta", group: "Espalda" },
  { id: "e7", name: "Remo T con Apoyo", group: "Espalda" },
  { id: "e8", name: "Hiperextensiones", group: "Espalda" },

  // DELTOIDES (Hombro)
  { id: "h1", name: "Press Militar con Barra", group: "Deltoides" },
  { id: "h2", name: "Elevaciones Laterales con Mancuerna", group: "Deltoides" },
  { id: "h3", name: "Press Arnold", group: "Deltoides" },
  { id: "h4", name: "Face Pull en Polea", group: "Deltoides" },
  { id: "h5", name: "Pájaros (Deltoide Posterior)", group: "Deltoides" },
  { id: "h6", name: "Elevaciones Frontales con Disco", group: "Deltoides" },
  { id: "h7", name: "Remo al Cuello en Polea", group: "Deltoides" },
  { id: "h8", name: "Press de Hombro en Máquina", group: "Deltoides" },

  // BÍCEPS
  { id: "b1", name: "Curl con Barra Z", group: "Bíceps" },
  { id: "b2", name: "Curl Alterno con Mancuernas", group: "Bíceps" },
  { id: "b3", name: "Curl Martillo", group: "Bíceps" },
  { id: "b4", name: "Curl en Banco Predicador", group: "Bíceps" },
  { id: "b5", name: "Curl Concentrado", group: "Bíceps" },
  { id: "b6", name: "Curl en Polea Baja", group: "Bíceps" },
  { id: "b7", name: "Curl tipo Spider", group: "Bíceps" },
  { id: "b8", name: "Chin-ups (Bíceps)", group: "Bíceps" },

  // TRÍCEPS
  { id: "t1", name: "Extensiones en Polea Alta", group: "Tríceps" },
  { id: "t2", name: "Press Francés con Barra Z", group: "Tríceps" },
  { id: "t3", name: "Fondos entre Bancos", group: "Tríceps" },
  { id: "t4", name: "Copa a una Mano con Mancuerna", group: "Tríceps" },
  { id: "t5", name: "Patada de Tríceps en Polea", group: "Tríceps" },
  { id: "t6", name: "Press de Banca Agarre Cerrado", group: "Tríceps" },
  { id: "t7", name: "Extensiones tras nuca con cuerda", group: "Tríceps" },
  { id: "t8", name: "Flexiones Diamante", group: "Tríceps" },

  // CUÁDRICEPS
  { id: "c1", name: "Sentadilla Libre con Barra", group: "Cuádriceps" },
  { id: "c2", name: "Prensa de Piernas 45°", group: "Cuádriceps" },
  { id: "c3", name: "Extensiones de Cuádriceps", group: "Cuádriceps" },
  { id: "c4", name: "Zancadas con Mancuernas", group: "Cuádriceps" },
  { id: "c5", name: "Sentadilla Hack", group: "Cuádriceps" },
  { id: "c6", name: "Sentadilla Búlgara", group: "Cuádriceps" },
  { id: "c7", name: "Sentadilla Frontal", group: "Cuádriceps" },
  { id: "c8", name: "Step Up con Peso", group: "Cuádriceps" },

  // ISQUIOTIBIALES
  { id: "i1", name: "Peso Muerto Rumano", group: "Isquiotibiales" },
  { id: "i2", name: "Curl Femoral Tumbado", group: "Isquiotibiales" },
  { id: "i3", name: "Curl Femoral Sentado", group: "Isquiotibiales" },
  { id: "i4", name: "Buenos Días con Barra", group: "Isquiotibiales" },
  { id: "i5", name: "Curl Femoral de Pie", group: "Isquiotibiales" },
  { id: "i6", name: "Puente de Glúteo / Isquio", group: "Isquiotibiales" },
  {
    id: "i7",
    name: "Peso Muerto con Piernas Rígidas",
    group: "Isquiotibiales",
  },
  { id: "i8", name: "Hip Thrust", group: "Isquiotibiales" },

  // ABDOMEN
  { id: "a1", name: "Crunch Abdominal en Máquina", group: "Abdomen" },
  { id: "a2", name: "Elevación de Piernas Colgado", group: "Abdomen" },
  { id: "a3", name: "Plancha Abdominal", group: "Abdomen" },
  { id: "a4", name: "Rueda Abdominal", group: "Abdomen" },
  { id: "a5", name: "Twist Ruso con Disco", group: "Abdomen" },
  { id: "a6", name: "Woodchopper en Polea", group: "Abdomen" },
  { id: "a7", name: "Crunch con Cable (Polea)", group: "Abdomen" },
  { id: "a8", name: "Bicicleta Abdominal", group: "Abdomen" },
];

export { EXERCISES_DB, MUSCLE_GROUPS };
