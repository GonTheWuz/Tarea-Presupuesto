import { CrearGasto } from "../js/gestionPresupuesto.js";

class FormularioGasto extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    this.shadowRoot.innerHTML = `
      <style>
        form {
          display:flex;
          flex-direction:column;
          gap:6px;
          background:#eee;
          padding:10px;
          border-radius:8px;
        }
      </style>

      <form id="form">
        <input id="descripcion" placeholder="Descripción" required />
        <input id="valor" type="number" placeholder="Valor (€)" required />
        <input id="fecha" type="date" required />
        <input id="etiquetas" placeholder="Etiquetas separadas por comas" />
        <button type="submit">Añadir gasto</button>
      </form>
    `;
  }

  connectedCallback() {
    //metodo que se ejecuta cuando se conecta al DOM
    this.shadowRoot.querySelector("#form").addEventListener("submit", (e) => {
      //agrego para el evento submit del formulario
      e.preventDefault();

      const desc = this.shadowRoot.querySelector("#descripcion").value;
      const valor = parseFloat(this.shadowRoot.querySelector("#valor").value); //obtiene los valores de los campos del formulario
      const fecha = this.shadowRoot.querySelector("#fecha").value;

      const etiquetas = this.shadowRoot
        .querySelector("#etiquetas")
        .value.split(",")
        .map((e) => e.trim())
        .filter((e) => e !== "");

      const gasto = new CrearGasto(desc, valor, fecha, ...etiquetas);

      this.dispatchEvent(
        new CustomEvent("gasto-creado", {
          detail: gasto, // incluye el gasto creado
          bubbles: true, //permite que el evento burbujee hacia arriba en el DOM (o algo asi)
          composed: true, //permite
          // que el evento cruce el límite del Shadow DOM
        })
      );

      e.target.reset(); //deja todo en blanco despues de enviar
    });
  }
}

customElements.define("formulario-gasto", FormularioGasto); //registra el componente personalizado
