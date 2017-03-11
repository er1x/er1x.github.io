title: Cómo empezar con D3.js
date: 2015-05-28 16:45:00
tags: ['frontend', 'd3']
---

![D3.JS](/images/2015-05/d3-wall.png)

[D3](http://d3js.org/) es la **biblioteca más potente para realizar visualización de datos en JavaScript**. Su principal ventaja es que se puede hacer casi cualquier cosa, a costa de que hay que currarse bastante más las visualizaciones que si utilizas, por ejemplo, [Highcharts](http://www.highcharts.com/).

Para sacar todo el jugo a D3 hay que utilizar SVG, lo que permite generar gráficos y visualizaciones que nunca van a perder calidad por mucho que las escales.

## SVG *easy & fast*

Veamos de forma rápida qué es SVG.

SVG hace referencia a **Scalable Vector Graphics**. Son gráficos que se pueden crear únicamente con código. Dentro de un código HTML, puedes utilizar la etiqueta *svg* y dentro ir añadiendo los diferentes elementos que compongan la imagen.

Por ejemplo, para dibujar un círculo azul de 50px de radio, el código sería el siguiente:
```html
<svg width="500" height="500">
  <circle r="50" cx="100" cy="100" fill="blue" />
</svg>
```

Como ves, va todo en base a atributos (ancho, alto, radio, coordenada X, coordenada Y...), que es lo que habrá que ir creando y modificando con D3. Prueba a [trastear con el ejemplo](http://codepen.io/er1x/pen/oXjXYX).

Con SVG se pueden utilizar figuras geométricas simples (rectángulos, círculos, elipses...), y también cosas más complejas, utilizando el elemento *path*, que básicamente son sucesiones de "coordenadas" por las que va pasado una línea. Estos últimos gráficos son más complejos y se realizan con programas como Illustrator o Inkscape.

Si te quieres meter a fondo con SVG, te recomiendo este estupendo [tutorial](https://developer.mozilla.org/es/docs/Web/SVG/Tutorial). No obstante, puedes ir empezando con D3 de todas formas.

## Al lío. Un **ejemplo básico de D3**

Si quieres crear visualizaciones originales en D3 no te quedará más remedio que controlar de SVG y tener idea de diseño. Afortunadamente en la web de D3 tienes una [cantidad aberrante de ejemplos](https://github.com/mbostock/d3/wiki/Gallery) con la que puedes empezar a hacer tus pinitos.

Antes de meterte a modificar esos ejemplos, lo suyo es que conozcas lo básico de D3. Y eso es lo que voy a enseñarte aquí con un proyecto muy sencillo: un diagrama de barras con botones para aumentar/disminuir sus valores.

Esto es lo que vamos a construir:

![D3-1](/images/2015-05/d3-1.png)

¿Parece simple, no? ¡Lo es! Vamos con ello. Te recuerdo que tienes [el *repo* disponible](https://github.com/er1x/d3-simple-example).

### Creando el *index.html*

Crearemos un **index.html** con el código necesario para el proyecto, que es el siguiente:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Hero Poll</title>
  <style>
    .portraits {
      float: left;
      margin-right: 10px;
    }
    img {
      display: block;
      margin-bottom: 5px;
      height: 50px;
      width: 50px;
    }
  </style>
</head>
<body>

  <div class="portraits">
    <img src="Ironman.png">
    <img src="Hulk.png">
    <img src="Thor.png">
  </div>

  <div id="chart"></div>

  <button id="ironman">Vote for Ironman</button>
  <button id="hulk">Vote for Hulk</button>
  <button id="thor">Vote for Thor</button>


  <script src="d3.js"></script>
  <script src="app.js"></script>
</body>
</html>
```

La parte que nos interesa de aquí es:

  - El contenedor donde se dibujará el diagrama.
```html
<div id="chart"></div>
```
  - La ruta del fichero de D3. Lo puedes descargar de [aquí](https://github.com/mbostock/d3/releases/download/v3.5.5/d3.zip), o puedes usar un [gestor de dependencias](/2015/05/dependencias-web/).
```html
<script src="bower_components/d3/d3.js"></script>
```
  - Nuestro código, que lo pondremos en un fichero diferente.
```html
<script src="app.js"></script>
```

### Uso básico de D3
Dentro del fichero **app.js** haremos uso de D3. Una versión mínima sería:

```javascript
function init() {

  var data = [50, 75, 12];

  var svg = d3.select('#chart')
              .append('svg')
              .attr('width', 500)  
              .attr('height', 200);

  var heroBars = svg.selectAll('rect')
     .data(data)
     .enter()
     .append('rect')
     .attr('height', 50)
     .attr('width', function(d){ return d;})
     .attr('y', function(d, index){ return index * 55; });
}

window.onload = init;
```
Cuando la carga de la web termina se ejecuta la función **init**, en la cual se crea el diagrama, de la siguiente forma:

1. Primero se crea un array con los datos que queremos dibujar gráficamente.

2. Después se crea el elemento SVG. Esto se hace utilizando d3.select, función a la cual se le pasa el selector del elemento donde queremos poner el SVG. Es similar a *jQuery, $('#myId')* o a *document.getElementById*.

3. A esa selección se le añade (append) un elemento svg y a este a su vez se le ponen atributos de ancho y alto.
Habrás notado que se utiliza continuamente el punto '.' para encadenar funciones. Esto es equivalente a hacer:

```javascript
var selector = d3.select('#chart');
var svg      = selector.append('svg');
svg.attr('width', 500);
svg.attr('height', 200);
```

Pero como sería un rollo tener que ir poniendo variables por cada llamada, se encadenan de esta manera. Esto de hecho es un [patrón muy común](http://schier.co/blog/2013/11/14/method-chaining-in-javascript.html) en JavaScript.

Por último creamos los rectángulos. Éstos, dependiendo del dato que representen, tendrán un ancho diferente y se pondrán en diferente sitio. Para hacer esto se hace una sucesión de llamadas encadenadas. **Atento, esto es lo más importante del post**. Veámoslas paso a paso:

```javascript
var heroBars = svg.selectAll('rect');
```

Utilizando el svg creado antes, seleccionamos a su vez todos los **rect** dentro de éste. Todavía no existen, pero se crearán después.

```javascript
.data(data)
```
Enlaza los datos que tenemos (en el array *data*). A partir de esta llamada, todo lo siguiente se ejecutará tantas veces como elementos de datos tengamos. En este caso 3.

```javascript
.enter()
```
Crea una nueva referencia para el elemento que vamos a añadir.

```javascript
.append('rect')
```

Toma la referencia anterior e inserta un elemento de tipo rectángulo SVG. Esta llamada devuelve una referencia al elemento rect, y es a partir de aquí cuando podemos dar diferentes propiedades a cada rectángulo.

```javascript
.attr('height', 50)
```

Le damos un alto de 50px.

```javascript
.attr('width', function(d, index){
  return d;
})
```

Le damos un ancho variable a cada rectángulo.

A cada propiedad le podemos dar valores dinámicos gracias a una función especial, que recibe como parámetros el valor del dato asociado y un índice numérico.

Así, esta función se ejecuta 3 veces, con parámetros (50, 0), (75, 1) y (12,2). Nosotros devolvemos como valor para el ancho el mismo valor del dato del array. Por tanto los rectángulos tendrán anchos de 50, 75 y 12 píxeles.

```javascript
.attr('y', function(d, index){ return index * 55; })
```

Ahora bien, cada rectángulo necesita ser posicionado a diferente altura para que no se solapen. Esto lo hacemos cambiando el atributo **y** (la coordenada y). También dinámicamente, utilizamos el índice para que cada rectángulo se pinte (55 x Índice) píxeles más abajo.

Una vez terminado esto, nos queda lo siguiente:

![D3-2](/images/2015-05/d3-2.png)

## Añadiendo color y comportamiento a los botones

Como el color del rect por defecto es un poco soso vamos a modificarlo para que cada uno tenga un color diferente. Además agregaremos comportamiento a los botones.

Sólo tenemos que tocar el fichero **app.js**, que quedará así:

```javascript
function heroColor(d, index) {
  if (index === 0) { // ironman
    return '#DA0716';
  } else if (index === 1) {
    return '#007315'; // hulk!
  } else {
    return '#006eff';
  }
}

function addTen(heroBar) {
  var oldVal = heroBar.getAttribute('width');
  heroBar.setAttribute('width', parseInt(oldVal) + 10);
}

function init() {

  var data = [50, 75, 12];

  var svg = d3.select('#chart')
              .append('svg')
              .attr('width', 500)
              .attr('height', 200);

  var heroBars = svg.selectAll('rect')
     .data(data)
     .enter()
     .append('rect')
     .attr('height', 50)
     .attr('width', function(d){ return d;})
     .attr('y', function(d, index){ return index * 55; })
     .attr('fill', heroColor);

  document.getElementById('ironman').addEventListener('click', function() { addTen(heroBars[0][0]); });
  document.getElementById('hulk').addEventListener('click', function() { addTen(heroBars[0][1]); });
  document.getElementById('thor').addEventListener('click', function() { addTen(heroBars[0][2]); });

}

window.onload = init;
```

¿Qué hemos agregado aquí?

- Hemos añadido un paso más a la creación del rect, el atributo **fill**, que en SVG se utiliza para colorear. La función que utilizamos para decidir ese color es *heroColor*.

 En este caso la hemos sacado a una función externa para que fuera más legible, en lugar de ponerla directamente como hicimos con el ancho o la posición.

- Hemos agregado un *listener* a cada uno de los botones. Cuando se hace click en ellos, se llama a  la función *addTen*.

 Esta función recibe un objeto rect, y le suma diez al ancho.
Verás que hemos recogido el diagrama en la variable *heroBars*, para utilizarla posteriormente en los eventos de click.

 Se trata de un doble array porque d3 devuelve un array en primer lugar con la selección inicial (podrían existir varios rect previos a nuestra gráfica) y luego otro array con los rects que hemos ido creando.

## El resultado

Finalmente, nuestro sencillo ejemplo ha quedado de esta manera:

![D3-3](/images/2015-05/d3-3.png)

Y, por supuesto, podemos aumentar la barra de Hulk pulsando en su botón.

![D3-4](/images/2015-05/d3-4.png)

Ya que, como todos sabemos, Hulk es mucho mejor que Thor y Ironman :D


Con este post has aprendido los fundamentos de D3 y estás listo para empezar aplicarlo en tus desarrollos. Yo suelo cogerme [algún ejemplo](https://github.com/mbostock/d3/wiki/Gallery) y lo adapto dependiendo de la visualización que vaya a crear. También puedes, lógicamente, crear tú desde cero tus propias visualizaciones.

Si te animas a probar D3 vuelve a este post y cuéntanos qué te parece :)
