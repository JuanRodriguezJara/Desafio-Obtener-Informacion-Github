// Conseguir URL
const baseUrl = "https://api.github.com/users";

// Funcion Request para hacer las peticiones a la API y retornar el resultado
const request = async (url) => {
  const results = await fetch(url);
  const response = await results.json();
  return response;
};

// Funcion getUser para enviar los datos a request y obtener la info de los usuarios
const getUser = async (id) => {
  const url = `${baseUrl}/${id}`;
  return request(url);
};

// Funcion getRepo para enviar los datos a request y obtener la info de los repositorios
const getRepo = async (id, pagina, repos) => {
  const url = `${baseUrl}/${id}/repos?page=${pagina}&per_page=${repos}`;
  return request(url);
};

// Agregar una escucha al formulario para activar una funcion que capture los datos ingresados por el usuario de la pagina, al presionar el boton "Enviar"
const button = document.querySelector(".btn");
button.addEventListener("click", (event) => {
  event.preventDefault();
  const nombre = document.getElementById("nombre").value;
  const pagina = document.getElementById("pagina").value;
  const repos = document.getElementById("repoPagina").value;
  // console.log(repos);                                    // => console para verificar que la info está siendo recibida
  const resultado = document.getElementById("resultados");
  const lista = document.getElementById("lista");           // => resultados y lista es para seleccionar en el html en donde imprimir la info
  const form = document.querySelector("form");              // => para posteriormente resetear el formulario 

// Mediante Promesa, realizar el llamado a las 2 funciones para traer la info en caso de existir getUser y getRepo
  Promise.all([getUser(nombre), getRepo(nombre, pagina, repos)]).then(
    (resp) => {
      try {
        if (resp[0].message === "Not Found") {              // => al no encontrar un usuario registrado, lo retornará como Not Found, creando una alerta de Usuario no Existe
          alert("Usuario no Existe :(");
          throw new Error("usuario no encontrado");
        }
        const usuario = resp[0];                                  
        const repositorio = resp[1];

        // rescatando y obteniendo los datos del Array del Github
        const avatar = usuario.avatar_url;
        const name = usuario.name;
        const login = usuario.login;
        const repositorios = usuario.public_repos;
        const localidad = usuario.location;
        const tipoUsuario = usuario.type;                 

        // imprimiendo los datos del usuario en pantalla
        resultado.innerHTML = `<h2>Datos de Usuario</h2>
                <img id="avatar" src="${avatar} class="img-responsive" style="width:250px">
                <br></br>
                <p><strong>Nombre de usuario:</strong> ${name}</p>
                <p><strong>Nombre de login:</strong> ${login}</p>
                <p><strong>Cantidad de Repositorios:</strong> ${repositorios}</p>
                <p><strong>Localidad:</strong> ${localidad}</p>
                <p><strong>Tipo de Usuario:</strong> ${tipoUsuario}</p>`;

        // imprimiendo los datos del repositorio en pantalla
        lista.innerHTML = `<h2>Nombre de Repositorios</h2>`;
        repositorio.forEach((element) => {
          const r = element.name;
          const repos2 = element.html_url;
          const lista = document.getElementById("lista");
          lista.innerHTML += `<p><a href=${repos2}> ${r}</a></p>`;
        });
      // en caso de mostrar error o usuario no existe, borra la información ya mostrada en pantalla 
      } catch (err) {
        (resultado.innerHTML = ""), 
        (lista.innerHTML = "");
      };
    },
  );
  form.reset();         // => para resetear el formulario luego de presionar enviar
});
