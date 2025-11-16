let presupuesto = 0;
let gastos = [];
let idGasto = 0;

function actualizarPresupuesto(valor) {
  if (typeof valor !== "number" || valor < 0) {
    return -1;
  }
  presupuesto = valor;
  return presupuesto;
}

function mostrarPresupuesto() {
  return `Tu presupuesto actual es de ${presupuesto} €`;
}

function CrearGasto(descripcion, valor, fecha = new Date(), ...etiquetas) {
  if (typeof valor !== "number" || valor < 0) {
    valor = 0;
  }

  this.descripcion = descripcion;
  this.valor = valor;

  let fechaConvertida = new Date(fecha);
  if (fechaConvertida.toString() === "Invalid Date") {
    fechaConvertida = new Date();
  }

  this.fecha = fechaConvertida.getTime();
  this.timestamp = this.fecha;

  this.etiquetas = etiquetas.length > 0 ? etiquetas : [];

  this.mostrarGasto = function () {
    return `Gasto de ${this.descripcion} ${this.valor} €`;
  };

  this.mostrarGastoCompleto = function () {
    let texto = `Gasto correspondiente a ${this.descripcion} con valor ${this.valor} €.\n`;
    texto += `Fecha: ${new Date(this.fecha).toLocaleString()}\n`;
    texto += `Etiquetas:\n`;
    this.etiquetas.forEach((et) => {
      texto += `- ${et}\n`;
    });
    return texto;
  };

  this.actualizarFecha = function (nuevaFecha) {
    const nueva = new Date(nuevaFecha);
    if (nueva.toString() !== "Invalid Date") {
      this.fecha = nueva.getTime();
      this.timestamp = this.fecha;
    }
  };

  this.actualizarDescripcion = function (newDescripcion) {
    this.descripcion = newDescripcion;
  };

  this.actualizarValor = function (newValor) {
    if (typeof newValor === "number" && newValor >= 0) {
      this.valor = newValor;
    }
  };

  this.anyadirEtiquetas = function (...nuevasEtiquetas) {
    nuevasEtiquetas.forEach((et) => {
      if (!this.etiquetas.includes(et)) {
        this.etiquetas.push(et);
      }
    });
  };

  this.borrarEtiquetas = function (...etiquetasABorrar) {
    this.etiquetas = this.etiquetas.filter(
      (et) => !etiquetasABorrar.includes(et)
    );
  };
}

CrearGasto.prototype.obtenerPeriodoAgrupacion = function (periodo) {
  const fecha = new Date(this.fecha);
  const y = fecha.getFullYear();
  const m = (fecha.getMonth() + 1).toString().padStart(2, "0");
  const d = fecha.getDate().toString().padStart(2, "0");

  if (periodo === "dia") return `${y}-${m}-${d}`;
  if (periodo === "anyo") return `${y}`;
  return `${y}-${m}`;
};

function listarGastos() {
  return gastos;
}

function anyadirGasto(gasto) {
  if (!(gasto instanceof CrearGasto)) return -1;
  gasto.id = idGasto;
  gastos.push(gasto);
  idGasto++;
  return gasto.id;
}

function borrarGasto(id) {
  const index = gastos.findIndex((g) => g.id === id);
  if (index === -1) return -1;
  gastos.splice(index, 1);
  return 1;
}

function calcularTotalGastos() {
  return gastos.reduce((total, gasto) => total + gasto.valor, 0);
}

function calcularBalance() {
  return presupuesto - calcularTotalGastos();
}

function filtrarGastos(filtros = {}) {
  return gastos.filter((g) => {
    const fechaGasto = new Date(g.fecha);
    if (filtros.fechaDesde && fechaGasto < new Date(filtros.fechaDesde))
      return false;
    if (filtros.fechaHasta && fechaGasto > new Date(filtros.fechaHasta))
      return false;
    if (filtros.valorMinimo && g.valor < filtros.valorMinimo) return false;
    if (filtros.valorMaximo && g.valor > filtros.valorMaximo) return false;
    if (
      filtros.descripcionContiene &&
      !g.descripcion
        .toLowerCase()
        .includes(filtros.descripcionContiene.toLowerCase())
    )
      return false;
    if (filtros.etiquetasTiene && filtros.etiquetasTiene.length > 0) {
      const etiquetasMin = g.etiquetas.map((e) => e.toLowerCase());
      const tiene = filtros.etiquetasTiene.some((e) =>
        etiquetasMin.includes(e.toLowerCase())
      );
      if (!tiene) return false;
    }
    return true;
  });
}

function agruparGastos(
  periodo = "mes",
  etiquetas = [],
  fechaDesde,
  fechaHasta
) {
  const filtrados = filtrarGastos({
    fechaDesde: fechaDesde,
    fechaHasta: fechaHasta,
    etiquetasTiene: etiquetas.length > 0 ? etiquetas : undefined,
  });

  return filtrados.reduce((acc, g) => {
    const clave = g.obtenerPeriodoAgrupacion(periodo);
    if (!acc[clave]) acc[clave] = 0;
    acc[clave] += g.valor;
    return acc;
  }, {});
}

export function guardarGastos() {
  //guarda la lista de gastos en un localStorage y se convierte en un json
  localStorage.setItem("misGastos", JSON.stringify(gastos)); //guarda el array en un string json
}

export function cargarGastos() {
  //carga la lista desde el localStorage
  const datos = localStorage.getItem("misGastos"); //recupera los datos guardados
  if (!datos) return;

  const lista = JSON.parse(datos); //se convierte el string en un array

  gastos.length = 0; //vacia el array global manteniendo la misma referencia

  lista.forEach((g) => {
    //reconstruye el objeto gasto
    const nuevo = new CrearGasto(g.descripcion, g.valor);
    nuevo.id = g.id;
    gastos.push(nuevo); //se añade el gasto reconstruido al array global
  });
  idGasto = gastos.length; //mantiene el contador de id actualizado para evitar que se dupliquen los gastos nuevos
}

export {
  mostrarPresupuesto,
  actualizarPresupuesto,
  CrearGasto,
  listarGastos,
  anyadirGasto,
  borrarGasto,
  calcularTotalGastos,
  calcularBalance,
  filtrarGastos,
  agruparGastos,
};
