title: 'Jugando con el objeto Proxy de ECMAScript6'
date: 2016-02-08 07:00:00
tags: ['es6', 'es2015']
---
![Proxy](/images/2016-02/proxy.jpg)

JavaScript avanza tan deprisa que es complicado estar al día de todas las cosas nuevas que salen. Uno de las novedades más interesantes que llegará próximamente es el objeto Proxy.

## Proxy en ES6

MDN define el  [Proxy](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Proxy) como un **objeto que puede utilizarse para añadir comportamiento personalizado a operaciones básicas de otro**.

Un ejemplo: *tengo un objeto P. Cuando la propiedad P.foo cambie, **además haz tal cosa***. A eso nos ayuda el Proxy.

Veámoslo:

```
'use strict'

let target = {}
let handler = {
  get: (target, prop) => {
    console.log(`Someone wants to know *${prop}*!`)
    return target[prop]
  }
}

let p = new Proxy(target, handler)
p.name = 'Bart'
console.log(p.name)
```

![Ejemplo Proxy](/images/2016-02/proxy_example.PNG)

Básicamente, al constructor de Proxy se le pasan 2 cosas:

* Un objeto sobre el que actuar de proxy.
* Otro objeto con *hooks* sobre las operaciones JavaScript que quieras interceptar sobre el objeto original. Aquí puedes *hookear* operaciones como Get, Set, Apply...

## Usando **Proxy ES6** para prevenir acceso a propiedades inexistentes

Vamos a utilizar el Proxy ES6 para crear objetos que *tiren* excepciones cuando se intente acceder a propiedades que no tengan definidas, para evitar el famoso *undefined* que no da error y a veces es difícil de depurar.

```
'use strict'

let dummyObj = {
  name: 'Bart'
}

let awareObject = new Proxy(dummyObj, {
  get: (target, property) => {
    if (property in target) {
      return target[property]
    } else {
      throw new Error(`Hey! ${property} does not exist in ${target}`)
    }
  }
})

console.log(dummyObj.name)
console.log(dummyObj.surname)

console.log(awareObject.name)
console.log(awareObject.surname)
```

Esto simplemente utiliza el Proxy para ver si el objeto al que se intenta acceder. La salida, como podéis suponer, es la siguiente:

![Objeto con chequeo de propiedades](/images/2016-02/aware_object.png)


## Soporte y uso con Babel

Actualmente [no hay demasiado soporte](http://kangax.github.io/compat-table/es6/#Proxy) para utilizar el Proxy. Yo lo he probado con [Chrome Canary](https://www.google.es/chrome/browser/canary.html) y con [Babel](https://babeljs.io/).

Si quieres probarlo con Babel tendrías que instalar [este plugin](https://github.com/krzkaczor/babel-plugin-proxy/):

**NOTA**: es experimental y no deberías usarlo en producción por el impacto que podría tener en el rendimiento.

```
npm install --save-dev babel-plugin-proxy
```

E indicar el uso de este plugin en el fichero de configuración de Babel:

```javascript
{
  "presets": ["es2015"] ,
  "plugins": ["babel-plugin-proxy"]
}
```
---

Por otra parte si quieres trastear un poco con ello, te **recomiendo encarecidamente [Codepen](http://codepen.io/)**. De hecho te lo recomiendo para trastear con casi cualquier cosa. Se pueden añadir todo tipo de preprocesadores sin ningún tipo de instalación y puedes probar casi todo con él.

¡Buena semana!
