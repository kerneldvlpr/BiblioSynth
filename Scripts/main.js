// Esperar a que la página se cargue completamente antes de ejecutar el código
document.addEventListener("DOMContentLoaded", () => {
  /**
   * MÓDULO 1: GESTIÓN DEL MENÚ DE NAVEGACIÓN
   * Controla la apertura/cierre del submenú y el resaltado de la sección activa.
   */
  const setupNavigation = () => {
    // Buscar el botón que abre/cierra el menú desplegable
    const dropdownToggle = document.querySelector(
      '.header__menu-link[aria-haspopup="true"]'
    );
    // Buscar el elemento del submenú de libros
    const submenu = document.getElementById("submenu-books");

    // ---- Funcionalidad del menú desplegable ----
    // Verificar que tanto el botón como el submenú existen en la página
    if (dropdownToggle && submenu) {
      // Agregar evento de clic al botón del menú desplegable
      dropdownToggle.addEventListener("click", (e) => {
        // Prevenir el comportamiento por defecto del enlace
        e.preventDefault();
        // Verificar si el menú está actualmente expandido
        const isExpanded =
          dropdownToggle.getAttribute("aria-expanded") === "true";
        // Cambiar el estado del menú (abrir si está cerrado, cerrar si está abierto)
        dropdownToggle.setAttribute("aria-expanded", !isExpanded);
      });

      // Agregar evento para cerrar el menú cuando se hace clic fuera de él
      document.addEventListener("click", (e) => {
        // Si el clic no fue en el botón ni en el submenú, cerrar el menú
        if (!dropdownToggle.contains(e.target) && !submenu.contains(e.target)) {
          dropdownToggle.setAttribute("aria-expanded", "false");
        }
      });

      // Agregar evento para cerrar el menú con la tecla Escape
      document.addEventListener("keydown", (e) => {
        // Si se presiona Escape y el menú está abierto
        if (
          e.key === "Escape" &&
          dropdownToggle.getAttribute("aria-expanded") === "true"
        ) {
          // Cerrar el menú y devolver el foco al botón
          dropdownToggle.setAttribute("aria-expanded", "false");
          dropdownToggle.focus();
        }
      });
    }

    // ---- Funcionalidad de resaltado de sección activa con IntersectionObserver ----
    // Buscar todas las secciones de la página que tienen un ID
    const sections = document.querySelectorAll("main section[id]");
    // Buscar todos los enlaces de navegación que apuntan a secciones internas
    const navLinks = document.querySelectorAll('.header__menu a[href^="#"]');

    // Verificar si el navegador soporta IntersectionObserver
    if ("IntersectionObserver" in window) {
      // Crear un observador para detectar cuando las secciones entran/salen de vista
      const observer = new IntersectionObserver(
        (entries) => {
          // En cada cambio de intersección, primero quitamos la clase activa de todos los enlaces
          navLinks.forEach((link) => {
            link.classList.remove("header__menu-link--active");
          });

          // Luego, identificamos la sección que actualmente está en el centro de la vista
          // y le asignamos la clase activa a su enlace correspondiente.
          let activeSectionId = null;
          // Iteramos las entradas para encontrar la que está intersectando
          for (let i = 0; i < entries.length; i++) {
            if (entries[i].isIntersecting) {
              activeSectionId = entries[i].target.id;
              break; // Una vez que encontramos la primera sección intersectando, salimos
            }
          }

          // Si encontramos una sección activa, agregamos la clase a su enlace
          if (activeSectionId) {
            const currentActiveLink = document.querySelector(
              `.header__menu a[href="#${activeSectionId}"]`
            );
            if (currentActiveLink) {
              currentActiveLink.classList.add("header__menu-link--active");
            }
          }
        },
        {
          // Configurar para activar cuando la sección esté en el centro de la pantalla
          rootMargin: "-50% 0px -50% 0px", // Activa cuando la sección está en el centro de la pantalla
          threshold: 0, // Activar tan pronto como cualquier parte de la sección sea visible
        }
      );

      // Observar todas las secciones encontradas
      sections.forEach((section) => observer.observe(section));
    }
  };

  /**
   * MÓDULO 2: GENERADOR DE ENLACES DE BIBLE GATEWAY
   * Asigna dinámicamente las URLs correctas a los enlaces de los libros bíblicos.
   */
  const setupBibleLinks = () => {
    // Definir la versión de la Biblia a usar
    const BIBLE_VERSION = "RVR1960";
    // URL base del sitio Bible Gateway
    const BASE_URL = "https://www.biblegateway.com/passage/?search=";

    // Mapa de conversión de nombres de libros del español al formato requerido
    const bookNameMap = {
      Génesis: "Genesis",
      Éxodo: "Exodo",
      Levítico: "Levitico",
      Números: "Numeros",
      Deuteronomio: "Deuteronomio",
      Josué: "Josue",
      Jueces: "Jueces",
      Rut: "Rut",
      "1 Samuel": "1 Samuel",
      "2 Samuel": "2 Samuel",
      "1 Reyes": "1 Reyes",
      "2 Reyes": "2 Reyes",
      "1 Crónicas": "1 Cronicas",
      "2 Crónicas": "2 Cronicas",
      Esdras: "Esdras",
      Nehemías: "Nehemias",
      Ester: "Ester",
      Job: "Job",
      Salmos: "Salmos",
      Proverbios: "Proverbios",
      Eclesiastés: "Eclesiastes",
      Cantares: "Cantares",
      Isaías: "Isaias",
      Jeremías: "Jeremias",
      Lamentaciones: "Lamentaciones",
      Ezequiel: "Ezequiel",
      Daniel: "Daniel",
      Oseas: "Oseas",
      Joel: "Joel",
      Amós: "Amos",
      Abdías: "Abdias",
      Jonás: "Jonas",
      Miqueas: "Miqueas",
      Nahúm: "Nahum",
      Habacuc: "Habacuc",
      Sofonías: "Sofonias",
      Hageo: "Hageo",
      Zacarías: "Zacarias",
      Malaquías: "Malaquias",
      Mateo: "Mateo",
      Marcos: "Marcos",
      Lucas: "Lucas",
      Juan: "Juan",
      Hechos: "Hechos",
      Romanos: "Romanos",
      "1 Corintios": "1 Corintios",
      "2 Corintios": "2 Corintios",
      Gálatas: "Galatas",
      Efesios: "Efesios",
      Filipenses: "Filipenses",
      Colosenses: "Colosenses",
      "1 Tesalonicenses": "1 Tesalonicenses",
      "2 Tesalonicenses": "2 Tesalonicenses",
      "1 Timoteo": "1 Timoteo",
      "2 Timoteo": "2 Timoteo",
      Tito: "Tito",
      Filemón: "Filemon",
      Hebreos: "Hebreos",
      Santiago: "Santiago",
      "1 Pedro": "1 Pedro",
      "2 Pedro": "2 Pedro",
      "1 Juan": "1 Juan",
      "2 Juan": "2 Juan",
      "3 Juan": "3 Juan",
      Judas: "Judas",
      Apocalipsis: "Apocalipsis",
    };

    // Función para generar la URL completa de Bible Gateway
    const generateUrl = (bookName) => {
      // Convertir el nombre del libro usando el mapa, o usar el nombre original si no existe
      const normalizedBookName = bookNameMap[bookName] || bookName;
      // Codificar el nombre del libro para uso en URL
      const encodedBookName = encodeURIComponent(normalizedBookName);
      // Crear y retornar la URL completa
      return `${BASE_URL}${encodedBookName}&version=${BIBLE_VERSION}`;
    };

    // Buscar todos los enlaces de libros que tienen el atributo data-book
    const bibleLinks = document.querySelectorAll(".book-card__link[data-book]");
    // Procesar cada enlace de libro encontrado
    bibleLinks.forEach((link) => {
      // Obtener el nombre del libro desde el atributo data-book
      const bookName = link.dataset.book;
      // Verificar que el nombre del libro existe
      if (bookName) {
        // Asignar la URL generada al enlace
        link.href = generateUrl(bookName);
        // Configurar el enlace para abrir en una nueva pestaña
        link.target = "_blank";
        // Agregar atributos de seguridad para enlaces externos
        link.rel = "noopener noreferrer nofollow";
      } else {
        // Mostrar error en consola si falta el atributo data-book
        console.error("Enlace de libro sin atributo data-book:", link);
      }
    });
  };

  // Inicializar todos los módulos cuando la página esté lista
  setupNavigation();
  setupBibleLinks();
});
