title: 'Megatutorial Meteor en Español (2) - El framework más popular en Github'
tags: ['meteor']
date: 2016-01-04 11:55:39
---
![Meteor](/images/2015-12/meteor.jpg)

Las partes de este tutorial son:

* [Parte 1](/2015/12/megatutorial-meteor-uno/): el *hola mundo* de Meteor y la estructura de un proyecto.
* [Parte 2](/2016/01/megatutorial-meteor-dos/): cómo crear vistas y rutas e introducción a [Atmosphere](http://atmospherejs.com/).
* [Parte 3](/2016/01/megatutorial-meteor-tres/): las colecciones de datos.
* [Parte 4](/2016/02/megatutorial-meteor-cuatro/): usuarios y autenticación.
* [Parte 5](/2016/02/megatutorial-meteor-cinco/): llamadas a métodos en el servidor.


Si recuerdas [el anterior tutorial introductorio](/2015/12/megatutorial-meteor-uno/), habíamos creado un proyecto en blanco de meteor y creado una estructura básica para un proyecto más o menos decente :P

En esta entrega de hoy toca decidir las páginas que va a tener nuestra aplicacion, maquetar un poco, añadir algo de CSS y configurar la navegación entre las diferentes páginas.

Vamos a ello!


## Go Spacebars! El motor de plantillas de Meteor

Como ya te he contado, [Spacebars](https://github.com/meteor/meteor/tree/devel/packages/spacebars) es el motor de plantillas de Meteor. Por tanto vamos a escribir las diferentes vistas de la aplicación con este lenguaje.

Las vistas que tendremos serán, a saber:

* Un listado con los productos de la tienda.
* Una vista de detalle de producto.
* Una vista con el carrito de la compra.
* Una página *Acerca de*.

Estas paǵinas compartirán un header y un footer.

Let's go.


### Creando vistas

#### client/templates/layout.html
```html
<head>
  <meta charset="UTF-8">
  <title>StarWars Shop!</title>
  <link href="https://maxcdn.bootstrapcdn.com/bootswatch/latest/sandstone/bootstrap.min.css" rel="stylesheet">
  <script src="https://maxcdn.bootstrapcdn.com/bootstrap/latest/js/bootstrap.min.js"></script>
</head>
<template name="layout">
  {{ > navbar }}

  {{ > yield }}

  {{ > footer }}
</template>
```
El layout es la plantilla principal, que incluye 2 plantillas adicionales (la barra de navegación y el footer), así como la directiva especial *yield*. Esta directiva le dice a Meteor que incruste la plantilla que especifiquemos en el router. No te preocupes, que esto lo vemos más abajo :P

También hemos incluido Bootstrap, directamente desde un CDN.

#### client/templates/products.html
```html
<template name="products">
<div class="container products">
  <h1>Productos Disponibles</h1>
  <hr>
  <div class="row category-credit" style="margin-top:20px">
    {{#each products}}
      {{ > productCard}}
    {{/each}}
  </div>
</div>
</template>
```

Esta plantilla *products.html* iría en lugar del yield. Como ves es una plantilla muy normal, itera con un *#each* sobre una variable de productos, y por cada uno incrusta una plantilla *productCard*.

#### client/templates/product-card.html
```html
<template name="productCard">
<div class="col-lg-2 col-md-4 col-xs-6 thumb ">
  <div class="thumbnail">
    <a class="" href="/products/{{id}}">
      <img class="img-responsive" src="/img/{{image}}" alt="">
      <div class="wrapper">
        <div class="caption post-content">
          <h4>{{title}}</h4>
        </div>
      </div>
    </a>
    <div class="wrapper">
      <div class="post-meta">
        <div class="price">{{price}} €</div>
      </div>
    </div>
  </div>
</div>
</template>
```
La plantilla *productCard* consiste en un pequeño *thumbnail* del poster. Utiliza clases de Bootstrap y variables que le vienen de un objeto especificando un id, una imagen, título y precio.

La cosa queda más o menos así:

![Listado](/images/2016-01/listado.png)

Básicamente, lo importante que quiero que veas aquí es:

* **Cómo se incluyen unas plantillas dentro de otras** (usando {% raw %}{{ > plantilla }}{%endraw%})
* Que las **plantillas tienen que tener un nombre**.
* Que **dentro de ellas puedes usar bucles y utilizar variables**.


Vale pero... ¿Cómo se le pasan estas variables a la plantilla? ¿Cómo se navega entre vistas?

Pues esto se hace con el **Router**. Pero primero necesitamos los datos de los productos, ¿no?

Vamos a crearlos.


## Una lista de productos: *a lo burro*

Como de momento estamos maquetando y creando la navegación, vamos a pasar de momento de la base de datos y a meter los productos en memoria. ¿Dónde? Pues en la carpeta *lib*:

### lib/collections/products.js
```javascript
Products = [
  {
    id: '1',
    title: 'Poster: Star Wars',
    price: 12345,
    image: 'poster1.jpg'
  },
  {
    id: '2',
    title: 'Poster: Yoda',
    price: 12345,
    image: 'poster2.jpg'
  },
  {
    id: '3',
    title: 'Poster: La Venganza de los Sith',
    price: 12345,
    image: 'poster3.jpg'
  },
  ...
];
```

Como ves, es un array mondo y lirondo. Y como está en la carpeta *lib*, está disponible tanto en el servidor como en el cliente.

Mira cómo aparece en la consola:

![Productos en cliente](/images/2016-01/productos-cliente.png)

Para que estos productos estén disponibles en una plantilla, podemos crear *helpers* asociados. Por ejemplo en el listado de productos principal:

```javascript
Template.products.helpers({
  products: function() {
    return Products;
  }
})
```

Ahora llega la hora de introducir el router y configurar la navegación.

## AtmosphereJS: paquetes para Meteor

El router no viene por defecto con Meteor, tenemos que instalarlo.

Para ello usaremos **el repositorio de paquetes de Meteor: [AtmosphereJS](https://atmospherejs.com/)**.

![Atmosphere](/images/2016-01/atmosphere.png)

**Para instalar un paquete en Meteor usamos el comando *meteor add***, en este caso queremos instalar el paquete **Iron-Router**, de modo que:

```bash
meteor add iron:router
```

Tan sencillo como eso. Pero ahora tenemos que configurar este router.

### Iron Router

Tenemos que crear un archivo disponible en cliente y servidor, yo por ejemplo lo meteré en lib/router.js. En él tenemos una variable Router, a la cual deberemos especificarle las rutas de las páginas.

En este caso vamos a poner:

* **/**: para el listado de productos principal.
* **/about**: para el acerca-de.
* **/products/:id**: para el detalle de un producto.

Quedaría así:

```javascript
Router.configure({
  layoutTemplate: 'layout',
  notFoundTemplate: '404'
});

Router.route('/', function () {
  this.render('products');
});

Router.route('/about', function () {
  this.render('about');
});

Router.route('/products/:id', function () {
  var that = this;
  var product = _.find(Products, function(prod) {
    return (prod.id === that.params.id);
  });
  this.render('productDetail', {
    data: product
  });
});
```

Como ves, al router se le pasa una pequeña configuración por defecto, las rutas que queremos y una función de callback que realice el render de la vista apropiada.

En el caso del detalle de producto, utilizamos **[Underscore](http://underscorejs.org/)** para buscar el producto por id y pasarselo a la plantilla como dato. Underscore está por defecto disponible en cualquier lugar de una aplicación web Meteor.

---
En este post hemos visto cómo crear plantillas en Meteor y a utilizar un Router para navegar en la aplicación. A mí cuando aprendí me pareció bastante sencillo viniendo de otros frameworks, aunque me extrañó el tener que añadir a mayores el router, pues normalmente viene por defecto.

Por lo demás Spacebars lo hace fácil. Es sencillo dividir una aplicación en componentes con este uso de las plantillas. Si lo complementas con clases CSS diferenciadas queda una aplicación modular bastante maja.

¿A ti qué te ha parecido?

¿Sencillo? ¿Chungo?

¿Añadirías algo? ¡No dudes en comentar!
