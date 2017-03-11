title: 5 paquetes que no deben faltar en tu instalación de Node.js
date: 2015-06-08 07:17:00
tags: ['nodejs', 'herramientas']
---
![paquetes npm](/images/2015-06/npm-packages.png)
Entre la vasta colección de paquetes de [NPM](https://www.npmjs.com/) hay unos cuantos que nunca faltan en mi PC, y que siempre instalo de manera global. Así están a mano en la terminal.

Para instalarlos:

```bash
npm install -g node-inspector nodemon yo http-server forever
```

Estoy seguro de que te serán muy útiles. Aquí te enseño para qué sirven y cómo usarlos.

## [node-inspector](https://www.npmjs.com/package/node-inspector)

Un ***debugger* gráfico para Node.js**.
Es una interfaz de las herramientas de desarrollo de Blink (el motor de renderizado de Chrome, que a su vez es un fork de WebKit). Para que nos entendamos, es como tener el depurador de Chrome pero para Node.

Para utilizarlo, simplemente:

```bash
node-debug mi-aplicacion.js
```

Acto seguido se te abrirá una ventana de Chrome con el depurador listo para empezar la ejecución.

## [nodemon](https://www.npmjs.com/package/nodemon)

Imagina que estás desarrollando un servidor HTTP y que cada vez que cambias algo en el código te toca hacer Ctrl+C y volverlo a arrancar... ¿qué coñazo no?

Si lo ejecutas con nodemon ya no necesitarás hacer esto. **Detecta los cambios en el código automáticamente y re-arranca el servidor**.

```bash
nodemon mi-servidor.js
```

## [yeoman](https://www.npmjs.com/package/yo)

Este proyecto es tan amplio que casi merece un post aparte... Básicamente, **crea proyectos base enteritos con un sólo comando**.

Para que funcione, necesitas instalar Yeoman por una parte (npm install -g yo) y por otra el generador del proyecto que quieras empezar. Puedes encontrar una lista [aquí](http://yeoman.io/generators/).

Por ejemplo, imagina que quieres generar un esqueleto para un proyecto con Backbone. Harías:

```bash
npm install -g generator-backbone
```

Y después:

```bash
mkdir mi-proyecto && cd $_
yo backbone
```

Yeoman nos preguntará amablemente si queremos usar Bootstrap, CoffeeScript o RequireJS y hará todo el trabajo de crear el esqueleto del proyecto e instalar todas las dependencias.

Pero, ¡ojo con abusar de Yeoman!. Dependiendo del generador que uses, puede que no te guste mucho la estructura del proyecto que te deje o que prefieras trabajar de otra forma. **Lo mejor de Yeoman es que puedes crear tu propio generador**, con la estructura y las dependencias que a tí mejor te vayan.


## [http-server](https://www.npmjs.com/package/http-server)

¿Tienes un directorio con **contenido que quieres servir de forma rápida en una web**? Aquí tienes el equivalente al *python -m SimpleHTTPServer*, estilo Node.

Ejecuta este comando en el directorio que quieras servir:

```bash
$ http-server
Starting up http-server, serving ./ on: http://0.0.0.0:8080
Hit CTRL-C to stop the server
```

Lógicamente, puedes configurar el puerto, que solo escuche en *localhost* etc...

## [forever](https://www.npmjs.com/package/forever)

Supongamos que tienes un **servidor web en Node.js que quieres dejar corriendo en segundo plano**. ¡Nada más fácil!

```bash
forever start server.js
```

A partir de aquí puedes:

* forever list: listar los procesos en background.
* forever stop *Id|Uid|Pid|Index|Script*: para un proceso.
* forever restart *Id|Uid|Pid|Index|Script*: reinicia proceso.
* forever restartall: reinicia todo.
* forever stopall: para todo.

Y otra serie de cosas que puedes ver con *forever -h*.

Si quieres una alternativa más elaborada a forever, por ejemplo para servir una aplicación en producción, echa un vistazo a [pm2](https://www.npmjs.com/package/pm2).

---
Lo cierto es que Node.js tiene un montón de herramientas de línea de comandos superútiles: uglify, jshint, less, browserify, [grunt o gulp](http://blog.koalite.com/2015/06/grunt-o-gulp-que-uso/)...

**¿Tienes tú algún paquete siempre presente en tu instalación? ¡Cuéntanoslo en los comentarios!**
