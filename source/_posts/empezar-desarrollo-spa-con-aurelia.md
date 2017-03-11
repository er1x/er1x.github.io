title: 'Cómo empezar a desarrollar con Aurelia con su Starter Kit'
date: 2016-02-22 07:00:00
tags: ['aurelia', 'es2015']
---
![Aurelia Framework](/images/2016-02/aurelia.png)

Ha llovido un poquito desde [la primera vez que hablamos de Aurelia](/2015/07/introduccion-aurelia-framework/). Por si no te leíste el anterior post, te diré que es un **framework JavaScript que está llamado a competir con Angular 2**.

Desde entonces ha habido bastantes cambios en la web y el framework, incluida una [nueva y flamante documentación](aurelia.io/docs.html) y un *starter kit* para comenzar a familiarizarnos con el framework.

En este post vamos a tomar este *Starter kit* y a trastear un poquito con él.

## Nuevo Starter Kit ES2016

¡Empezamos!

Bájate el starter kit de [aquí](http://aurelia.io/downloads/kit-es2016.zip), (del typescript pasamos de momento ^^).

Descomprímelo y verás lo siguente:

![Ficheros del starter kit](/images/2016-02/aurelia-files.png)

Un buen montón de cosas. Te cuento de qué van:

* *jspm_packages*: aquí van las dependencias externas del proyecto. [Se instalan con JSPM](/2015/07/frontend-modular-es6-jspm/). ¿Necesitas jQuery, Bootstrap o [D3](/2015/05/empezar-con-d3js/)? Pues van aquí.
* *src*: la carpeta con el código de tu app.
* *styles*: las hojas de estilo (CSS).
* *config.js*: es el fichero de configuración de JSPM. En principio no tienes que tocarlo, lo cual es de agradecer. JSPM va guardando aquí *sus movidas*.
* *index.html*: el fichero principal de tu app web. Lo vemos un ratito después :)
* *jsconfig.json*: una historia del editor [Visual Studio Code](https://code.visualstudio.com/). No lo uso, pues de momento prefiero [Atom](https://atom.io/), así que de momento pasando de él.
* *package.json*: dependencias y scripts de Node.js. Irrelevante para este tuto.

Básicamente este zip está pensado para que **aprendas a utilizar [Aurelia](http://aurelia.io) y no liarte demasiado** instalando otras dependencias. Sólo tienes que servir la aplicación y listo.

Yo voy a usar [http-server](https://www.npmjs.com/package/http-server), una utilidad que puedes instalar [si tienes instalado Node.js](/2015/05/instalar-nodejs/), así:

```bash
npm install http-server -g
```

Y para servir el directorio en localhost:

![Servir starter kit](/images/2016-02/aurelia-server.png)

¡Listo! vamos a ver qué pinta tiene, yendo con el navegador a http://localhost:8080:

![Servir starter kit](/images/2016-02/aurelia-initial.png)


Hmm... bueno... no es lo más *fantabuloso* del mundo. Pero tiene su lógica, veamos por qué.

## Index.html y componentes

La cosa es la siguiente:


```html
<!DOCTYPE html>
<html>
  <head>
    <title>Aurelia</title>
    <link rel="stylesheet" href="styles/styles.css">
    <meta name="viewport" content="width=device-width, initial-scale=1">
  </head>

  <body aurelia-app>
    <script src="jspm_packages/system.js"></script>
    <script src="config.js"></script>
    <script>
      SystemJS.import('aurelia-bootstrapper');
    </script>
  </body>
</html>
```

Aquí tenemos un index.html pelado, con unas pocas salvedades:

* Se carga **[SystemJS](https://github.com/systemjs/systemjs), el cargado de módulos**, junto con su configuración.
* Se hace un **SystemJS.import('aurelia-bootstrapper');**. Esto hace que el framework entre en acción y busque un atributo **aurelia-app** por algún sitio. Ahí cargará el componente principal de la aplicación.

**El componente principal siempre se llama *app***, y estará formado, como todos los componentes de Aurelia, por dos ficheros. Un HTML y un JavaScript.

A ver qué tienen:

### src/app.html

```html
<template>
  <h1>${message}</h1>
</template>
```

### src/app.js

```js
export class App {
  message = 'Welcome to Aurelia!';
}
```

¡Con razón el index es tan soso! Sólo tiene un triste texto puesto ahí.

Lo *guay* es que nos revela una serie de características de Aurelia, que es lo que hacen, a mi modo de ver, tan interesante este framework.

## Lo que me gusta del framework

### No se ve (o se ve poco)

**Aurelia está pensado para no ~~incordiar~~ ser muy visible** mientras estás desarrollando la aplicación. El protagonista es tu código, no el del framework.

### Es JavaScript

**Un componente es una clase simple JavaScript**, con sus propiedades y sus métodos, sí, pero sólo eso. No hay cosas raras de por medio. Aurelia se encarga de enlazarlo con su vista, que es su trabajo.

Además en Aurelia se ha realizado un esfuerzo para asemejarse al estándar. La forma de representar las cadenas, por ejemplo, es con **${}**, es decir, de la misma manera que se hacen las [plantillas de cadenas de texto en ECMAScript6](https://developer.mozilla.org/es/docs/Web/JavaScript/Referencia/template_strings).

### Está orientado a componentes de manera natural

La idea predominante hoy en día en el desarrollo web es el **desarrollo de componentes**. Con React creas componentes, con Angular 2 creas componentes, con Angular 1 creas directivas (y puedes nombrarlas como componentes desde la versión 1.5).

Aurelia no es menos. Y es que esta idea es muy potente. Dividir una aplicación compleja en partes sencillas, cohesivas, poco acopladas. Ingeniería del software de toda la vida.

## Añadiendo métodos y propiedades

Vamos a jugar un poco con la clase inicial.

```js
export class App {
  message = 'Welcome to Aurelia!';
  anotherMessage = 'this is just another message';

  forceChoke() {
    alert('I find your lack of faith disturbing')
  }
}
```

```html
<template>
  <h1>${message}</h1>
  <br>
  <h2>${anotherMessage}</h2>
  <button click.trigger="forceChoke()">Do a force choke!</button>
</template>
```

Lo que hemos hecho aquí es muy simple:

* Agregar una nueva propiedad y representarla en la vista.
* Crear un método e indicar que se dispare al hacer click en un botón, con **click.trigger**.

La cosa queda así:

![Servir starter kit](/images/2016-02/aurelia-morethings.png)


¡No está mal para empezar con un nuevo framework!

---
**Aurelia es uno de los futuros pesos pesados en el mundo de las SPA (*Single Page Application*)**. Nos ofrece un starter kit muuuuy sencillo con el que podemos empezar a aprender cómo funciona, sin instalar mil cosas. Sólo el zip y a correr.

¿Y tú qué opinas? ¿Te gusta la forma de trabajar en Aurelia?
