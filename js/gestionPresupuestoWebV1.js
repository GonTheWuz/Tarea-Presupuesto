import {
  // pos mira esto hace que importe funciones y modulos: (xd)
  CrearGasto,
  anyadirGasto,
  listarGastos,
  borrarGasto,
  calcularTotalGastos,
} from "./gestionPresupuesto.js";

const form = document.getElementById("formGasto");
const listaGastosDiv = document.getElementById("listaGastos"); //estos tres obtienen referecncias del DOM
const totalGastosSpan = document.getElementById("totalGastos");

mostrarGastos();

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const descripcion = document.getElementById("descripcion").value.trim();
  const valor = parseFloat(document.getElementById("valor").value); //estas 4 lineas, son los valores del formulario
  const fecha = document.getElementById("fecha").value;
  const etiquetasTexto = document.getElementById("etiquetas").value.trim();

  const etiquetas = etiquetasTexto
    ? etiquetasTexto.split(",").map((e) => e.trim()) //convierte el texto de las estiquetas en un array
    : [];

  const nuevoGasto = new CrearGasto(descripcion, valor, fecha, ...etiquetas);
  anyadirGasto(nuevoGasto);
  //añade, limpia y actualiza
  form.reset();
  mostrarGastos();
});

function mostrarGastos() {
  const gastos = listarGastos();
  listaGastosDiv.innerHTML = "";

  gastos.forEach((gasto) => {
    const gastoDiv = document.createElement("div");
    gastoDiv.classList.add("gasto");

    const fechaFormateada = new Date(gasto.fecha).toLocaleDateString();

    gastoDiv.innerHTML = `
            <p><strong>${gasto.descripcion}</strong> - ${gasto.valor} €</p>
            <p>Fecha: ${fechaFormateada}</p>
            <p>Etiquetas: ${gasto.etiquetas.join(", ") || "Sin etiquetas"}</p>
            <button class="borrar" data-id="${gasto.id}">Borrar</button>`;

    listaGastosDiv.appendChild(gastoDiv);
  });

  actualizarTotal();
  activarBotonesBorrar();
}

function activarBotonesBorrar() {
  const botones = document.querySelectorAll(".borrar");
  botones.forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = parseInt(btn.getAttribute("data-id"));
      borrarGasto(id); //bprra el gasto con la funcion importada y abajo lo actualiza
      mostrarGastos();
    });
  });
}

function actualizarTotal() {
  //actualiza el total de gastos
  totalGastosSpan.textContent = calcularTotalGastos().toFixed(2); //calcula el total mostrando 2 decimales
}
