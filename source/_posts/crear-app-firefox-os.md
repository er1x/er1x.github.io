title: Cómo Crear una App para Firefox OS
date: 2015-06-01 07:13:00
tags: ['mobile']
---

![FirefoxOS](/images/2015-06/FirefoxOS.png)

[Firefox OS](https://www.mozilla.org/es-ES/firefox/os/2.0/) es uno de los SO móviles menos conocidos. Y es que de momento no hay muchas Apps, y los teléfonos disponibles no son muchos, ni de grandes prestaciones. El foco de Firefox OS era democratizar el uso del smartphone con  [terminales de muy bajo coste](http://www.amazon.es/gp/product/B00MTZRW3C/ref=as_li_tf_tl?ie=UTF8&camp=3626&creative=24790&creativeASIN=B00MTZRW3C&linkCode=as2&tag=jsj04-21). Aunque parece que [esto puede cambiar](http://www.cnet.com/news/mozilla-overhauls-firefox-smartphone-plan-to-focus-on-quality-not-cost/).

Pero lo que a mí (y a tí seguro que también) más me gusta de Firefox OS es que todas las aplicaciones son aplicaciones web. **Si sabes desarrollo web, ya eres un desarrollador de apps para Firefox OS**. Así de simple.

Además el futuro de HTML5 en el desarrollo móvil es prometedor, como se intuye viendo frameworks como [Ionic](http://ionicframework.com/). Al fin y al cabo, es un movimiento que ya ocurrió con las aplicaciones de escritorio.

Desarrollar para FirefoxOS es superfácil, ahora verás cómo. Vamos a crear un **app muy sencilla que consuma un servicio REST de meteorología**.

## Instala el emulador

Lo primero que vamos a hacer es instalar un emulador. Para ello, instala [Firefox Developer Edition](https://www.mozilla.org/es-ES/firefox/developer/). En este caso el emulador es un complemento del navegador Firefox. Si has usado el AVD de Android, te alegrará saber que este emulador le da mil vueltas en velocidad.

Abre el navegador y pulsa en el botón WebIDE, con este icono  ![webide](/images/2015-06/webide.png)

Tras esto, pulsa en el botón *Seleccionar entorno de ejecución* e instala la versión que quieras. Yo he elegido la estable.

![instalar simulador](/images/2015-06/ffox1.png)

![instalar version estable](/images/2015-06/ffox2.png)


## Crea un proyecto base

Para empezar un proyecto abre el WebIDE y selecciona *Proyecto/Nueva Aplicación*. Te saldrán tres plantillas para escoger: *Hello World / Privileged Empty App / Privileged App*. Escoge **Hello World**. En realidad la única diferencia es el código de ejemplo que viene dentro de la plantilla, y el de Hello World es el que menos ~~mierda~~ contenido mete.

![escoger plantilla](/images/2015-06/app1.png)

Escoge una carpeta destino donde dejar el proyecto y pulsa Aceptar. A continuación se te abrirá el proyecto en el WebIDE. Yo prefiero editar el proyecto con otro editor y utilizar el WebIDE para ejecutarlo. Tú elige lo que prefieras.

Para ejecutar el proyecto primero **arranca el emulador pulsando en *Seleccionar entorno de ejecución* y a continuación en el que hayas instalado**.

![arrancar emulador](/images/2015-06/app2.png)

Una vez arrancado pulsa el botón de *Play* y la aplicación se instalará y ejecutará en el emulador. Después puedes ejecutarla de nuevo tantas veces como quieras usando el botón de refresco que aparecerá en lugar del *play*.

![ejecutar app](/images/2015-06/app3.png)

### El código base

Lo único que debe interesarte de la carpeta del código es el fichero **manifest.webapp**. Este es el fichero que le dice a Firefox OS cuál es el **punto de entrada de tu aplicación y qué permisos va a requerir**, de una forma similar al manifest de una aplicación Android, pero en JSON y mucho más legible.

Los campos que trae el ejemplo base son auto-explicativos:

```javascript
{
  "name": "GooseMountains Weather",
  "description": "A Hello World app",
  "launch_path": "/index.html",
  "icons": {
    "16": "/icons/icon16x16.png",
    "48": "/icons/icon48x48.png",
    "60": "/icons/icon60x60.png",
    "128": "/icons/icon128x128.png"
  },
  "developer": {
    "name": "Your name",
    "url": "http://example.com"
  }
}
```

Este fichero admite muchos parámetros de configuración, y vienen explicados en la [web desarrollo de Mozilla](https://developer.mozilla.org/es/Apps/Build/Manifest). Nosotros utilizaremos algunos para el ejemplo.

Salvo este fichero **manifest.webapp**, el resto de tu aplicación la podemos organizar como queramos, pues es una aplicación web normal y corriente. De hecho es lo que vamos a hacer.

## Desarrolla una App

Vamos a crear una **App muy simple que consulte un servicio REST**. La aplicación constará de:

* Un index.html
* Un app.js
* El manifest.webapp
* CSS, jQuery y poco más.

Recuerda que es una aplicación web normal y corriente. Por tanto puedes usar jQuery, Angular, [D3](/2015/05/empezar-con-d3js/)...

Si quieres ver el código de la aplicación completa, [puedes hacerlo aquí](https://github.com/er1x/ffos-example). A continuación te muestro y explico los ficheros más importantes.

### index.html

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,user-scalable=no,initial-scale=1">
    <title>GooseMountains Weather</title>
    <link rel="stylesheet" href="style.css">
  </head>

  <body>
    <header>
      ¡GooseMountains Weather Station!
    </header>

    <main>
      <h1 id="city"></h1>
      <h2 id="error"></h2>
      <section id="currentWeather"></section>
    </main>

    <script src="jquery-2.1.4.min.js"></script>
    <script src="app.js"></script>
  </body>

</html>
```

Como ves, es un index.html normal y corriente, en el que se definen unas etiquetas h1, h2 y section en la que se cargará el contenido obtenido del servicio REST que consultaremos, con la ayuda de jQuery.

### app.js

```javascript

function getWeatherInfo(pos) {
  var apiUrl = 'http://api.openweathermap.org/data/2.5/weather?' +
               'lat=' + pos.coords.latitude +
               '&lon=' + pos.coords.longitude;
  $.getJSON(apiUrl, function(data) {
    $('#currentWeather').text(data.weather[0].main + ': ' + data.weather[0].description);
    $('#city').text(data.name);
  });
}

function init() {
  if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(getWeatherInfo, function(err) {
      $('#error').html(err.message);
    });
  } else {
    alert('This app needs geolocation to work!');
  }
}

window.onLoad = init();
```

Este fichero realiza lo siguiente:

* Cuando termina de cargar la web, ejecuta la función *init*.
* La funcion *init* comprueba que el navegador tiene disponible la **API de geolocalización** (pues queremos consultar el tiempo que hace en nuestra zona). Si la geolocalización está disponible, llama a la función *navigator.geolocation.getCurrentPosition*.
* [navigator.geolocation.getCurrentPosition](https://developer.mozilla.org/es/docs/Web/API/Geolocation/getCurrentPosition) es una API que nos proporciona la geolocalización del dispositivo. Le pasamos la función *getWeatherInfo* como manejador.
* *getWeatherInfo* **recibe la posición como parámetro y consulta una API REST meteorológica** el tiempo de la zona, utilizando la latitud y longitud que vienen en la variable *pos*. Si funciona correctamente, rellena los elementos de la web con la información.

### manifest.webapp

```javascript
{
  "name": "GooseMountains Weather",
  "description": "A simple weather app",
  "launch_path": "/index.html",
  "icons": {
    "16": "/icons/icon16x16.png",
    "48": "/icons/icon48x48.png",
    "60": "/icons/icon60x60.png",
    "128": "/icons/icon128x128.png"
  },
  "type": "web",
  "permissions": {
    "geolocation": {
      "description": "Needed for showing forecast!"
    }
  }
}
```

Como ves, la aplicación indica que requiere el [permiso](https://developer.mozilla.org/en-US/Apps/Build/App_permissions) para usar la [API de geolocalización](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation/Using_geolocation). También se ponen otros datos, como el nombre de la app, descripción, iconos y fichero principal.

Además si te fijas estamos declarando el *"type":"web"*. Esto es porque Firefox OS divide las aplicaciones en tres tipos:

* Web: las más básicas. De hecho son el tipo por defecto si no rellenas este campo.
* Privilegiadas: aplicación aprobada en el [Firefox Marketplace](https://marketplace.firefox.com/?lang=es). Puede acceder a más APIs que la app web.
* Certificadas: las internas de Firefox OS. Nivel de privilegio ~~over nine thousand~~ máximo.


## Probando la App

Para probar la app, puedes clonar el proyecto de ejemplo:
```bash
git clone https://github.com/er1x/ffos-example
```
Después abre el WebIDE y ve a *Abrir aplicación.../aplicación empaquetada*. Selecciona la carpeta del proyecto clonado. También puedes utilizar el proyecto que creaste antes, reemplazando los ficheros por defecto con los del repositorio.

Arranca el simulador y pulsa el icono de Play para ejecutar la aplicación. Verás que solicita permiso para acceder a la geolocalización.

<div class="container" style="width: 100%;">
 <div class="theme-table-image col-sm-6">
   <img src="/images/2015-06/solicitud-permiso.png" alt="solicitud-permiso">
 </div>
 <div class="theme-table-image col-sm-6">
   <img src="/images/2015-06/app-funcionando.png" alt="app-funcionando">
 </div>
</div>


## Bonus: ¡debug!

Una de las cosas que más molan de Firefox OS es que **puedes usar el propio debugger de Firefox para depurar la aplicación**. Para ello solo tienes que pulsar F12 o irte a *Proyecto/Depurar* aplicación en el WebIDE.

Mira cómo aparece un console.log:

![debug](/images/2015-06/debug.png)

Espero que te haya gustado la forma de desarrollar en Firefox OS y te anime, al menos, a probar la plataforma.

Aunque no creo que llegue a ser una plataforma mayoritaria, pienso que la variedad de opciones hace que haya más competencia y que los usuarios y desarrolladores ganen con ello.

> Cada vez que se encuentre usted del lado de la mayoría, es tiempo de hacer una pausa y reflexionar.
> **Mark Twain**
