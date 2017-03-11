title: '5 características de ES6 que puedes utilizar en tu navegador hoy'
date: 2016-04-14 21:00:00
tags: ['javascript']
---
El soporte de ECMAScript 6 (ES6 / ES2015) es cada día mayor, y tanto es así que en Chrome y Firefox ya podemos utilizar la mayoría de novedades de esta versión (puedes comprobar el soporte [aquí](https://kangax.github.io/compat-table/es6/)).

A continuación te presento con ejemplos 5 de las nuevas características de ES6 que considero más útiles a día de hoy.

## Arrow functions

Ahora podemos utilizar formas abreviadas de definir funciones anóminas, utilizando **=>**

Antes:

```javascript
var myFunction = function() {
  console.log('logging...');
};
```

Ahora:

```javascript
var myFunction = () => console.log('logging...');
```

Funciones en bloques:
```javascript
var myFunction = () => {
  console.log('...');
  console.log('logging...');
}
```

## Template strings

Ahora podemos utilizar plantillas para definir cadenas con variables en su interior.

Antes:

```javascript
var name = 'Emilio';
console.log('Me llamo ' + name);
```

Ahora:
```javascript
var name = 'Emilio';
console.log(`Me llamo ${name}`);
```

También es de agradecer cuando estamos escribiendo cadenas multilínea:
```javascript
var longString = `Esta cadena está escrita en forma multilínea
y por tanto ya no hay que unir los trozos de la misma
con el operador + ni usar \\n`
```

## Let y Const

Con ES6 es viable declarar variables válidas sólo dentro de bloques específicos dentro de llaves, **{ }**  usando **let** y **const**. Antes las variables se declaraban con var y su ámbito era la función en la que se declaraban.

La diferencia entre ambas formas es que los valores declarados con const no se pueden modificar después.

Antes:
```javascript
function scope () {
  if (1) {
    var foo = 1;
  }
  // foo existe aquí
  console.log(foo) // -> 1
}
```

Ahora:
```javascript
function scope () {
  if (1) {
    let foo = 1;
  }
  // foo NO existe aquí
  console.log(foo); // -> Error: foo is not defined
}
```

## Parámetros por defecto

Ahora podemos declarar parámetros por defecto para las funciones, para ser utilizados si estos no llegan:

Antes:

```javascript
function sayHi (name) {
  name = name || 'desconocido'
  console.log('Hi ' + name);
}
```

Ahora:
```javascript
function sayHi (name = 'desconocido') {
  console.log(`Hi ${name}`);
}
```

## Iteradores y *For…of*

Para iterar en un array antes se utilizaba for y forEach. Ahora, con **for…of** tenemos una manera abreviada de iterar y que además se puede interrumpir con breaks, al contrario que forEach.

```javascript
var numbers = [0, 1, 2, 3, 4, 5];
for(let number of numbers) {
  console.log(number);
}
```

Esta es sólo una muestra de características de ES6/2015 que pueden hacerte la vida más fácil. Pero hay muchas más y puedes consultarlas [aquí](http://es6-features.org/).
