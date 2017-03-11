title: 'Tutorial Ionic Framework - Parte 3: Autenticación con Twitter y conexión al backend'
date: 2015-07-05 20:22:00
tags: ['angularjs', 'ionic', 'cordova']
---
![ionic](/images/2015-06/ionic.png)

Aquí llega la última parte del tutorial de Ionic. Si te leíste las otras partes sabrás que **estamos creando una aplicación híbrida con el [framework Ionic](http://ionicframework.com/)**. Esta aplicación permitirá obtener un listado de eventos y autenticarse mediante Twitter.

Recordemos primero lo que llevamos hecho hasta el momento:

* En la [parte 1](/2015/06/tutorial-ionic-parte-uno/) instalamos Ionic, creamos la App y vimos la estructura de una aplicación por dentro. También la dejamos lista con las vistas, controladores y servicios necesarios.
* En la [parte 2](/2015/06/tutorial-ionic-parte-dos/) te enseñé cómo crear un backend en Node.js que permitiera realizar autenticación con token mediante la API de Twitter.


En este último post de la serie **vamos a ver cómo conectar la aplicación al backend** y que permita:

* Autenticarnos.
* Obtener una lista de eventos.

Y, finalmente, **utilizaremos un emulador de Android para ver cómo funcionaría la aplicación**.

## Poniéndonos en contexto

Vamos a tomar el código de la aplicación Ionic y a ponernos donde lo habíamos dejado en la parte 1.

```bash
git clone https://github.com/er1x/events-app
cd events-app
git checkout part1
ionic serve
```

Aparte de eso, tendremos que arrancar el backend (orden *node server.js*, en el directorio donde tengas el backend de la [segunda parte del tutorial](/2015/06/tutorial-ionic-parte-dos/)).

El backend lo puedes clonar de [este repositorio](https://github.com/er1x/events-backend), pero recuerda que para que funcione necesitas crear un App en Twitter y crear un fichero *.secret.json* con las credenciales.

## Index.html

Lo primero que tenemos que hacer es instalar el plugin que nos permitirá autenticar, [Satellizer](https://github.com/sahat/satellizer). **En el repositorio del proyecto ya te lo he incluido**, pero puedes instalarlo de nuevo   [utilizando Bower](/2015/05/dependencias-web/#Bower), que ya viene preparado con Ionic. En el momento de escribir este post el plugin tiene un problema con Twitter, y por eso he incluido la versión arreglada de la rama master.

Satellizer soporta autenticación por token con las redes sociales más conocidas, además de permitirnos autenticar con un sistema de autenticación propio.

Una vez lo tenemos agregado, **actualizamos el fichero index.html**:
```html
...
<meta http-equiv="Content-Security-Policy" content="default-src *; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline' 'unsafe-eval'">
...
<!-- ionic/angularjs js -->
<script src="lib/ionic/js/ionic.bundle.js"></script>
<script src="lib/satellizer/satellizer.js"></script>

<!-- cordova script (this will be a 404 during development) -->
<script src="cordova.js"></script>
```

Como puedes ver, hemos incluido una etiqueta META, necesaria para que funcione la autenticación con Cordova. Y además el fichero JS de Satellizer.


## app.js

Una vez agregada la referencia en el index.html tenemos que **añadir Satellizer a las dependencias de nuestra aplicación Angular y configurarlo**. Así que editamos app.js:

```javascript
angular.module('eventsApp', [ 'ionic',
                              'eventsApp.controllers',
                              'eventsApp.services',
                              'satellizer'])

.config(function($authProvider){
  var cfg = {
    popupOptions: {
      location: 'no',
      toolbar: 'no',
      width: window.screen.width,
      height: window.screen.height
    },
    url: '/auth/twitter'
  };

  $authProvider.baseUrl = 'http://192.168.0.100:8000';

  if (ionic.Platform.isIOS() || ionic.Platform.isAndroid()) {
    $authProvider.platform   = 'mobile';
    cfg.redirectUri          = 'http://127.0.0.1/';
  } else {
    $authProvider.withCredentials = false;
  }

  $authProvider.twitter(cfg);
})

.config(function($stateProvider, $urlRouterProvider) {
...
```

Verás que, dependiendo de si la aplicación se ejecuta en Cordova o en un navegador normal, se redirige a una URL diferente tras la autenticación. Por otra parte, **tendrás que modificar la baseUrl a la URL donde tengas escuchando el backend de Node**.


## services.js

El servicio que teníamos en **services.js** ya no tendrá *hardcodeados* los eventos, sino que **los obtendrá del backend, usando para ello el servicio [$http](https://docs.angularjs.org/api/ng/service/$http) de AngularJS**.

```javascript
angular.module('eventsApp.services', [])

.factory('EventsService', function($http) {
  return {
    all: function() {
      return $http.get('http://192.168.0.100:8000/events');
    }
  };
});
```

## controllers.js

Este es el aspecto que presenta ahora el fichero **controllers.js**:

```javascript
angular.module('eventsApp.controllers', [])

.controller('LoginCtrl', function($scope, $auth, $state){
  $scope.authenticate = function() {
    $auth.authenticate('twitter')
         .then(function(){
           $state.go('tab.list');
         })
         .catch(function(err){
            console.log(err);
         });
  };
})

.controller('ListCtrl', function($scope, EventsService, $auth, $state) {
  if (!$auth.isAuthenticated()) {
    $state.go('login');
  } else {
    EventsService.all()
    .success(function(events){
      $scope.events = events;
    })
    .error(function(err) {
      console.log(err);
    });
  }
})

.controller('AccountCtrl', function($scope, $auth, $state) {
  $scope.logout = function() {
    $auth.logout();
    $state.go('login');
  };
});
```

Aquí se hace lo siguiente:

* En los tres controladores **inyectamos las dependencias $auth** (proporcionada por Satellizer) **y $state** (proporcionada por el router de Ionic).

* En el controlador de Login, **definimos la función que se ejecuta al hacer click en el botón**. Esta función utiliza Satellizer para autenticar con Twitter y, si la autenticación es exitosa, redirige al usuario a la lista de eventos usando $state.

* El **controlador de la lista utiliza $auth para comprobar si el usuario está autenticado**, si es así se utiliza el servicio para listar los eventos, y si no se redirige al usuario a la pantalla de Login.

* Por último, **el controlador de cuenta define una función para que el usuario pueda cerrar la sesión**.

---

Con esto la aplicación ya está lista para funcionar en el navegador, pero nosotros queremos desplegarla en un dispositivo móvil, así que vamos a ello.

## Agregando la plataforma móvil

En este ejemplo voy a usar Android, pero en principio debería funcionar sin problemas en otras plataformas.

Para ello **agregamos el soporte para Android y agregamos el plugin inapp-browser**, necesario para que funcione la autenticación.

```bash
ionic platform add android
ionic plugin add cordova-plugin-inappbrowser
```

Por último construimos y corremos la aplicación. Yo utilizo el emulador [Genymotion](https://www.genymotion.com/#!/), que va superbien y le da mil vueltas al emulador estándar de Android.

No te voy a explicar aquí como instalar Genymotion, pero vamos, que es muy sencillo y en Google encuentras información a patadas sobre ello.

Con ello, el SDK de Android instalado y Genymotion corriendo, ejecutamos:

```bash
ionic run android
```

Este comando compila e instala la aplicación en un dispositivo conectado, en este caso el emulador de Android.

<div class="container" style="width: 100%;">
 <div class="theme-table-image col-sm-6">
   <img src="/images/2015-07/genymotion1.png" alt="genymotion1">
 </div>
 <div class="theme-table-image col-sm-6">
   <img src="/images/2015-07/genymotion2.png" alt="genymotion2">
 </div>
</div>

---

¿Fácil no?

En este post hemos visto **cómo utilizar Satellizer para iniciar sesión con Twitter** y **cómo utilizar el servicio $http de AngularJS para recuperar información de un servidor remoto**.

En mi opinión las aplicaciones híbridas crecerán en los próximos años como alternativa de desarrollo rápido y menor coste. Y frameworks como Ionic son una buena solución.

**¿Qué opinas tú al respecto de este tipo de alternativas al desarrollo nativo?**
