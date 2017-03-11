title: 'Megatutorial Meteor en Español (4) - El framework más popular en Github'
tags: ['meteor']
date: 2016-02-01 07:00:00
---
![Meteor](/images/2015-12/meteor.jpg)

Esta es la **cuarta parte de la serie de tutoriales de [Meteor](https://www.meteor.com/)**.

Las partes de este tutorial son:

* [Parte 1](/2015/12/megatutorial-meteor-uno/): el *hola mundo* de Meteor y la estructura de un proyecto.
* [Parte 2](/2016/01/megatutorial-meteor-dos/): cómo crear vistas y rutas e introducción a [Atmosphere](http://atmospherejs.com/).
* [Parte 3](/2016/01/megatutorial-meteor-tres/): las colecciones de datos.
* [Parte 4](/2016/02/megatutorial-meteor-cuatro/): usuarios y autenticación.
* [Parte 5](/2016/02/megatutorial-meteor-cinco/): llamadas a métodos en el servidor.

En esta tercera parte del tutorial veremos:

* La autenticación de usuarios
* Crear un carrito de la compra con el módulo [Cart](https://atmospherejs.com/jimmiebtlr/cart).

Let's go!

## Autenticación en Meteor

**Añadir usuarios a Meteor es de lo más sencillo que hay**. Se gestionan mediante los paquetes *accounts-XXXX*. Así por ejemplo tenemos los paquetes *accounts-password*, *accounts-twitter*, *accounts-facebook*... Sólo tienes que agregar los que necesite tu aplicación.

Por otra parte tenemos los paquetes *accounts-ui*, que proporcionan la interfaz de usuario necesaria para hacer *login*.

### accounts-ui-bootstrap-3

Para este ejemplo vamos a utilizar **[accounts-ui-bootstrap-3](https://atmospherejs.com/ian/accounts-ui-bootstrap-3)**.

```bash
$ meteor add ian:accounts-ui-bootstrap-3
```

Ahora tan sólo necesitamos agregar el código a la vista:

#### client/templates/partials/navbar.html
```html
...
<ul class="nav navbar-nav navbar-right">
  {{>loginButtons}}
</ul>
...
```

¡Y ya está! Si nos vamos a ver la aplicación veremos lo siguiente (fíjate en la barra arriba a la derecha):

![Sin servicios de login](/images/2016-02/meteor4-nologinservices.png)

Esto quiere decir que tenemos la interfaz lista, pero no hay métodos de login configurados.
De momento vamos a poner autenticación por contraseña.

### accounts-password

```bash
$ meteor add accounts-password
```

![Login con contraseña](/images/2016-02/meteor4-accountsPassword.png)

Con este método ya tenemos autenticación sencilla por contraseña, y podemos crear nuestra cuenta y acceder con ella.

![Login con contraseña (2)](/images/2016-02/meteor4-loggedin.png)

Ten en cuenta que **el servicio [Accounts](http://docs.meteor.com/#/full/accounts_api) de Meteor es muy potente**. Puedes configurarlo para pedir campos adicionales, restringir los registros...

### accounts-twitter

Como somos muy majos (y con Meteor no lleva mucho trabajo :P) vamos a **permitir iniciar sesión a los usuarios con su cuenta de Twitter**. Tan sencillo como ésto:

```bash
$ meteor add accounts-twitter
```

Con esto, Meteor añade la opción de iniciar sesión con Twitter. Pero como esto requiere de cierta configuración adicional, **Meteor nos proporciona instrucciones para montarla**. Un detallazo.

![Configurar Twitter 1](/images/2016-02/meteor4-configTwitter.png)
![Configurar Twitter 2](/images/2016-02/meteor4-configTwitter2.png)

Como el proceso es el mismo que el que te mostré [en el tutorial de Ionic](/2015/06/tutorial-ionic-parte-dos/#Configurar_la_autenticaci_F3n_con_Twitter), no voy a pararme aquí.

La cosa es que **Meteor internamente creará una colección users en MongoDB**, donde almacenará la información de los usuarios.


## Carrito

Hasta ahora, tenemos productos pero no un carrito de la compra.

![Carro](/images/2016-02/mongo4-botoncarro.png)

Tenemos que conseguir que ese botón *"Añadir al carrito"* funcione.

### Módulo Cart

Cuando hice este tutorial estuve mirando módulos para carritos en Meteor, y la verdad no encontré muchos. Ya iba a ponerme a hacerlo yo mismo (con una *[colección](https://www.meteor.com/tutorials/blaze/collections)*), cuando probé **[éste módulo](https://atmospherejs.com/jimmiebtlr/cart)**. Es un carrito sencillo y funciona bien, pero supongo que para cosas más serias tendrías que *picarte* uno tú mismo.

#### lib/cart.js

Básicamente, lo que hay que hacer es configurar el carrito con las colecciones de productos que tengamos en la tienda.

```javascript
Cart.configure({
  Products: {
    collection: Products
  }
});
```

Esto **expone un objeto *Cart***, con diferentes métodos: añadir objetos, listar, eliminar etc.

![Objeto expuesto por Cart](/images/2016-02/meteor4-cart-methods.png)

#### client/scripts/productDetail.js

Ahora toca hacer que el botón *"Añadir al carrito"* haga su trabajo. Para ello añadimos un **evento click en la plantilla del producto**. Al pulsar este botón, se llama al método *add* de *Cart*.


```javascript
Template.productDetail.events({
  'click button': function(event, template){
    Cart.add({
      relationType: 'Products',
      relationId: template.data._id._str,
      quantity: 1
    });
  }
});
```

### Vista del carrito

Guay, ya tenemos el carrito y podemos añadir los productos. Pero necesitamos tener una vista para ver lo que tenemos y pagar. Vamos a añadirla:


#### client/templates/partials/cart.html

```html
<template name="cart">
<div class="container products">
  <h1>Carrito</h1>
  <hr>
  <h2>Items en el carrito: {{numItems}}</h2>
  <div class="row category-credit" style="margin-top:20px">
    <div class="col-md-6">
      <table class="table table-striped">
        <thead>
          <tr>
            <th>Item ID</th>
            <th>Cantidad</th>
          </tr>
        </thead>
        <tbody>
          {{#each items}}
            <tr>
              <td data-id="{{_id}}">{{item.title}}</td>
              <td>{{amount}}</td>
            </tr>
          {{/each}}
        </tbody>
      </table>
    </div>
  </div>
  <p>Total a pagar: <strong>{{totalPrice}}€</strong></p>
  {{#if currentUser}}
    <div>
      <button id="pay" class="btn btn-primary">
        <i class="glyphicon glyphicon-shopping-cart"></i>
        Pagar
      </button>
    </div>
  {{else}}
    <p>No puedes pagar sin estar registrado: ¡monstruo desaprensivo!</p>
  {{/if}}
  <br>
  <br>
</div>
</template>
```

Aquí hacemos varias cosillas:

* Definimos una plantilla de nombre **cart**.
* Mostramos el número de objetos en el carro, que está en la variable *numItems*.
* Mostramos una tabla con cada uno de los productos y debajo el total a pagar.
* Por último, si existe la variable *currentUser*, mostramos el botón de pagar. Si no, le indicamos al usuario que se registre. Cabe destacar que **currentUser está disponible en cualquier lugar**, y nos indica el usuario actual de la aplicación.

El resto de *helpers* los definimos nosotros. Veamos cómo:

#### client/scripts/cart.js

```javascript
Template.cart.helpers({
  items: function(){
    var items = [];
    Cart.items().forEach(function(item) {
      items.push({
        _id: item.relationId,
        item: Products.findOne({_id: new Meteor.Collection.ObjectID(item.relationId)}),
        amount: item.quantity
      });
    });
    return items;
  },
  numItems: function(){
    return Cart.numItems();
  },
  totalPrice: function() {
    var price = 0;
    Cart.items().forEach(function(item) {
      var product = Products.findOne({_id: new Meteor.Collection.ObjectID(item.relationId)});
      price += item.quantity * product.price;
    });
    return price;
  }
});

Template.cart.events({
  "click #pay": function(event, template){
    alert('pagando!');
  }
});
```

En este script definimos **3 helpers Meteor**, que son:

* *items*: busca los objetos del carrito y los devuelve.
* *numItems*: simplemente devuelve lo que haya en Cart.num_items().
* *totalPrice*: itera por los productos del carrito y va acumulando el precio total.

Finalmente, definimos un evento al pulsar el botón *"pagar"*, que implementaremos en la **siguiente y última parte del tutorial de Meteor**.

La cosa queda así:

![Vista del carrito](/images/2016-02/cart-view.png)

¿Un poco caro para 3 pósters no? :P

---

En este tutorial hemos visto lo sencillo que resulta utilizar el **sistema de usuarios del framework  Meteor**, así como utilizar un pequeño módulo para el carrito de la compra.

Particularmente, me ha encantado **lo fácil que es incluir sistemas de autenticación alternativos, tipo Twitter o Github**. Esto últimamente es un *must have* de cualquier aplicación, y **Meteor lo pone más fácil que cualquier otro framework** que haya visto.

¿Qué opinas al respecto?

En la próxima y última entrega, que creo que será cortita, realizaremos el pago de los productos, probablemente utilizando la **API de [Stripe](https://stripe.com/es)**, que me han dicho que mola mucho más que la de PayPal :P

¡Buena semana!
