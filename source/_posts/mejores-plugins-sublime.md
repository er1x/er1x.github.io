title: Los 10 mejores plugins de Sublime Text para desarrolladores web
date: 2015-06-11 09:02:00
tags: ['herramientas']
---
![sublime text](/images/2015-06/sublime.png)
Para desarrollar ya sea web o Node.js mi editor favorito es [Sublime Text](http://www.sublimetext.com/). Es posible que te preguntes **por qué Sublime y no [Atom](https://atom.io/) o [WebStorm](https://www.jetbrains.com/webstorm/)**.

Si te soy sincero me gustaría usar cualquiera de los otros dos, ya que creo que con el tiempo se volverán superiores a Sublime, que tiene un ciclo de actualizaciones muy lento.

El caso es que **Atom me parece demasiado lento** y **WebStorm no se ve muy bien en Linux y sus funcionalidades de IDE tampoco me solventan nada**. El autocompletado la última vez que lo usé no era nada del otro jueves, y no necesito un botón verde para ejecutar Node. Me manejo bien con la consola y puedo ejecutar las cosas como me de la gana. Y **para depurar ya tengo [node-inspector](/2015/06/paquetes-imprescindibles-npm/)**.


Mira el aspecto: WebStorm a la izquierda y Sublime a la derecha.

![wstorm-vs-subl](/images/2015-06/ws-subl.png)

Hoy por hoy, por su velocidad creo que Sublime es la mejor opción para desarrollo web.

Sí que es necesario instalarle un buen montón de plugins, y aquí te pongo **los 10 que considero imprescindibles para desarrollo web**.

## 1. AlignTab

**Alinea código con respecto a un carácter**. Para un código más legible.

```javascript
const _             = require('lodash');
const express       = require('express');
const bodyParser    = require('body-parser');
const cookie-parser = require('cookie-parser');
const otherThing    = require('other-thing');
```

## 2. DocBlockr

**Para escribir documentación rápidamente**. Escribes /** y pulsas tab y listo. Te deja una plantilla para documentar lista.

```javascript
/**
 * [doSomething description]
 * @param  {[type]} param1 [description]
 * @return {[type]}        [description]
 */
function doSomething(param1){
  console.log('probando');
}
```

## 3. Emmet

Esto es **el arma definitiva para escribir HTML**. Escribes:

```html
div.my-class>ul>li{contenido}*3
```

Le das al tab y te deja:

```html
<div class="my-class">
  <ul>
    <li>contenido</li>
    <li>contenido</li>
    <li>contenido</li>
  </ul>
</div>
```
Una pasada. [Aquí te dejo un cheat sheet](http://docs.emmet.io/cheat-sheet/) para que veas todo lo que puedes hacer con Emmet.

## 4. Handlebars/Jade/Stylus...

Si como yo, usas lenguajes de plantillas o preprocesadores CSS o HTML, necesitarás este tipo de plugins para que el **editor te coloree la sintaxis adecuadamente**.

Por ejemplo, este código de Handlebars:

![handlebars](/images/2015-06/handlebars.png)

## 5. JavaScript & NodeJS Snippets

**Snippets para escribir código rápidamente**. Algunos ejemplos:

* **re**: require('package')
* **gi**: document.getElementById
* **cl**: console.log()
* **fe**: forEach
* **fn**: function Name(){}
* **afn**: function(){}
* **st**: setTimeout
* **us**: use strict

Puedes consultar todos los snippets [aquí](https://packagecontrol.io/packages/JavaScript%20%26%20NodeJS%20Snippets).

## 6. Color Highlighter

**Colorea los identificadores de colores en el código**. Una pijadita.

## 7. Modific

**Resalta las líneas que han cambiado desde el último commit**, si usas Git como sistema de control de versiones.

## 8. Seti_UI

Esto, **más que un plugin es un tema**. Y mola bastante. Deja una interfaz en la que puedes ver los tipos de archivo con un iconito identificando lo que son.

Mejor te lo enseño con una imagen:

![seti-ui](/images/2015-06/seti.png)

## 9. SideBarEnhancements

Añade **menús contextuales adicionales a la barra lateral** de Sublime. Por ejemplo:

* Find and Replace
* Copy file path
* Duplicate, rename, move...

## 10. SublimeLinter / SublimeLinter-jshint

Por último, **el plugin seguramente más importante**. El "linter", que se encarga de **resaltar los errores de nuestro JavaScript**.

Hay que instalar por separado los plugins SublimeLinter y SublimeLinter-jshint. Puedes instalar jslint también, si lo prefieres.

---

Es cierto que un editor no es un IDE, pero con plugins puede llegar a convertirse en algo muy parecido.

¿Crees que merece la pena invertir tiempo en aprender a utilizar un IDE para JavaScript cuando el ecosistema avanza tan deprisa? Yo a veces lo dudo.


Ya has visto cuáles son mis plugins favoritos y que me facilitan la vida enormemente. **¿Cuáles son los tuyos?**
