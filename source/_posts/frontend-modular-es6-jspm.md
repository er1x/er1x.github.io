title: 'Modulariza tu frontend en ES6: JSPM'
date: 2015-07-16 17:57:00
tags: ['frontend', 'jspm']
---
![paquetes](/images/2015-07/9658240210_f9ede0a055_c.jpg)

En la carrera por mejorar la modularidad en aplicaciones JavaScript, tras la aparición de [RequireJS](http://requirejs.org/) y [Browserify](http://browserify.org/) han ido apareciendo **sistemas de carga de módulos más elaborados, como [webpack](http://webpack.github.io/) y [jspm](http://jspm.io/)**.

jspm es la **solución favorita de [Aurelia](/2015/07/introduccion-aurelia-framework/) para la gestión de paquetes, pues está orientada a trabajar con ECMAScript6**, y en este post vamos a ver cómo utilizarlo.

Con jspm podrás:

* **Gestionar las dependencias de tu aplicación**, instalándolas desde los registros jspm, github o npm. [Si conoces Bower](/2015/05/dependencias-web/), te parecerá similar en este aspecto.
* **Escribir tu propio código en módulos ES6**.

## Instalación

Con [Node.js instalado](/2015/05/instalar-nodejs/), instalamos jspm de manera global.

```bash
npm i -g jspm
```

## Proyecto base y carga de módulo principal

Vamos a crear un proyecto sencillo que coja imágenes de Reddit y las ponga en la web. **El código completo del ejemplo [lo tienes en Github](https://github.com/er1x/jspm-example)**.

Para empezar, inicializamos jspm en el directorio raíz del proyecto.

```bash
[] jspm init
Package.json file does not exist, create it? [yes]:
Would you like jspm to prefix the jspm package.json properties under jspm? [yes]:
Enter server baseURL (public folder path) [./]:
Enter jspm packages folder [./jspm_packages]:
Enter config file path [./config.js]:
Configuration file config.js doesn\'t exist, create it? [yes]:
Enter client baseURL (public folder URL) [/]:
Which ES6 transpiler would you like to use, Traceur or Babel? [traceur]:Babel
```

Las preguntas que nos hace son simples, y eres libre de responder como quieras. Con las opciones por defecto para este ejemplo vamos que chutamos, pero particularmente elijo Babel como transpiler ES6, más por costumbre que otra cosa.

Este comando crea una carpeta para albergar las dependencias, así como un fichero de configuración. **Las dependencias de nuestro proyecto se irán guardando en el fichero package.json**, propio de Node.


### index.html

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Latest Wallpapers</title>
</head>
<body>
  <h1>hola!</h1>
  <script src="jspm_packages/system.js"></script>
  <script src="config.js"></script>
  <script>
    System.import('js/main');
  </script>
</body>
</html>
```

Aquí **importamos el cargador de módulos [SystemJS](https://github.com/systemjs/systemjs)**, junto con las dependencias de la aplicación escritas en el fichero config.js. Este fichero contiene rutas de dependencias y es generado y actualizado automáticamente por jspm cada vez que instalamos algo.

Después inicializamos nuestra aplicación, importando un fichero principal, que tendremos en *js/main.js*.

### main.js

```javascript
console.log('hola!');
```

Esto nos da como resultado:

![holajspm](/images/2015-07/holajspm.png)


## Instalar dependencias y crear nuestros propios módulos

Vamos a **crear un módulo que se encargue de recuperar las imágenes de Reddit, utilizando para ello ES6**.

En primer lugar, **vamos a instalar una pequeña dependencia para usar AJAX fácilmente, que es [Superagent](https://github.com/visionmedia/superagent)**. Para ello:

```bash
jspm install npm:superagent
```

La sintaxis es muuy básica, antes de los dos puntos ponemos el registro a utilizar y después la dependencia. **En este caso instalamos superagent desde [npm](https://www.npmjs.com/)**.

Ahora veamos el código del módulo que recuperará las imágenes:

### images.js

```javascript
import request from 'superagent';

export default class Images {
  list(){
    let promise = new Promise((resolve, reject) => {
      request.get('https://www.reddit.com/r/wallpaper.json')
             .end((err, res) => {
                resolve(JSON.parse(res.text).data.children);
             });
    });
    return promise;
  }
}
```

En este módulo:

* Importamos request de superagent.
* Creamos y exportamos una clase Images.
* La clase tiene un método *list*. Este método devuelve una *promesa* que realiza una petición a Reddit, al hilo de wallpapers, y devuelve el JSON de respuesta parseado.

Como ves, gracias a Babel utilizamos **[características de ES6](https://babeljs.io/docs/learn-es2015/#ecmascript-6-features) como: clases, módulos, promesas y funciones *arrow***.

Veamos cómo utilizamos este módulo en el fichero main.

### main.js

```javascript
import Images from 'js/images';

function renderImages (images) {
  let urls = images
            .filter(obj => obj.data.post_hint === 'image')
            .filter(obj => !obj.data.over_18)
            .map(obj => obj.data.url);
  urls.forEach(url => {
    let element = document.createElement('img');
    element.setAttribute('src', url);
    document.body.appendChild(element);
  });
}

let images = new Images();
images.list()
      .then(renderImages);
```

Básicamente aquí:

* Importamos nuestro módulo recién creado.
* Instanciamos la clase Images y llamamos a su función *list*.
* Indicamos que al resolverse la promesa se ejecute la función *renderImages*, mediante *then*.
* Al resolverse la promesa se ejecuta la función *renderImages*. Le llega el array de objectos de Reddit como parámetro. De él se extrae la URL de la imagen (filtrando imágenes *de mayores* para no herir susceptibilidades :P). Después creamos un elemento img y lo añadimos al body.

El resultado que nos deja esto es el siguiente (he añadido un poco de CSS que no viene al caso :P, pero puedes verlo en el repo):

![redditwalls](/images/2015-07/redditwalls.png)

<br>
## ¡A producción!

Si has tenido la curiosidad de mirar la pestaña de Red de las herramientas de desarrollo, **habrás visto que se hacen mogollón de peticiones (imágenes aparte)**.

![peticiones](/images/2015-07/requests.png)

Esto en producción no es práctico. La regla de oro del rendimiento es hacer **cuantas menos peticiones mejor**. Por ello resulta fundamental **concatenar nuestra aplicación en un único fichero y *minificarlo***.

Para ello jspm nos lo pone fácil:

```bash
[] jspm bundle-sfx --minify js/main
     "Building the single-file sfx bundle for js/main...
ok   Built into build.js with source maps, minified, mangled."
```

Ese comando nos ha dejado un fichero optimizado en build.js, que debemos incluir en el fichero index.html

### index.html

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Latest Wallpapers!</title>
  <style>
    body {
      padding: 0;
      margin: 0;
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
    }
    img {
      display: block;
      width: 20vw;
      object-fit: cover;
    }
  </style>
</head>
<body>
  <script src="build.js"></script>
</body>
</html>
```

Veamos el resultado:

![peticiones2](/images/2015-07/requests2.png)

Como ves, **24 solicitudes, de las cuales 21 eran las imágenes :)** Esto ya es usable en producción.


---

En ese post hemos aprendido a usar jspm, un gestor de dependencias de nueva generación: **junto con Babel/Traceur, una excusa perfecta para empezar a usar ES6 en tus proyectos**.

Merece la pena.


Imagen del post: <a href="https://www.flickr.com/photos/ltdemartinet/9658240210/">eldeeem</a> / <a href="http://foter.com/">Foter</a> / <a href="http://creativecommons.org/licenses/by-nc-sa/2.0/">CC BY-NC-SA</a>
