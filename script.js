// ** - 1 -
// Cargar opciones de lenguajes desde el archivo JSON desde mis archivos 'lenguajes.json'
// const lenguajeSelect = document.getElementById('lenguaje');

// fetch('lenguajes.json')
//   .then(response => response.json())
//   .then(data => {
//     console.log(data); // Check if the data is being loaded correctly -Compruebe si los datos se están cargando correctamente
//     data.forEach(lenguaje => {
//       const option = document.createElement('option');
//       option.value = lenguaje.value;
//       option.textContent = lenguaje.title;
//       lenguajeSelect.appendChild(option);
//     });
//   });

// ** - 2 -
// Cargar opciones de lenguajes desde el archivo JSON desde el link
const lenguajeSelect = document.getElementById("lenguaje");
fetch(
  "https://raw.githubusercontent.com/kamranahmedse/githunt/master/src/components/filters/language-filter/languages.json"
)
  .then((response) => response.json())
  .then((data) => {
    console.log(data); // Check if the data is being loaded correctly -Compruebe si los datos se están cargando correctamente
    data.forEach((lenguaje) => {
      const option = document.createElement("option");
      option.value = lenguaje.value;
      option.textContent = lenguaje.title;
      lenguajeSelect.appendChild(option);
    });
  });

// Función para buscar repositorios por lenguaje
// Modificar la función de búsqueda para limpiar resultados antes de mostrar errores
const buscarRepositorio = async (lenguaje) => {
  const githubApiUrl = "https://api.github.com/search/repositories";
  const pat = "Ingresa-tu-token"; // Reemplaza con tu token
  const url = `${githubApiUrl}?q=language:${lenguaje}&sort=random&order=desc`;
  const headers = {
    Authorization: `Bearer ${pat}`,
    "Content-Type": "application/json",
  };

  const timeout = new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(new Error("Timeout"));
    }, 7000); // 7 segundos
  });

  try {
    const respuesta = await Promise.race([fetch(url, { headers }), timeout]);
    const datos = await respuesta.json();
    console.log(datos); // Check the response data
    if (datos.items.length === 0) {
      throw new Error("No se encontraron repositorios");
    }
    return datos.items[0];
  } catch (error) {
    console.error(error);
    mostrarError("No se encontraron repositorios o ocurrió un error");
    return null; // Retornar null si hay un error
  }
};

// Función para mostrar el mensaje de error
const mostrarError = (mensaje) => {
  // Limpiar resultados anteriores
  mostrarRepositorio(null); // Llamar a mostrarRepositorio con null para limpiar

  const errorMessageElement = document.getElementById("error-message");
  const repositorioMensajeInicial = document.getElementById(
    "repositorio-mensajeInicial"
  );
  const repositorioInfo = document.getElementById("repositorio-info");
  repositorioMensajeInicial.style.display = "none";
  repositorioInfo.style.backgroundColor = "red"; // Resetear el fondo
  errorMessageElement.textContent = mensaje;
  errorMessageElement.style.background = "red";
  errorMessageElement.style.display = "block";
};

// Function to hide the error message
const hideError = () => {
  const errorMessageElement = document.getElementById("error-message");
  const repositorioInfo = document.getElementById("repositorio-info");
  const repositorioMensajeInicial = document.getElementById(
    "repositorio-mensajeInicial"
  );
  repositorioMensajeInicial.style.display = "block";
  repositorioInfo.style.background = "#fff";
  errorMessageElement.style.display = "none";
};



// Función para mostrar información del repositorio
const mostrarRepositorio = (repositorio) => {
  // Limpiar resultados anteriores
  const repositorioNombre = document.getElementById("repositorio-nombre");
  const repositorioDescripcion = document.getElementById(
    "repositorio-descripcion"
  );
  const repositorioEstrellas = document.getElementById("repositorio-estrellas");
  const repositorioBifurcaciones = document.getElementById(
    "repositorio-bifurcaciones"
  );
  const repositorioProblemas = document.getElementById("repositorio-problemas");
  const repositorioInfo = document.getElementById("repositorio-info");
  const errorMessageElement = document.getElementById("error-message");
  const repositorioMensajeInicial = document.getElementById('repositorio-mensajeInicial');

  repositorioNombre.textContent = "";
  repositorioDescripcion.textContent = "";
  repositorioEstrellas.textContent = "";
  repositorioBifurcaciones.textContent = "";
  repositorioProblemas.textContent = "";

  // Mostrar nueva información
  if (repositorio) {
    // repositorioNombre.textContent = repositorio.name;
    repositorioNombre.innerHTML = `<i class="fa-sharp fa-solid fa-language"></i> ${repositorio.name}`;
    repositorioDescripcion.textContent = repositorio.description || "No hay descripción disponible";
    // repositorioEstrellas.textContent = `Estrellas: ${repositorio.stargazers_count}`;
    // Modificamos la linea anterior para incluir el ícono ahora usamos innerHTML.
    repositorioEstrellas.innerHTML = `<i class="fa-sharp fa-solid fa-star"></i> Estrellas: ${repositorio.stargazers_count} `;
    // repositorioBifurcaciones.textContent = `Bifurcaciones: ${repositorio.forks_count}`;
    repositorioBifurcaciones.innerHTML = `<i class="fa-sharp fa-solid fa-code-fork"></i> Bifurcaciones: ${repositorio.forks_count}`;
    // repositorioProblemas.textContent = `Problemas abiertos: ${repositorio.open_issues_count}`;
    repositorioProblemas.innerHTML = `<i class="fa-sharp fa-solid fa-circle-exclamation"></i> Problemas abiertos: ${repositorio.open_issues_count}`;
    repositorioInfo.style.background = "#b8d5f1"; // Cambiar el fondo
    errorMessageElement.style.display = "none"; // Ocultar el mensaje de error
    repositorioMensajeInicial.style.display = "none"; // Ocultar mensaje de información inicial
  }
};

// Función para refrescar la búsqueda
const refrescarBusqueda = () => {
  console.log("Refrescando búsqueda...");
  const lenguaje = document.getElementById("lenguaje").value;
  buscarRepositorio(lenguaje).then((repositorio) => {
    mostrarRepositorio(repositorio);
  });
};

// Evento de clic en el botón de buscar repositorio
const buscarRepositorioButton = document.getElementById("buscar-repositorio");
buscarRepositorioButton.addEventListener("click", () => {
  const lenguaje = document.getElementById("lenguaje").value;
  buscarRepositorio(lenguaje).then((repositorio) => {
    mostrarRepositorio(repositorio);
  });
});

// Evento de tecla presionada o click al botón refrescar-busqueda
const refrescarBusquedaButton = document.getElementById("refrescar-busqueda");
refrescarBusquedaButton.addEventListener("click", refrescarBusqueda);
