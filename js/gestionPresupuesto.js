let presupuesto = 0;
let gastos = [];
let idGasto = 0;

function actualizarPresupuesto(valor) {
  if (typeof valor !== "number" || valor < 0) return -1;
  presupuesto = valor;
  return presupuesto;
}

function mostrarPresupuesto() {
  return `Tu presupuesto actual es de ${presupuesto} €`;
}

function CrearGasto(descripcion, valor, fecha = new Date(), ...etiquetas) {
  if (!(this instanceof CrearGasto)) {
    return new CrearGasto(descripcion, valor, fecha, ...etiquetas);
  }

  this.descripcion =
    typeof descripcion === "string" ? descripcion : "Sin descripción";
  this.valor = typeof valor === "number" && valor >= 0 ? valor : 0;

  const fechaObj = new Date(fecha);
  this.fecha =
    fechaObj.toString() !== "Invalid Date"
      ? fechaObj.getTime()
      : new Date().getTime();
  this.timestamp = this.fecha;

  this.etiquetas = [];

  if (etiquetas.length > 0 && Array.isArray(etiquetas[0])) {
    this.etiquetas = etiquetas[0].filter(
      (et) => typeof et === "string" && et.trim() !== ""
    );
  } else {
    this.etiquetas = etiquetas.filter(
      (et) => typeof et === "string" && et.trim() !== ""
    );
  }

  this.etiquetas = [...new Set(this.etiquetas)];
}

CrearGasto.prototype.mostrarGasto = function () {
  return `Gasto correspondiente a ${this.descripcion} con valor ${this.valor} €`;
};

CrearGasto.prototype.mostrarGastoCompleto = function () {
  let texto = `Gasto correspondiente a ${this.descripcion} con valor ${this.valor} €.\n`;
  texto += `Fecha: ${new Date(this.fecha).toLocaleString()}\n`;

  if (this.etiquetas.length > 0) {
    texto += `Etiquetas:\n`;
    this.etiquetas.forEach((et) => {
      texto += `- ${et}\n`;
    });
  } else {
    texto += `Etiquetas:\n`;
  }

  return texto;
};

CrearGasto.prototype.actualizarFecha = function (nuevaFecha) {
  const nueva = new Date(nuevaFecha);
  if (nueva.toString() !== "Invalid Date") {
    this.fecha = nueva.getTime();
    this.timestamp = this.fecha;
  }
};

CrearGasto.prototype.actualizarDescripcion = function (newDescripcion) {
  if (typeof newDescripcion === "string") {
    this.descripcion = newDescripcion;
  }
};

CrearGasto.prototype.actualizarValor = function (newValor) {
  if (typeof newValor === "number" && newValor >= 0) {
    this.valor = newValor;
  }
};

CrearGasto.prototype.anyadirEtiquetas = function (...nuevasEtiquetas) {
  const etiquetasPlanas = nuevasEtiquetas.flat();
  etiquetasPlanas.forEach((et) => {
    if (
      typeof et === "string" &&
      et.trim() !== "" &&
      !this.etiquetas.includes(et)
    ) {
      this.etiquetas.push(et);
    }
  });
  this.etiquetas = [...new Set(this.etiquetas)];
};

CrearGasto.prototype.borrarEtiquetas = function (...etiquetasABorrar) {
  const etiquetasPlanas = etiquetasABorrar.flat();
  this.etiquetas = this.etiquetas.filter((et) => !etiquetasPlanas.includes(et));
};

CrearGasto.prototype.obtenerPeriodoAgrupacion = function (periodo) {
  const fechaObj = new Date(this.fecha);
  const y = fechaObj.getFullYear();
  const m = (fechaObj.getMonth() + 1).toString().padStart(2, "0");
  const d = fechaObj.getDate().toString().padStart(2, "0");

  if (periodo === "dia") return `${y}-${m}-${d}`;
  if (periodo === "anyo") return `${y}`;
  return `${y}-${m}`;
};

function listarGastos() {
  return gastos;
}

function anyadirGasto(gasto) {
  if (!(gasto instanceof CrearGasto)) return -1;
  gasto.id = idGasto++;
  gastos.push(gasto);
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
    if (filtros.etiquetasTiene?.length > 0) {
      const tiene = filtros.etiquetasTiene.some((et) =>
        g.etiquetas.map((e) => e.toLowerCase()).includes(et.toLowerCase())
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
    fechaDesde,
    fechaHasta,
    etiquetasTiene: etiquetas.length > 0 ? etiquetas : undefined,
  });

  return filtrados.reduce((acc, g) => {
    const clave = g.obtenerPeriodoAgrupacion(periodo);
    acc[clave] = (acc[clave] || 0) + g.valor;
    return acc;
  }, {});
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
