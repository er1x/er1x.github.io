title: 3 Formas de Organizar tus Dependencias en Proyectos Web
date: 2015-05-21 20:45:00
tags: ['frontend', 'bower', 'nodejs']
---

![npm & bower](/images/2015-05/npmbower.png)

Cuando trabajas en una web casi siempre tienes una serie de dependencias: jQuery, Bootstrap, Backbone, Angular... y un largo etc.

Por ello conviene saber qué alternativas tenemos a la hora de gestionar estas dependencias y no volvernos locos si hay algún cambio de versión y algo deja de funcionar, o si no queremos meter todas estas dependencias en el sistema de control de versiones que utilicemos.

Vamos a ver cómo instalar y utilizar jQuery de tres formas diferentes. También [tienes el código de ejemplo completo en Github](https://github.com/er1x/dep-managers).


## Descarga Manual

La opción tradicional es [descargar jQuery de su web](https://jquery.com/download/). Después incluiríamos una referencia de este estilo en nuestro proyecto.

```markup
<script src="lib/jquery-2.1.4.js"></script>
```

El problema de gestionar así las dependencias es que actualizar las versiones es un rollo, y además tenemos que agregarlas al control de versiones para tenerlas controladas. Esto, si son muchos ficheros, puede ser un poco caos.

Aparte, da mucha pereza tener que ir manualmente a cada una de las páginas de descarga si tenemos muchas dependencias :)

Hoy en día existen varias alternativas con las que podemos instalar estas dependencias con un sólo comando.

## Bower

Aquí la cosa se pone más interesante. [Bower](http://bower.io/) es **la herramienta de gestión de dependencias más usada para frontend**. Para instalarla deberemos [tener previamente instalado Node.js](/2015/05/instalar-nodejs/).

Una vez lo tengamos, escribimos en una terminal:

```bash
npm install -g bower
```

A partir de aquí tendremos el comando *bower* disponible en nuestro sistema.

Para instalar una dependencia con Bower, nos situaremos en la carpeta del proyecto en la terminal y ejecutaremos *bower install jquery*. En nuestro ejemplo:

```bash
bower install jquery
```

Bower buscará la última versión de jQuery y la guardará en la carpeta
*bower_components/jquery*, de forma que en nuestro proyecto referenciaremos la dependencia así:

```markup
<script src="bower_components/jquery/dist/jquery.js"></script>
```

### Fichero bower.json

Lo más útil de Bower es que podemos utilizar la opción *--save* para que guarde las dependencias en un **fichero bower.json**.

Para ello inicializaremos un fichero de dependencias así:

```bash
bower init
```
Nos hará una serie de preguntas que puedes responder como creas conveniente. Para este ejemplo puedes pulsar INTRO con todas las opciones, ya que nos dan igual. El resultado será un fichero bower.json con las dependencias de tu proyecto.

A partir de aquí, al instalar una dependencia podemos utilizar el flag *--save*.

```bash
bower install jquery --save
```

En este caso nos quedaría el fichero bower.json así:

```javascript
{
  "name": "prueba",
  "version": "0.0.0",
  "authors": [
    "Emilio <emilio@jsjutsu.com>"
  ],
  "moduleType": [
    "globals"
  ],
  "license": "MIT",
  "ignore": [
    "**/.*",
    "node_modules",
    "bower_components",
    "test",
    "tests"
  ],
  "dependencies": {
    "jquery": "~2.1.4"
  }
}
```

Como verás existe un campo *dependencies*, que almacena las dependencias con un número de versión con formato [semver](https://github.com/npm/node-semver).

De esta forma, en nuestro sistema de control de versiones podemos ignorar la carpeta de dependencias y únicamente agregar el fichero bower.json. La ventaja de todo esto es que si nos llevamos ese fichero a otro sitio, podemos instalar automáticamente las dependencias de un proyecto **con un sólo comando: *bower install***.

Además, con el uso del formato semver nos podemos asegurar de que no se instalen versiones con cambios que puedan hacer que el proyecto nos deje de funcionar.

Con Bower también podemos:

- Instalar una versión específica con *bower install paquete#version*

- Buscar directamente con *bower search*

- Actualizar dependencias con *bower update*

Adicionalmente, se puede configurar cómo actúa Bower creando un fichero de configuración llamado *.bowerrc*, que no es más que un fichero JSON. Por ejemplo, si queremos que instale las dependencias en otro sitio, podemos tener un **fichero .bowerrc** así:

```javascript
{
  "directory": "app/lib"
}
```

Obviamente, en el [sitio de Bower](http://bower.io/) puedes consultar la documentación completa, incluyendo opciones de ejecución, campos del fichero bower.json etc.

## NPM

**NPM es el gestor de paquetes para Node.js**, pero también se puede utilizar para manejar dependencias de frontend. Funciona de forma muy similar a Bower.

### Fichero package.json

Igual que con bower.json, un proyecto se inicializa con el siguiente comando:

```bash
npm init
```

A partir de aquí, podemos instalar las dependencias también con la opción *--save*:

```bash
npm install --save jquery
```

En este caso, la carpeta destino es node_modules, de forma que la referencia sería:

```markup
<script src="node_modules/jquery/dist/jquery.js"></script>
```

Así, de la misma forma que con el bower.json, podemos tener en nuestro repositorio únicamente el fichero package.json e **instalar todas las dependencias de un plumazo con *npm install***.

Ten en cuenta que NPM es un gestor de mucho más alcance que Bower, y por tanto tiene más opciones, fuera de lo estrictamente frontend.

De hecho, en cuanto a dependencias frontend, **Bower tiene un catálogo más amplio que NPM**.

### Browserify: modularizando el frontend

Siempre que las dependencias de mi proyecto estén disponibles en NPM, yo lo prefiero.

*¿Y eso por qué?*

Pues la razón principal es que me permite utilizar [CommonJS](http://www.commonjs.org/) (la manera de importar paquetes en Node.js, **usando *require***) para modularizar mis proyectos, junto con la herramienta [Browserify](http://browserify.org/).

Veamos un ejemplo rápido.

Primero instalamos browserify:

```bash
npm install -g browserify
```

Ahora, crearemos un fichero *body-writer.js* de ejemplo:

```javascript
var $ = require('jquery');

module.exports.write = function() {
  $('body').text('jQuery imported as a Node module');
}
```

Como ves, podemos importar jQuery y utilizarlo dentro del módulo. Además este módulo expone una función que puede ser usada desde otro sitio.

Creamos un fichero principal de aplicación, **main.js** que haga uso del módulo:

```javascript
var bodyWriter = require('./body-writer.js');

bodyWriter.write();
```

Finalmente, utilizamos browserify para generar un único fichero JS que incluimos en la aplicación:

```bash
browserify main.js -o bundle.js
```

Browserify navega a través de las dependencias y crea un único fichero JS con lo necesario para que todo funcione.


Así, en el HTML simplemente referenciamos el fichero *bundle.js*:

```markup
<script src="bundle.js"></script>
```

No hay duda de que hoy en día tenemos muchas opciones para que el JavaScript de nuestra web esté mucho mejor organizado y modularizado. Y el futuro se presenta más interesante con los [módulos ES6](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import).

Te recuerdo que [el código del ejemplo completo está en Github](https://github.com/er1x/dep-managers).

¿Y tú? ¿Usas Bower o NPM para gestionar tus dependencias? ¿Prefieres otra cosa?
