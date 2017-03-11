title: 'Cómo añadir publicidad (AdMob) a una App en Ionic'
date: 2015-10-13 22:17:00
tags: ['mobile', 'cordova', 'ionic', 'admob']
---
![Ionic+adMob](/images/2015-10/admob.jpg)

Añadir publicidad es una de las formas más comunes de obtener ingresos (o como le dicen ahora, monetizar) de una aplicación. Una de las plataformas más comunes para ello es **[AdMob](https://www.google.es/admob/) de Google**.

Es probable que ya lo conozcas. Es esa barrita de publicidad que suele salir en la parte de abajo de las apps.

En Ionic, y por extensión, **en una app híbrida hecha con Cordova, podemos hacer uso de AdMob** mediante plugins. En este tutorial veremos cómo.

## Iniciar una app Ionic en blanco

Si no tienes instalado Ionic lo detallo un poco más en [este tutorial](/2015/06/tutorial-ionic-parte-uno/), pero básicamente es tener instalado Node.js y ejecutar *npm i -g cordova ionic*.

Con Ionic y Cordova listos, veamos rápidamente cómo crear un **starter básico en blanco**.

```bash
ionic start admob-demo blank
```

![start](/images/2015-10/start.png)

## Añadir la plataforma móvil y el plugin de AdMob

Para este ejemplo voy a utilizar Android.

Si quieres hacer lo mismo necesitarás tener el SDK de Android instalado, yo lo tengo con la API 5.1.1 y los siguientes extras:

![extras](/images/2015-10/extras.png)

```bash
ionic platform add android
```

Después **agregamos el plugin de AdMob**, en este caso voy a utilizar [este](https://www.npmjs.com/package/cordova-plugin-admobpro).

```bash
ionic plugin add cordova-plugin-admobpro
```

![platform/plugin](/images/2015-10/platform.png)

¡Listo! Ahora sólo hace falta agregar el código necesario para que la barrita de publicidad aparezca en la parte de abajo.

## Código para agregar AdMob

Vamos a tocar dos ficheros, de la siguiente manera:

* **www/index.html**: agregaremos una referencia a un script nuevo en el que incluiremos nuestro código para AdMob, llamado *ads.js*.
* **www/js/ads.js**: aquí es donde irá la *chicha* del asunto.

<br>
#### www/index.html

```html
...
    <!-- your app's js -->
    <script src="js/app.js"></script>

    <!-- the admob code -->
    <script src="js/ads.js"></script>

  </head>
...
```

Simplemente añadimos el script ads.js. No hay más.

<br>
#### www/js/ads.js

```javascript
(function() {
  'use strict';

  var admobData = {};

  // Determine platform
  if (/(android)/i.test(navigator.userAgent)) {
    admobData = {
        banner: 'ca-app-pub-1817269486258695/6892783564'
    };
  } else if (/(ipod|iphone|ipad)/i.test(navigator.userAgent)) {
    admobData = {
        banner: 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'
    };
  } else {
    admobData = {
        banner: 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'
    };
  }

  function setBanner() {
    if (AdMob) {
        AdMob.createBanner({
            adId : admobData.banner,
            position : AdMob.AD_POSITION.BOTTOM_CENTER,
            autoShow : true
        });
    }
  }

  document.addEventListener('deviceready', setBanner, false);
}());
```

Veamos con un poco más de detalle qué se hace aquí:

* En el primer bloque de código, **se examina el *user agent* del navegador para determinar la plataforma de ejecución**. Android, IOS u otros.
Dependiendo de la que sea se rellena un objeto *admobData* con el **ID de AdMob** apropiado.

  Tú tendrás que **reemplazar este ID con el de tu cuenta**. El ID **nos lo proporciona Google al crear la cuenta de Admob**.

* Definimos una función, *setBanner*, que utiliza el plugin para crear el banner con nuestro ID de Admob que va en *admobData*.

* Utilizamos el evento que proporciona Cordova, **deviceready**, para definir la función *setBanner* como callback, que se disparará cuando el dispositivo esté listo.


## Probándolo en un dispositivo

Vamos a probar el invento. Para ello yo utilizaré [Genymotion](https://www.genymotion.com/#!/), pero puedes utilizar otro emulador o un dispositivo físico.

```bash
ionic run android
```

¡Y listo!

![emulador](/images/2015-10/emulador.png)


---

**Con esto puedes añadir publicidad de forma sencilla** a una aplicación híbrida. No solo Ionic, sino **cualquiera hecha con Cordova/Phonegap**.

Por supuesto **existen muchos sistemas de monetización**, que ofrecen librerías similares que puedes utilizar si Admob no te convence.

Espero que te sea útil :)
