
"use strict";

// URL del tunel activo de Cloudflare
const API_BASE_URL =
    "https://AQUI-VA-TU-ENLACE.trycloudflare.com";

// Validacion de cuentas ficticias
function validarDatosDemo(ruta, datos) {

    if (!["/api/registro", "/api/login"].includes(ruta)) {
        throw new Error("Ruta no permitida");
    }

    if (!/^demo_[a-z0-9_]{1,30}@example\.test$/.test(datos.correo || "")) {
        throw new Error(
            "Utiliza un correo ficticio como demo_alumno@example.test"
        );
    }

    if (!/^DEMO_[A-Za-z0-9_]{4,30}$/.test(datos.password || "")) {
        throw new Error(
            "Utiliza una contraseña ficticia que comience con DEMO_"
        );
    }
}

// Funcion utilizada por index.html y registro.html
async function enviarAPI(ruta, datos) {

    validarDatosDemo(ruta, datos);

    const respuesta = await fetch(API_BASE_URL + ruta, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(datos),
        cache: "no-store"
    });

    const resultado = await respuesta.json();

    if (!respuesta.ok) {
        throw new Error(
            resultado.error || "Error HTTP " + respuesta.status
        );
    }

    return resultado;
}
