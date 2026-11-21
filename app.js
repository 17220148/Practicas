
"use strict";

// ==========================================
// CONFIGURACION DE CLOUDFLARE TUNNEL
// ==========================================

const API_BASE_URL =
    "https://rip-publication-welcome-thumbnail.trycloudflare.com";


// ==========================================
// VALIDAR DATOS DE LABORATORIO
// ==========================================

function validarDatosDemo(ruta, datos) {

    // Solo permitir rutas del laboratorio
    const rutasPermitidas = [
        "/api/registro",
        "/api/login"
    ];

    if (!rutasPermitidas.includes(ruta)) {
        throw new Error("Ruta no permitida");
    }

    if (!datos || typeof datos !== "object") {
        throw new Error("Datos invalidos");
    }

    // Solo aceptar correos ficticios
    const patronCorreo =
        /^demo_[a-z0-9_]{1,30}@example\.test$/;

    if (
        typeof datos.correo !== "string" ||
        !patronCorreo.test(datos.correo)
    ) {
        throw new Error(
            "Utiliza un correo ficticio como demo_alumno@example.test"
        );
    }

    // Solo aceptar contrasenas ficticias
    const patronPassword =
        /^DEMO_[A-Za-z0-9_]{4,30}$/;

    if (
        typeof datos.password !== "string" ||
        !patronPassword.test(datos.password)
    ) {
        throw new Error(
            "La contrasena de prueba debe comenzar con DEMO_"
        );
    }

    // Validaciones adicionales para registro
    if (ruta === "/api/registro") {

        if (
            typeof datos.nombre !== "string" ||
            datos.nombre.trim().length < 2
        ) {
            throw new Error(
                "Introduce un nombre ficticio valido"
            );
        }

        if (
            typeof datos.apellido !== "string" ||
            datos.apellido.trim().length < 2
        ) {
            throw new Error(
                "Introduce un apellido ficticio valido"
            );
        }

        if (!datos.nacimiento) {
            throw new Error(
                "Selecciona una fecha de nacimiento ficticia"
            );
        }

        if (!["Mujer", "Hombre", "Otro"].includes(datos.genero)) {
            throw new Error(
                "Selecciona una opcion de genero"
            );
        }
    }
}


// ==========================================
// ENVIAR DATOS A FLASK
// ==========================================

async function enviarAPI(ruta, datos) {

    validarDatosDemo(ruta, datos);

    let respuesta;

    try {
        respuesta = await fetch(
            API_BASE_URL + ruta,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(datos),

                cache: "no-store"
            }
        );

    } catch (error) {

        console.error(
            "No se pudo conectar con Flask:",
            error
        );

        throw new Error(
            "No se pudo conectar con Kali Linux. " +
            "Verifica que Flask y Cloudflare Tunnel " +
            "esten funcionando."
        );
    }

    let resultado;

    try {
        resultado = await respuesta.json();

    } catch (error) {
        throw new Error(
            "El servidor no devolvio una respuesta JSON valida"
        );
    }

    if (!respuesta.ok) {

        console.error(
            "Error HTTP:",
            respuesta.status,
            resultado
        );

        throw new Error(
            resultado.error ||
            "Error del servidor: " + respuesta.status
        );
    }

    return resultado;
}


// ==========================================
// COMPROBAR CONEXION DE LA API
// ==========================================

async function comprobarConexion() {

    try {
        const respuesta = await fetch(
            API_BASE_URL + "/api/salud",
            {
                method: "GET",
                cache: "no-store"
            }
        );

        if (!respuesta.ok) {
            return false;
        }

        const datos = await respuesta.json();

        return datos.estado === "OK";

    } catch (error) {
        return false;
    }
}


// ==========================================
// MOSTRAR INFORMACION EN CONSOLA
// ==========================================

console.log(
    "Practica educativa de ciberseguridad"
);

console.log(
    "Servidor Flask:",
    API_BASE_URL
);
