title: 'Creando una app híbrida con Aurelia y Framework7'
date: 2016-03-30 7:00:00
tags: ['aurelia']
---
![Aurelia + Framework7](/images/2016-03/aurelia-framework7.png)

Hace poco estuve indagando un poco sobre alternativas a [Ionic](http://ionicframework.com/), ahora que se está oyendo hablar de su nueva versión con Angular2, pero aplicadas al [framework Aurelia](/2016/02/empezar-desarrollo-spa-con-aurelia/). Me encontré con que la cosa todavía está un poco verde, pero que a día de hoy, y a falta de que se revelen más datos sobre [Aurelia Interface](http://blog.durandal.io/2015/11/20/aurelia-beta-week-day-5-aurelia-interface/), una opción interesante es el resultado de combinar [Aurelia](http://aurelia.io/) y [Framework7](http://framework7.io/).

## Aurelia + Framework7

[Como sabes por este blog](/2015/07/introduccion-aurelia-framework/), Aurelia es un framework para aplicaciones JavaScript de última generación. Framework7 es un framework, más o menos equivalente a Ionic, para aplicaciones híbridas. Consiste en [un montón de componentes](http://framework7.io/docs/navbar-toolbar-layouts.html): barras de navegación, botones etc. y un poco de JS que semejan la interfaz de los SO móviles mayoritarios, Android e IOS.

Básicamente lo que voy a mostrarte en este ejemplo es la combinación de ambas herramientas. Aurelia para estructurar y gobernar la lógica de la aplicación, y Framework7 como librería de componentes.

Vamos a crear un ejemplo básico: Todo App. El típico ejemplo de aplicación de lista de tareas por hacer.

## Preparando el proyecto

Lo primero que he hecho ha sido descargarme el [esqueleto básico para aplicaciones de Aurelia](https://github.com/aurelia/skeleton-navigation). En concreto el **skeleton-es2016**.

A partir de ahí, lo que he hecho ha sido un poco de limpieza: eliminar contenido que no necesito y dejar el app.html y app.js limpios:

![App.html & app.js](/images/2016-03/app.png)

Después, he instalado las dependencias para la construcción y las del framework:

```bash
npm install && jspm install -y
```

A continuación toca instalar framework7 como dependencia:

```bash
jspm install npm:framework7
```

## Estructura básica

Con las dependencias instaladas, he preparado el index para incluir el CSS de Framework7:

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Aurelia</title>
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no, minimal-ui">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black">
    <title>My App</title>
    <link rel="stylesheet" href="jspm_packages/npm/framework7@1.4.2/dist/css/framework7.ios.min.css">
    <link rel="stylesheet" href="jspm_packages/npm/framework7@1.4.2/dist/css/framework7.ios.colors.min.css">
    <link rel="stylesheet" href="styles/styles.css">
  </head>

  <body aurelia-app>
    <script src="jspm_packages/system.js"></script>
    <script src="config.js"></script>
    <script>
      System.import('aurelia-bootstrapper');
    </script>
  </body>
</html>
```

Y además, he creado diferentes views y viewmodels que conformarán la aplicación, que son:

* *app.html + app.js*: punto de entrada, aquí creamos y configuramos el router de la aplicación.
* *addTodo.html + addTodo.js*: pantalla para añadir una tarea.
* *todos.html + todos.js*: la lista de tareas.
* *storage.js*: una clase auxiliar para almacenar la lógica de guardado y recuperación de tareas.

## Al turrón

### app.html + app.js

Simplemente contiene el HTML estructural: la barra de navegación y el panel de contenido, y crea el punto donde irán las diferentes vistas en función del router.

```html
<template>
  <div class="statusbar-overlay"></div>
  <div class="panel-overlay"></div>
  <div class="panel panel-left panel-reveal">
    <div class="content-block">
      <ul>
        <li repeat.for="route of router.navigation">
          <a href.bind="route.href">${route.title}</a>
        </li>
      </ul>
    </div>
  </div>
  <div class="views">
    <div class="view view-main">
      <div class="navbar">
        <div class="navbar-inner">
          <div class="center sliding">Aurelia + Framework7 ToDo App</div>
          <div class="right">
            <div class="link icon-only open-panel"><i class="icon icon-bars"></i></div>
          </div>
        </div>
      </div>
      <div class="pages navbar-through toolbar-through">
        <div data-page="index" class="page">
          <div class="page-content">
            <router-view></router-view>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
```

En cuanto al JS, simplemente configuramos el router:

```javascript
import './framework7'

export default class App {

  configureRouter (config, router) {
    config.map([
      { route: ['', 'todos'], name: 'todos', moduleId: './todos', nav: true, title: 'Todos' },
      { route: 'todos/add', name: 'addtodo', moduleId: './addTodo' },
      { route: 'about', name: 'about', moduleId: './about', nav: true, title: 'About' }
    ])

    this.router = router
  }
}
```
Además, he importado un pequeño módulo que inicializa Framework7, indicando que no se va a utilizar el router de F7, sino el de Aurelia:

```javascript
import 'framework7'

let f7 = new window.Framework7({
  router: false
})
export default f7
```

### todos.html + todos.js

El listado de tareas:

* Se repiten en un listado las diferentes tareas: *repeat.for=”todo of todos”*
* Por cada una creamos eventos para eliminarla o marcar el checkbox que indica que está hecha o no: *click.delegate=”removeTodo(todo)”* y *change.delegate=”toggleDone(todo)”*.
* Enseñamos el título: *${todo.title}* y enlazamos la propiedad checked del checkbox al atributo done de la tarea *checked.bind=”todo.done”*.

```html
<template>
  <div class="page-content">
    <div class="content-block">
      <a href="#/todos/add" class="button button-big button-fill button-round active">Add ToDo</a>
    </div>
    <div class="content-block-title">Todos</div>
    <div class="list-block">
      <ul>
        <li repeat.for="todo of todos">
          <label class="label-checkbox item-content">
            <input type="checkbox" change.delegate="toggleDone(todo)" checked.bind="todo.done">
            <div class="item-media">
              <i class="icon icon-form-checkbox"></i>
            </div>
            <div class="item-inner">
              <div class="item-title">${todo.title}</div>
              <div class="item-after"><button class="button color-red" click.delegate="removeTodo(todo)">Remove</button></div>
            </div>
          </label>
        </li>
      </ul>
    </div>
  </div>
</template>
```

En cuanto al JS, utiliza la clase de utilidad Storage para obtener las tareas, y maneja los eventos anteriores:

```javascript
import {inject} from 'aurelia-framework'
import Storage from './storage'

@inject(Storage)
export default class Todos {
  constructor (Storage) {
    this.storage = Storage
    this.todos = Storage.todos
  }

  removeTodo (todo) {
    this.storage.removeTodo(todo.id)
  }

  toggleDone (todo) {
    this.storage.save()
  }
}
```

Esta vista tiene una pinta así:

![Lista de tareas](/images/2016-03/todos.png)

¿No está mal verdad? Se parece mucho a Ionic.

### addTodo.html + addTodo.js

Este componente no es más que un formulario, que una vez más hace uso del servicio auxiliar Storage, y utiliza el evento click para guardar la tarea.

```html
<template>
  <div class="content-block-title">Add Todo</div>
  <div class="list-block">
    <ul>
      <li>
        <div class="item-content">
          <div class="item-inner">
            <div class="item-title label">Title</div>
            <div class="item-input">
                <input type="text" name="title" value.bind="todo">
            </div>
          </div>
        </div>
      </li>
    </ul>
  </div>
  <div class="content-block">
    <p class="buttons-row">
      <a href="#/todos" class="button button-round">Cancel</a>
      <a href="#" click.trigger="addTodo()" class="button button-round active">Add</a>
    </p>
  </div>
</template>
```

Y el JS, más sencillo que el anterior:

```javascript
import {inject} from 'aurelia-framework'
import Storage from './storage'

@inject(Storage)
export default class AddTodo {
  constructor (Storage) {
    this.todo = ''
    this.storage = Storage
  }

  addTodo () {
    this.storage.addTodo(this.todo)
    window.location.href = '#/todos'
  }
}
```

El aspecto en este caso es así:

![Agregar tarea](/images/2016-03/addtodo.png)

### Storage

Por último, el servicio Storage no es más que una clase JavaScript estándar, sin nada de código de librerías externas. Simplemente utiliza [localStorage](https://developer.mozilla.org/es/docs/Web/API/Window/localStorage) para guardar las tareas. Sin más.

```javascript
export default class Storage {
  constructor () {
    let todosString = window.localStorage.getItem('todos')
    if (!todosString) {
      this.todos = []
    } else {
      this.todos = JSON.parse(todosString)
    }
  }

  addTodo (title) {
    this.todos.push({
      title: title,
      done: false,
      id: this.todos.length
    })
    this.save()
  }

  removeTodo (id) {
    this.todos.forEach((todo, index) => {
      if (todo.id === id) {
        this.todos.splice(index, 1)
      }
    })
    this.save()
  }

  save () {
    window.localStorage.setItem('todos', JSON.stringify(this.todos))
  }
}
```

---
Y con esto damos por terminado el ejemplo.

El código lo tienes completo en GitHub, por si te interesa.

A mí me ha parecido una opción interesante y muy sencilla para hacer apps híbridas. Aunque la larga cuando aparezca Aurelia Interface imagino que será la opción más habitual.

En cualquier caso Aurelia trabajaría igual de bien con otras librerías de componentes, dando libertad al desarrollador, que es de lo que se trata al fin y al cabo.

¿Tú que opinas?
