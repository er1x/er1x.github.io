title: 'Tutorial express de Vue.js en español (4). Creación de componentes.'
date: 2016-07-21 19:45:00
tags: ['vue']
---
![vue.js](/images/2016-06/vue.js.png)

Continuamos con nuestra serie de tutoriales de Vue en español.

En episodios anteriores...

* En **[la primera parte](/2016/06/tutorial-express-vuejs-1/)** hicimos una pequeña introducción haciendo referencia al patrón MVVM y su aplicación con Vue.
* En la **[segunda](/2016/06/tutorial-express-vuejs-2/)** representamos una lista de datos y aprendimos cómo hacer *binding* y manejar eventos.
* En la **[tercera](/2016/07/tutorial-express-vuejs-3/)** vimos el ciclo de vida de un componente y aprendimos a utilizar vue-resource para obtener datos de un servicio REST. 

Hoy vamos a ver algo más interesante. Crearemos [componentes de Vue](https://vuejs.org/guide/components.html) independientes que nos permitirán visualizar
de manera mucho más clara el HTML e ir modularizando la aplicación.  

Esto es una tendencia actual que facilita mucho el desarrollo de aplicaciones JS complejas. Pero no necesitamos un framework de última generación para verlo en acción. [En Angular 1.5 también podemos hacerlo](https://carlosazaustre.es/blog/desarrollo-por-componentes-con-angular-1-5-con-es6-es2015/).

## Creacion de un componente

Un componente es una pieza de la aplicación en la que podemos encapsular código potencialmente reutilizable.

Típicamente será un **trozo de JS + una plantilla + un estilo**.

Lo que vamos a hacer es crear un pequeño componente (una tarjeta), que encapsule la información relativa a una peli con la que hemos venido trabajando.

Un componente básico sería:

```js
Vue.component('film-card', {
  template: '<h1>Mi Peli</h1>'
})
```
¿Nada más simple verdad? Y sin embargo es lo único que queremos ahora mismo.

Esto lo podríamos usar directamente así:

```html
<div class="col-md-4" v-for="film in films">
  <film-card></film-card>
</div>
```

Dando como resultado:

![Componente básico](/images/2016-07/basic-component.png)

Esto no tiene mucha utilidad, pero nos va a permitir ir mejorando este componente.

Para ello tenemos que hacer 2 cosas:

1- Ponerle una plantilla un poco más chula.
2- Pasarle datos de verdad y darle funcionalidad.

## Referenciando una plantilla

Hacer referencia a una plantilla es de lo más sencillo. Recuerda a [los buenos tiempos de Backbone](http://backbonejs.org/#View) :P

Primeramente creamos una plantilla para la peli:

```html
<template id="filmCard">
  <div class="panel panel-primary">
    <div class="panel-heading">
      <h3 class="panel-title">Título</h3>
    </div>
    <div class="panel-body">
      Texto
    </div>
    <button class="btn btn-block">
      Botón
    </button>
  </div>
</template>
```
Y la referenciamos en la propiedad *template* del componente utilizando el id como selector:

```js
Vue.component('film-card', {
  template: '#filmCard'
})
```

Sencillo e intuitivo. Y el resultado va tomando forma:

![Plantilla](/images/2016-07/plantilla.png)


## Propiedades y eventos

Ahora bien, a este componente habrá que pasarle los datos de la peli que tiene que mostrar. Y además, tenemos que volver a darle la funcionalidad de hacer click para marcar la peli como vista.

Por partes pues.

### Pasar datos al componente

Lo que vamos a hacer es **pasar los datos de las películas que tiene el componente superior (la aplicación) a los componentes inferiores (film-card)**.

Para ello, tenemos que definir las propiedades que va a recibir el componente. Nada más sencillo:

```js
Vue.component('film-card', {
  template: '#filmCard',
  props: ['title', 'opening', 'seen']
})
```

Además, vamos a agregar una propiedad computada y un método click, que nos den un texto y estilo diferentes en función de si el atributo *seen* es verdadero o no:

```js
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
```

Ya tenemos unos cuantos datos en nuestro componente. ¿Cómo usarlos? 

Ya sabemos hacerlo, con dobles llaves (y un asterisco si queremos que sea estático):

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
            v-on:click="toggleSeen"
    >
      {{ seenText }}
    </button>
  </div>
</template>
```

Ahora solo nos falta un detalle. Pasar estos datos al componente.

Esto lo haremos al incluir el componente en el HTML, **mediante la directiva v-bind**

```html
<div class="col-md-4" v-for="film in films">
  <film-card  v-bind:title="film.title"
              v-bind:opening="film.opening"
              v-bind:seen="film.seen"
  >
  </film-card>
</div>
```

Recordemos que estos *films* los obteníamos en el componente padre.

**v-bind y v-on son directivas explícitas**, pero podemos utilizar **los atajos : y @**.

Con todo esto, el resultado es bastante satisfactorio:

![Componente completo](/images/2016-07/full-component.png)


### Ver la estructura de la aplicación con VUE Dev Tools

Como bonus adicional te quiero mostrar [las herramientas de desarrollo de Vue.js](https://chrome.google.com/webstore/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd).

Se trata de un plugin de Chrome, en el que puedes inspeccionar los elementos de la jerarquía de componentes de tu aplicación y modificarlos a tu antojo en la consola.

Para muestra un botón:

![Vue Dev Tools](/images/2016-07/vue-devtools.png)

Esto es de lo más útil cuando estás desarrollando.

---

Con esto finalizamos el post. ¡Y ya solo nos queda uno! En la última entrega veremos **cómo crear componentes en ficheros .vue** y crearlos con ECMAScript 6. Así utilizaremos un flujo de trabajo profesional organizando los componentes en sus propios módulos. ¡No te lo pierdas!

¿Qué tal te va pareciendo Vue.js? 

A mí me encanta. Quizá no haga tanto ruido como React, Angular y cía. pero creo que **es una estupenda forma de iniciarse en el desarrollo de aplicaciones JS modernas** e ir aprendiendo poco a poco los flujos de trabajo y herramientas que tan locos nos vuelven a veces.

¡Buen verano!

