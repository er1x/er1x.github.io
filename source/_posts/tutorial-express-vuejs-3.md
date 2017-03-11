title: 'Tutorial express de Vue.js en español (3). Interacción con APIs REST.'
date: 2016-07-1 18:30:00
tags: ['vue']
---
![vue.js](/images/2016-06/vue.js.png)

Continuamos con nuestra serie de tutoriales de Vue en español.

Si recuerdas las anteriores entregas:

* En **[la primera parte](/2016/06/tutorial-express-vuejs-1/)** hicimos una pequeña introducción haciendo referencia al patrón MVVM y su aplicación con Vue.
* En la [segunda](/2016/06/tutorial-express-vuejs-2/) representamos una lista de datos y aprendimos cómo hacer *binding* y manejar eventos.

En esta tercera entrega veremos dos cosas muy concretas:

  * El ciclo de vida de un componente.
  * Obtener los datos con *vue-resource*.


## Ciclo de vida

Los componentes de Vue pasan por diferentes estados cuando se crean: se tiene compilar la plantilla, añadir el elemento al DOM, observar los datos...

Gráficamente Vue nos proporciona el siguiente diagrama para distinguir estos estados:

![Ciclo de vida de un componente Vue](https://vuejs.org/images/lifecycle.png)

Si te fijas, hay una serie de recuadros rojos que parten hacia la izquierda: *created*, *beforeCompile*, *compiled*...

Cada uno de estos nombres hace referencia a **un estado que podemos *hookear***, es decir, que podemos establecer funciones en nuestro viewmodel que se ejecuten cuando se han alcanzado estos estados.

## *Hook* en tras la creación del componente.

Vamos a añadir una función que se ejecute cuando se haya creado el componente:

```js
new Vue({
  el: '#app',
  data: {
    films: []
  },

  created: function () {
    console.log('component created!');
  },

  methods: {
    toggleSeen: function (film) {
      film.seen = !film.seen
    }
  }
})
```

Como ves, es tan sencillo como **asignar una función al atributo *created* del viewmodel**.

Pero, ¿y la lista de películas?

## vue-resource.

Ahora, **en lugar de *hardcodear* el listado de las pelis en el viewmodel, vamos a obtenerlo de un API Rest, en este caso de https://swapi.co/**.

Para ello podríamos utilizar cualquier sistema con el que nos sintiéramos cómodos, por citar algunos:

* XMLHttpRequest.
* Fetch.
* $.ajax de jQuery.
* Librerías específicas como [Superagent](https://github.com/visionmedia/superagent) o [Axios](https://github.com/mzabriskie/axios).
* O bien, [vue-resource](https://github.com/vuejs/vue-resource), un cliente HTPP específico para Vue.

Por ampliar un poco la información sobre Vue, voy a mostrar vue-resource, aunque seguramente ni yo mismo lo hubiera utilizado y hubiera tirado de algo con lo que estoy más familiarizado, como Superagent. Pero vamos, que da lo mismo.

Es lo bonito de desarrollar aplicaciones con este enfoque. Escoges pieza a pieza, y si no te gusta una pues usas otra.

Bien, el caso es que vue-resource extiende el viewmodel de Vue con un atributo $http, que nos permite **realizar peticiones Ajax de forma muy sencilla con promesas**.

Veamos cómo obtenemos el listado de pelis en la función created.

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/vue/1.0.24/vue.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/vue-resource/0.7.2/vue-resource.min.js"></script>
<script>
  new Vue({
    el: '#app',
    data: {
      films: []
    },

    created: function () {
      this.$http.get('https://swapi.co/api/films/')
                .then(function (response) {
                  this.films = response.data.results.map(function (film) {
                    return {
                      id: film.episode_id,
                      title: film.title,
                      seen: false
                    }
                  })
                }.bind(this))
    },

    methods: {
      toggleSeen: function (film) {
        film.seen = !film.seen
      }
    }
  })
</script>
```

Simplemente hacemos la petición con **this.$http.get** y en el *then* asignamos a films los resultados, quedándonos con los campos que nos interesan.

El resultado, como ves, no ha variado:

![Datos obtenidos con $http](/images/2016-07/http-result.png)

---

Vamos progresando con esta miniserie de Vue y en este post tan pequeño ya has podido ver cómo obtener datos de un API Rest.

Para **el siguiente toca algo más interesante: crear un elemento personalizado** con el que colocaremos cada película en una tarjeta con su propio componente Vue.

¡Pásalo bien!
