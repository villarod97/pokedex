// =============================================
// POKÉDEX — Lab 10: fetch, Promesas y JSON
// =============================================

const contenedor = document.getElementById("resultado");
const buscador = document.getElementById("buscador");

let pokedex = []; // rejilla cargada desde la API

// ── Adaptador: traduce la estructura de la API a la tuya ──
function adaptarPokemon(data) {
  return {
    nombre: data.name,
    imagen: data.sprites?.front_default ?? "https://via.placeholder.com/96?text=?",
    tipos: data.types.map(t => t.type.name)
  };
}

// ── crearTarjeta ──
function crearTarjeta(pokemon) {
  const div = document.createElement("div");
  div.className = "bg-white rounded-2xl shadow p-4 flex flex-col items-center gap-2";
  div.innerHTML = `
    <img src="${pokemon.imagen}" alt="${pokemon.nombre}" class="w-24 h-24">
    <h2 class="capitalize font-bold text-lg">${pokemon.nombre}</h2>
    <div class="flex gap-1">
      ${pokemon.tipos.map(t => `<span class="bg-slate-200 rounded-full px-2 py-0.5 text-xs capitalize">${t}</span>`).join("")}
    </div>
  `;
  return div;
}

// ── render: igual que en C09 ──
function render(lista) {
  contenedor.innerHTML = "";
  lista.forEach(p => contenedor.appendChild(crearTarjeta(p)));
}

// ── HU1 (experimento asincronía — solo para ver en consola) ──
console.log("1. pido los datos…");
// El fetch de HU1 está comentado aquí porque HU4 ya hace el fetch real
// fetch("https://pokeapi.co/api/v2/pokemon/pikachu").then(() => console.log("3. llegaron"));
console.log("2. sigo trabajando sin esperar");

// ── Cargar varios Pokémon en paralelo ──
const nombres = ["bulbasaur", "charmander", "squirtle", "pikachu", "jigglypuff", "gengar"];

contenedor.innerHTML = `<p class="col-span-full text-center text-slate-500">Cargando…</p>`;

const promesas = nombres.map(function (nombre) {
  return fetch(`https://pokeapi.co/api/v2/pokemon/${nombre}`).then(r => r.json());
});

Promise.all(promesas)
  .then(function (datos) {
    pokedex = datos.map(adaptarPokemon);
    render(pokedex);
  })
  .catch(function () {
    contenedor.innerHTML = `<p class="col-span-full text-center text-red-600">No se pudo cargar la Pokédex.</p>`;
  });

// ── Buscador (igual, solo cambia pokemonLocal → pokedex) ──
buscador.addEventListener("input", function () {
  const texto = buscador.value.toLowerCase();
  const filtrados = pokedex.filter(p => p.nombre.includes(texto));
  render(filtrados);
});

