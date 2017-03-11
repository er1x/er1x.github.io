title: Una introducción a Aurelia
date: 2015-07-09 16:23:00
tags: ['frontend', 'aurelia']
---
![aurelia framework](/images/2015-07/aurelia.png)

Hoy quiero hablarte de **[Aurelia](http://aurelia.io/)**. Y no, no es el nombre de mi abuela :P, sino un framework JavaScript que ha llamado mucho mi atención.

La primera vez que leí sobre Aurelia hace unos meses no pude por menos de simpatizar con este meme:

![anotherframework](/images/2015-07/xusNCWe.jpg)

De todos modos me dije: *¡voy a echarle un vistazo!*, y lo cierto es que me gustó lo que encontré.

En estos tiempos en que todos los días nos encontramos un framework JavaScript nuevo, no parece haber motivo para dar mucha importancia a otro más. Pero Aurelia tiene una característica que para mí lo hace especial: **está hecho para trabajar con ES6/7**, con el paradigma de *Web Components*.

Sus únicas dependencias son polyfills, algo que, tarde o temprano, desaparece y se sustituye por el estándar.

Cómo diría Homer Simpson: **es el trabajo del futuro... pero hoy.**

![Nucelar!](/images/2015-07/homer.png)

## Origen y filosofía de Aurelia

Aurelia fue iniciado por **[Rob Eisenberg](https://twitter.com/EisenbergEffect)**. Este señor es **conocido por ser el autor de Durandal y unirse al equipo de desarrollo de Angular 2, para después abandonar el proyecto tras casi diez meses de trabajo**.

Tras el abandono de Angular 2 se centró en el desarrollo de Aurelia. Que **hoy es un framework en estado de beta avanzada**, con licencia MIT y soportado de forma comercial por Durandal Inc., la *startup* de Eisenberg.

**Aurelia pone mucho énfasis en la flexibilidad**, pues se basa en las premisas de que:

* Cada proyecto es un mundo
* Un framework muy restrictivo puede darte dolores de cabeza en fases avanzadas del proyecto.

Por ello, cuando echamos un vistazo a Aurelia vemos que es un código muy modular basado en una colección de bibliotecas que colaboran como un todo, y nos proporcionan cosas como:

* Inyección de dependencias.
* Motor de plantillas.
* *Data-binding*.
* Cliente HTTP.
* Eventos.
* ...

Con ello consigue que puedas elegir **no usar cosas que no necesitas**, o cambiarlas por otras.

## *Application Starter*

Aurelia cuenta con un starter muy apañado en forma de generador de **[Yeoman](http://yeoman.io/)** y que utiliza:

* [Babel](https://babeljs.io/), como *transpiler* ES6/7.
* [JSPM](http://jspm.io/), como gestor de dependencias.
* [Gulp](http://gulpjs.com/), como sistema de construcción.
* [SystemJS](https://github.com/systemjs/systemjs), como cargador de módulos en el navegador.
* [BrowserSync](http://www.browsersync.io/), como servidor de desarrollo con *livereload*.

A partir de aquí voy a enseñarte:

* **A descargar y ejecutar este *Hola Mundo*, de Aurelia**.
* **Cómo está organizado este starter**.

### Prerequisitos

Como siempre en estos casos, hay que [tener instalado Node.js](/2015/05/instalar-nodejs/). En una terminal instalamos gulp, karma-cli, jspm, yeoman y el generador de aurelia.
```bash
npm i -g gulp jspm yo generator-aurelia karma-cli
```
A continuación debes configurar jspm con tus credenciales de Github. Necesita esto ya que descarga paquetes a toda pastilla y sobrepasa el límite de Github para peticiones anónimas. Para ello:
```bash
jspm registry config github
```

Finalmente, creamos un directorio para el proyecto e iniciamos el generador de Yeoman.
```bash
mkdir frontend && cd $_ && yo aurelia
```

¡Listo! Con eso ya tienes una aplicación básica de Aurelia preparada.
### Tareas de Gulp y primera ejecución

El *workflow* de este esqueleto de proyecto funciona a base de tareas de gulp, ya creadas y configuradas en ficheros independientes de fácil modificación. Las más interesantes son:

* *watch*: sirve la aplicación en http://localhost:9000 y recarga al detectar cambios en el código.
* *test*: ejecuta los tests unitarios.
* *cover*: ejecuta los tests unitarios y genera un informe de cobertura con [Istanbul](https://github.com/gotwarlost/istanbul).
* *tdd*: ejecuta los tests y queda a la espera de cambios en el código para ejecutarlos de nuevo.
* *e2e*: ejecuta los tests *end to end* con [Protractor](https://angular.github.io/protractor/#/).
* *prepare-release*: reconstruye el proyecto, genera documentación y log con los cambios del repositorio e incrementa la versión del proyecto.

¡Probemos a ejecutar el servidor!

```bash
gulp watch
```

![cargando](/images/2015-07/app-cargando.png)
![aplicacion](/images/2015-07/aplicacion.png)

Esta aplicación básica muestra el funcionamiento del router, incluyendo vistas anidadas, *data-binding* y recuperación de datos de un API Rest.

### Estructura de directorios

Veamos ahora los directorios más importantes y qué papel juegan dentro de esta aplicación:

* **build**: en este directorio están las tareas de Gulp que hemos visto antes.
* **jspm_packages**: dependencias de la aplicación.
* **node_modules**: dependencias de desarrollo.
* **src**: código de la aplicación.
* **styles**: aquí va el CSS :)
* **test**: carpeta para los test, dividida en unitarios y e2e.

### Flujo de la aplicación y método de trabajo básico


Una aplicación de Aurelia comienza su ejecución en el fichero index.html:

```html
<!doctype html>
<html>
  <head>
    <title>Aurelia</title>
    <link rel="stylesheet" type="text/css" href="jspm_packages/npm/font-awesome@4.3.0/css/font-awesome.min.css">
    <link rel="stylesheet" type="text/css" href="styles/styles.css">
    <meta name="viewport" content="width=device-width, initial-scale=1">
  </head>
  <body aurelia-app="animation-main">
    <div class="splash">
      <div class="message">Aurelia Navigation Skeleton</div>
      <i class="fa fa-spinner fa-spin"></i>
    </div>

    <script src="jspm_packages/system.js"></script>
    <script src="config.js"></script>
    <script>
      System.import('aurelia-bootstrapper');
    </script>
  </body>
</html>
```
¿Qué tenemos de especial aquí?

* El *body* lleva un atributo **aurelia-app="animation-main"**. Una aplicación Aurelia debe llevar este atributo, con un valor opcional, que en este caso es *animation-main*, y que le indica un fichero de src en el que, si queremos, podemos personalizar cómo Aurelia inicia la aplicación.

* Después tenemos un script que carga **System.js**, que no es más que el **cargador de módulos JavaScript**.

* A continuación se carga **config.js**. Este fichero **define las dependencias de la aplicación, y es manejado por JSPM**. Así, por ejemplo si decidimos que nuestro proyecto necesita jQuery, lo instalaríamos a través de JSPM y quedaría referenciado en este fichero.

* Por último, **importamos a través de System.js el módulo aurelia-bootstrapper**

A partir de aquí Aurelia va en busca de un par de ficheros **app.js y app.html**, que no son más que el componente principal de la aplicación. En este caso el que viene con el ejemplo define un router, pero podrían ser perfectamente así:

```javascript
export class App {
  constructor(){
     this.message = 'hola mundo!';
  }
}
```

```html
<template>
  <h1>${message}</h1>
</template>
```

Lo cual produciría:

![hola mundo](/images/2015-07/helloworld.png)


Así, la manera de definir componentes en Aurelia es:

* Un fichero JS que exporte una clase.
* Una plantilla HTML para esa clase.

Y esta es la mecánica básica de trabajo en Aurelia: **un fichero JS + un fichero HTML**. Y el fichero JS es una clase simple ES6, aunque podemos utilizar ES5 si lo preferimos, o incluso parte de ES7 gracias a Babel.


---

Y aquí llegamos al final del post..., aunque si te has quedado con ganas de más no te preocupes, porque en los sucesivos post iré profundizando más en este framework y veremos los elementos que lo componen paso a paso y con ejemplos.

Ahora quisiera que me contarás **qué te parece Aurelia**.

¿Crees que es un candidato a tener en cuenta en el *Juego de Frameworks* JavaScript?

¿Es tan sólo un participante más en el sobresaturado mercado de frameworks?


Te animo a que **compartas tu opinión** en los comentarios :)
