title: 'Cómo automatizar navegación web con SlimerJS'
date: 2015-09-30 17:25:00
tags: ['slimerjs']
---
![SlimerJS](/images/2015-09/slimer-1.png)

Es común a la hora de testear una web, hacer scraping o similar, tener que **automatizar la navegación por alguna página web**. [SlimerJS](http://slimerjs.org/) es una herramienta que personalmente he utilizado para ello y me ha dado muy buenos resultados. Su **instalación y uso son muy sencillos**.

Vamos a ver un ejemplo:

Supongamos que tenemos que crear un script que ejecutaremos diariamente, y que tiene que hacer una captura de pantalla de la noticia de portada de un diario deportivo.

Con SlimerJS podemos automatizar esto.

## Instalación y Apertura de una Web

La instalación de SlimerJS es sencilla. Puedes bien [descargártelo](http://slimerjs.org/download.html) o bien instalarlo a través de NPM.

Yo prefiero esta segunda opción:

```bash
npm install slimerjs -g
```

Por otra parte, en el sistema que quieras ejecutar los scripts tendrás que tener instalado Firefox (Iceweasel también vale).

Una vez instalado, veamos un script sencillito:

```javascript

var page = require('webpage').create();
page.viewportSize = { width: 1024, height: 768 };

page
  .open('http://www.marca.com/')
  .then(function(){
    slimer.wait(1000);
    slimer.exit()
  });
```

Básicamente, ahí le estamos diciendo a SlimerJS que abra la web de Marca y espere durante un segundo.

Ejecutamos:

```bash
slimerjs navigate.js
```

Y este es el resultado:

![captura1](/images/2015-09/captura1.png)


## Navegar por la página y sacar una captura

Ook, ahora vamos a ver cómo pulsar en el titular de la web y sacar una captura de pantalla:

```javascript

var page = require('webpage').create();
page.viewportSize = { width: 1024, height: 768 };

page
  .open('http://www.marca.com/')
  .then(function(){
    slimer.wait(1000);
  })
  .then(function() {
    page.evaluate(function() {
      document.querySelector('.principal a').click();
    });
  })
  .then(function() {
    slimer.wait(1000);
    page.render('screenshot.png')
    slimer.exit();
  });

```

Aquí, lo que hemos hecho es **inyectar JavaScript en la web** para hacer click en el enlace. SlimerJS nos permite evaluar JavaScript en el contexto del navegador, mediante **page.evaluate**.

Posteriormente generamos la captura con la función **page.render**. Los wait son para dar margen a que la página cargue correctamente, se quite la publicidad etc.

El aspecto de la captura de pantalla es tal que así (lo he recortado un poco porque captura la web entera):

![captura2](/images/2015-09/screenshot.png)

---

## Otras cuestiones

**Q: ¿Por qué no hacer un simple wget o descargar la página?**

A: Wget, y otros métodos de descarga estáticos no interpretan JavaScript, por tanto si quieres automatizar algo en una web en la que su contenido sea dinámico es probable que tengas que tirar de un método de este tipo. [PhantomJS](http://phantomjs.org/) o [Selenium](http://www.seleniumhq.org/).

**Q. ¿Para esto no se suele usar PhantomJS?**

A: Sí. En realidad para las necesidades que he tenido fue lo primero que probé. Sin embargo su sintaxis me parece más engorrosa y además me he encontrado con webs que no renderiza correctamente, y SlimerJS, al usar Firefox, sí.

**Q: Vale, pero para esto tengo que tener unas X instaladas y un navegador real**

A: Puedes utilizar **xvfb-run**. Yo lo he utilizado en Debian, con Iceweasel en un servidor sin entorno gráfico instalado y cero problemas.

Simplemente instala xvfb (apt, yum...) y ejecútalo así:

```bash
xvfb-run slimerjs tu-script.js
```
---

Y, como siempre, cualquier comentario es bienvenido :)
