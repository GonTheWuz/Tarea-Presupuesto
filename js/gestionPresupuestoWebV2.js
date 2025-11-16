import {
  CrearGasto,
  listarGastos,
  anyadirGasto,
  borrarGasto,
  calcularTotalGastos,
  guardarGastos,
  cargarGastos,
} from "./gestionPresupuesto.js";

import "../componentes/mi-gasto.js";
import "../componentes/formulario-gasto.js";

const zonaListado = document.getElementById("gastos-container"); // contenedor en el q se muestran los gastos
const totalSpan = document.getElementById("total-container"); // con esto se muestra el total
const formContainer = document.getElementById("form-container"); //esto es para el formulario

const formulario = document.createElement("formulario-gasto");
formContainer.appendChild(formulario); //actualiza el formulario mostrando lo nuevo

document.addEventListener("gasto-creado", (e) => {
  anyadirGasto(e.detail); //añade y actualiza los nuevos y todos los gastos
  mostrarGastos();
});

export function mostrarGastos() {
  zonaListado.innerHTML = "";

  listarGastos().forEach((gasto) => {
    const comp = document.createElement("mi-gasto");
    comp.gasto = gasto; //para añadir un gasto
    zonaListado.appendChild(comp); // añade el componente al contenedor
  });

  totalSpan.textContent =
    "Total de gastos: " + calcularTotalGastos().toFixed(2) + " €"; //devulve la suma de todos los gastos en 2 decimales
}

document.getElementById("guardar").addEventListener("click", () => {
  guardarGastos();
  alert("Gastos guardados correctamente.");
});
//añade los botones para guardar y cargar
document.getElementById("cargar").addEventListener("click", () => {
  cargarGastos();
  mostrarGastos();
});
