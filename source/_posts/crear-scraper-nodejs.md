title: Cómo crear un scraper escalable en menos de 100 líneas de JavaScript
date: 2015-06-15 07:22:00
tags: ['nodejs']
---
![nodejs scraping](/images/2015-06/4440771174_c86df3788e_b.jpg)


Hace poco me surgió la necesidad dentro de un proyecto de catalogar una gran cantidad de sitios web, y se me ocurrió crear un microservicio para ello. Cómo no, en Node.js.

Es increíble la cantidad de paquetes que tiene [NPM](https://www.npmjs.com/), y cómo juntando estas pequeñas piezas de *Lego* puedes montar casi cualquier cosa.

## Diseño

El objetivo que tenía este mini-proyecto era simple: **extraer el contenido de un montón de sitios web (*scraping*) y guardarlo en una base de datos**. Este texto posteriormente sería analizado por otro proceso, para clasificarlo en base a contenido, extraer información etc.

El sistema lo dividí en dos partes:

* **Un servidor web que expondría un API REST**. Se encargaría de recibir listados de URLs a analizar mediante una petición POST.
* **Una serie de *workers***: procesos que recibirían las tareas de parte del servidor web, realizarían el scraping de contenido y guardarían el resultado en una base de datos, en este caso un MongoDB.

La idea era poder utilizar varios servidores que ejecutara estos workers, de forma que el proceso de scraping fuera escalable.


## Servidor

Para ayudarme a realizar el servidor que expondría la API escogí 3 bibliotecas:

* **[Hapi](http://hapijs.com/)**: se trata de un **framework para escribir servidores**. Se diferencia de Express en que está más orientado a hacer las cosas por configuración, más que por código.
* **[Joi](https://github.com/hapijs/joi)**: para realizar una mínima **validación de los datos** que entraban al servidor. Se integra estupendamente con Hapi y permite realizar validaciones complejas, reportando automáticamente en la respuesta los errores que se produzcan. En este caso necesitaba realizar una validación de que los datos de entrada fueran un array de URLs.
* **[Kue](https://github.com/Automattic/kue)**: Kue es sistema de **cola de trabajos** que utiliza Redis (una base de datos no-sql en memoria) para almacenar las tareas y que sean distribuidas a diferentes workers. Gracias a Kue logramos la escalabilidad. Permite encolar un trabajo (en este caso un *scrapeo* de una URL) y que sea atendido por un *worker*.

El código del servidor quedó en lo siguiente:

```javascript
'use strict';

const Hapi   = require('hapi');
const kue    = require('kue');
const Joi    = require('joi');

const server = new Hapi.Server();
const queue  = kue.createQueue();

server.connection({
  host: 'localhost',
  port: 8000
});

server.route({
  method: 'POST',
  path:'/urls',
  handler: postUrls,
  config: {
    validate: {
      payload: {
        urls: Joi.array().required().items(Joi.string().uri({scheme: ['http', 'https']}))
      }
    }
  }
});

server.start();

function postUrls(request, reply) {
  request.payload.urls.forEach(function(url) {
    queue.create('scrape', {
      url: url
    }).save();
  });
  reply().code(202);
}
```

Este código hace lo siguiente:

* Define el servidor Hapi, indicando una ruta /urls, con método POST, una validación y una función manejadora.
* La función manejadora recibe la lista de URLs, y por cada una crea una tarea mediante Kue.

Simple y efectivo. **Total de líneas de código del servidor: 37**.

## Workers

Los workers debían de recibir las tareas, realizar el *scrapeo* y guardar la información en el MongoDB. Para ello utilicé:

* Kue: la cola de tareas que vimos antes.
* **[Ineed](https://www.npmjs.com/package/ineed)**: un módulo para realizar **scraping sencillísimo de utilizar**. Ideal para zoquetes como un servidor.
* **[mongodb](https://www.npmjs.com/package/mongodb)**: el **driver de MongoDB para Node.js**.

El código quedó tal que así:

```javascript
'use strict';

const kue         = require('kue');
const ineed       = require('ineed');
const MongoClient = require('mongodb').MongoClient;

const queue = kue.createQueue();

let db;
let collection;

MongoClient.connect('mongodb://localhost:27017/scraper', function(err, database) {
  if (err) {
    console.log(err);
    process.exit(1);
  }
  db = database;
  collection = db.collection('webdata');
});

queue.process('scrape', function(job, done){
  scrape(job.data.url);
  done();
});

function scrape(url) {
  ineed.collect.texts.from({
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; rv:31.0) Gecko/20100101 Firefox/31.0'
    },
    url: url
  }, function (err, response, result) {
      if (err) {
        console.log(err);
      } else {
        collection.insert(result, function(err) {
          if (err) {
            console.log(err);
          }
        });
      }
  });
}
```

Explicación:

* En primer lugar conectamos a MongoDB y asignamos a la tarea *scrape* su función manejadora.
* En la función scrape, utilizamos Ineed para recolectar el texto de la URL y posteriormente lo guardamos en una colección de MongoDB.

**Total de líneas de código del worker: 43**.


**NOTA**: en la versión de producción tengo las direcciones del MongoDB y el Redis en un fichero de configuración. Pero en esta primera prueba lo hice todo en una sola máquina y por ello están hardcodeadas.

---

\###

Como has visto, apoyándonos en módulos existentes y con muy poco código se pueden hacer cosas muy interesantes.

**No es mi intención con este post animarte a escribir programas en menos de 100 líneas** (entre otras cosas, aquí no he puesto los ficheros de configuración ni los tests, ni he desanidado los callbacks).

**Sí lo es poner de manifiesto que el ecosistema de NPM es muy rico**, y que, **juntando módulos a modo de piezas de *Lego*, se pueden hacer grandes cosas**, así como enseñarte algunos módulos que creo que son interesantes.

Bien es verdad que el hecho de que haya muchos módulos no quiere decir que todos sean buenos. Pero hay más donde elegir.

Además es muy sencillo crear tus propios módulos si ves que no hay ninguno que cubra tus necesidades. Pero esto lo dejo para otro post.

<br/>


Imagen: <a href="https://www.flickr.com/photos/dahlstroms/4440771174/">Håkan Dahlström</a> / <a href="http://foter.com/">Foter</a> / <a href="http://creativecommons.org/licenses/by/2.0/">CC BY</a>
