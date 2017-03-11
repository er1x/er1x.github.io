title: 'Aprende a hacer Testing en Node.js: Mocha, Chai, Sinon, Proxyquire... WTF'
date: 2015-06-04 07:30:00
tags: ['nodejs', 'testing']
---
![unit testing](/images/2015-06/testing--1-.png)
Las primeras veces que me puse con el tema del testing en Node.js me volvía un poco loco. En internet no haces más que ver nombres de herramientas en plan: Qunit, Mocha, Jasmine, Tape, Chai, Assert, Karma, Proxyquire, Sinon, Mockery... que cambian cada dos días... y es como...

![no-idea](/images/2015-06/i-have-no-idea-what-im-doing-dog.jpg)

Con el tiempo aprendes cómo va la cosa, pero las primeras veces es un lío. Aquí te va un tutorial para aclarar ideas. Y, como siempre, [el repo aquí](https://github.com/er1x/testing101).

## Algo que Probar

Si queremos hacer testing, primero tenemos que tener algo para probar. En este caso vamos a hacer un módulo muy sencillito, que exporte una función que sume 2 a la entrada:

**my-module.js**
```javascript
'use strict';

function addTwo(num) {
  console.log('processing input...');
  return num + 2;
}

module.exports = addTwo;
```

## ¡A Probar!

Para probar este código necesitamos una biblioteca de testing. Aquí tenemos varias opciones, y las más conocidas son:

* [Qunit](https://qunitjs.com/)
* [Tape](https://github.com/substack/tape)
* [Jasmine](http://jasmine.github.io/)
* [Mocha](http://mochajs.org/)

¿Cuál escoger? Pues ahí va a gustos... Yo en estos casos suelo ir a lo que use más gente, para evitar problemas, así que **escojo Mocha**.
Lo cierto es que la forma de hacer pruebas es bastante similar entre ellas, de modo que no tendrás problemas para coger código de una diferente una vez hayas aprendido cómo va el tema.

### Usando mocha

Para usar mocha podemos instalarlo bien como utilidad global (*npm install -g*) o local al proyecto (sin el -g). En este caso como el objetivo es aprender a usar Mocha lo instalaremos globalmente.

```bash
npm install -g mocha
```

Perfecto. Ahora deberías tener el comando *mocha* funcionando. No te preocupes si te tira un error. Por defecto busca el directorio *test* y si no lo encuentra se queja.

Ahora vamos a **escribir un test para Mocha en un fichero test.js**:

```javascript
'use strict';

var myModule = require('./my-module');
var assert   = require('assert');

describe('My Module', function() {

  it('should add 2 to a number', function () {

    assert.equal(5, myModule(3));

  });

});
```

¿Qué estamos haciendo aquí?

* Primero importamos el módulo que vamos a testear, junto con una utilidad assert, que viene en el core de Node.js.
* Después comenzamos con un *describe* que indica el módulo que vamos a testear.
* Seguidamente y dentro del *describe*, vamos añadiendo cada test como un *it...*
* Dentro del test propiamente dicho, comprobamos que nuestro módulo suma 2 correctamente.

De esta manera, nuestros tests quedan bastante expresivos, pues componen frases cómo: *"Mí módulo debería hacer tal cosa..."*

Basta de escribir. Vamos a ejecutar el test:

```bash
mocha test.js

processing input...
    ✓ should add 2 to a number

  1 passing (8ms)
```

El test pasa. Perfecto. Pero Mocha admite muchas cosas más.

Con **mocha -h** puedes ver un montón de opciones que te permite definir. Además, si las escribes en un fichero **mocha.opts**, no tendrás que especificarlas cada vez.

De momento vamos a poner un fichero mocha.opts, con el siguiente contenido:

```
--growl
--reporter dot
```

Ahora podemos ejecutar los test con:

```bash
mocha test.js --opts mocha.opts
```

Y nos reportará de forma mucho más concisa y mostrará una notificación.

![notificacion](/images/2015-06/notification.png)


Para mí, las opciones más interesantes son éstas:

* --watch : para quedarse a la espera de cambios en el código y ejecutarse cada vez.
* --debug-brk: para pararse en el primer punto y poder hacer debug.
* --timeout: para ponerle un timeout a los test. Útil para probar cosas asíncronas.

Muy bien , ya sabemos cómo pasarle opciones a Mocha.

## Bibliotecas de Asserts: Chai

La utilidad *assert* que viene con Node.js tiene una capacidad limitada, y por eso se suelen utilizar bibliotecas específicas para asserts, que permiten una sintaxis más rica.

La que más se utiliza es **[Chai](http://chaijs.com/)**, que permite **[varios tipos de asserts](http://chaijs.com/api/)**. Puedes instalar Chai de manera local al proyecto con *npm install chai*.

Vamos a modificar el test para que utiice una sintaxis de tipo expect:

```javascript
'use strict';

var myModule = require('./my-module');

var chai   = require('chai');
var expect = chai.expect;


describe('My Module', function() {

  it('should add 2 to a number', function () {

    expect(myModule(3)).to.be.equal(5);

  });

});
```

Simplemente hemos importado Chai y su expect, y lo hemos utilizado en el test.

¡Muy bien! Ya sabemos utilizar frameworks de testing y bibliotecas de asserts. Pero... ¿y si quieres hacer mocks?

## Mocks: SinonJS

Como habrás adivinado, **[Sinon](http://sinonjs.org/)** es la biblioteca más utilizada para hacer mocks en JS.

Una vez más la instalamos localmente:

```bash
npm install sinon
```

Sinon nos permite crear varios tipos de objetos:

* **Spies**: son funciones que graban todo lo que les pasa. Se suelen utilizar, por ejemplo, para comprobar que una callback o un método ha sido llamado.
* **Stubs**: son como spies, pero además con un comportamiento. Puedes programarlos para que tiren excepciones, por ejemplo.
* **Mocks**: son stubs con expects programados.

Pongamos por caso que queremos probar la función anterior, pero que necesita un parámetro extra para realizar un proceso que nosotros no queremos llevar a cabo:

```javascript
'use strict';

function addTwo(num, otherParam) {
  console.log('processing input...');
  otherParam.superFunction();
  return num + 2;
}

module.exports = addTwo;
```

Para probar esto, bien nos sirve un simple spy.

**test.js**
```javascript
'use strict';

var myModule = require('./my-module');

var chai   = require('chai');
var expect = chai.expect;

var sinon    = require('sinon');


describe('My Module', function() {

  it('should add 2 to a number', function () {
    var dontCare = { superFunction: sinon.spy() };

    var value = myModule(3, dontCare);

    expect(value).to.be.equal(5);
    expect(dontCare.superFunction.called).to.be.true;
  });

});
```

Aquí hemos:

* Importado Sinon.
* Creado un objeto con un método que es un *spy* de Sinon.
* Llamado al módulo a testear.
* Comprobado que se ha llamado a la función *superFunction*.

## Proxyquire

¡Última ronda! ¿Qué tendríamos que hacer, si por ejemplo, el módulo que vamos a testear depende de otro que no nos interesa que use?

Por ejemplo, si nuestro módulo a testear fuera:

```javascript
'use strict';

var hardcoreModuleOfDeath = require('hardcoreModuleOfDeath');

function addTwo(num, otherParam) {
  console.log('processing input...');
  otherParam.superFunction();
  hardcoreModuleOfDeath.destroyWorld();
  return num + 2;
}

module.exports = addTwo;
```

¡No queremos que se llame a *destroyWorld*! ¿Cómo solucionamos esto?: con **[proxyquire](https://github.com/thlorenz/proxyquire)**.

El test quedaría en este caso así:
```javascript
'use strict';

var chai       = require('chai');
var expect     = chai.expect;
var sinon      = require('sinon');
var proxyquire = require('proxyquire')


var harmless = {
  destroyWorld: function(){
    console.log('no way');
  }
};
var myModule = proxyquire('./my-module', { './hardcoreModuleOfDeath': harmless });

describe('My Module', function() {

  it('should add 2 to a number', function () {
    var dontCare = { superFunction: sinon.spy() };

    var value = myModule(3, dontCare);

    expect(value).to.be.equal(5);
    expect(dontCare.superFunction.called).to.be.true;
  });

});
```

Aquí hemos importado my-module, pero a través de un "proxy", que ha sustituido el módulo malvado con algo absolutamente inocente :)

![ejecucion](/images/2015-06/ejecucion.png)

----

Con esto damos fin a este post sobre **testing en Node.js**. Te recuerdo una vez más que tienes [el ejemplo en Github](https://github.com/er1x/testing101).

Pásalo bien :)
