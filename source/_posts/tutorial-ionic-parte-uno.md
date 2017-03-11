title: 'Tutorial Ionic Framework - Parte 1: Instalación y Proyecto Base'
date: 2015-06-21 21:32:00
tags: ['angularjs', 'ionic', 'cordova']
---
![ionic](/images/2015-06/ionic.png)

[Ionic](http://ionicframework.com/) es un framework de desarrollo de **aplicaciones híbridas en HTML5 basado en [AngularJS](https://angularjs.org/)** y que funciona con [Apache Cordova](https://cordova.apache.org/) (sí, Cordova con V).

En mi opinión, sus puntos fuertes son:

* **Rendimiento muy bueno**: sí, no es lo mismo que una aplicación nativa. Pero para un buen número de apps que hacen poco más que una aplicación web va que chuta. Y el mismo código te vale para IOS y Android.
* Tiene un **set de componentes visuales muy chulo** y fácil de usar.
* **Si sabes AngularJS empezar a usarlo es inmediato**.

Con este post empezamos una serie en la que **elaboraremos una aplicación que presentará un listado de eventos**. Utilizará un **backend en Node.js** y permitirá **autenticarse con Twitter**.


**DISCLAIMER**: si no sabes lo básico de AngularJS seguramente no te enteres de nada.

Vamos a ello.


## Instalación

Como siempre, tendremos [que tener instalado Node.js](/2015/05/instalar-nodejs/). Una vez instalado, en una terminal ejecutamos:

```bash
npm i -g cordova ionic
```
Este comando lo dejará todo listo para empezar.

## Creando un esqueleto de App

Ejecutamos en una terminal:

```bash
ionic start events-app tabs
```

Con ese comando lo que estamos diciendo a Ionic es que cree una aplicación básica con navegación basada en tabs, en el directorio events-app. Nos preguntará si queremos crear una cuenta ionic.io, la cual no es necesaria para poder hacer este tutorial.

¡Listo!, ahora entramos al directorio de la aplicación y la arrancamos para echarle un vistazo.

```bash
cd events-app
ionic serve
```

Ionic creará un servidor http y podremos abrir la página en nuestro navegador en la dirección http://localhost:8100. La idea es desarrollar utilizando el navegador y después probar en un móvil o un emulador.

Debes tener en cuenta que **si vas a utilizar APIs de dispositivo (por ejemplo, el acelerómetro) tendrás que probar estas cosas en un emulador o dispositivo**, ya que el navegador no implementa esto.

<div class="container" style="width: 100%;">
 <div class="theme-table-image col-sm-6">
   <img src="/images/2015-06/app-start-1.png" alt="app-creada-1">
 </div>
 <div class="theme-table-image col-sm-6">
   <img src="/images/2015-06/app-start-2.png" alt="app-creada-2">
 </div>
</div>
<br>
Para visualizar la aplicación con la resolución de otro dispositivo en el mismo navegador web puedes hacerlo:

* En Firefox pulsando Ctrl-Shift-M.
* En Chrome abriendo las herramientas de desarrollo (F12) y pulsando en el dibujito del teléfono arriba y en la izquierda.

Personalmente, suelo utilizar [Firefox Developer Edition](https://www.mozilla.org/es-ES/firefox/developer/), y cuando el depurador se me queda corto me paso a Chrome un rato.

### Estructura de directorios

Echemos un vistazo a los directorios que Ionic nos ha creado.

![directorios](/images/2015-06/estructura.png)

Se trata de un esqueleto web para una aplicación de Cordova, en la que se utiliza [Gulp](http://gulpjs.com/) para automatización de algunas tareas y [Bower como gestor de dependencias frontend](/2015/06/dependencias-web/).
De aquí, **lo importante lo tenemos en el directorio *www***.

![directorio www](/images/2015-06/directorio-www.png)

Este directorio debes verlo como el de aplicación web normal y corriente, con tres salvedades:

* Puedes acceder a [APIs de dispositivo móvil](http://cordova.apache.org/docs/en/5.0.0/cordova_plugins_pluginapis.md.html#Plugin%20APIs) gracias a Cordova.
* Puedes usar AngularJS. De hecho ya es una aplicación Angular básica con unos cuantos controladores y servicios.
* Y por último, puedes usar los [componentes de Ionic](http://ionicframework.com/docs/components/) en forma de directivas AngularJS.

Por lo demás es lo mismo que te encontrarías en otra web. El index.html, carpetas para el CSS y JS etc.

## Preparando el proyecto

Vamos a hurgar un poco en el código que viene de ejemplo y dejarlo limpito para lo que nosotros necesitamos. Que básicamente serán tres vistas: una para autenticarnos, otra para ver los eventos y otra para cerrar la sesión.

**NOTA**: el código tal cual lo dejamos en este paso puedes obtenerlo con:

```bash
git clone https://github.com/er1x/events-app
cd events-app
git checkout part1
```

Veamos lo más importante del código.

### index.html

El fichero de entrada de la aplicación. Hace lo siguiente:

* Cargar las dependencias: Ionic (incorpora Angular), Cordova y los ficheros JS de nuestra aplicación.
* Define la aplicación AngularJS: *ng-app="eventsApp"*
* Define dos directivas: una barra de navegación (*ion-nav-bar*) y otra que contendrá las vistas concretas que se cargarán después (*ion-nav-view*).

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="initial-scale=1, maximum-scale=1, user-scalable=no, width=device-width">
    <title>Events App</title>

    <link href="lib/ionic/css/ionic.css" rel="stylesheet">
    <link href="css/style.css" rel="stylesheet">

    <!-- ionic/angularjs js -->
    <script src="lib/ionic/js/ionic.bundle.js"></script>

    <!-- cordova script (this will be a 404 during development) -->
    <script src="cordova.js"></script>

    <!-- your app's js -->
    <script src="js/app.js"></script>
    <script src="js/controllers.js"></script>
    <script src="js/services.js"></script>

  </head>
  <body ng-app="eventsApp">

    <ion-nav-bar class="bar-positive">
      <ion-nav-back-button>
      </ion-nav-back-button>
    </ion-nav-bar>

    <ion-nav-view></ion-nav-view>

  </body>
</html>
```

### app.js

El fichero JS principal. En él definimos el nombre de la aplicación (*eventsApp*) y tres dependencias, que son el propio framework Ionic, y servicios y controladores de la aplicación. Después configuramos el enrutador. En Ionic se utiliza [Angular UI Router](https://github.com/angular-ui/ui-router).

El router de Ionic difiere del router por defecto de Angular en que en este se utiliza el concepto de máquina de estados. Aquí utilizamos **un estado abstracto *tab* y dos estados hijos: *list* y *account***. Por otra parte hay otra vista independiente, *login*.

**Este sistema permite tener vistas anidadas**. En este caso, las vistas que necesitamos (listado y configuración), se integran dentro de otra. **A estas rutas les asignamos una plantilla HTML y un controlador**.

```javascript

angular.module('eventsApp', [ 'ionic',
                              'eventsApp.controllers',
                              'eventsApp.services'])

.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider.state('tab', {
    url: "/tab",
    abstract: true,
    templateUrl: "templates/tabs.html"
  })
  .state('tab.list', {
    url: '/list',
    views: {
      'tab-list': {
        templateUrl: 'templates/tab-list.html',
        controller: 'ListCtrl'
      }
    }
  })
  .state('tab.account', {
    url: '/account',
    views: {
      'tab-account': {
        templateUrl: 'templates/tab-account.html',
        controller: 'AccountCtrl'
      }
    }
  })
  .state('login', {
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'LoginCtrl'
  });

  $urlRouterProvider.otherwise('/tab/list');
});

```

## services.js

El servicio que utilizaremos **se encargará de proveer a la aplicación de la lista de eventos**. De momento los tendrá en memoria. Más adelante se conectará al backend para obtener el listado.

**Proporciona una única funcion: *all***. Para listar los eventos.

```javascript
angular.module('eventsApp.services', [])

.factory('EventsService', function($http) {
  return {
    all: function() {

      // TODO: get events from backend
      var events = [
        {
          'speaker': 'Homer Simpson',
          'title': 'Emprender en servicios web: Compuglobalhipermeganet',
          'place': 'Sala 5',
          'date': '15:00'
        },
        {
          'speaker': 'Stewie Griffin',
          'title': 'Cómo generar ingresos extra siguiendo gordos con una tuba',
          'place': 'Salón de talleres 1',
          'date': '17:00'
        },
        {
          'speaker': 'Ralph Wiggum',
          'title': '¡Corre plátano!',
          'place': 'Sala 5',
          'date': '19:00'
        }
      ];
      return events;
    }
  };
});

```

### controllers.js

Tenemos **un controlador para el listado** (que utiliza el servicio para listar los eventos), y **otros para las vista de login y cuenta**, que de momento no hacen nada más que mostrar un mensaje en la consola cuando se pulse un botón.

```javascript
angular.module('eventsApp.controllers', [])

.controller('LoginCtrl', function($scope){
  $scope.authenticate = function() {
    console.log('TODO: authenticate');
  };
})

.controller('ListCtrl', function($scope, EventsService) {
  $scope.events = EventsService.all();
})

.controller('AccountCtrl', function($scope) {
  $scope.logout = function() {
    console.log('TODO: logout');
  };
});
```

### tabs.html

Se trata de una vista global que utiliza **[la directiva ion-tabs](http://ionicframework.com/docs/api/directive/ionTabs/)**.

Esta directiva **se utiliza para la navegación con los tabs**, que son los menús que se ven en la parte de abajo.

```html
<ion-tabs class="tabs-icon-top tabs-color-active-positive">

  <!-- List Tab -->
  <ion-tab title="Eventos" icon-off="ion-ios-people-outline" icon-on="ion-ios-people" href="#/tab/list">
    <ion-nav-view name="tab-list"></ion-nav-view>
  </ion-tab>

  <!-- Account Tab -->
  <ion-tab title="Cuenta" icon-off="ion-ios-gear-outline" icon-on="ion-ios-gear" href="#/tab/account">
    <ion-nav-view name="tab-account"></ion-nav-view>
  </ion-tab>

</ion-tabs>
```

### login.html

Desde esta vista mostraremos un botón para iniciar la sesión. Utiliza las directivas:

* ion-view: para cargarse dentro del nav-view.
* ion-content: un área para el contenido.
* button: un botón normal corriente con *ng-click="logout()"*. Al pulsarse ejecutará la función logout del controlador correspondiente.

```html
<ion-view view-title="Autenticación">
  <ion-content class="padding">
    <button class="button button-block button-positive" ng-click="authenticate()">Inicia sesión con Twitter</button>
  </ion-content>
</ion-view>
```

![vista de login](/images/2015-06/login.png)

### list.html

Igual que la vista de login, utiliza ion-view para ser cargada. Después utiliza el [componente card](http://ionicframework.com/docs/components/#cards) para crear una tarjetita con la información de cada evento.
Con ng-repeat se van cargando los elementos del $scope y entre llaves van poniéndose los atributos de los objetos de eventos. Esto es AngularJS básico.

```html
<ion-view view-title="Eventos">
  <ion-content class="padding">
    <div class="list card card" ng-repeat="event in events">
      <div class="item item-divider">
        {{ event.speaker}}
        <p>
          {{event.date}} | {{event.place}}
        </p>
      </div>
      <div class="item item-body">
        <div>
          {{ event.title }}
        </div>
      </div>
    </div>
  </ion-content>
</ion-view>
```
![vista de listado](/images/2015-06/list.png)

### account.html

Por último la vista de cuenta, que es exactamente igual que la de login, pero con un botón para cerrar la sesión.

```html
<ion-view view-title="Cuenta">
  <ion-content class="padding">
    <button class="button button-block button-positive" ng-click="logout()">Cerrar sesión</button>
  </ion-content>
</ion-view>
```

![vista de cuenta](/images/2015-06/account.png)

## Resumen

En esta primera parte del tutorial de Ionic hemos visto:

* Cómo instalar Ionic.
* Cómo crear el esqueleto de un proyecto y verlo en el navegador.
* La estructura de una app hecha con Ionic.

En la segunda parte de esta serie veremos cómo crear un sencillo **backend con Node.js y Express** que permita **autenticarse con Twitter** y proporcione un listado de los eventos.

---
**¿A ti que te parece Ionic?** ¿Te parecen útiles estos frameworks de desarrollo híbrido? ¿O piensas que son pamplinas y es mejor el desarrollo nativo?

**¡Deja tu opinión en un comentario!**
