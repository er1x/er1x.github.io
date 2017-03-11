title: '5 bibliotecas para crear utilidades de línea de comandos en Node.js'
date: 2015-08-10 18:13:00
tags: ['nodejs']
---
![Node.js Scripting](/images/2015-08/node-command-line.png)

Esta semana toca un post cortito, pues ando liado con varios proyectos y crear *tochoposts* de tutoriales completos es algo que lleva muuuucho tiempo :)

Bien, el caso es que muchas veces necesitamos crear pequeños scripts o programas de línea de comandos. Node es más que apto para eso, aunque a primera vista pudiera parecer lo contrario, ya tiene un ecosistema de paquetes sin igual.

Aquí te van unas bibliotecas que pueden resultarte útil para ello:

## 1. [Nomnom](https://www.npmjs.com/package/nomnom)

*Parseador* de parámetros. En mi opinión más sencillo que [minimist](https://www.npmjs.com/package/minimist), que es la más conocida.

## 2. [Chalk](https://www.npmjs.com/package/chalk)

¡Colorines para la terminal!

![Chalk](/images/2015-08/screenshot.png)

## 3. [node-progress](https://www.npmjs.com/package/progress)

Barra de progreso en ascii sencilla y fácil de usar.

## 4. [columnify](https://www.npmjs.com/package/columnify)

Le pasas un objeto y te lo imprime bien tabuladito en columnas :)

## 5. [request](https://www.npmjs.com/package/request)

No es realmente un paquete pensado sólo para esto, pero raro es el *script* que hago que no necesita realizar una petición HTTP para buscar algún recurso.

## Bonus: tutorial ultrarápido de utilidades de línea comandos

Una chuletilla rápida:

1- *npm init*: crear el package.json con los datos de la aplicación.
2- En el fichero fuente de entrada al programa, comenzar con **#!/usr/bin/env node**
3- Hacer el script :)
4- Añadir la siguiente sección al package.json:

```javascript
"bin": {
  "comando": "entrada.js"
}
```
5- *Opcional*: ya tienes el script listo. Si quieres utilizarlo sin tener que subirlo al registro npm ejecuta **npm link** desde el raíz del proyecto, para *linkar* paquete. Esto creará un enlace al "binario" en tu instalación de node, así como al módulo.

No lo instala realmente, así que si te cepillas la carpeta no funcionará.

---

Un post cortito, pero espero que útil. Cuando vaya sacando tiempo completaré la serie de [Aurelia](/2015/07/aurelia-1-mvvm-e-inyeccion-dependencias/).

Y por supuesto, **si tú conoces algún paquete útil** para este tipo de cosas no dudes en **dejar un comentario** y lo añadiré al post.

¡Pásalo bien!
