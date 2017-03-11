title: 'Cómo añadir un mapa a una app híbrida en Ionic'
date: 2016-05-25 20:30:00
tags: ['ionic']
---
Casi a diario tengo que trabajar con mapas dentro de aplicaciones de Angular, así que he decidido hacer un breve tutorial sobre ello.
<br>
Para el ejemplo vamos a suponer que tenemos que hacer una app para una pizzería y mostrar en un mapa la localización de la misma. Se me ha ocurrido lo de la pizzería porque el otro día revisioné aquel capítulo de [*How I Met Your Mother* en el que Ted y Marshall van a la pizzería Gazzola's](http://how-i-met-your-mother.wikia.com/wiki/Gazzola's), en Chicago, a tope de latas de *Tantrum*. Rofl.

![](/images/2016-05/RoadTrip.jpg)

## Iniciando el proyecto

[Como todo proyecto de Ionic](/2015/06/tutorial-ionic-parte-uno/), lo primero que tenemos que hacer es inicializarlo:

```bash
ionic start mi-supertienda blank
ionic serve
```

Para el index.html vamos a poner:
* Un header.
* Una pequeña tarjeta con una foto de una pizza (utilizando el estupendo servicio de [LoremPizza.com](http://lorempizza.com/)).
* Otra tarjeta para el mapa.

La cosa va siendo así:

```html
<body ng-app="starter">
  <ion-pane>
    <ion-header-bar class="bar-assertive">
      <h1 class="title">Super Pizzas!</h1>
    </ion-header-bar>
    <ion-content padding="20" ng-controller="MainController as ctrl">
      <h2>¡Bienvenido a Super Pizzas!</h2>
      <div class="card">
        <div class="item item-image">
          <img src="http://lorempizza.com/480/240">
        </div>
        <a class="item item-icon-left" href="#" ng-click="ctrl.directions()">
          <i class="icon ion-map"></i>
          ¡Pulsa para saber cómo llegar!
        </a>
      </div>

      <div class="card">
        mapa...
      </div>
    </ion-content>
  </ion-pane>
</body>
```
![Primer vistazo](/images/2016-05/pizzas1.png)

De momento no va mal. Solo con la foto de la pizza ganamos bastantes enteros :)

Ahora se trata de añadir el mapa.

## Instalando leaflet y añadiendo el mapa

Para el mapa usaremos la biblioteca [Leaflet](http://leafletjs.com/), que es de las que tiene más comunidad y mejor rendimiento da (a mí me gusta más que Google Maps).

Simplemente, bajamos [el .zip](http://cdn.leafletjs.com/leaflet/v0.7.7/leaflet.zip) y lo ponemos en la carpeta www/lib de la app. Luego es sólo añadir el .css y el .js en el index.html de la aplicación.

Con ello hecho, vamos a **crear una directiva para el mapa**. En este caso quiero que la directiva:

* Sea un atributo de un div.
* Pinte el mapa.

La cosa va así:

```js
.directive('myMap', [ function () {
  return {
    restrict: 'A',
    link: function (scope) {
      var map = L.map('myMap').setView([40.4, -3.7], 12)
      L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
      }).addTo(map)

      L.marker([40.4, -3.7])
       .addTo(map)
    }
  }
}])
```

El mapa deberá tener una altura. La definimos en CSS:

```CSS
#myMap {
  height: 40vh;
}
```

La añadimos al HTML, de esta forma:
```html
<div class="card">
  <div id="myMap" my-map></div>
</div>
```

Quedando así:

![Mapa añadido](/images/2016-05/pizzas2.png)


Lo que hemos hecho es:

* Crear un mapa con *L.map*, indicándole un id, y poner el centro en unas coordenadas y un nivel de zoom con *setView*.
* Después añadimos con *addTo* un mapa base creado con *L.tileLayer*. Para el mapa base he escogido el de [CartoDB](https://cartodb.com/), que mola mucho, pero puedes elegir [entre un montón](https://leaflet-extras.github.io/leaflet-providers/preview/).
* Por último, añadimos un marcador en la posición del comercio (me la he inventado), con *L.marker*.

## Personalizando el marcador

El marcador no está mal, pero lo chulo sería sacar algún dibujillo.

Para ello podríamos:

* Crear un icono a partir de una imagen, con *L.icon*.
* Currar un poco más y crear un div, personalizándolo un poco, con *L.divIcon*.

Vamos a utilizar esta segunda opción, **metiendo dentro del div un SVG y personalizándolo con CSS** (cualquier *no-informático* que oiga a alguien así debe parecerle un marciano T_T).

Bien, pues, con L.divIcon podemos hacer:

```js
var myIcon = L.divIcon({
              className: 'pizzaIcon',
              html: '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="512" height="512" viewBox="0 0 512 512">' +
              '<g>' +
              '</g>' +
              '<path d="M249.262 255.693l229.612-39.792c1.853 12.851 3.072 26.327 3.072 39.792 0 132.239-104.1 239.401-232.684 239.401-129.188 0-233.267-107.161-233.267-239.401 0-131.625 104.079-238.776 233.267-238.776 26.327 0 52.665 4.895 77.763 13.476l-77.762 225.3zM219.259 281.385l69.796-222.843c-116.327-35.492-238.776 88.187-238.776 197.15 0 112.661 88.791 204.503 198.983 204.503 109.599 0 198.369-91.843 198.369-204.503 0-1.813 0-4.291 0-6.113l-228.373 31.805z" fill="#000000" />' +
              '<path d="M496.005 165.694c-57.579 9.175-115.108 17.746-172.647 26.962l28.15-71.055c1.229 0.635 2.457 0.635 3.666 0.635 12.872 0 23.286-12.237 23.286-26.931 0-7.966-3.082-15.944-8.601-20.828l17.767-43.459c61.87 22.006 101.642 64.276 108.38 134.677v0zM442.747 117.954c-9.8 0-17.756 7.936-17.756 17.726s7.957 17.767 17.756 17.767c9.769 0 17.736-7.977 17.736-17.767s-7.966-17.725-17.736-17.725z" fill="#000000" />' +
              '<path d="M196.004 301.609l210.617-18.985c0 1.843 0 3.676 0 5.54-0.604 15.278-3.072 28.743-6.134 40.981-6.123-8.56-15.923-14.060-27.546-14.060-18.37 0-33.045 14.060-33.045 31.222 0 17.142 14.674 31.222 33.044 31.222 1.219 0 2.447 0 3.656 0-39.782 50.821-111.431 64.901-175.094 45.302 2.447-1.802 3.686-4.885 3.686-7.936 0-7.363-6.748-13.476-14.121-13.476-7.332 0-13.445 5.519-14.060 12.237-56.34-25.723-99.82-80.2-96.133-157.962 3.666-92.436 79.616-208.793 178.155-178.78l-63.027 224.696zM260.894 322.447c-12.216 0-22.026 9.165-22.026 20.777 0 11.643 9.81 20.839 22.026 20.839 11.653 0 21.442-9.195 21.442-20.839-0.010-11.612-9.8-20.777-21.442-20.777v0zM128.030 285.686c-15.933 0-28.16 13.476-28.16 31.222 0 17.183 12.227 30.618 28.16 30.618 15.309 0 28.17-13.445 28.17-30.618 0-17.736-12.862-31.222-28.17-31.222v0zM167.823 172.431c-11.623 0-20.797 9.175-20.797 20.224 0 10.998 9.175 20.194 20.798 20.194 11.653 0 20.818-9.185 20.818-20.194 0-11.049-9.175-20.224-20.818-20.224z" fill="#000000" />' +
              '</svg>',
              iconSize: [32, 32]
            })
```

Simplemente le pasamos los atributos *className*, *html* con el código del SVG dentro e *iconSize*.

Aunque es un poco sucio, meter el SVG *inline* nos va a permitir modificarlo con CSS, así:

```CSS
.pizzaIcon {
  border-radius: 15px;
  background-color: rgb(230, 12, 12);
}

.pizzaIcon svg {
  width: 23px;
  height: 23px;
  left: 4px;
  top: 4px;
  position: absolute;
}

.pizzaIcon svg path {
  fill: #fefefe;
}
```


Por último añadimos el marcador pasándole un atributo icon:

```js
L.marker([40.4, -3.7], {icon: myIcon})
 .addTo(map)
```

Y así vamos, de momento: ¡mucho mejor!

![Icono personalizado](/images/2016-05/pizzas3.png)


## Rutas

Por último, no estaría mal que le indicásemos a potenciales clientes cómo llegar al comercio (así Marshall y Ted podrán venir más cómodos :P ). Para ello podemos usar la geolocalización y calcular una ruta.

Aunque suena complicado, podemos hacer uso de un *plugin* de Leaflet que hará esto por nosotros. Para la geolocalización usaremos [navigator.geolocation](https://developer.mozilla.org/es/docs/WebAPI/Using_geolocation), complementado con un [plugin de Cordova](https://cordova.apache.org/docs/en/latest/reference/cordova-plugin-geolocation/) que hará que funcione en el dispositivo móvil.

Vamos con ello.

### Plugin de Rutas

Lo primero que hay que hacer es instalar el plugin de rutas. Yo he escogido [Leaflet Routing Machine](http://www.liedman.net/leaflet-routing-machine/).

De nuevo, simplemente es bajar [el .zip de Github](https://github.com/perliedman/leaflet-routing-machine/releases) en www/lib y referenciar el css y el js en el index.html.

Ahora llega el momento de crear un controlador para manejar el evento click y desencadenar la lógica de geolocalización y rutas. Por simplicidad haré todo en el controlador, pero es una buena práctica no hacerlo, como explico en [el curso de Angular](https://jsjutsu.com/angularjs-practico/).

```js
  .controller('MainController', [ function () {
    var ctrl = this
    ctrl.map = null

    ctrl.directions = function () {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(function (position) {
          L.marker([position.coords.latitude, position.coords.longitude])
           .addTo(ctrl.map)

          ctrl.map.setZoom(5)

          L.Routing.control({
            waypoints: [
              L.latLng(position.coords.latitude, position.coords.longitude),
              L.latLng(40.4, -3.7)
            ],
            createMarker: function () { return null }
          }).addTo(ctrl.map).hide()
        })
      } else {
        console.warn('No geolocation available!')
      }
    }
  }])
```

Bien, aquí hacemos muchas cosas, así que vamos por partes:

* Lo primero es crear una variable en el scope para el mapa: **map** (luego se asigna en la directiva).
* Después creamos la función del scope **directions**, la cual:
  * Comprueba si hay geolocalización disponible.
  * De ser así utiliza **navigator.geolocation.getCurrentPosition** para obtenerla.
  * Una vez obtenida, añade un marcador en la misma, que será la del usuario.
  * Reducimos un poco zoom (esto podríamos ajustarlo un poco teniendo en cuenta la posición del usuario).
  * Con **L.Routing.control** se pide una ruta que pase por los dos puntos, el inicial y el destino. Además se le indica que no queremos que ponga marcadores (ya los tenemos).
  * Por último añadimos el control al mapa y con *hide* escondemos el panel de instrucciones (por defecto saca un panel en el que va poniendo las instrucciones para llegar al destino).

Ahora, al pulsar en el botón designado, queda lo siguiente:

![Ruta calculada](/images/2016-05/pizzas4.png)

¡Bien chulo!

---

En este post has podido ver lo sencillo que es incluir un mapa en una aplicación. Lógicamente si quieres añadirle cosas se va complicando, pero Leaflet tiene muchos plugins, lo usa mucha gente y tiene una buena documentación.
