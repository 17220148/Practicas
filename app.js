
const API_BASE_URL = "https://NUEVA-DIRECCION.trycloudflare.com";

async function registrarEvento(tipo, alias) {
    const respuesta = await fetch(
        `${API_BASE_URL}/api/eventos`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                tipo: tipo,
                alias_demo: alias
            })
        }
    );

    if (!respuesta.ok) {
        throw new Error(
            `Error del servidor: ${respuesta.status}`
        );
    }

    return await respuesta.json();
}
