title: 'Megatutorial Meteor en Español (3) - El framework más popular en Github'
tags: ['meteor']
date: 2016-01-18 07:00:00
---
![Meteor](/images/2015-12/meteor.jpg)

Esta es la **tercera parte de la serie de tutoriales de [Meteor](https://www.meteor.com/)**.

Las partes de este tutorial son:
* [Parte 1](/2015/12/megatutorial-meteor-uno/): el *hola mundo* de Meteor y la estructura de un proyecto.
* [Parte 2](/2016/01/megatutorial-meteor-dos/): cómo crear vistas y rutas e introducción a [Atmosphere](http://atmospherejs.com/).
* [Parte 3](/2016/01/megatutorial-meteor-tres/): las colecciones de datos.
* [Parte 4](/2016/02/megatutorial-meteor-cuatro/): usuarios y autenticación.
* [Parte 5](/2016/02/megatutorial-meteor-cinco/): llamadas a métodos en el servidor.

En esta tercera parte del tutorial veremos:

* La base de datos de Meteor.
* Cómo crear colecciones de datos.
* Cómo hacer que esos datos estén disponibles en el *frontend*.
* El modelo de seguridad de Meteor.

A por ello.

## MongoDB, el almacén de datos

**Meteor utiliza [MongoDB](https://www.mongodb.org/) como base de datos**. Como seguramente sepas, MongoDB es una base de datos NoSQL orientada a almacenar documentos, concretamente documentos tipo JSON (MongoDB llama a este formato [BSON](https://es.wikipedia.org/wiki/BSON)).

Es, probablemente, la base de datos NoSQL más popular hoy en día.

**Meteor viene con un MongoDB empaquetado** que se puede usar directamente desde el directorio del proyecto, utilizando el comando **meteor mongo**, así:

![meteor-mongo](/images/2016-01/meteor-mongo.png)


## Creando una colección

En MongoDB, los datos se almacenan en colecciones.

Si recuerdas del anterior tutorial, habíamos [creado previamente un listado *hardcodeado* de productos](/2016/01/megatutorial-meteor-dos/#Una_lista_de_productos_3A_a_lo_burro).

Vamos a sustituir este array que habíamos creado manualmente, por una colección Meteor:

### lib/collections/products.js

```javascript
Products = new Meteor.Collection('products');
```

Tan sencillo como eso.

Insertaremos a continuación los productos que antes teníamos en un array en la base de datos, utilizando el mismo cliente de Mongo de consola:

![Insertando en MongoDB](/images/2016-01/mongo-insert.png)


## Disponibilidad de los datos y Sincronización automática

La colección Products, al estar en la carpeta lib, está disponible tanto en el servidor como en el cliente, y Meteor los sincroniza de forma transparente.

La gracia de esto es que Meteor ofrece una **interfaz similar a MongoDB, llamada [MiniMongo](https://www.meteor.com/mini-databases)**, pero que se puede usar en el cliente. Esto en realidad es una copia de la colección cacheada en el navegador (y no entera, evidentemente).

Mira el aspecto de Products en cliente:

![Colección Products en el navegador](/images/2016-01/productos-cliente.png)

Si se realizan inserciones y actualizaciones, Meteor actualizará las vistas automáticamente en el navegador mediante Blaze.


### Publish / Subscribe

Por defecto Meteor comparte todas las colecciones con el cliente mediante el paquete *[autopublish](https://atmospherejs.com/meteor/autopublish)*. Esto no es deseable, y en producción debemos eliminarlo:

```bash
meteor remove autopublish
```

El problema es que ahora, ¡nos hemos quedado sin productos!

![Sin productos](/images/2016-01/no-autopublish.png)

No hay problema, lo que vamos a hacer es **publicar**, los productos.

#### server/publications.js
```javascript
Meteor.publish('products', function() {
  return Products.find();
});
```

Y debemos indicar al cliente que se **suscriba** a este dato:

#### client/scripts/subscriptions.js
```javascript
Meteor.subscribe('products');
```

¡Ya tenemos de vuelta los productos!

![Listado de productos con suscripción](/images/2016-01/products-subscribed.png)



### Insecure

Puede que al ver que el cliente puede acceder a los productos hayas pensado: "Pero... ¿el cliente puede escribir en la base de datos?"

¡Pues sí!

Mira lo que pasa si hago una inserción desde el navegador:

![Insertando un producto falso](/images/2016-01/client-insertion.png)

No mola, ¿verdad? ¡El cliente podría echar a perder la aplicación!

Esto ocurre porque **Meteor incluye un paquete llamado [*insecure*](https://atmospherejs.com/meteor/insecure), útil para prototipar, pero peligroso en producción**. Vamos a quitarlo:

```bash
meteor remove insecure
```

Si probamos ahora...

![Inserción denegada](/images/2016-01/insert-denied.png)


Podemos personalizar lo que se puede y no se puede hacer en una colección mediante los métodos [allow y deny](http://docs.meteor.com/#/full/allow).

Imagina que por un casual quisiéramos permitir inserciones como la que has visto antes, podrías hacer:

```javascript
Products.allow({
  insert: function(userId, disconnect) {
    return true;
  }
});
```

---

Como ves, es bastante sencillo almacenar datos de una aplicación en Meteor, por medio de MongoDB, así como hacer que estos datos estén disponibles para el cliente, aplicando modelos de seguridad personalizados.

En el próximo tutorial veremos cómo autenticar a los usuarios y añadir productos a un carrito. ¡No te lo pierdas!
