const entrenos = ["Pecho", "Espalda", "Pecho", "Piernas", "Espalda", "Pecho"];

const conteoGrupso = entrenos.reduce((acc, grupo) => {
  // Si el grupo ya existe en el objeto, le suma 1; si no, lo crea en 0 y le suma 1.
  acc[grupo] = (acc[grupo] || 0) + 1;
  return acc;
}, {}); // Iniciamos con un objeto vacío {}

console.log(conteoGrupso);
// { Pecho: 3, Espalda: 2, Piernas: 1 }
