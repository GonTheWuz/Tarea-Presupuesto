import { borrarGasto } from "../js/gestionPresupuesto.js";
import { mostrarGastos } from "../js/gestionPresupuestoWebV2.js";

class MiGasto extends HTMLElement {
  //define un componente web personalizado para representar
  constructor() {
    super();
    this.attachShadow({ mode: "open" }); //crea Shadow para aislamiento del componente

    const template = document.getElementById("template-gasto");
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  set gasto(g) {
    this._gasto = g; //almacena el gasto en una propiedad
    this.actualizarVista(); //actualiza la vista
  }

  actualizarVista() {
    //actualiza cada elementp
    const fecha = new Date(this._gasto.fecha);

    this.shadowRoot.querySelector(".descripcion").textContent =
      "Descripción: " + this._gasto.descripcion;

    this.shadowRoot.querySelector(".valor").textContent =
      "Valor: " + this._gasto.valor + " €";

    this.shadowRoot.querySelector(".fecha").textContent =
      "Fecha: " + fecha.toISOString().split("T")[0]; //actualiza la fecha

    this.shadowRoot.querySelector(".etiquetas").textContent =
      "Etiquetas: " + this._gasto.etiquetas.join(", "); //une etiquetas con comas
  }

  connectedCallback() {
    //metodo de ciclo de vida
    const btnEditar = this.shadowRoot.querySelector(".btn-editar");
    const btnBorrar = this.shadowRoot.querySelector(".btn-borrar");
    const form = this.shadowRoot.querySelector(".form-edicion");
    const cancelar = this.shadowRoot.querySelector(".btn-cancelar");

    btnEditar.addEventListener("click", () => {
      //para mostrasr/ocultar formulario
      form.style.display = form.style.display === "none" ? "block" : "none";
      this.rellenarFormulario(); //para rellenar con los datos que nos de la gana
    });

    cancelar.addEventListener("click", () => {
      //para cancelar
      form.style.display = "none";
    });

    btnBorrar.addEventListener("click", () => {
      if (confirm("¿Seguro que quieres borrar este gasto?")) {
        borrarGasto(this._gasto.id);
        mostrarGastos();
      }
    });

    form.addEventListener("submit", (e) => {
      //para obetener nuevos valores del formulario
      e.preventDefault();

      const desc = form.querySelector(".edit-descripcion").value;
      const valor = parseFloat(form.querySelector(".edit-valor").value);
      const fecha = form.querySelector(".edit-fecha").value;
      const etiquetas = form
        //procesamiento de las susodichas etiquetas
        .querySelector(".edit-etiquetas")
        .value.split(",")
        .map((e) => e.trim())
        .filter((e) => e !== "");

      this._gasto.actualizarDescripcion(desc);
      this._gasto.actualizarValor(valor); //actualiza el objeto con nuestros datos
      this._gasto.actualizarFecha(fecha);

      this._gasto.etiquetas = etiquetas;

      form.style.display = "none"; //oculta y actualiza vista global
      mostrarGastos();
    });
  }

  rellenarFormulario() {
    const form = this.shadowRoot.querySelector(".form-edicion");

    form.querySelector(".edit-descripcion").value = this._gasto.descripcion; //establece los datos actuales en los campos
    form.querySelector(".edit-valor").value = this._gasto.valor;

    const fecha = new Date(this._gasto.fecha).toISOString().split("T")[0];
    form.querySelector(".edit-fecha").value = fecha; //formatea la fecha

    form.querySelector(".edit-etiquetas").value =
      this._gasto.etiquetas.join(", ");
  }
}

customElements.define("mi-gasto", MiGasto); //registra el componente personalizado para html
