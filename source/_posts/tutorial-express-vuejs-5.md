title: 'Tutorial express de Vue.js en español (5). Componentes.vue y Browserify.'
date: 2016-08-20 12:50:00
tags: ['vue']
---
![vue.js](/images/2016-06/vue.js.png)

Con este último tutorial finalizaremos la **serie de tutoriales de [Vue.js](https://vuejs.org/) en español**.


En los tutoriales anteriores:

* En **[la primera parte](/2016/06/tutorial-express-vuejs-1/)** hicimos una pequeña introducción haciendo referencia al patrón MVVM y su aplicación con Vue.
* En la **[segunda](/2016/06/tutorial-express-vuejs-2/)** representamos una lista de datos y aprendimos cómo hacer *binding* y manejar eventos.
* En la **[tercera](/2016/07/tutorial-express-vuejs-3/)** vimos el ciclo de vida de un componente y aprendimos a utilizar vue-resource para obtener datos de un servicio REST. 
* En la **[cuarta parte](/2016/07/tutorial-express-vuejs-4/)** estudiamos cómo crear componentes independientes y utilizarlos. 

En este último tutorial vamos a ver:

* Cómo crear componentes en ficheros .vue completamente independientes.
* Usar una herramienta de *scaffold* de aplicaciones Vue.

## Construcción de un proyecto con Browserify

**[Browserify](http://browserify.org/) es la herramienta más sencilla que conozco para construir "bundles"** (ficheros JS agrupados en uno) de aplicaciones JavaScript.

Se trata de un paquete que podemos instalar mediante NPM, al cual:

1. Se le indica un fichero JS de entrada (*main*).
2. Y Browserify navega a través de él y sus dependencias para construir un fichero de salida.

Las referencias a estas dependencias pueden estar escritas en formato CommonJS, p.ej: "require('jquery')".

Vamos a añadir Browserify y una tarea de construcción al proyecto que tenemos entre manos:

```bash
npm install --save-dev browserify
```

#### package.json

```json
...
  "scripts": {
    "server": "live-server .",
    "bundle": "browserify scripts/main.js -o bundle.js --debug"
   }
...
```

Además vamos a instalar Vue y vue-resource mediante NPM, ya que vamos a requerir estas dependencias internamente y dejar de usar el CDN.

```bash
npm install --save vue vue-resource
```

Ahora tenemos todo lo necesario para eliminar el JS del fichero index.html y simplemente incluir nuestro bundle.

#### index.html

```html
<template id="filmCard">
    <div class="panel panel-primary">
      <div class="panel-heading">
        <h3 class="panel-title">{{* title }}</h3>
      </div>
      <div class="panel-body" :class="{'seen': seen}">
        {{* opening }}
      </div>
      <button class="btn btn-block"
              :class="{'btn-danger': seen, 'btn-success': !seen}"
              @click="toggleSeen"
      >
        {{ seenText }}
      </button>
    </div>
  </template>
  <script src="bundle.js"></script>
```

#### scripts/main.js

```js
var Vue = require('vue')
Vue.use(require('vue-resource'))

Vue.component('film-card', {
  template: '#filmCard',
  props: ['title', 'opening', 'seen'],
  methods: {
    toggleSeen: function () {
      this.seen = !this.seen
    }
  },
  computed: {
    seenText: function () {
      return this.seen ? 'Ya la he visto' : '¡Quiero verla!'
    }
  }
})

new Vue({
  el: '#app',
  data: {
    films: []
  },
  created: function () {
    this.$http.get('https://swapi.co/api/films/')
              .then(function (response) {
                this.films = JSON.parse(response.data).results.map(function (film) {
                  return {
                    id: film.episode_id,
                    title: film.title,
                    opening: film.opening_crawl,
                    seen: false
                  }
                })
              }.bind(this))
  }
})
```

Como ves, **ahora en el fichero main, se requieren dependencias localizadas otros ficheros**.

Ejecutando "*npm run bundle*" tendremos nuestra aplicación empaquetada y funcionando exactamente igual.

![Aplicación sin cambios](/images/2016-08/app-unchanged.png)

## Browserify transforms: Vueify

Bien, ya sabemos usar Browserify. Con esto ya podríamos dar bastante modularidad al proyecto. Pero, **¿podríamos escribir los componentes en ficheros independientes, que agruparan su HTML, JS y CSS?**

La respuesta es sí. Y **podemos hacerlo mediante una extensión de Browserify, llamada [Vueify](https://github.com/vuejs/vueify).**

Instalar Vueify y modificar la tarea de construcción es sencillo:

```bash
npm install vueify --save-dev
```

```json
...
  "scripts": {
    "server": "live-server .",
    "bundle": "browserify scripts/main.js -o bundle.js -t vueify --debug"
   }
...
```

Hasta aquí no ha cambiado nada y funcionará todo exactamente igual.

### Componentes .vue

Lo que vamos a hacer ahora es extraer todo lo relativo a nuestro componente *film-card* a un fichero independiente, con su HTML y estilos:

#### components/FilmCard.vue

```html
<template>
  <div class="panel panel-primary">
    <div class="panel-heading">
      <h3 class="panel-title">{{* title }}</h3>
    </div>
    <div class="panel-body" :class="{'seen': seen}">
      {{* opening }}
    </div>
    <button class="btn btn-block"
            :class="{'btn-danger': seen, 'btn-success': !seen}"
            @click="toggleSeen"
    >
      {{ seenText }}
    </button>
  </div>
</template>

<script>
  module.exports = {
    template: '#filmCard',
    props: ['title', 'opening', 'seen'],
    methods: {
      toggleSeen: function () {
        this.seen = !this.seen
      }
    },
    computed: {
      seenText: function () {
        return this.seen ? 'Ya la he visto' : '¡Quiero verla!'
      }
    }
  }
</script>

<style>
  .panel-body {
    position: relative;
  }

  .seen::before {
    background-color: rgba(0, 0, 0, 0.5);
    height: 100%;
    width: 100%;
    position: absolute;
    display: block;
    left: 0;
    top: 0;
  }
</style>
```

De esta forma:

* En el fichero main.js simplemente **requerimos nuestros componentes, usando la propiedad *components***.
* En el index desaparece todo rastro de la plantilla.

#### scripts/main.js

```js
var Vue = require('vue')
Vue.use(require('vue-resource'))

var FilmCard = require('./components/FilmCard.vue')

new Vue({
  el: '#app',
  data: {
    films: []
  },
  components: {
    FilmCard
  },
  created: function () {
    this.$http.get('https://swapi.co/api/films/')
              .then(function (response) {
                this.films = JSON.parse(response.data).results.map(function (film) {
                  return {
                    id: film.episode_id,
                    title: film.title,
                    opening: film.opening_crawl,
                    seen: false
                  }
                })
              }.bind(this))
  }
})
```

#### index.html

```html
...
<body>
  <h1 class="text-center">Pelis de Star Wars</h1>

  <div class="container">
    <div id="app">
      <div class="row">
        <div class="col-md-4" v-for="film in films">
          <film-card v-bind:title="film.title"
                     v-bind:id="film.id"
                     v-bind:opening="film.opening"
                     v-bind:seen="film.seen"
          >
          </film-card>
        </div>
      </div>
    </div>
  </div>
  <script src="bundle.js"></script>
</body>
</html>
```

De nuevo, tras ejecutar "*npm run bundle*", la aplicación se comporta exactamente igual.

### Truquillos adicionales de Browserify/Vueify

* Es posible **utilizar preprocesadores de todo tipo (Jade, Sass, Coffescript...)** instalando el preprocesador correspondiente e indicando "lang", en la etiqueta. P.ej:

```html
<style lang="sass">
</style>
```

* De la misma forma **puede utilizarse [Babel](https://babeljs.io/) para escribir los componentes con versiones modernas de JS**. De nuevo es solo instalar las dependencias relacionadas con Babel.

* Vueify permite añadir un atributo *scoped* al estilo de los componentes. Esto hace que todo el CSS que se escriba dentro del componente le afecte únicamente a él.


## Otras opciones: vue-cli

A mí Browserify me gusta mucho porque es sencillo de usar, minimalista pero potente mediante plugins. 

Pero hay gente que le gusta más soluciones como Webpack. Para ellos existen plugins como [vue-loader](https://github.com/vuejs/vue-loader).

En cualquier caso, **existe la herramienta [Vue-CLI](https://github.com/vuejs/vue-cli)**, instalable una vez más desde NPM, que nos permite **crear rápidamente el esqueleto de un proyecto a partir de una lista de plantillas disponibles**.

![Vue-CLI](/images/2016-08/vue-cli.png)

---

¡Y terminamos con la serie de Vue!

Espero que te haya gustado, y [en GitHub tienes el código](https://github.com/er1x/vuejs-tuto) para lo que quieras :)