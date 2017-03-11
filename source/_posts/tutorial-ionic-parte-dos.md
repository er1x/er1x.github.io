title: 'Tutorial Ionic Framework - Parte 2: Backend en Node.js'
date: 2015-06-28 19:51:00
tags: ['nodejs', 'ionic', 'cordova', 'angularjs']
---
![ionic](/images/2015-06/ionic.png)

En el [anterior post](/2015/06/tutorial-ionic-parte-uno/) vimos cómo iniciar una App con Ionic Framework. En ese post creamos un esqueleto para una aplicación que obtuviera un listado de eventos.

Ahora vamos a crear un **backend en Node.js** que permita:

* **Autenticarse utilizando Twitter**.
* **Obtener un listado de eventos**. Sólo si el usuario está autenticado.

Empieza descargando el código de GitHub.

```bash
git clone https://github.com/er1x/events-backend
cd events-backend
npm install
```

Si intentas arrancarlo (*node server.js*), verás que suelta una excepción, y es que para que funcione **es necesario registrar una App en Twitter** y obtener una clave para la misma. Esta clave está en un fichero llamado *.secret.json* y no está en git. Luego veremos cómo crearlo.


## Autenticación por Token

La autenticación por token consiste en que en la aplicación cliente se almacena una cadena cifrada con la información del usuario. Cuando el cliente realiza una petición al servidor acompaña este token cifrado.

El servidor sabe descifrar ese token y con él identificar al usuario. Difiere en la clásica identificación por cookie o sesión en que el servidor no guarda una megacaché con todos los datos de sesión, y por tanto, escala mejor. Además si la aplicación no es web no tiene sentido hablar de cookies.

En este caso lo que vamos a hacer es crear una autenticación por token en nuestra aplicación mediante un **[plugin de AngularJS llamado Satellizer](https://github.com/sahat/satellizer)**. Este plugin soporta varios tipos de autenticación, entre ellas mediante Twitter.


## Configurar la autenticación con Twitter

Para que el backend funcione necesitas una clave de aplicación válida de Twitter, y para ello tienes que registrar una App. Es sencillo.

* Ve a https://apps.twitter.com/. Tienes que tener una cuenta de Twitter. Si no la tienes créala :P
* Pulsa en **Create new App** y rellena el nombre, la descripción y una web (yo he puesto la de Github ya que es una prueba).
* Cuando Twitter cree la App ve a la pestaña de settings y rellena la **Callback URL**. **Fíjate bien en este paso porque es crítico**: cuando el proceso de autorización termine, Twitter retorna al usuario a la URL que pongas aquí.

  Aquí nos surge un problema, y es que mientras desarrollamos la aplicación queremos que Twitter nos redirija al servidor de pruebas y cuando la tengamos lista queremos que retorne a la URL de Cordova. Por tanto tenemos dos configuraciones posibles:


  * Desarrollo (aplicacíon web): IP y puerto locales del servidor de desarrollo de Ionic. En mi caso es http://192.168.0.100:8100 . En el tuyo dependerá de tu configuración, si prefieres usar localhost etc.
  * Producción (url App Cordova): http://127.0.0.1/

![config-twitter](/images/2015-06/callback.png)

* Por último vete a la pestaña de **Keys and Access Tokens** y **cópiate la API Key y la API Secret**.


Una vez tengas las claves es hora de crear el fichero *.secret.json*, que tendrá esta pinta:

```json
{
  "TWITTER_KEY": "XXXXXXXXXXXXXXXXXXXX",
  "TWITTER_SECRET": "XXXXXXXXXXXXXXXXXXX",
  "TOKEN_SECRET": "aquiponesloquequieras"
}
```
Los campos *Twiter-* son la clave de aplicación y secreta de Twitter y TOKEN-SECRET es la clave con la que cifraremos el token final que utilizaremos para autenticar al usuario.

**Es importante que utilices un Token complejo y que sea secreto**, pues de otro modo se podrían descifrar los datos del usuario.

Veamos ahora el código del backend.

## Código del backend

El backend es un solo fichero muy sencillito. **Está escrito en Node.js y utiliza el framework [Express](http://expressjs.com/es/)**.

Lo que hace es:

* Importar dependencias.
* Importar la clave secreta del fichero .secret.json.
* Crear la aplicación express, y utilizar los middleware bodyparser (para parsear parámetros) y cors (para permitir peticiones de otros dominios).
* Definir una función para crear el token de autenticación. Ésta función [está tomada de este estupendo post](https://carlosazaustre.es/blog/autenticacion-con-token-en-node-js/).
* Definir un par de rutas, una para autenticar al usuario y otra para devolver un listado con eventos.

```javascript
var express    = require('express');
var bodyParser = require('body-parser');
var cors       = require('cors');
var qs         = require('querystring');
var moment     = require('moment');
var jwt        = require('jwt-simple');
var request    = require('request');

var config = require('./.secret.json');
var app = express();

app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

function createJWT(userId) {
  var payload = {
    sub: userId,
    iat: moment().unix(),
    exp: moment().add(14, 'days').unix()
  };
  return jwt.encode(payload, config.TOKEN_SECRET);
}

// Ruta para autenticación
app.post('/auth/twitter', function(req, res) {
  ...
});
// Ruta para listar eventos
app.post('/events', function(req, res) {
  ...
});
```

## Ruta */auth/twitter*

Esta ruta es la que permite al usuario autenticarse utilizando Twitter. Realiza lo siguiente:

* Inicialmente, si el usuario no estaba autenticado, hace una petición a esta ruta sin cabeceras de autorización. De ser así el backend realiza una petición a Twitter para que nos proporcione un token de autenticación para el usuario. Se devuelve al usuario ese token y Satellizer se encargará de mandarlo a la web de Twitter para que autorice a la aplicación.

* Cuando el usuario da permiso a la App, Twitter lo redirige a la web que le hayamos configurado en la *Callback URL*, que debe ser esta misma ruta.

* Ahora el usuario viene con un token de Twitter (entra por el *else*). El backend comprueba la validez de ese token mediante una petición a Twitter. Twitter devuelve los datos del usuario y el backend crea el token final en JSON y lo devuelve a la App.

* A partir de entonces, la App tiene un token de autorización válido y lo acompañará a cada petición al backend. Este token queda almacenado en el *storage del navegador*.

```javascript
app.post('/auth/twitter', function(req, res) {
  var requestTokenUrl = 'https://api.twitter.com/oauth/request_token';
  var accessTokenUrl  = 'https://api.twitter.com/oauth/access_token';
  var authenticateUrl = 'https://api.twitter.com/oauth/authenticate';

  // First request: no auth token present
  if (!req.body.oauth_token || !req.body.oauth_verifier) {
    var requestTokenOauth = {
      consumer_key: config.TWITTER_KEY,
      consumer_secret: config.TWITTER_SECRET
    };

    // Retrieve a Twitter Token and redirect to Twitter auth page
    request.post({ url: requestTokenUrl, oauth: requestTokenOauth }, function(err, response, body) {
      res.send(qs.parse(body));
    });
  } else {
    var accessTokenOauth = {
      consumer_key: config.TWITTER_KEY,
      consumer_secret: config.TWITTER_SECRET,
      token: req.body.oauth_token,
      verifier: req.body.oauth_verifier
    };

    // Check the token against Twitter and send JWT to app
    request.post({ url: accessTokenUrl, oauth: accessTokenOauth }, function(err, response, resData) {
      // Additional info from user should be retrieved here (from a local db etc.)
      res.send({ token: createJWT(qs.parse(resData).user_id) });
    });
  }
});
```

## Ruta */events*

Ésta ruta es muy sencilla. Simplemente comprueba que el usuario está autenticado correctamente y en ese caso devuelve una lista de eventos.

Para comprobar que está autenticado:

* La petición debe llevar un token de autorización.
* Esta cabecera debe tener un valor válido, lo cual se comprueba con *jwt.decode*.

```javascript
app.get('/events', function(req, res) {

  // if not authenticated, send forbidden code
  if (!req.headers.authorization) {
    return res.sendStatus(403);
  }

  // check if token is valid
  try {
    var decoded = jwt.decode(req.headers.authorization.split(' ')[1], config.TOKEN_SECRET);
  } catch(err) {
    return res.sendStatus(403);
  }

  // If it is, send events.
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
  res.send(events);
});
```

---

¡Perfecto! **Tenemos nuestro backend listo**. Ahora **solo nos queda modificar la App para que utilice este backend** y probarla en un emulador.

Pero esto lo dejamos para el siguiente post :)
