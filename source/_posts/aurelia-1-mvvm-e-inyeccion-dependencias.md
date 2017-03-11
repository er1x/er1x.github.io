title: 'Aurelia series 1: MVVM e Inyección de dependencias'
date: 2015-07-22 19:31:00
tags: ['frontend', 'aurelia']
---
![Aurelia Framework](/images/2015-07/aurelia-tutorial.png)

Con este post voy a **dar comienzo a una serie en la que voy a realizar un tutorial completo del framework [Aurelia](http://aurelia.io/)**, que ya [presenté en un post anterior](/2015/07/introduccion-aurelia-framework/).

En esta serie de posts **vamos a construir una sencilla aplicación CRUD, desde cero, que conecte con una API externa**.



## Qué es *Model-View-ViewModel*

Aurelia es un framework que implementa MVVM (Model-View-ViewModel).

**TL;DR;** MVVM es una forma de separar las responsabilidades de aplicación en partes, y que no tengas que andar toqueteando todo cada vez que quieres modificar algo.

---
MVVM es un patrón que segmenta nuestra aplicación en tres tipos de componentes diferenciados, a saber:

* **Models**: son clases que albergarán (accediendo o no a BBDD) información sobre los elementos del negocio. Por ejemplo, si tengo una aplicación de series de televisión, podría tener una clase *Series*, con métodos para obtener una lista, preguntar por una en particular... etc.

* **Views**: son la parte de la aplicación que presenta los datos al usuario. Aquí hay poco que decir, ya que son plantillas HTML. En este tipo de frameworks incluyen un pequeño lenguaje de plantillas para poder meter datos fácilmente.

* **ViewModels**: son clases que están en el medio de los modelos y las vistas. Contienen propiedades que son enlazadas en la vista (mediante el lenguaje de plantillas) e implementan los métodos que tienen lugar cuando un usuario pulsa en algún sitio, por ejemplo. Habitualmente dependen de los modelos de donde obtienen los datos.

![mvvm](/images/2015-07/mvvm.png)

Imagen de MVVM de [Wikipedia](https://en.wikipedia.org/wiki/Model_View_ViewModel).

Suficiente teoría. ¡Vamos a hacer algo!

## Creando el proyecto

En lugar de utilizar el generador de Yeoman para Aurelia vamos a crear el proyecto desde cero, para aprender mejor cómo funciona.

Para ello, creamos una carpeta con un fichero index.html simple.

![base](/images/2015-07/base-1.png)

### Agregando JSPM al proyecto

Para instalar nuestras dependencias de frontend vamos a utilizar el gestor JSPM, el cual [ya te enseñé como instalar y usar](/2015/07/frontend-modular-es6-jspm/). Veamos rápidamente cómo:

![jspm-init](/images/2015-07/jspm-init.png)

Con JSPM añadido, modificamos nuestro index.html para incluir el cargador de módulos y el fichero de dependencias.

![index.html con jspm](/images/2015-07/index-with-modules.png)

### Instalando Aurelia

Simplemente indicamos a jspm lo que debe instalar, que en este caso son dos dependencias: **[aurelia-framework](https://github.com/aurelia/framework)** y **[aurelia-bootstrapper](https://github.com/aurelia/bootstrapper)**.

![instalando aurelia](/images/2015-07/aurelia-install.png)

## Primeros *ViewModel* y *View*

Ya tenemos el proyecto base listo. A continuación tendremos que:

* Cargar el framework en la página.
* Crear los primeros view y viewmodel que debe cargar.

Vamos con ello:

### Cargando el framework

Sólo es necesario importar aurelia-bootstrapper con [SystemJS](https://github.com/systemjs/systemjs), e indicarle un punto de montaje, en este caso el body.

![index.html modificado](/images/2015-07/index-modified.png)

### Primeros *view* y *viewmodel*

Por defecto, Aurelia se va a por los ficheros app.js y app.html en busca de los primeros view y viewmodel. Esto puede cambiarse, pero de momento lo vamos a dejar así y a crear ambos ficheros.

![app.html](/images/2015-07/app-html.png)
![app.js](/images/2015-07/app-js.png)

Si te leíste el post de introducción de Aurelia no verás nada nuevo. Básicamente tenemos [plantillas HTML5](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/template) (view) y [clases ECMAScript 2015](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes) (viewmodel).

Los atributos de la clase tienen su reflejo en la vista. Esto se conoce como data-binding y profundizaremos más en ello en otro post.

![hello world](/images/2015-07/helloworld-1.png)

## ¿Y el *model*?

¡Necesitamos algún sitio de donde sacar datos! En este caso queremos obtener un listado de películas de Star Wars.

Para hacer esto, vamos a crear un modelo: films.js. Pero antes, tenemos que tener una manera de conseguir los datos de las pelis, que los vamos a sacar de https://swapi.co/.

Necesitamos algo para hacer peticiones AJAX, y en este caso vamos a usar el **[cliente HTTP de aurelia](https://github.com/aurelia/http-client)**, aunque podríamos usar cualquier otro.

Para instalarlo, con jspm:

![instalando cliente http de aurelia](/images/2015-07/aurelia-http.png)

Ahora, tenemos que escribir nuestro modelo de forma que haga uso del cliente HTTP.

![modelo](/images/2015-07/model-1.png)

Vamos a explicar un poco qué hace esta clase:

* **Importamos como dependencias el cliente HTTP** que hemos instalado antes, **y la función inject** que nos permitirá inyectar esta dependencia en la clase Films.

* Utilizamos el **decorator @inject** para agregar la dependencia y la ponemos en una propiedad en el constructor. Los decorators son propios de ES7 y su sintaxis no es definitiva.

* Por último, agregamos una función all, que hace una **llamada a la API REST** de Star Wars y **devuelve una promesa** con el contenido de la respuesta.

### Vale, pero, ¿a qué viene lo del *inject*?

Puede que te estés preguntando para qué es esto del inject, ya que al fin y al cabo, podríamos instanciar el cliente HTTP de aurelia dentro del constructor de Films.

Lo cierto es que es así, pero el problema viene si queremos hacer testing de esa clase. **Si de alguna manera le pasamos sus dependencias podemos testearla más fácilmente**, ya que podemos hacer que estas dependencias sean mocks, stubs etc. de forma que probemos únicamente la clase objetivo, sin intervenir nada más.

Esta manera de trabajar **es un patrón conocido como [inyección de dependencias](https://es.wikipedia.org/wiki/Inyecci%C3%B3n_de_dependencias)**.

## Modificando App

Con esta nueva clase que nos hemos creado ya podemos obtener datos para presentar en la vista principal.

### app.js
Primero modificamos app.js para que haga uso del modelo que hemos creado. Una vez más haciendo uso de inject.

![app.js modificado](/images/2015-07/app-js2.png)

Como ves, utilizamos la función all proporcionada por el modelo. Una vez se resuelve la promesa, extraemos los títulos de las películas de la respuesta y los guardamos en this.movies.

### app.html

Ahora tenemos que tomar esas pelis y enseñarlas. Para ello modificamos la vista:

![vista modificada](/images/2015-07/viewmodified.png)

En este caso utilizamos el atributo repeat.for, para recorrer el objeto movies y extraer el título de cada una.


Finalmente el resultado es este:

![resultado](/images/2015-07/result.png)

Sí, ya sé que no es lo más bonito del mundo (y ahora que me doy cuenta, ¡ni siquiera salen por orden!), pero ya lo corregiremos más adelante con un poco de Bootstrap.



---

## En resumen

En este post hemos aprendido a:

* **Crear una aplicación de Aurelia desde cero**, usando JSPM para instalar las dependencias que necesitamos.
* Qué es MVVM y **cómo crear *models*, *views* y *viewmodels* y usarlos** dentro de Aurelia.
* Cómo **utilizar la inyección de dependencias para modularizar los componentes** de la aplicación.

Lo que mola de esto, en mi opinión, es que con pocas excepciones, **hemos estado usando estándares HTML5 y JS (ECMAScript 2015)**. Lo cual está muy bien porque hay que aprenderlos sí o sí :)

---

Por cierto.

En este post he cambiado un poquitillo la manera de trabajar, incluyendo imágenes en lugar de trozos de código. He hecho esto porque creo que se ve mejor con el árbol de directorios y queda todo más legible. Además **el código lo tienes en el [repositorio en Github](https://github.com/er1x/aur-tuto)**, para copiar lo que quieras.

Supongo que me penalizará el SEO, pero si te es más útil así, bien hecho está.

Si prefieres que ponga el código en como texto, dímelo y para los sucesivos posts lo haré así.

Y si quieres comentar algo sobre Aurelia, eres bienvenido ^^

<br>
---
Imagen del post por [Jay Mantri](http://jaymantri.com/) | Creative Commons 0 [CC0](http://creativecommons.org/publicdomain/zero/1.0/)
