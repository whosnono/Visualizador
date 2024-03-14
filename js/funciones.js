var turno = true; //true: blancas, false: negras
var i = 0; //movimientos
var tokens;
var posicion = "";
var columna = 0;
var renglon = 0;
var stopCompleto = true;

//colocar piezas en el tablero
function iniciar() {
  var celdas = document.getElementById("js-tablero");

  /*Piezas negras*/
  for (let i = 1; i < 9; i++) {
    celdas.rows[2].cells[i].classList.add("peon-n");
  }
  celdas.rows[1].cells[1].classList.add("torre-n");
  celdas.rows[1].cells[2].classList.add("caballo-n");
  celdas.rows[1].cells[3].classList.add("alfil-n");
  celdas.rows[1].cells[4].classList.add("reina-n");
  celdas.rows[1].cells[5].classList.add("rey-n");
  celdas.rows[1].cells[6].classList.add("alfil-n");
  celdas.rows[1].cells[7].classList.add("caballo-n");
  celdas.rows[1].cells[8].classList.add("torre-n");

  //nada
  for (let i = 1; i < 9; i++) {
    for (let j = 3; j < 7; j++) {
      celdas.rows[j].cells[i].classList.remove(
        celdas.rows[j].cells[i].classList.item(1)
      );
    }
  }

  /*Piezas blancas*/
  for (let i = 1; i < 9; i++) {
    celdas.rows[7].cells[i].classList.add("peon-b");
  }

  celdas.rows[8].cells[1].classList.add("torre-b");
  celdas.rows[8].cells[2].classList.add("caballo-b");
  celdas.rows[8].cells[3].classList.add("alfil-b");
  celdas.rows[8].cells[4].classList.add("reina-b");
  celdas.rows[8].cells[5].classList.add("rey-b");
  celdas.rows[8].cells[6].classList.add("alfil-b");
  celdas.rows[8].cells[7].classList.add("caballo-b");
  celdas.rows[8].cells[8].classList.add("torre-b");
}

//leer un archivo con una partida y escribirlo en el text area
function cargarPartida() {
  var archivo = document.getElementById("js-cargar").files[0];
  var lector = new FileReader();
  lector.onload = function (e) {
    document.getElementById("js-texto").value = e.target.result;
  };
  lector.readAsText(archivo);
}

//visualizar el juego paso por paso
function pasos() {
  var tablero = document.getElementById("js-tablero");

  //separar cada token
  tokens = document.getElementById("js-texto").value.replace(/\d+\.\s*/g, "").split(/\s+/);

  var pieza = "";

  //texto de movimiento
  var out = document.getElementById("js-out");

  if (i >= tokens.length) {
    return; //terminar el juego cuando se alcanza el final de los movimientos
  }

  pieza = checarPieza(tokens[i]);
  posicion = limpiarTokens(tokens[i]);

  if (checarJaque(tokens[i]) || checarJaqueMate(tokens[i])) {
    var rey = document.querySelector(".rey" + (turno ? "-n" : "-b"));
    rey.classList.remove("rey" + (turno ? "-n" : "-b"));
    rey.classList.add("jaque" + (turno ? "-n" : "-b"));

    var otroRey = document.querySelector(".jaque" + (turno ? "-b" : "-n"));
    if (otroRey !== null && i < tokens.length) {
      otroRey.classList.remove("jaque" + (turno ? "-b" : "-n"));
      otroRey.classList.add("rey" + (turno ? "-b" : "-n"));
    }
  } else if (document.querySelector(".jaque" + (turno ? "-b" : "-n"))) {
    var rey = document.querySelector(".jaque" + (turno ? "-b" : "-n"));
    rey.classList.remove("jaque" + (turno ? "-b" : "-n"));
    rey.classList.add("rey" + (turno ? "-b" : "-n"));
  }

  //promocion de peon
  if (checarPromocion(tokens[i])) {
    var transformar = checarPieza(tokens[i].match(/[A-Z]/)[0]);
    var columna = parseInt(convertirLetraANumero(posicion[0])) + 1;
    var renglon = 9 - parseInt(posicion[1]);
    var celda = tablero.rows[renglon].cells[columna];
    moverPieza(tablero, turno, "peon", posicion, checarSiCome(tokens[i]));
    tablero.rows[renglon].cells[columna].classList.remove("peon" + (turno ? "-b" : "-n"));
    tablero.rows[renglon].cells[columna].classList.add(transformar + (turno ? "-b" : "-n"));
    out.innerText = `Movimiento:\nTurno: ${turno ? "blancas\n" : "negras\n"
      }Promoción de peon a ${transformar}`
  }
  else if (pieza == "enroque") {
    if (tokens[i].endsWith("+") || tokens[i].endsWith("#")) {
      posicion = tokens[i].replace(/[\+#]/g, '');
    } else {
      posicion = tokens[i];
    }
    switch (posicion) {
      case "O-O":
        {
          //enroque corto
          renglon = turno ? 8 : 1;
          tablero.rows[renglon].cells[5].classList.remove(
            "rey" + (turno ? "-b" : "-n")
          );
          tablero.rows[renglon].cells[7].classList.add(
            "rey" + (turno ? "-b" : "-n")
          );
          tablero.rows[renglon].cells[8].classList.remove(
            "torre" + (turno ? "-b" : "-n")
          );
          tablero.rows[renglon].cells[6].classList.add(
            "torre" + (turno ? "-b" : "-n")
          );

          //actualizar texto de movimiento
          out.innerText = `Movimiento\nTurno: ${turno ? "blancas\n" : "negras\n"
            }Enroque corto`;
        }
        break;
      case "O-O-O":
        {
          // enroque largo
          renglon = turno ? 8 : 1;
          tablero.rows[renglon].cells[5].classList.remove(
            "rey" + (turno ? "-b" : "-n")
          );
          tablero.rows[renglon].cells[3].classList.add(
            "rey" + (turno ? "-b" : "-n")
          );
          tablero.rows[renglon].cells[1].classList.remove(
            "torre" + (turno ? "-b" : "-n")
          );
          tablero.rows[renglon].cells[4].classList.add(
            "torre" + (turno ? "-b" : "-n")
          );

          //actualizar texto de movimiento
          out.innerText = `Movimiento\nTurno: ${turno ? "blancas\n" : "negras\n"
            }Enroque largo`;
        }
        break;
    }
  } else {
    //poner al rey rojo si está en jaque
    if (posicion.length > 2) {
      //checar si la posición incluye alguna columna o renglon extra
      moverPiezaAmbigua(
        tablero,
        pieza,
        turno,
        posicion,
        checarSiCome(tokens[i])
      );
      posicion = posicion.slice(1);
    } else {
      moverPieza(tablero, turno, pieza, posicion, checarSiCome(tokens[i]));
    }

    //actualizar texto de movimiento
    out.innerText = `Movimiento:\nTurno: ${turno ? "blancas\n" : "negras\n"}${checarSiCome(tokens[i])
      ? `${pieza} se come a ${posicion}`
      : `${pieza} a ${posicion}`
      }`;
  }

  if (checarJaque(tokens[i])) {
    out.innerText += ", Jaque";
  } else if (checarJaqueMate(tokens[i])) {
    out.innerText += ", Jaque Mate";
  }

  //si se come una pieza, eliminar la clase de la pieza comida
  if (checarSiCome(tokens[i])) {
    var columna = parseInt(convertirLetraANumero(posicion[0])) + 1;
    var renglon = 9 - parseInt(posicion[1]);
    var celda = tablero.rows[renglon].cells[columna];

    celda.classList.remove(celda.classList.item(1));
  }
  //cambiar de turno
  turno = !turno;
  //pasar al siguiente token
  i++;
  if (i >= tokens.length) {
    var ganador = checarGanador();
    out.innerText += `\nGanador: ${ganador}`;
  }

}

function checarGanador() {
  if (turno == false) {
    return "Blancas";
  } else if (turno == true) {
    return "Negras";
  }
}

//visualizar partida completa
async function completo() {
  stopCompleto = true;
  pasos();
  while (i < tokens.length && stopCompleto) {
    await new Promise((resolve) => setTimeout(resolve, 1000)); //esperar
    pasos();
  }
}

//convertir la coordenada de la columna a un numero
function convertirLetraANumero(letra) {
  switch (letra) {
    case "a":
      return 0;
    case "b":
      return 1;
    case "c":
      return 2;
    case "d":
      return 3;
    case "e":
      return 4;
    case "f":
      return 5;
    case "g":
      return 6;
    case "h":
      return 7;
    default:
      return -1;
  }
}

//checar si el token tiene mayusculas
function tieneMayusculas(token) {
  return /[A-Z]/.test(token);
}

//checar que tipo de pieza se esta moviendo
function checarPieza(token) {
  var inicial = token[0];
  if (!tieneMayusculas(token)) {
    return "peon";
  } else {
    switch (inicial) {
      case "N":
        return "caballo";
      case "K":
        return "rey";
      case "B":
        return "alfil";
      case "R":
        return "torre";
      case "Q":
        return "reina";
      case "O":
        return "enroque";
    }
  }
  return "";
}

//checar si una pieza come a otra
function checarSiCome(token) {
  return token.includes("x");
}

//pues checar si hay jaque
function checarJaque(token) {
  return token.endsWith("+");
}

//checar si hay jaquemate
function checarJaqueMate(token) {
  return token.endsWith("#");
}

function checarPromocion(token) {
  return token.includes("=");
}

//regresar coordenadas del movimiento sin los caracteres extra
function limpiarTokens(token) {
  return token.replace(/x|[A-Z]|[\+#=]+/g, "");
}

//checar si las coordenadas se salen del tablero
function fueraDelTablero(coordenadas) {
  return (
    coordenadas[0] < 0 ||
    coordenadas[0] > 9 ||
    coordenadas[1] < 0 ||
    coordenadas[1] > 9
  );
}

// mover una pieza con coordenadas de origen adicionales
function moverPiezaAmbigua(tablero, pieza, turno, posicion, come) {
  var columna = parseInt(convertirLetraANumero(posicion[1])) + 1;
  var renglon = 9 - parseInt(posicion[2]);
  var celda = tablero.rows[renglon].cells[columna];
  var renglonOrigen;
  var columnaOrigen;
  const origenes = obtenerOrigenes(
    tablero,
    pieza,
    turno,
    renglon,
    columna,
    come
  );
  var color = turno ? "-b" : "-n"; //si es turno de las blancas -b, si es turno de las negras -n
  var origen = null;

  if (/^\d/.test(posicion)) {
    renglonOrigen = 9 - parseInt(posicion.slice(0, 1));
    origenes.forEach((posibleOrigen) => {
      //checar si el posible origen está en el mismo renglón que el del movimiento
      if (
        posibleOrigen[1] == renglonOrigen &&
        !fueraDelTablero(posibleOrigen)
      ) {
        origen = tablero.rows[posibleOrigen[1]].cells[posibleOrigen[0]];
        if (origen.classList.contains(pieza + color)) {
          origen.classList.remove(pieza + color);
        }
      }
    });
  } else if (/^[a-zA-Z]/.test(posicion)) {
    columnaOrigen = parseInt(convertirLetraANumero(posicion.slice(0, 1))) + 1;
    origenes.forEach((posibleOrigen) => {
      //checar si el posible origen está en la misma columna que la del movimiento
      if (
        posibleOrigen[0] == columnaOrigen &&
        !fueraDelTablero(posibleOrigen)
      ) {
        origen = tablero.rows[posibleOrigen[1]].cells[posibleOrigen[0]];
        if (origen.classList.contains(pieza + color)) {
          origen.classList.remove(pieza + color);
        }
      }
    });
  }

  //agregar la pieza que se movio
  celda.classList.add(pieza + color);
}

//mover las piezas en el tablero
function moverPieza(tablero, turno, pieza, posicion, come) {
  var columna = parseInt(convertirLetraANumero(posicion[0])) + 1;
  var renglon = 9 - parseInt(posicion[1]);
  var celda = tablero.rows[renglon].cells[columna];
  const origenes = obtenerOrigenes(
    tablero,
    pieza,
    turno,
    renglon,
    columna,
    come
  );
  const color = turno ? "-b" : "-n"; //si es turno de las blancas -b, si es turno de las negras -n

  let eliminada = false; //checar si una pieza ya fue eliminada
  let origen = null;

  //por cada posible origen, elegir el mas probable
  origenes.forEach((coordenadasOrigen) => {
    if (!fueraDelTablero(coordenadasOrigen)) {
      origen = tablero.rows[coordenadasOrigen[1]].cells[coordenadasOrigen[0]];
      //eliminar una pieza si es del mismo tipo
      if (origen.classList.contains(pieza + color) && !eliminada) {
        origen.classList.remove(pieza + color);
        eliminada = true; //eliminar una sola pieza
      }
    }
  });



  //agregar la pieza que se movio
  celda.classList.add(pieza + color);
}

//funcion que regresa posibles origenes de la pieza que se movio
function obtenerOrigenes(tablero, pieza, turno, renglon, columna, come) {
  //objeto que contiene los posibles origenes de cada tipo de pieza
  const origenes = {
    caballo: [
      [columna - 2, renglon + 1],
      [columna - 1, renglon + 2],
      [columna + 2, renglon + 1],
      [columna + 1, renglon + 2],
      [columna - 1, renglon - 2],
      [columna + 1, renglon - 2],
      [columna + 2, renglon - 1],
      [columna - 2, renglon - 1],
    ],
    peon_blanco: [],
    peon_negro: [],
    reina: [],
    torre: [],
    rey: [
      [columna, renglon - 1],
      [columna, renglon + 1],
      [columna - 1, renglon],
      [columna - 1, renglon + 1],
      [columna - 1, renglon - 1],
      [columna + 1, renglon],
      [columna + 1, renglon + 1],
      [columna + 1, renglon - 1],
    ],
    alfil: [],
  };

  //posibles origenes de un peon blanco que comio una pieza
  const peonBlancoCome = [
    [columna - 1, renglon + 1],
    [columna + 1, renglon + 1],
  ];

  //posibles origenes de un peon negro que comio una pieza
  const peonNegroCome = [
    [columna - 1, renglon - 1],
    [columna + 1, renglon - 1],
  ];

  //posibles origenes de un peon blanco que se mueve normal
  const peonBlancoAvanza = [
    [columna, renglon + 1],
    [columna, renglon + 2]
  ];

  //posibles origenes de un peon negro que se mueve normal
  const peonNegroAvanza = [
    [columna, renglon - 1],
    [columna, renglon - 2]
  ];

  //agregar los origenes a la lista del peon
  if (pieza == "peon" && come) {
    turno
      ? origenes["peon_blanco"].push(...peonBlancoCome)
      : origenes["peon_negro"].push(...peonNegroCome);
  } else if (pieza == "peon" && !come) {
    turno
      ? origenes["peon_blanco"].push(...peonBlancoAvanza)
      : origenes["peon_negro"].push(...peonNegroAvanza);
    console.log(origenes);
  }

  //agregar origenes a las listas de la torre y la reina (renglon y columna)
  if (pieza == "torre" || pieza == "reina") {
    for (let j = 1; j < 9; j++) {
      if (
        columna != j &&
        tablero.rows[renglon].cells[j].classList.contains("celda")
      ) {
        //no agregar origen si hay un obstaculo (las torres no pueden brincar piezas)
        if (!origenConObstaculo([j, renglon], [columna, renglon], tablero)) {
          origenes["torre"].push([j, renglon]);
          origenes["reina"].push([j, renglon]);
        }
      }
      if (
        renglon != j &&
        tablero.rows[j].cells[columna].classList.contains("celda")
      ) {
        //no agregar origen si hay un obstaculo (las torres no pueden brincar piezas)
        if (!origenConObstaculo([columna, j], [columna, renglon], tablero)) {
          origenes["torre"].push([columna, j]);
          origenes["reina"].push([columna, j]);
        }
      }
    }
  }

  //agregar origenes a las listas del alfil y la reina (diagonales)
  if (pieza == "alfil" || pieza == "reina") {
    for (let i = -7; i < 9; i++) {
      if (
        renglon + i >= 1 &&
        renglon + i < 9 &&
        columna + i >= 1 &&
        columna + i < 9 &&
        i != 0 &&
        tablero.rows[renglon + i].cells[columna + i].classList.contains("celda")
      ) {
        origenes["alfil"].push([columna + i, renglon + i]);
        origenes["reina"].push([columna + i, renglon + i]);
      }
      if (
        renglon - i >= 1 &&
        renglon - i < 9 &&
        columna + i >= 1 &&
        columna + i < 9 &&
        i != 0 &&
        tablero.rows[renglon - i].cells[columna + i].classList.contains("celda")
      ) {
        origenes["alfil"].push([columna + i, renglon - i]);
        origenes["reina"].push([columna + i, renglon - i]);
      }
    }
  }

  if (pieza == "peon") {
    return origenes["peon_" + (turno ? "blanco" : "negro")];
  }
  return origenes[pieza];
}

//funcion que checa si hay una pieza entre un posible origen y la celda destino
function origenConObstaculo(origen, destino, tablero) {
  //obtener coordenadas
  const [columnaOrigen, renglonOrigen] = origen;
  const [columnaDestino, renglonDestino] = destino;

  // verificar si hay una pieza en el camino
  if (renglonOrigen === renglonDestino) {
    const inicio = Math.min(columnaOrigen, columnaDestino);
    const fin = Math.max(columnaOrigen, columnaDestino);
    for (let j = inicio + 1; j < fin; j++) {
      if (tablero.rows[renglonOrigen].cells[j].classList.length > 1) {
        return true; //sí hay una pieza en el camino
      }
    }
  } else if (columnaOrigen === columnaDestino) {
    const inicio = Math.min(renglonOrigen, renglonDestino);
    const fin = Math.max(renglonOrigen, renglonDestino);
    for (let i = inicio + 1; i < fin; i++) {
      if (tablero.rows[i].cells[columnaOrigen].classList.length > 1) {
        return true; //sí hay una pieza en el camino
      }
    }
  }
  // no hay pieza en el camino
  return false;
}

function reiniciarTablero(valor) {
  iniciar();
  const p = document.getElementById('js-out');
  p.textContent = "Movimiento: ";
  const select = document.getElementById("js-partidas");
  select.options[valor].selected = true;
  turno = true;
  i = 0;
  stopCompleto = false;
}

//refrescar ventana y seleccionar opcion por defecto en select
function reiniciar() {
  window.location.reload();
  const select = document.getElementById("js-partidas");
  for (let i = 0, l = select.length; i < l; i++) {
    select[i].selected = select[i].defaultSelected;
  }
}

//elegir una partida precargada
function partidas() {
  const textarea = document.getElementById("js-texto");
  const valor = document.getElementById("js-partidas").value;

  switch (valor) {
    case "0":
      textarea.value = "";
      reiniciarTablero(valor);
      break;
    case "1":
      textarea.value = `1. e4 e5\n2. Nf3 Nc6\n3. Bc4 Nf6\n4. Ng5 d5\n5. exd5 Nxd5\n6. Nxf7 Kxf7\n7. Qf3+ Ke6\n8. Nc3 Ne7\n9. d4 c6\n10. O-O Kd6\n11. Re1 Kc7\n12. Rxe5 Nxc3\n13. Bf4 Kb6\n14. bxc3 a6\n15. Rb1+ Ka7\n16. d5 c5\n17. d6 Ng6\n18. Rxc5 Nxf4\n19. Qxf4 Bxd6\n20. Qd4 Bxc5\n21. Qxc5+ Kb8\n22. Bd5 Re8\n23. c4 Re5\n24. f4 Rxd5\n25. cxd5 Qc7\n26. Qd4 b5\n27. c4 Qxc4\n28. Qe5+ Qc7\n29. d6 Qd7\n30. Rc1 Ra7\n31. Rc5 Rb7\n32. f5 Ka8\n33. g4 h6\n34. h4 Ka7\n35. Kh2 Kb8\n36. Kg3 Ka7\n37. Kf4 Kb8\n38. Ke4 Ka7\n39. Kd4 Kb8\n40. Kc3 Ka7\n41. Kb4 Kb8\n42. Ka5 Ka7\n43. Rc7 Rxc7\n44. Qd4+ Kb8\n45. dxc7+ Qxc7+\n46. Kb4 a5+\n47. Kxb5 Bd7+\n48. Ka6 Qb7+\n49. Kxa5 Qb5#`;
      reiniciarTablero(valor);
      break;
    case "2":
      textarea.value = `1. e4 c5\n2. Nf3 Nc6\n3. d4 cxd4\n4. Nxd4 e6\n5. Nc3 a6\n6. Be3 Qc7\n7. Qd2 Nf6\n8. f3 b5\n9. O-O-O Bb7\n10. g4 h6\n11. h4 Rc8\n12. Be2 Ne5\n13. g5 hxg5\n14. hxg5 Rxh1\n15. Rxh1 Ng8\n16. Rh8 Ne7\n17. f4 N5g6\n18. Ncxb5 axb5\n19. Nxb5 Qxc2+\n20. Qxc2 Rxc2+\n21. Kxc2 Nxh8\n22. Nd6+ Kd8\n23. Bb6#`;
      reiniciarTablero(valor);
      break;
    case "3":
      textarea.value = `1. d4 Nf6\n2. Nc3 d5\n3. Bg5 Nbd7\n4. Nf3 h6\n5. Bh4 g5\n6. Bg3 Bg7\n7. e3 O-O\n8. Bd3 c5\n9. Ne5 c4\n10. Bf5 e6\n11. Bg4 Nxg4\n12. Nxg4 f5\n13. Nxh6+ Bxh6\n14. Qh5 Qf6\n15. h4 g4\n16. O-O-O a6\n17. f3 Bxe3+\n18. Kb1 Bxd4\n19. fxg4 Bxc3\n20. bxc3 f4\n21. Bf2 Qxc3\n22. Bd4 Qb4+\n23. Ka1 Nf6\n24. Qg6+ Kh8\n25. Bxf6+ Rxf6\n26. Qxf6+ Kg8\n27. h5 Qf8\n28. Qe5 Bd7\n29. h6 Kh7\n30. Rdf1 Qh8\n31. Qxh8+ Rxh8\n32. Rxf4 Kg6\n33. Rhf1 Rxh6\n34. Rf6+ Kg5\n35. Rxh6 Kxh6\n36. Rf7 Bc6\n37. Re7 Kg5\n38. Rxe6 Kxg4\n39. Rg6+ Kf5\n40. Rg7 d4\n41. g4+ Kf6\n42. Rg8 d3\n43. cxd3 cxd3\n44. Kb2 Kf7\n45. Rd8 Be4\n46. Rd4 Bf3\n47. Rxd3 Bxg4\n48. Rb3 Bc8\n49. Rc3 Bd7\n50. Rc7 Ke6\n51. Rxb7 Kd6\n52. Rb6+ Kc5\n53. Rxa6 Kb5\n54. Rh6 Ka5\n55. Rh4 Be6\n56. a3 Bd5\n57. Rh5 Ka4\n58. Kc3 Kxa3\n59. Rxd5 Ka4\n60. Rc5 Ka3\n61. Ra5#`;
      reiniciarTablero(valor);
      break;
    case "4":
      textarea.value = `1. e4 e5\n2. Nf3 Nc6\n3. Bb5 a6\n4. Bxc6 dxc6\n5. O-O Bg4\n6. h3 h5\n7. hxg4 hxg4\n8. Nh2 Qh4\n9. f3 g3\n10. Re1 Qxh2+\n11. Kf1 Qh1+\n12. Ke2 Qxg2+\n13. Kd3 O-O-O+\n14. Kc3 Qf2\n15. d3 Qd4+\n16. Kd2 Rh2+\n17. Re2 g2\n18. c3 Qxd3+\n19. Ke1 g1=Q#`;
      reiniciarTablero(valor);
      break;
    case "5":
      textarea.value = `1. e4 e5\n2. Nf3 Nc6\n3. Bb5 a6\n4. Bxc6 dxc6\n5. d4 exd4\n6. Qxd4 Qxd4\n7. Nxd4 Nf6\n8. O-O Bc5\n9. Nb3 Bb6\n10. Nc3 O-O\n11. Bg5 Re8\n12. Bxf6 gxf6\n13. Rad1 f5\n14. Rfe1 fxe4\n15. Nxe4 Kg7\n16. Nbc5 Bxc5\n17. Nxc5 Rxe1+\n18. Rxe1 b6\n19. Nd3 Be6\n20. a3 Rd8\n21. Re3 c5\n22. Rg3+ Kf6\n23. h4 Rd4\n24. h5 Rh4\n25. Rf3+ Kg5\n26. Rg3+ Kxh5\n27. Ne5 Re4\n28. Nf3 Re2\n29. Rg5+ Kh6\n30. Rg8 Rxc2\n31. g4 f6\n32. g5+ fxg5\n33. Rxg5 Rxb2\n34. Rg3 Rb3\n35. Kh2 Bd5\n36. Rh3+ Kg7\n37. Rg3+ Kh8\n38. Ng5 Rxg3\n39. Kxg3 Kg7\n40. Kf4 h6\n41. Nh3 Kf6\n42. f3 Be6\n43. Nf2 h5\n44. Ne4+ Ke7\n45. Kg5 Bd5\n46. Nd2 Bxf3\n47. Nxf3 c4\n48. Nd4 Kd6\n49. Kxh5 Kd5\n50. Nc2 Ke4\n51. Kg4 Kd3\n52. Nb4+ Kd2\n53. Kf3 c3\n54. Ke4 c2\n55. Nxc2 Kxc2\n56. Kd4 Kb3\n57. Kd5 Kxa3\n58. Kc6 b5\n59. Kxc7 b4\n60. Kb6 b3\n61. Kxa6 b2\n62. Kb5 b1=Q+\n63. Kc4 Qb4+\n64. Kd3 Kb3\n65. Ke2 Qc3\n66. Kd1 Qb2\n67. Ke1 Kc3\n68. Kf1 Kd3\n69. Kg1 Ke3\n70. Kh1 Kf3\n71. Kg1 Qg2#`;
      reiniciarTablero(valor);
      break;
    default:
      break;
  }
}
