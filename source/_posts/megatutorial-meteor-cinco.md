title: 'Megatutorial Meteor en Español (5) - El framework más popular en Github'
tags: ['meteor']
date: 2016-02-15 07:00:00
---
![Meteor](/images/2015-12/meteor.jpg)

Esta es la **quinta y última parte de la serie de tutoriales de [Meteor](https://www.meteor.com/)**.

Las partes de este **tutorial de Meteor en español** son:

* [Parte 1](/2015/12/megatutorial-meteor-uno/): el *hola mundo* de Meteor y la estructura de un proyecto.
* [Parte 2](/2016/01/megatutorial-meteor-dos/): cómo crear vistas y rutas e introducción a [Atmosphere](http://atmospherejs.com/).
* [Parte 3](/2016/01/megatutorial-meteor-tres/): las colecciones de datos.
* [Parte 4](/2016/02/megatutorial-meteor-cuatro/): usuarios y autenticación.
* [Parte 5](/2016/02/megatutorial-meteor-cinco/): llamadas a métodos en el servidor.

En esta parte del tutorial lo que haremos será aprender a hacer **llamadas de métodos definidos en el servidor**. Si recuerdas el [anterior tutorial](/images/2016-02/megatutorial-meteor-cuatro/), nos habíamos quedado a punto de mandar al servidor una petición de compra de productos, pulsando un botón.

De modo que aquí veremos:

* La instalación y uso de un módulo de pagos de [Stripe](https://stripe.com/es). Esto no es mucha novedad, ya que durante toda la serie hemos estado usando Atmosphere *a cascoporro*.
* Cómo definir llamadas a **métodos del servidor en Meteor**, con **Meteor.call**.
* Recibir esas llamadas en el servidor, con **Meteor.methods**.

## Stripe

[Stripe](https://stripe.com/es) es un servicio que permite integrar pagos con tarjeta de crédito en tu aplicación de una forma relativamente sencilla.

Sólo hay que crearse una cuenta y el sistema nos proporciona unas claves con las que podemos integrar el sistema de pago.

### Crear una cuenta de Stripe

Lo primero que hay que hacer es crearse un cuenta de Stripe en [su página de registro](https://dashboard.stripe.com/register). Lo típico: email y password.

![Nueva cuenta](/images/2016-02/meteor-5-account.png)

Después, podemos ir al *dashboard* de Stripe y arriba a la derecha podemos pulsar en nuestra cuenta y e ir a *account settings*.

![Configuración de cuenta](/images/2016-02/meteor-5-settings.png)

Por defecto la cuenta está en modo test, lo que nos permite recibir pagos ficticios, así que para este ejemplo nos viene perfecto.

En la configuración verás un botón que pone *API Keys*. Ahí es donde verás tus claves privada y pública. Un par para testing y otra para producción. Apúntate las de testing.

![API Keys](/images/2016-02/meteor-5-stripe-keys.png)


## Instalar módulo de Stripe en Meteor

Vamos a utilizar [éste módulo](https://atmospherejs.com/mrgalaxy/stripe) para trabajar con Stripe en Meteor. Así que ya sabes lo que toca:

```bash
meteor add mrgalaxy:stripe
```

Para trabajar con éste módulo tenemos que proporcionarle las claves de Stripe.

### Settings.json, fichero de configuración de Meteor

Vamos a guardar las claves en el un **fichero de configuración en la raíz del proyecto, llamado settings.json**:

```json
{
  "public": {
    "stripe_pk": "pk_test_superclavefantastica"
  },
  "private": {
    "stripe_sk": "sk_test_furiousthemonkeyboy"
  }
}
```

Como ves, en este fichero podemos definir configuraciones públicas y privadas. En este caso la clave secreta de Stripe sólo está disponible en el servidor, y la pública en el cliente y el servidor.

Para que coja esta configuración hay que iniciar Meteor con:

```bash
meteor --settings settings.json
```

Lo suyo aquí, es que tengas un fichero *settings.json* añadido al sistema de control de versiones, y otro para producción que no lo subas, añadiéndolo por ejemplo a .gitignore si usas git.


## Cliente: formulario y Meteor.call

Básicamente, lo que hay que hacer es crear un formulario en HTML y asignar un *evento submit* al mismo.

En el formulario de tarjetas de crédito hay que incluir los siguientes campos: número de tarjeta, año y mes de caducidad y CVC.

Un formulario sencillo podría ser por ejemplo este:

```html
<form class="form-horizontal well">
  <fieldset>
    <legend>Datos del pago</legend>
    <div class="form-group">
      <label class="col-lg-2 control-label">Número de tarjeta</label>
      <div class="col-lg-10">
        <input type="text" class="form-control" id="ccnum" placeholder="número..." required>
      </div>
    </div>
    <div class="form-group">
      <label class="col-lg-2 control-label">Fecha expiración</label>
      <div class="col-lg-4">
        <input type="text" class="form-control" id="exp-year" placeholder="Año" required>
      </div>
      <div class="col-lg-4">
        <input type="text" class="form-control" id="exp-month" placeholder="Mes" required>
      </div>
    </div>
    <div class="form-group">
      <label class="col-lg-2 control-label">CVC</label>
      <div class="col-lg-10">
        <input type="text" class="form-control" id="cvc" placeholder="Email" required>
      </div>
    </div>
    {{#if currentUser}}
    <div class="form-group">
      <button id="pay" class="btn btn-primary" type="submit">
        <i class="glyphicon glyphicon-shopping-cart"></i> Pagar
      </button>
    </div>
    {{else}}
    <p>No puedes pagar sin estar registrado: ¡monstruo desaprensivo!</p>
    {{/if}}
  </fieldset>
</form>
```

No es muy sofisticado pero para un ejemplo nos sirve:

![Formulario de ejemplo](/images/2016-02/meteor-5-form-pago.png)

### Inicializar Stripe del lado del cliente

Tenemos que inicializar Stripe con la clave pública. Con Meteor podemos definir métodos que se ejecuten al inicio con [Meteor.startup](http://docs.meteor.com/#/basic/Meteor-startup).

```javascript
Meteor.startup(function() {
    Stripe.setPublishableKey(Meteor.settings.public.stripe_pk);
});
```

### Evento *submit*

Ahora tenemos que recoger el evento submit del formulario. Con [Template.name.events](http://docs.meteor.com/#/basic/Template-events).

```javascript
Template.cart.events({
  "submit .form-horizontal": function(event, template){
    event.preventDefault();
    Stripe.card.createToken({
      number   : $('#ccnum').val(),
      cvc      : $('#cvc').val(),
      exp_month: $('#exp-month').val(),
      exp_year : $('#exp-year').val()
    }, stripeCallback);
  }
});

function stripeCallback (status, response) {
  if (status !== 200) {
    toastr.error(null, response.message);
    return;
  }

  stripeToken = response.id;
  Meteor.call('chargeCard', stripeToken, Cart.items().fetch(), Meteor.userId(), function(err, result) {
    if (err) {
      toastr.error(null, err);
    } else {
      toastr.success(null, 'Compra realizada!');
      Cart.empty();
    }
  });
}
```

Veamos este código por partes, cual *Jack el Destripador*:

* Asignamos una función al evento *"submit .form-horizontal"*. La función se llamará al mandar el formulario.
* Cuando se ejecuta esta función, en primer lugar se impide que la acción del evento se dispare para que no se nos vaya de la página, con *event.preventDefault()*
* Después, **creamos un token de Stripe con Stripe.card.createToken**, al que le pasamos el contenido del formulario, recogido con jQuery y $('#id').val().
* Por último, si se crea bien el token, llamamos al a función *stripeCallback*.

Función stripeCallback:

* Comprobamos que el token se creó correctamente y en caso contrario mostramos un error.
* Si se creó bien, ya podemos llamar a nuestro servidor para realizar el pago, y aquí entra en juego **[Meteor.call](http://docs.meteor.com/#/basic/Meteor-call)**. En este caso **con Meteor.call llamamos al método del servidor llamado *chargeCard***, y le pasamos como parámetros el token de pago de Stripe, el contenido del carrito y el ID del usuario actual.

**NOTA**: ten en cuenta que esto es un ejemplo de uso de Meteor.call y no estoy teniendo en cuenta la seguridad, validar y mostrar errores etc...


## Servidor: Meteor.methods

¡Por fin tenemos una petición de compra! Habrá que atenderla ¿no?

Vamos a definir el método del servidor *chargeCard*, mediante **[Meteor.methods](http://docs.meteor.com/#/basic/Meteor-methods)**.

```javascript
Meteor.methods({
  'chargeCard': function(stripeToken, items, user) {
    var amount = getAmount(items);
    var Stripe = StripeAPI(Meteor.settings.private.stripe_sk);
    Stripe.charges.create({
      amount: amount,
      currency: 'eur',
      source: stripeToken
    }, function(err, charge) {
      console.log(err, charge);
    });
  }
});

function  getAmount(items) {
 ...
}
```

* Hemos creado un método del servidor al que le llegan el token de stripe, los objetos que hay que comprar y el usuario.
* Obtenemos la cantidad a pagar, en función de los objetos que se quieren comprar (esto no es más que hacer una cuenta con una colección y lo obviamos aquí).
* Inicializamos el API de Stripe con la clave privada, obtenida del **settings.json de Meteor**.
* Llamamos al método de pago, indicando la cantidad a pagar, el tipo de moneda y la cantidad.

Ahora podemos hacer un pago con un tarjeta de prueba, por ejemplo, cualquiera de estas (no son *black*, no te preocupes):

![Tarjetas para testing](/images/2016-02/meteor-5-tarjetas-testing.png)

Si todo ha ido bien, deberíamos poder ver los ingreso en el panel de Stripe:


![Pagos recibidos](/images/2016-02/meteor-5-payments.png)

¡Y ahora a esperar a que llegue la pasta! (si es que llega... :D)

---
Y con esto termina la serie de tutoriales sobre [Meteor](https://www.meteor.com/).

He intentado, no sé si con mucho éxito, agrupar diferentes características de Meteor en estos tutoriales, a lo largo de una aplicación típica, de una forma que te resultara práctica y amena.

En el proceso me he dejado en el tintero mil cosas. Pero espero que al menos te haya podido servir como una introducción sencillita a Meteor y a la forma de trabajar en esta plataforma.

Por último quiero recomendarte los **libros de Meteor que me han ayudado a mí a aprender sobre ello**, y que seguro que los necesitarás si quieres meterte en serio a desarrollar con ello:

* [Getting Started with Meteor.js JavaScript Framework Second Edition](http://www.amazon.es/gp/product/1785285548/ref=as_li_ss_tl?ie=UTF8&camp=3626&creative=24822&creativeASIN=1785285548&linkCode=as2&tag=jsj04-21)
* [Discover Meteor](https://www.discovermeteor.com/)


¡Buena semana!
