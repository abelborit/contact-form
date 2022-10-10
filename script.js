function contactForm() {
  const $form = document.getElementById("contact-form");
  const $inputs = document.querySelectorAll(".contact-form [data-required]"); // todos los elementos del formulario que tengan el atributo "data-required"

  const $inputName = document.getElementById("input-name");
  const $inputEmail = document.getElementById("input-email");
  const $inputSubject = document.getElementById("input-subject");
  const $inputTextarea = document.getElementById("input-textarea");

  /* objeto que hace referencia a las expresiones regulares */
  const expresiones = {
    name: /^[A-Za-zÑñÁáÉéÍíÓóÚúÜü\s]{1,20}$/,
    email:
      /^[a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,15})$/,
    subject: /^.{1,40}$/,
    comments: /^.{1,255}$/,
  };

  /* objeto que hace referencia a los mensajes de error */
  const mensajes = {
    mensajeVacio: "Este es un campo requerido, no puede ir vacio",
    mensajeCoincidenciaName:
      "Este campo solo acepta hasta 20 caracteres, letras mayúsculas, minúsculas y espacios en blanco",
    mensajeCoincidenciaEmail: "Email incorrecto",
    mensajeCoincidenciaSubject: "El Asunto no debe exceder los 40 caracteres",
    mensajeCoincidenciaComments:
      "Tu comentario no debe exceder los 255 caracteres",
  };

  /* objeto que hace referencia si los campos están correctos o incorrectos */
  const validacionInput = {
    name: false,
    email: false,
    subject: false,
    comments: false,
  };

  $inputs.forEach((input) => {
    const $span = document.createElement("span");

    $span.id = input.name;
    $span.classList.add("contact-form-error");
    input.insertAdjacentElement("afterend", $span);
  });

  $inputName.addEventListener("keyup", (e) => {
    if (e.target.value !== "" && expresiones.name.test(e.target.value)) {
      /* mandar a llamar al "span" correspondiente a través de su "id" y remover la clase "is-active" */
      document.getElementById(e.target.name).classList.remove("is-active");
      validacionInput.name = true;
    } else {
      document.getElementById(e.target.name).classList.add("is-active");
      /* utilizar un operador ternario para que dependiendo de su condición mande a llamar a su "span" correspondiente mediante el "id" asignado previamente y muestre su texto en particular */
      !e.target.value
        ? (document.getElementById(e.target.name).textContent =
            mensajes.mensajeVacio)
        : (document.getElementById(e.target.name).textContent =
            mensajes.mensajeCoincidenciaName);
      validacionInput.name = false;
    }
  });

  $inputEmail.addEventListener("keyup", (e) => {
    if (e.target.value !== "" && expresiones.email.test(e.target.value)) {
      document.getElementById(e.target.name).classList.remove("is-active");
      validacionInput.email = true;
    } else {
      document.getElementById(e.target.name).classList.add("is-active");
      !e.target.value
        ? (document.getElementById(e.target.name).textContent =
            mensajes.mensajeVacio)
        : (document.getElementById(e.target.name).textContent =
            mensajes.mensajeCoincidenciaEmail);
      validacionInput.email = false;
    }
  });

  $inputSubject.addEventListener("keyup", (e) => {
    if (e.target.value !== "" && expresiones.subject.test(e.target.value)) {
      document.getElementById(e.target.name).classList.remove("is-active");
      validacionInput.subject = true;
    } else {
      document.getElementById(e.target.name).classList.add("is-active");
      !e.target.value
        ? (document.getElementById(e.target.name).textContent =
            mensajes.mensajeVacio)
        : (document.getElementById(e.target.name).textContent =
            mensajes.mensajeCoincidenciaSubject);
      validacionInput.subject = false;
    }
  });

  $inputTextarea.addEventListener("keyup", (e) => {
    if (e.target.value !== "" && expresiones.comments.test(e.target.value)) {
      document.getElementById(e.target.name).classList.remove("is-active");
      validacionInput.comments = true;
    } else {
      document.getElementById(e.target.name).classList.add("is-active");
      !e.target.value
        ? (document.getElementById(e.target.name).textContent =
            mensajes.mensajeVacio)
        : (document.getElementById(e.target.name).textContent =
            mensajes.mensajeCoincidenciaComments);
      validacionInput.comments = false;
    }
  });

  document.addEventListener("submit", (e) => {
    e.preventDefault();

    const $loader = document.getElementById("loader");
    const $responseCorrect = document.getElementById(
      "contact-form-correct-response"
    );
    const $responseIncorrect = document.getElementById(
      "contact-form-incorrect-response"
    );

    $loader.classList.remove("none");

    /* validación para saber si todos los campos son correctos */
    if (
      validacionInput.name &&
      validacionInput.email &&
      validacionInput.subject &&
      validacionInput.comments
    ) {
      $responseIncorrect.classList.add("none");
      /* el API de FormSubmit nos devuelve la respuesta en formato JSON */
      fetch("https://formsubmit.co/ajax/your@email.com", {
        method: "POST",
        /* El FormDataobjeto le permite compilar un conjunto de pares clave/valor para enviar usando XMLHttpRequest. Está diseñado principalmente para enviar datos de formularios */
        /* utilizaremos el FormData() para que parsee el elemento y su valor de cada elemento del formulario, es decir cada input con su texto que escribimos. FormData() puede recibir un elemento HTML que sea formulario y recordar que el evento "submit" lo estamos trabajando cuando enviamos el formulario, entonces en este caso el "e.target" hace referencia al formulario. Entonces como el "el objeto que origina el evento submit es el formulario de HTML" (utilizando el e.target) con esto el FormData() ya hace automáticamente el parseeo de todos los elementos del formulario pero para esto es necesario que todos los elementos input tengan el atributo "name" ya que este es el nombre de la variable cuando se envía el formulario */
        body: new FormData(e.target),
      })
        .then((respuesta) =>
          respuesta.ok ? respuesta.json() : Promise.reject(respuesta)
        )
        .then((json) => {
          // console.log(json);
          $loader.classList.add("none");
          $responseCorrect.classList.remove("none");
          // $response.innerHTML = `<p>${json.message}</p>`;
          $form.reset();
        })
        .catch((error) => {
          // console.log(error);
          let message =
            error.statusText ||
            "Ocurrió un error al enviar el formulario, intenta nuevamente";
          $responseIncorrect.innerHTML = `<span>Error ${error.status}: ${message}</span>`;
        })
        .finally(() => {
          setTimeout(() => {
            $responseIncorrect.classList.add("none");
            $responseCorrect.classList.add("none");
            location.reload();
          }, 2000);
        });
    } else {
      $loader.classList.add("none");
      $responseIncorrect.classList.remove("none");
      setTimeout(() => {
        $responseIncorrect.classList.add("none");
      }, 2000);
    }
  });
}

document.addEventListener("DOMContentLoaded", contactForm);
