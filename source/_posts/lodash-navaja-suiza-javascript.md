title: 'lodash: la navaja suiza de los programadores JavaScript'
date: 2015-08-17 12:00:00
tags: ['lodash']
---
![Navaja suiza](/images/2015-08/swiss-army-knife-1.jpg)

Cuando estás trabajando en cualquier programa siempre te surgen necesidades "chorras", en plan: *encontrar X cosa en este objeto*, *obtener un número aleatorio entre X e Y*...

Esto te obliga a crear **métodos de *utilidad***, que muchas veces van a un cajón de sastre porque no sabemos dónde ponerlos.

**[lodash](https://lodash.com/)** es una biblioteca que **implementa infinidad de este tipo de métodos, de manera muy eficiente**, y raro es el proyecto en el que no la utilizo. Los que hayáis usado [Backbone](http://backbonejs.org/) veréis que es muy similar a [Underscore](http://underscorejs.org/), y así es, de hecho es un reemplazo. Pero lodash tiene más métodos y se actualiza con más frecuencia. De hecho hay una propuesta de **[merge](https://github.com/jashkenas/underscore/issues/2182)** de ambas.


Para que te hagas una idea de en qué te puede ayudar lodash, veamos **9 métodos muy prácticos que tiene**:

## times

Un iterador sencillo.

```javascript
_.times(3, function(){
  console.log('percebe');
});
```

## cloneDeep

Crea una copia *profunda*.

```javascript
var arr = [{name: 'juan'}, {name: 'pepe'}];
var arrCopy = _.cloneDeep(arr);

console.log(arr[0] === arrCopy[0]);
// false
```

## random

Genera números aleatorios.

```javascript
console.log(_.random(0, 10));
// 2
```

## assign

Amplía un objeto con nuevas características, sobreescribiendo las anteriores:

```javascript
var obj = {name: 'juan'};

var extended = _.assign(obj, {name: 'pepe'}, {job:'percebeiro'});

console.log(extended);
// { name: 'pepe', job: 'percebeiro'  }  
```

## pick

Crea un objeto a partir de propiedades escogidas de otro.

```javascript
var car = {
  price: '40000€',
  brand: 'BMW',
  year: 2015
};

console.log(_.pick(car, ['brand', 'year']));
// { brand: 'BMW', year: 2015  }
```

## find

Encuentra el primer elemento que cumpla una condición en una colección.

```javascript
var cars = [
  {brand: 'BMW', price: 40000},
  {brand: 'Seat', price: 20000},
  {brand: 'Mercedes', price: 50000}
];

console.log(_.find(cars,{price: 20000}));
// { brand: 'Seat', price: 20000  }
```

## chunk

"Parte" un array en subarrays de la longitud especificada.

```javascript
var chunked = _.chunk(['juan', 12, 'pepe', 33], 2);
console.log(chunked);

// [ [ 'juan', 12  ], [ 'pepe', 33  ]  ]
```

## union

Crea un array de valores únicos.

```javascript
var union = _.union([1, 2], [3, 2], [2, 1]);
console.log(union);
// [ 1, 2, 3 ]
```

## merge

"Fusiona" dos objetos.

```javascript
var brands = [
  {brand: 'BMW'},
  {brand: 'Toyota'},
  {brand: 'Seat'}
];

var prices = [
  {price: 40000},
  {price: 30000},
  {price: 20000}
];

var merged = _.merge(brands, prices);

console.log(merged);
// [ { brand: 'BMW', price: 40000  },
//   { brand: 'Toyota', price: 30000  },
//   { brand: 'Seat', price: 20000  } ]
```

---
lodash implementa estos **[y muchísimos métodos más](https://lodash.com/docs)** que estoy seguro de que te serán útiles.

Por otra parte, en npm tienes disponible [lodash en forma de módulos](https://www.npmjs.com/package/lodash), por si quieres importar única y exclusivamente lo que necesite tu aplicación.

De momento seguimos con estos minipost, en lugar de megatutoriales, que pienso que también pueden ser útiles, al menos para dar a conocer herramientas.

Como siempre, **cualquier aporte es bienvenido**.

¡Pásalo bien!

---
Imagen del post: [atomicShed](https://www.flickr.com/photos/57071639@N00/)
