title: 'Aurelia - Cómo crear Custom Elements y usar Event Aggregator'
date: 2016-02-29 07:00:00
tags: ['aurelia', 'es2015']
---
![Aurelia CustomElements & Event Aggregator](/images/2016-02/aur-eventagg.jpg)

Como viene siendo habitual en los frameworks JavaScript de última generación, tenemos la posibilidad de crear elementos HTML personalizados. Así, **con [Aurelia](http://aurelia.io/) podemos crear Custom Elements**, que nos permiten hacer el HTML más legible y modular.

En este tutorial de Aurelia veremos **cómo crear estos [Custom Elements](http://blog.durandal.io/2015/04/24/aurelia-custom-elements-and-content-selectors/), y utilizar [Event Agregator](https://github.com/aurelia/event-aggregator)**, una pequeña biblioteca que nos permite comunicar elementos de la página mediante el mecanismo *publish/subscribe*.

## Aurelia Custom Elements

Vamos a crear unos interruptores (switch) y a permitir usarlos en una aplicación, partiendo del **[Starter Kit de Aurelia](/2016/02/empezar-desarrollo-spa-con-aurelia/)** como base.

Como ya sabes si viste alguno de los [tutoriales anteriores de Aurelia](/2015/07/introduccion-aurelia-framework/), crearemos estos elementos con dos ficheros: switch.html y switch.js.

### switch.js

```javascript
import {customElement} from 'aurelia-framework'

@customElement('switch')
export class Switch {
  constructor() {
    this.enabled = false
  }
  toggle() {
    this.enabled = !this.enabled
  }
}
```
Como puedes ver, en [Aurelia](http://aurelia.io/) es todo es [ECMAScript 6](https://babeljs.io/docs/learn-es2015/)/7, que es compilado a ES5 con [Babel](https://babeljs.io/). En este caso hemos hecho lo siguiente:

* Importar *customElement* del framework Aurelia.
* Crear una clase *Switch* y especificar mediante el decorator customElement, que "switch" será el elemento HTML que vamos a crear.
* En el constructor creamos una propiedad enabled, que indicará si el interruptor está activo. Por defecto a false.
* Por último creamos un método de la clase Switch para activar y desactivar el interruptor.

### switch.html

```html
<template>
  <require from="/styles/switch.css"></require>
  <div class='switch' click.trigger="toggle()">
    <div class='switch__off' class.bind="enabled ? 'switch__off--hide' : ''">OFF</div>
    <div class='switch__glow' class.bind="enabled ? '' : 'switch__glow--hide'"></div>
    <div class='switch__button' class.bind="enabled ? 'switch__button--hide' : ''"></div>
    <div class='switch__on' class.bind="enabled ? '' : 'switch__on--hide'">ON</div>
  </div>
</template>
```
Y esta es la plantilla:

* Se define entre las etiquetas **template** (¡sí, [igual que en Meteor](/2015/12/megatutorial-meteor-uno/)!).
* Creamos una serie de divs que son las que muestran el estado del interruptor. Esto lleva a requerir un CSS para este switch, lo que hacemos con la **etiqueta require y el atributo from**.
* Indicamos que al hacer click debe dispararse el método toogle, mediante **click.trigger**.
* Por último **hacemos un bind de la class**, para asignar clases CSS adicionales dependiendo de si el interruptor está activo o no.

¿Sencillo no? ¡Pues ahora a usar nuestro nuevo elemento!

Para ello incluiremos varios "switch" en el elemento principal de la aplicación, en src/app.html:

```html
<template>
  <require from="./switch"></require>
  <div class="container">
    <div class="col1">
      <switch></switch>
      <switch></switch>
      <switch></switch>
      <switch></switch>
    </div>
  </div>
</template>
```
Con todo esto, **nuestros custom elements de Aurelia tienen esta pinta**:

![Custom switches](/images/2016-02/custom-switches.png)

## Aurelia Event Aggregator

Cuando me puse a picar este ejemplo pensé que sería chulo que estos interruptores controlaran algo, por ejemplo, unas bombillas, y **comunicar estos elementos con el [Event Aggregator](https://github.com/aurelia/event-aggregator) de Aurelia**. El Event Aggregator es un sistema ligero de comunicación tipo *publish/subscribe*.

### Modificaciones del elemento Switch

Tenemos que añadir los eventos al switch, vamos a ello:

```javascript
import {customElement, inject, bindable} from 'aurelia-framework'
import {EventAggregator} from 'aurelia-event-aggregator'

@customElement('switch')
@inject(EventAggregator)
export class Switch {
  @bindable number
  constructor(eventAggregator) {
    this.enabled = false
    this.eventAggregator = eventAggregator
  }
  toggle() {
    this.enabled = !this.enabled
    this.eventAggregator.publish(`switch-${this.number}`, this.enabled)
  }
}
```

Con respecto al código anterior, esto es lo que ha cambiado:

* Importamos **inject y bindable de aurelia-framework**. Inject lo necesitaremos para inyectar la dependencia EventAggregator en la clase switch (podríamos pasar de ello si no quisiéramos usar inyección de dependencias). Bindable lo necesitaremos para añadir un atributo extra al interruptor, que será un número que lo identifique.
* Importamos EventAggregator.
* **Inyectamos EventAggregator** mediante el decorator "\@inject".
* Asignamos el atributo HTML number a una propiedad.
* En el constructor, guardamos el eventAggregator.
* En el método toggle, además de cambiar el estado del interruptor, **utilizamos eventAggregator para publicar un evento** *switch-númeroDelSwitch*. A quien se suscriba a este evento le llegará también el estado del interruptor (this.enabled) como información adicional.

A partir de ahora, los switch se crearían así:

```javascript
<switch number="0"></switch>
```

### Elemento *Light*

Vamos a crear unos *custom element* sencillitos que enseñen un pequeño circulito amarillo, a modo de bombilla.

#### light.html

```html
<template>
  <require from="/styles/light.css"></require>
  <div class="light" class.bind="on? '' : 'light--off'">
  </div>
</template>
```
No hay mucho que decir en este ejemplo, ya que lo hemos visto todo con el anterior. Importamos un CSS para la luz y le cambiamos la clase dependiendo del estado del atributo ON.

#### light.js

```javascript
import {customElement, inject, bindable} from 'aurelia-framework'
import {EventAggregator} from 'aurelia-event-aggregator'

@customElement('light')
@inject(EventAggregator)
export class Light {
  @bindable number
  constructor(eventAggregator) {
    this.on = false
    this.eventAggregator = eventAggregator
  }

  attached() {
    this.eventAggregator.subscribe(`switch-${this.number}`, switchEnabled => {
      if (switchEnabled) {
        this.on = true
      } else {
        this.on = false
      }
    })
  }
}
```
En este caso los imports son exactamente iguales que en el otro custom element. La diferencia ahora está en el método attached.

Attached es un método especial que se ejecuta cuando la vista se ha agregado al DOM, y en este caso lo que queremos que ocurra es que **el elemento light se suscriba al evento *switch-númeroDelSwitch***, mediante el método subscribe de eventAggregator.

El resultado tiene esta pinta:

![Custom switches](/images/2016-02/switches-lights.png)
---

En este tutorial de [Aurelia](http://aurelia.io/) hemos visto lo sencillo que es crear elementos HTML personalizados ([Custom Elements](http://blog.durandal.io/2015/04/24/aurelia-custom-elements-and-content-selectors/)) y cómo podemos utilizar [EventAggregator](https://github.com/aurelia/event-aggregator) para realizar una comunicación sencilla en la aplicación.

Y por último, que se me olvidaba :P, el código [lo tienes en Github](https://github.com/er1x/ce-ea-sample), por si quieres echarle un vistazo ;)

¿A ti qué te ha parecido? ¿Fácil, difícil? ¿Te gusta más la sintaxis de React o Angular2? A mí desde luego no ^^

¡Buena semana!

---
Imagen del post por [Vadim Sherbakov](https://unsplash.com/madebyvadim)
