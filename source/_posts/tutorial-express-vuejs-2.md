title: 'Tutorial express de Vue.js en español (2). Listas, eventos y directivas.'
date: 2016-06-20 7:00:00
tags: ['vue']
---
![vue.js](/images/2016-06/vue.js.png)

Continuamos con nuestra serie de tutoriales de Vue en español.

Si viste **[la primera parte](/2016/06/tutorial-express-vuejs-1/)**, en ella hicimos una pequeña introducción haciendo referencia al patrón MVVM y su aplicación con Vue.

En este post veremos:

  * Cómo representar una lista de elementos.
  * Aplicar clases dinámicamente.
  * Manejar eventos.

## Un poco de estilo

Para empezar vamos a meter un poco de estilo a la web, añadiendo un [tema gratuito de Bootstrap](https://bootswatch.com/superhero/).

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Star Wars Movies</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bootswatch/3.3.6/superhero/bootstrap.css">
  <link rel="stylesheet" href="style.css">
</head>
<body>
  ...
```

## v-for: representando una lista con datos.

Bien, teniendo ya algo de estilos vamos a ver **cómo representar información en listas con Vue**. De forma similar a Angular, Vue amplía el comportamiento de una aplicación web mediante el **uso de [directivas](https://vuejs.org/api/#Directives)** (pequeños trozos de HTML que añaden funcionalidad).

Pero antes de nada, necesitamos una lista con información, que vamos a añadir a la propiedad data de nuestro *viewmodel*.

```js
new Vue({
  el: '#app',
  data: {
    films: [
      {id: 4, name: 'The Phantom Menace', seen: false},
      {id: 5, name: 'Attack of the Clones', seen: false},
      {id: 6, name: 'Revenge of the Sith', seen: false},
      {id: 1, name: 'A New Hope', seen: true},
      {id: 2, name: 'The Empire Strikes Back', seen: true},
      {id: 3, name: 'Return of the Jedi', seen: true},
      {id: 7, name: 'The Force Awakens', seen: false}
    ]
  }
})
```

Como vemos, es un array de objetos sencillo. Lo que tenemos que hacer ahora es representarlo en una lista. Veamos cómo:

```html
<div id="app">
  <div class="row">
    <div class="col-md-6 col-md-offset-3">
      <ul class="list-group">
        <li v-for="film in films"
            class="list-group-item film"
        >
            <span>{{* film.name }}</span>
        </li>
      </ul>
    </div>
  </div>
</div>
```

Aparte del contenedor y la fila y columna de Bootstrap, lo importante aquí es esto:

```html
<ul class="list-group">
  <li v-for="film in films"
      class="list-group-item film"
  >
      <span>{{* film.name }}</span>
  </li>
</ul>
```

Como vemos, tenemos **un atributo *v-for*, que nos permite iterar** por cada película en el array *films*.

Después, por cada una de ellas creamos un span y **ponemos el título con dobles llaves y *film.name***.

Además, dentro de las llaves hemos incluido un asterisco (\*). Esto sirve para aplicar *one-time bindings*, es decir, que Vue no va a vigilar esa expresión y no actualizará la vista si se producen cambios. Esto es útil cuando simplemente queremos representar una información que no va a cambiar y queremos que el rendimiento de la aplicación sea mejor (ya vimos esto en [un post anterior con Angular](/2016/04/optimizar-angularjs-one-time-bindings/)).

En resumidas cuentas, esto nos da un resultado como éste:

![Listado de películas con v-for](/images/2016-06/vfor-1.png)

### Ordenando las películas

¿Y si quisiéramos que las películas salieran ordenadas cronológicamente? Tan sencillo como aplicar **un *filtro* al listado**, mediante una *tubería* |, y el nombre del filtro, en este caso *orderBy*.

Se trata de filtros similares a los de Angular, y tienen esta pinta:

```html
<li v-for="film in films | orderBy 'id'"
    class="list-group-item film"
>
    <span>{{* film.name }}</span>
</li>
```

Quedando como resultado:

![v-for con filtro](/images/2016-06/vfor-ordered.png)

## Clases dinámicas. Binding.

Estaría bien poder aplicar estilos condicionales. Por ejemplo, en este caso podríamos querer que las películas que ya hemos visto aparecieran con un estilo diferente.

Para esto podemos **vincular el atributo class a una propiedad, utilizando la directiva *v-bind***.

```html
<li v-for="film in films | orderBy 'id'"
    class="list-group-item film"
    v-bind:class="{'seen' : film.seen}"
>
```

Aquí estamos indicando que si el atributo *seen* de la película es verdadero, nos añada la clase *seen* a la etiqueta li.

Quedando así:

![class bind](/images/2016-06/class-bind.png)

Incluso podemos ahorrarnos escribir v-bind, y dejar simplemente dos puntos (:class), pero así queda más explícito.

El binding funciona de una forma parecida para otro tipo de atributos, pero sin permitir el uso de arrays u objetos (que son para clases y estilos), sino expresiones. Por ejemplo, si quisiéramos hacer *binding* del atributo title haríamos:

```html
<li :title="film.name">
```

Dando como resultado:

```html
<li title="A New Hope">
```

## Llamadas a métodos.

De forma similar al *binding* en propiedades, **podemos hacer lo propio con eventos, en este caso con *v-on* (o su atajo @)**.

Vamos a crear un método para cambiar el estado de las pelis:

```js
new Vue({
  el: '#app',
  data: {
    films: [
      ...
    ]
  },
  methods: {
    toggleSeen: function (film) {
      film.seen = !film.seen
    }
  }
})
```

Para invocar este método que hemos creado vamos a hacer un botón y a vincular su evento click. Esto nos permitirá cambiar el estado de la película de *vista* a *no vista*.

```html
<li v-for="film in films | orderBy 'id'"
    class="list-group-item film"
    v-bind:class="{'seen' : film.seen}"
>
    <button class="btn btn-primary btn-xs pull-left"
            v-on:click="toggleSeen(film)"
    >
            Toggle
    </button>
    <span>{{* film.name }}</span>
</li>
```

![evento click](/images/2016-06/click.png)

Al igual que con v-bind, podemos utilizar un atajo, en este caso @:

```html
<button class="btn btn-primary btn-xs pull-left"
        @click="toggleSeen(film)"
>
```

Y emplear el mismo mecanismo para reaccionar a otro tipo de eventos:

```html
<button class="btn btn-primary btn-xs pull-left"
        @mouseover="toggleSeen(film)"
>
```

---

En este tutorial has visto lo sencillo que es trabajar con *bindings* dinámicos en Vue.js (aunque soporta modificadores más avanzados (que puedes consultar [en su documentación](https://vuejs.org/api/#v-bind)).

El siguiente tutorial será muy sencillo y veremos cómo obtener el listado de datos de una API REST mediante peticiones AJAX, lo cual irá aproximando este tutorial a una aplicación más real.
