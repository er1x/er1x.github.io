title: 'Tutorial express de Vue.js en español (1). Cómo empezar.'
date: 2016-06-14 19:30:00
tags: ['vue']
---
![vue.js](/images/2016-06/vue.js.png)

Tenía muchas ganas escribir algo sobre [Vue.js](https://vuejs.org/) y qué mejor que hacer una de esas series de minitutoriales que de vez en cuando me da por escribir :P

## ¿Qué es Vue.js?

Pues el enésimo framework JS (sí, todos estamos hartos de oír que ha salido un nuevo framework superchulo que trabajará por nosotros mientras nos dedicamos a jugar al Overwatch).

Lo cierto es que Vue.js no tan moderno (en tiempo JS, claro). Lleva desde Junio de 2014 [rondando por Github](https://github.com/vuejs/vue). También es cierto que no te va a resolver la vida. **Sólo te va resolver la problemática de la vista**. En ese sentido:

* **Es del estilo de React**.
* **No abarca tanto como un framework full-stack tipo Angular**.

Mira los tamaños del fichero comparado con otros:

![Tamaño del fichero](/images/2016-06/vue-size.png)

Las cosas que me gustan de Vue son:

* Es pequeñito.
* **Es fácil de aprender**. De hecho yo creo que es lo más sencillo que podría aprender una persona que viene del legendario mundo de *"yo esto lo hago con jQuery en 2 líneas"*.
* Se encarga de sincronizar vista y modelos.
* Puedes crear componentes.

## Vale ya de desvariar. *Show me the code*.

Vamos a crear un típico proyecto que enseñe un listado de cosas y permita una pequeña interacción con ellas. Nada original. Y **como al final siempre acabo tirando de la [API de Star Wars](https://swapi.co/)**, pues lo que enseñaremos será un listado de pelis.

### live-server

Voy a comenzar instalando un servidor de desarrollo sencillo y asociarlo a un script de NPM en un fichero *package.json*, es decir:

```bash
npm init # creamos el package.json
npm install --save-dev live-server # instalamos el servidor de desarrollo
```
E incluimos una sección scripts tal que así:

```json
"scripts": {
  "server": "live-server ."
}
```

Chachi, ahora ejecutando **npm run server** tenemos un servidor web con live-reload en localhost:8080.

### index.html

Creamos el index de entrada a la aplicación e incluimos la biblioteca de Vue desde un CDN (más adelante veremos cómo hacerlo con un [gestor de dependencias](/2015/05/dependencias-web/)).

Es decir:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Intro a VueJS</title>
</head>
<body>
  <div id="app"></div>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/vue/1.0.24/vue.js"></script>
  <script>
    // Aquí irá nuestra flamante aplicación.
  </script>
</body>
</html>
```

Nada interesante de momento, aunque como habrás adivinado, dentro de *id="app"* es donde va a ir montada la aplicación.

## Aplicación Vue básica

Vamos a ver la chicha:

```html
<div id="app">
  <h1>{{ greeting }}</h1>
  <input type="text" v-model="greeting">
</div>

<script src="https://cdnjs.cloudflare.com/ajax/libs/vue/1.0.24/vue.js"></script>
<script>
  new Vue({
    el: '#app',
    data: {
      greeting: 'Hola Vue!'
    }
  })
</script>
```

* Hemos creado una aplicación Vue (**new Vue**) y la hemos **montado en el selector app**.
* Hemos dado unos datos iniciales en la **propiedad greeting** del objeto *data*.
* Usando dobles llaves hemos representado el contenido de esta propiedad.
* Usando *v-model* hemos vinculado el input a la propiedad, de forma que si escribimos, cambia dinámicamente.

![Datos iniciales](/images/2016-06/vue1.png)

![Contenido dinámico](/images/2016-06/vue2.png)

## ¿Qué es esta magia?

Por detrás, Vue crea un *viewmodel*, que vincula los datos que definimos en el modelo al DOM. Podríamos escribir lo anterior así:

```js
var myModel = {
  greeting: 'Hola Vue!'
}
var myViewModel = new Vue({
  el: '#app',
  data: myModel
})
```

Funcionaría exactamente igual y **se explica por sí solo teniendo en cuenta [el patrón MVVM](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93viewmodel)**. Y es intuitivo de cojones, bajo mi punto de vista.

La pinta del viewmodel en la consola es esta:

![ViewModel](/images/2016-06/viewmodel.png)

Así:

* Vue crea observadores para los elementos del modelo.
* Crea *getters* y *setters* para los mismos.
* Nos permite crear *hooks* para cuando el elemento está siendo montado, se destruye etc.

Y mucho más, que iremos viendo en los siguientes tutoriales :)
