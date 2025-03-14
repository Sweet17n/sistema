function mostrarPregunta(id) {
    let preguntaObj = preguntas[id];
    if (!preguntaObj) return;

    document.getElementById("pregunta").innerText = preguntaObj.pregunta;
    document.getElementById("descripcion").innerText = preguntaObj.descripcion || "";
    document.getElementById("lista-recomendaciones").innerHTML = "";
    document.getElementById("boton-reiniciar").style.display = preguntaObj.opciones ? "none" : "block";

    let opcionesDiv = document.getElementById("opciones");
    opcionesDiv.innerHTML = "";

    if (preguntaObj.opciones) {
        for (let opcion in preguntaObj.opciones) {
            let btn = document.createElement("button");
            btn.className = "opcion";
            btn.innerText = opcion;
            btn.onclick = function() { mostrarPregunta(preguntaObj.opciones[opcion]); };
            opcionesDiv.appendChild(btn);
        }
    } else if (preguntaObj.recomendaciones) {
        let lista = document.getElementById("lista-recomendaciones");
        preguntaObj.recomendaciones.forEach(reco => {
            if (reco.edad === "all" || (reco.edad === "13+" && datosUsuario.edad >= 13) || (reco.edad === "18+" && datosUsuario.edad >= 18)) {
                let li = document.createElement("li");
                li.innerHTML = `
                    <img src="${reco.imagen}" alt="${reco.nombre}">
                    <p>${reco.nombre}</p>
                `;
                li.onclick = function() { 
                    mostrarLibro(datosUsuario.idioma === "español" ? reco.libro_es : reco.libro_en, reco.sinopsis); 
                };
                lista.appendChild(li);
            }
        });

        if (lista.innerHTML === "") {
            let li = document.createElement("li");
            li.innerText = "No hay recomendaciones disponibles para tu edad.";
            lista.appendChild(li);
        }
    }
}