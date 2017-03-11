title: 'Megatutorial Meteor en Español (1) - El framework más popular en Github'
tags: ['meteor']
date: 2015-12-26 11:55:39
---
![Meteor](/images/2015-12/meteor.jpg)

Las partes de este tutorial son:

* [Parte 1](/2015/12/megatutorial-meteor-uno/): el *hola mundo* de Meteor y la estructura de un proyecto.
* [Parte 2](/2016/01/megatutorial-meteor-dos/): cómo crear vistas y rutas e introducción a [Atmosphere](http://atmospherejs.com/).
* [Parte 3](/2016/01/megatutorial-meteor-tres/): las colecciones de datos.
* [Parte 4](/2016/02/megatutorial-meteor-cuatro/): usuarios y autenticación.
* [Parte 5](/2016/02/megatutorial-meteor-cinco/): llamadas a métodos en el servidor.


[Meteor](https://www.meteor.com/) es la **plataforma de moda para aplicaciones web en tiempo real**. Sí, más que un framework es una plataforma. Y, si atendemos [al hype que hay en Github con él](https://github.com/showcases/web-application-frameworks), parece que ha llegado para quedarse.

Yo llevo un poco de tiempo utilizándolo, y los resultados han sido más que satisfactorios. De hecho, ahora mismo  no conozco **nada mejor para prototipar una aplicación web moderna y en tiempo récord**.

En este Megatutorial, que dividiré en varias secciones, te voy a mostrar **el potencial de Meteor**.

## ¿Otro framework? ¿Qué casos de uso tiene Meteor?

No es otro framework, **es una plataforma de desarrollo de aplicaciones *Universal JavaScript* **. Y Meteor no es nuevo, lleva rondando bastante tiempo por ahí y ya tiene **una versión suficientemente estable y madura** (1.2.1) como para plantearse hacer proyectos serios con él.

### ¿Dónde usaríamos Meteor?

Pues Meteor es más o menos equivalente al stack [MEAN](https://en.wikipedia.org/wiki/MEAN_(software_bundle%29), es decir, que afecta tanto al cliente como al server, incluyendo la base de datos. No en vano **utiliza MongoDB como capa de persistencia**, siendo **perfectamente compatible con AngularJS o React**, y con su propio framework de capa cliente, Blaze.

Con esto quiero decir que su caso de uso son **aplicaciones web que se beneficien de una interacción fluida y en tiempo real con el usuario**. Por ejemplo: una startup, y además española, que hace uso de él, es **[mmmelon](https://mmmelon.com/), una aplicación de trabajo colaborativo en tiempo real**.

### ¿Qué tiene de especial?

La magia de meteor es la **sincronización automática entre el cliente y el servidor**. Algo que con MEAN, por ejemplo, tendrías que hacer a base de cosas como Socket.IO. Con mucho más control, pero también más trabajoso.

No voy a meterme con mucha teoría, así que vamos directos al grano.

## Instalación. Más fácil imposible

Instalar Meteor es insultantemente sencillo:

```bash
curl https://install.meteor.com/ | sh
```

[Y en Windows](https://install.meteor.com/windows) también.

¡Y ya está! Incluye absolutamente todo, hasta el MongoDB :P

## Hola Mundo: cómo funciona Meteor

Vamos a crear una aplicación. Para ello, una vez tenemos Meteor instalado el comando *meteor* estará disponible en la terminal:

```bash
> $ meteor create starwars-shop
Created a new Meteor app in 'starwars-shop'.  

To run your new app:
  cd starwars-shop
  meteor

If you are new to Meteor, try some of the learning resources here:
  https://www.meteor.com/learn
```

Eso creará una carpeta para el proyecto con unos cuantos archivos de ejemplo base. Y sí, lo has adivinado, vamos a hacer una tienda de productos de Star Wars como proyecto. En mi defensa diré que me gustaba Star Wars antes de que se pusiera de moda y aparecieran [cosas como ésta](https://twitter.com/erixdev/status/676372744297160705)...

Pero en fin, que divago...

### Qué nos incluye Meteor en el esqueleto

Para arrancar la aplicación es tan sencillo como irte a la carpeta del proyecto y ejecutar **meteor**.

```bash
> $ meteor  
[[[[[ /tmp/starwars-shop ]]]]]

=> Started proxy.
=> Started MongoDB.
=> Started your app.

=> App running at: http://localhost:3000/


```

Después en el navegador vemos esto:

![Aplicación Meteor recién creada](/images/2015-12/meteor-one.png)

El funcionamiento de este ejemplo es sencillo. Presenta una plantilla con un botón y según vas a haciendo click actualiza una variable. Una chorrada vamos.

Vamos a ver qué tienen estos archivos que hagan que la aplicación funcione así.

Si te vas a la carpeta del proyecto verás que solo hay 3 archivos. **Un HTML, un JS y un CSS**.

![Estructura base](/images/2015-12/estructura.png)

#### starwars-shop.html
```html
<head>
  <title>starwars-shop</title>
</head>

<body>
  <h1>Welcome to Meteor!</h1>

  {{ > hello}}
</body>

<template name="hello">
  <button>Click Me</button>
  <p>You've pressed the button {{counter}} times.</p>
</template>
```

En este *starwars-shop.html* vemos dos cosicas interesantes, y fundamentales en Meteor:

* Hay una **template con un name**. Esta plantilla se inserta en el body mediante el uso de {% raw %}{{> nombreplantilla }}{% endraw %}

* Dentro de la plantilla se referencia la variable *counter*.


Como ves, es una **sintaxis sencilla tipo [Handlebars](http://handlebarsjs.com/)**. De hecho el lenguaje de plantillas de Meteor se llama [Spacebars](https://github.com/meteor/meteor/tree/devel/packages/spacebars) y tienen una sintaxis similar.


#### starwars-shop.js
```javascript
if (Meteor.isClient) {
  // counter starts at 0
  Session.setDefault('counter', 0);

  Template.hello.helpers({
    counter: function () {
      return Session.get('counter');
    }
  });

  Template.hello.events({
    'click button': function () {
      // increment the counter when button is clicked
      Session.set('counter', Session.get('counter') + 1);
    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
```

Este JavaScript que ves tiene** dos partes de código, una para el servidor (Meteor.isServer), que no hace nada, y otra para el cliente (Meteor.isClient)**.

Dentro del código que se ejecuta en el cliente, es decir, en el navegador:

* Se establece el valor de la variable de counter en un objeto global llamado **Session**.

* Se definen ***helpers* para la plantilla *hello*, que son funciones que están disponibles dentro de la plantilla**. En este caso se define *counter*, que es la que se invoca cuando en la plantilla ponemos {% raw %}{{counter}}{% endraw %}

* Se definen **eventos para la plantilla *hello***. Al estilo Backbone, con nombre de evento y selector CSS. En este caso este evento al dispararse incrementa la variable *counter*.


Y... ¡ya sabemos cómo funciona el **hola mundo de  Meteor**!

El css no lo vemos, porque es trivial.


## Cómo organizar el código para un proyecto más grande

Eso de Meteor.isClient y Meteor.isServer apesta ¿no? No pasa nada, un proyecto Meteor en condiciones no se organiza así.

Una estructura más razonable es la siguiente:

![Estructura separada](/images/2015-12/estructura-big-project.png)


Meteor trata las carpetas de forma especial, según sea su nombre, en este caso tenemos:

* **server**: código del servidor, que el cliente no puede ver ni ejecutar.
* **client**: código del cliente. HTML, JS y CSS irían aquí.
* **lib**: código que se compartirá entre el servidor y el cliente. Estará disponible automágicamente en los dos.
* **public**: carpeta para los *assets* del proyecto (imágenes, favicon etc.).
...

Más info sobre la estructura y convenciones de Meteor [aquí](http://docs.meteor.com/#/full/structuringyourapp).

## ¿Qué proyecto vamos a hacer?

Como te he dicho, una "especie" de tienda de pósters de Star Wars. Básicamente **aprenderás a usar Meteor** y a meterle cosas como:

* Bootstrap
* Vistas y rutas
* Preprocesadores CSS
* Autenticación ultra fácil en cosa de 2 minutos, y con redes sociales y todo :P (¡sí, de verdad!)
* Uso de paquetes npm e integración con una pasarela de pago.

Esto es lo que iremos desarrollando a lo largo del tutorial... Espero que te guste y te anime al menos a probar Meteor al menos :D

---

Y a tí ¿qué te parece Meteor? ¿será la base de tu nueva startup? ;)
