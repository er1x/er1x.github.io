title: 'Streams en Node.js'
date: 2015-09-01 19:08:00
tags: ['nodejs']
---
![Stream](/images/2015-09/mosman-bay-falls.jpg)

Si has trabajado un poco con **Node.js** es probable que en algún momento hayas oído hablar del concepto de **stream**, que podría traducirse como **corriente o flujo**.

En Node.js, los streams se utilizan profusamente con cosas como:

* Tráfico de red.
* Entrada/salida de ficheros.

En este post voy a enseñarte los **conceptos básicos de los streams y cómo utilizarlos**.

## EventEmitters y Callbacks

Como seguramente sabes, en JavaScript mucho del código que escribes es asíncrono, y para lidiar con ello, se utiliza el concepto de **callback**, que es una **función que se le pasa a la operación asíncrona, y que ésta llama al terminar su procesamiento**. Por ejemplo:

```javascript
asyncFunction(function(res){
  console.log('llamada al callback!');
});
```

Mucha de la crítica que se le hace a JavaScript y con ello a Node es que el uso indiscriminado de una callback detrás de otra conduce al temido [Callback Hell](http://callbackhell.com/).

![Mordor Callback](/images/2015-09/mordor.jpg)

La cosa es que no tiene por qué ser así, y hay varias herramientas a tu disposición para evitar esto. Una de ellas son los **[EventEmitters](https://iojs.org/api/events.html#events_class_events_eventemitter)**.

### EventEmitters

Un EventEmitter es una clase (sí, ya hablo en [ES2015](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes)), que, como su nombre indica, puede emitir eventos. Y que funciona como algo así:

```javascript
'use strict';

const EventEmitter = require('events').EventEmitter;

class Emisor extends EventEmitter {
  constructor(){
    super();
    let count = 5;

    let timer = setInterval(function(){
      this.emit('percebes', 'he encontrado un percebe!');
      count--;
      if(!count) {
        this.emit('fin', 'me cansé de buscar percebes :(');
        clearInterval(timer);
      }
    }.bind(this), 1000);
  }
}


let emisor = new Emisor();

emisor.on('percebes', function(msg){
  console.log(msg);
});

emisor.on('fin', function(msg){
  console.log(msg);
  console.log('acabamos');
});
```
![eventemitter](/images/2015-09/evemitter.png)

Básicamente, se utiliza el método **on**, para saber cuando se produce un evento, y **emit** para emitirlo.

¿Ventajas sobre las callbacks?

* Se utiliza un modelo *publish/subscribe*: se pueden añadir diferentes *listeners* a los eventos.
* Se pueden ejecutar acciones cuando haya datos listos, en lugar de esperar a que finalice el proceso asíncrono por completo. Así podemos, por ejemplo, leer ficheros poco a poco y no tenerlos por completo en memoria.
* Se facilita el evitar (al menos en parte), una pirámide de callbacks. Pese a ello se siguen usando.


## Streams

Vale, pero... ¿qué tiene que ver esto con los *streams*?

Pues que **los streams son EventEmitters**, que cumplen con cierta "interfaz".

Un stream puede ser:

* De lectura, **WritableStream**.
* De escritura, **ReadableStream**.
* **Duplex**, es decir, de lectura y escritura.

Cada uno de estos tipos de stream tiene diversos eventos y funciones para manejarlos.

### Ejemplo de ReadableStream

Mira el siguiente script:

```javascript
'use strict';

const request = require('request');

let stream = request('http://www.google.es');

stream.on('data', function(chunk){
  console.log(`Trozo de datos ${chunk}`);
});

stream.on('end', function(){
  console.log('Flujo finalizado');
});
```

[Request](https://www.npmjs.com/package/request) devuelve un stream de lectura. Según se reciben los datos, va emitiéndose el evento data y podemos tratarlos según van llegando.

### WritableStream y *piping*

¿Cómo podríamos utilizar esta *corriente* de lectura para escribir un fichero?

Para ello podemos crear un stream de escritura y conectarlos mediante una tubería (pipe), utilizando un concepto similar a las tuberías de UNIX.

Modificando el ejemplo anterior:

```javascript
'use strict';

const request = require('request');
const fs      = require('fs');

let readableStream = request('http://www.google.es');
let writableStream = fs.createWriteStream('google.html');

readableStream.pipe(writableStream);
```

![ejemplo pipe](/images/2015-09/ejemplo.png)

Por supuesto, nada impide realizar múltiples *pipes*, y de hecho es una de las formas más comunes de realizar procesamiento de datos en cadena.

Muchas de las bibliotecas que se usan cada día en Node se pueden usar como *streams* y los utilizan para funcionar. Una de las herramientas más conocidas que hace uso extensivo de ellos es **[Gulp](http://gulpjs.com/)**.



---

En resumen, los **streams son una de las herramientas más útiles de Node**, permitiendo un código rápido y ligero en consumo de recursos.

---

Imagen del Post: <a href="https://www.flickr.com/photos/powerhouse_museum/2484289367/">Powerhouse Museum</a> / <a href="http://foter.com/">Foter</a>
