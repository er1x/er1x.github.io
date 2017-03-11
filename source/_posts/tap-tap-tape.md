title: 'Tap Tap Go! - Test Anything Protocol en Node.js: Cómo usar el módulo tape y calcular la cobertura'
date: 2016-01-11 08:00:00
tags: ['nodejs', 'testing']
---
![TAP - Tape!](/images/2016-01/tape-testing.jpg)

Como ya sabes el testing es algo necesario y conveniente en el desarrollo de software. En mi opinión especialmente crítico en proyectos grandes, o dentro de un equipo de personas, para asegurar que cuando uno se pone a *picar* algo, no se rompe nada.

## Test Anything Protocol

**[Test anything protocol (TAP)](https://testanything.org/)** es un estándar de testing que define un formato de salida de este tipo de herramientas, por lo que facilita su integración con otros sisstemas (herramientas de cálculo de cobertura, integración continua etc...)

## Ejemplo. SUT: Dragon Balls

Vamos a establecer nuestro SUT (Subject under test), es decir el código que vamos a  probar.

En este caso se me ha ocurrido un ejemplo un poco absurdo. Una clase que puede usarse para invocar a diversos dragones de la archiconocida serie *[Dragon Ball](https://es.wikipedia.org/wiki/Dragon_Ball)*.

En fin, el caso es que **lo que vamos a probar es una clase ([ES2015](https://babeljs.io/docs/learn-es2015/)), con un método *summonDragon***, que dependiendo del número de dragon balls y el tipo de estas bolas, nos devolverá un dragón u otro.

### sut.js
```javascript
'use strict'

class DragonSummoner {
  summonDragon (ballsNumber, ballsType) {
    if (ballsNumber < 7) {
      throw Error(`Wrong ballsNumber!:  ${ballsNumber}`)
    }
    if (ballsType !== 'namek' && ballsType !== 'earth') {
      throw Error(`Wrong ballsType!:  ${ballsType}`)
    }

    if (ballsNumber === 7) {
      if (ballsType === 'namek') {
        return 'Polunga';
      }
      if (ballsType === 'earth') {
        return 'Shenron';
      }
    }
  }
}

module.exports = DragonSummoner
```


## Uso de Tape

Para probar esta clase **vamos a usar [Tape](https://github.com/substack/tape)**. Tape es una biblioteca de testing que implementa el protocolo TAP. Además vamos a agregarle un output diferente de salida, más visual, que podremos entender mejor. Lo meteremos todo en un script de NPM

Instalamos tape y el spec:

```bash
npm install tape tap-spec --save-dev
```

Y ahora escribimos nuestro test:

### sut-test.js
```javascript
'use strict'

const test = require('tape')
const DragonSummoner = require('./sut')

test('DragonSummoner', function (t) {
  let dragonSummoner = new DragonSummoner()

  t.ok(DragonSummoner, 'should be defined')

  t.equal(typeof DragonSummoner, 'function', 'should be a function')

  t.ok(dragonSummoner.summonDragon, 'has a summonDragon method')

  t.equal('Polunga', dragonSummoner.summonDragon(7, 'namek'), 'should summon Polunga if 7 namekian balls are used')
  t.equal('Shenron', dragonSummoner.summonDragon(7, 'earth'), 'should summon Shenron if 7 earth balls are used')

  t.end()
})

```

Como ves, el testeo es relativamente sencillo.

Se **define el sujeto que se va a testear y las diferentes *aserciones***, en este sentido es muy similar a otros frameworks de test como [Mocha](https://mochajs.org/), del que [ya hemos hablado anteriormente](/2015/06/testing-nodejs/).

Puedes ver el resto de métodos de aserción que proporciona Tape [aquí](https://github.com/substack/tape#methods).

### Ejecutar los tests

Para ejecutar tests yo suelo utilizar una tarea NPM, y en casos más complejos utilizo un *task runner* como [Grunt o Gulp](http://blog.koalite.com/2015/06/grunt-o-gulp-que-uso/).

Para este ejemplo he definido esta tarea en el *package.json*:

```json
{
  "name": "tape-testing",
  "version": "1.0.0",
  "description": "",
  "main": "sut.js",
  "scripts": {
    "test": "tape *-test.js |tap-spec"
  },
  "author": "",
  "license": "MIT",
  "devDependencies": {
    "istanbul": "^0.4.1",
    "tap-spec": "^4.1.1",
    "tape": "^4.2.2"
  }
}
```

![Tape run](/images/2016-01/tape-run.png)



## Calculando la cobertura con Istanbul

Guay. Ahora vamos a utilizar la herramienta **[Istanbul](https://github.com/gotwarlost/istanbul)** para **calcular la cobertura de nuestros tests JavaScript**. Esto es, la cantidad de código que tenemos cubierto por nuestras pruebas. En general, cuanta mayor cobertura, mejor.

Instalamos istanbul
```bash
npm install istanbul --save-dev
```

Y definimos una nueva tarea en el package.json para ejecutarlo contra los tests:

```javascript
...
"scripts": {
  "test": "tape *-test.js |tap-spec",
  "cover": "istanbul cover *-test.js"
}
...
```

Probamos a ejecutarlo...

![Istanbul run](/images/2016-01/istanbul-run.png)



Istanbul nos deja una carpeta con un **informe HTML** más visual en el que podemos examinar la cobertura y ver qué nos falta por cubrir.

![Cobertura](/images/2016-01/html-coverage.png)



### ¡Ramas, ramas!

Como ves, no hemos probado los casos de error. Vamos a probarlos:

```javascript
...
t.throws(() => dragonSummoner.summonDragon(5, 'earth'), 'should throw an error if less than 7 balls are provided')
t.throws(() => dragonSummoner.summonDragon(7, 'unknown'), 'should throw an error if wrong balls are used')
...
```

Con esto volvemos a ejecutar Istanbul y...

![Cobertura 2](/images/2016-01/istanbul-run-2.png)


---

En este post has visto lo sencillo que es **utilizar el framework de test Tape y calcular la cobertura con Istanbul en un proyecto JavaScript**.

Además, definiendo tareas npm sencillas.

¿Qué opinas de tape?

¿Prefieres mocha u otro framework de testing?

¿Usas Istabul para el cáclulo de cobertura?
