title: 'Tutorial Chart.js: gráficas sencillas en JavaScript'
date: 2016-04-28 7:00:00
tags: ['javascript']
---
![chart.js](/images/2016-04/postimage.png)

[Chart.js](http://www.chartjs.org/) es una biblioteca para crear gráficas sencillas en JavaScript. Hace poco ha sido liberada su versión 2, y ya que es una de mis primeras opciones cuando tengo que crear gráficas en una aplicación te voy a explicar cómo va en este pequeño tutorial.

## Qué se puede hacer con Chart.js

Pues gráficas. No tiene muchos tipos, pues sólo te vas a encontrar los básicos: líneas, barras, tartas etc. pero son muy sencillos de usar y muy visuales. Para muestra un botón:

![Gráfico de Barras](/images/2016-04/barras.png)
![Gráfico de Radar](/images/2016-04/radar.png)

## Instalación de Chart.js 2

Vamos al lío. Para usar Chart.js 2 puedes descargarlo directamente de aquí o utilizar algún gestor de dependencias como NPM, Bower etc. E incluirlo en un script, lo de siempre.

Ahora, **Chart.js trabaja con [canvas](https://developer.mozilla.org/es/docs/Web/HTML/Canvas) para hacer los diagramas**. Por tanto hemos de incluir una etiqueta \<canvas\>, normalmente con un id para identificarlo fácilmente.

Para este ejemplo lo he instalado con NPM y he incluido un tema de Bootstrap. El canvas lo he puesto en una columna para él solito:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Document</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bootswatch/3.3.6/flatly/bootstrap.css">
</head>
<body>

  <div class="container">
    <div class="row">
      <div class="col-lg-12">
        <h1>Life Expectancy by Country</h1>
        <hr>
      </div>
    </div>
    <div class="row">
      <div class="col-lg-12">
        <canvas id="lifeChart"></canvas>
      </div>
    </div>
  </div>
  <script src="node_modules/chart.js/dist/Chart.js"></script>
</body>
</html>
```

## Datos y creación de la gráfica

Para este ejemplo he recogido datos de la esperanza de vida en diferentes países y los he guardado en un JSON, para hacer un **diagrama de barras**. Tiene una pinta de este estilo:

```js
[
    {"country": "Japan", "lifeExpectancy": 84 },
    {"country": "Spain", "lifeExpectancy": 83 },
    {"country": "Andorra", "lifeExpectancy": 83 },
    {"country": "Singapore", "lifeExpectancy": 83 },
    {"country": "Switzerland", "lifeExpectancy": 83 },
...
```

Lo que vamos a hacer ahora es crear una función que se encargue de pintar este diagrama, partiendo de unos datos que lleguen como parámetro. Ésta función:

* Recogerá el elemento canvas con un *document.getElementById*.
* Creará el diagrama con la función Chart, pasando como parámetros el canvas y un objeto con opciones.
* Las opciones del diagrama serán cosas como: el tipo de diagrama, los datos a usar en el eje X e Y, colores y cosas así.
La cosa, lo más sencilla posible es algo así:

```js
function renderChart (dataset) {
  let ctx = document.getElementById('lifeChart')
  let barChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: dataset.map((el) => el.country),
      datasets: [{
        label: 'life expectancy (years)',
        backgroundColor: 'rgba(128,164,237, 0.8)',
        borderColor: 'rgba(128,164,237, 1)',
        data: dataset.map((el) => el.lifeExpectancy)
      }]
    }
  })
}
```

Como ves, en el objeto de opciones:

* Ponemos type: ‘bar’ para indicar que es un diagrama de barras.
* En data pasamos como etiquetas (eje X), un array con los países. Estos los sacamos mapeando el array de datos con una [arrow function](/2016/04/5-caracteristicas-es6/) que nos devuelva el país.
* En los data set, incluimos los datos propiamente dichos, para el eje Y, así como una configuración para los colores y una etiqueta de leyenda arriba.

![Gráfica inicial](/images/2016-04/chart-basico.png)

¿No está mal verdad? Además mola porque **es responsive por defecto**. Aun así hay cosas que no me gustan y vamos a cambiar.

## Personalizando un poco

Para empezar, no me gusta que no salgan los textos de todos los países, y tampoco que la gráfica empiece en 78. Tal y como está parece que los japoneses son la leche y que Colombia no mola nada. Hay que cambiarlo.

Esto son opciones adicionales sobre los ejes X e Y, y las pasaremos así:

```js
let barChart = new window.Chart(ctx, {
  type: 'bar',
  data: {
    labels: dataset.map((el) => el.country),
    datasets: [{
      label: 'life expectancy (years)',
      backgroundColor: 'rgba(128,164,237, 0.8)',
      borderColor: 'rgba(128,164,237, 1)',
      data: dataset.map((el) => el.lifeExpectancy)
    }]
  },
  options: {
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true
        }
      }],
      xAxes: [{
        ticks: {
          autoSkip: false
        }
      }]
    }
  }
})
```

![Gráfica personalizada](/images/2016-04/chart-custom.png)

¿Mucho mejor verdad? Aun así se me ocurre que no estaría mal hacer algo cuando el usuario haga click en una barra. Como mostrar info ampliada o algo así.

## Manejando el evento *click*

Añadir un manejador al evento click es sencillo:

```js
options: {
        onClick: clickHandler,
        responsive: true,
        scales: {
          yAxes: [{
...
```

Este manejador recibe el evento y el elemento donde se ha pulsado, si es que es alguno, en un array. Lo que vamos a hacer es crear un div con un panel de Bootstrap para colocar un texto adicional:

```html
...
   <div class="row">
      <div class="col-lg-12">
        <canvas id="lifeChart"></canvas>
      </div>
    </div>
    <div class="row">
      <div class="col-lg-12">
        <div class="panel panel-primary">
          <div class="panel-heading">
            <h3 class="panel-title">Selected Country</h3>
          </div>
          <div class="panel-body">
            <div id="selectedCountry">
              <h4>No Selected Country</h4>
            </div>
          </div>
        </div>
      </div>
    </div>
...
```

Este **div con id selectedCountry lo rellenaremos al hacer click**. Veamos cómo:

```js
function clickHandler (evt, element) {
  if (element.length) {
    let data = dataset[element[0]._index]
    let template = `<h4>Selected country is: ${data.country}</h4>
<h5>Life expectancy: ${data.lifeExpectancy}</h5>`
    document.getElementById('selectedCountry').innerHTML = template
  }
}
```

Si nos llega un elemento, lo que hacemos es **recoger el índice de su propiedad \_index**. Este índice podemos utilizarlo para recuperar el país y la esperanza de vida de los datos originales que teníamos. Rellenamos una plantilla ES6 con estos datos y a su vez el div objetivo, quedando la cosa así:

![Gráfica final con manejo de evento click](/images/2016-04/chart-full.png)

Finalmente, **el código del ejemplo completo es el siguiente**, incluyendo la recogida de datos del JSON y demás. **Todo hecho con JavaScript nativo (menos los diagramas), con ES6**.

### index.html

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Document</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bootswatch/3.3.6/flatly/bootstrap.css">
</head>
<body>
  <div class="container">
    <div class="row">
      <div class="col-lg-12">
        <h1>Life Expectancy by Country</h1>
        <hr>
      </div>
    </div>
    <div class="row">
      <div class="col-lg-12">
        <canvas id="lifeChart"></canvas>
      </div>
    </div>
    <div class="row">
      <div class="col-lg-12">
        <div class="panel panel-primary">
          <div class="panel-heading">
            <h3 class="panel-title">Selected Country</h3>
          </div>
          <div class="panel-body">
            <div id="selectedCountry">
              <h4>No Selected Country</h4>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <script src="node_modules/chart.js/dist/Chart.js"></script>
  <script src="my-chart.js"></script>
</body>
</html>
```

### my-chart.js

```js
(function () {
  'use strict'

  window.fetch('/data.json', {
    method: 'get'
  })
  .then((response) => response.json())
  .then((json) => renderChart(json))
  .catch((err) => console.log(err))

  function renderChart (dataset) {
    let ctx = document.getElementById('lifeChart')
    let barChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: dataset.map((el) => el.country),
        datasets: [{
          label: 'life expectancy (years)',
          backgroundColor: 'rgba(128,164,237, 0.8)',
          borderColor: 'rgba(128,164,237, 1)',
          data: dataset.map((el) => el.lifeExpectancy)
        }]
      },
      options: {
        onClick: clickHandler,
        responsive: true,
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }],
          xAxes: [{
            ticks: {
              autoSkip: false
            }
          }]
        }
      }
    })

    function clickHandler (evt, element) {
      if (element.length) {
        let data = dataset[element[0]._index]
        let template = `<h4>Selected country is: ${data.country}</h4>
<h5>Life expectancy: ${data.lifeExpectancy}</h5>`
        document.getElementById('selectedCountry').innerHTML = template
      }
    }
  }
}())
```

## Sobre los tamaños

Chart.js es un poco puñetero en modo responsive si quieres hacer los tamaños de los diagramas a tu bola. En ese caso es interesante pasarle el parámetro **responsive: false** en las opciones, y hacer el canvas del tamaño que gustes aplicándole height y width.

---

Chart.js es una de mis opciones favoritas cuando tengo que hacer gráficas sencillas en aplicaciones. ¿Qué te parece? ¿Prefieres usar otras alternativas?
