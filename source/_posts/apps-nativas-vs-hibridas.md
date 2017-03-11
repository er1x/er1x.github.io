title: 'Apps Nativas vs Híbridas'
date: 2015-10-09 08:57:00
tags: ['mobile', 'cordova']
---
![Versus](/images/2015-10/405632849_0fd70c31b2_o.jpg)

Un debate frecuente a la hora de plantearse realizar un desarrollo móvil es elegir entre un desarrollo **nativo o híbrido**.

Como en todo, **depende de las necesidades y de los recursos disponibles**. En este post te voy a mostrar los factores que pienso que son los **pros y contras de ambas opciones**, y cómo plantearía yo la elección.

---

## Apps Nativas

![android-ios](/images/2015-10/android-ios.jpg)

Las aplicaciones nativas se realizan para una plataforma específica, **para correr directamente y sólo en esa plataforma**. Se usan lenguajes específicos y herramientas diferentes. Así por ejemplo tenemos:

* Objective C / Swift para aplicaciones IOS.
* Java para aplicaciones Android.

#### Pros

* Ofrecen **el mejor rendimiento**, al no haber capas intermedias.
* Al interactuar directamente con las APIs ofrecidas por cada fabricante, se tiene un **mayor control**.

#### Contras

* Requiere **conocer el lenguaje y entorno de desarrollo específicos** de cada plataforma.
* Por ser específicas, **no hay reusabilidad** de código entre plataformas.

---

## Apps Híbridas (tipo *WebView*)

![telerik-cordova](/images/2015-10/telerik-cordova.png)

Este tipo de aplicaciones son en realidad aplicaciones web. Están hechas con **HTML, CSS y JavaScript**.

Estas aplicaciones **se ejecutan en un navegador del dispositivo móvil** (de ahí que las denomine tipo *WebView*).

Los **ficheros HTML, CSS y JS se empaquetan en la aplicación** y se suben a la store de turno. Por tanto **se almacenan en el dispositivo tras la instalación, no en un servidor web remoto**.

Aquí tenemos sistemas como:

* [Apache Cordova](https://cordova.apache.org/): proporciona **APIs de JavaScript** para acceder a funciones del dispositivo, así como la posibilidad de compilar las apps a IOS, Android etc.

  Ten en cuenta que para compilar para IOS necesitarás un Mac con XCode, para Windows un Visual Studio... también existen herramientas como [Phonegap Build](https://build.phonegap.com/), que realizan este proceso de compilación en la nube.

* [Telerik Platform](http://www.telerik.com/appbuilder): es un [producto comercial](https://www.telerik.com/purchase/appbuilder) de Telerik, basado en Cordova. **Da más facilidades de desarrollo** al integrar herramientas de desarrollo, UI kits, testing, despliegue en stores... Lógicamente estas facilidades tienen un coste económico.

#### Pros

* Puedes **reutilizar tus habilidades y herramientas** de desarrollo web.
* El código es **"reutilizable entre plataformas"**. Y lo pongo entre comillas porque probablemente te toque retocar alguna cosilla. Pero en general sí, es reutilizable.

#### Contras

* **Rendimiento inferior** a una aplicación nativa. Esto es así, y punto :P. De todas formas, por mi experiencia para un buen número de aplicaciones es más que suficiente.

  Con [Ionic](/2015/06/tutorial-ionic-parte-uno/), por ejemplo, **una típica aplicación web CRUD en un dispositivo relativamente moderno va perfectamente**, y el usuario promedio no tiene la sensación de que es una aplicación web. Pero lógicamente no vas a hacer un Angry Birds en Cordova (no porque no se pueda).


* En Cordova hay que buscarse bastante la vida en cuanto a desarrollo, pero usas las herramientas que quieras.
* Telerik facilita las cosas, pero con un coste económico y de aprendizaje de su plataforma.

---

## Apps Híbridas (tipo *Cross-Compile*)

![xamarin-titanium](/images/2015-10/xamarin-titanium.png)

Este tipo de aplicaciones podrían considerarse híbridas, pero siguen un tipo de estrategia diferente a las de tipo *WebView*.

En ellas, se realiza una **transformación a partir de nuestro código a elementos UI nativos**, usando runtimes propios,  consiguiendo con ello un rendimiento similar a las aplicaciones nativas, pero sin llegar a programar en la plataforma específica. No es un cross-compile pero se acerca.

Aquí tenemos tecnologías como:

* [Xamarin](https://xamarin.com/): permite desarrollar para dispositivos móviles en C#.

* [Titanium Appcelerator](http://www.appcelerator.com/): se utiliza JavaScript, con un framework MVC llamado [Alloy](http://docs.appcelerator.com/titanium/3.0/#!/guide/Alloy_Quick_Start).

#### Pros

* Permiten reutilizar conocimientos en lenguajes concretos.
* Permiten **compartir código entre plataformas**, usando sólo un lenguaje. No totalmente, pues dependiendo del producto puede que no se puedan compartir elementos.


#### Contras

* Como en  Telerik, estas opciones tienen un coste económico y de aprendizaje.
* Hay menos libertad para desarrollar, ya que estás atado a las herramientas que te ofrece la plataforma.

---

## Vale, ¿y qué escojo?

En general **no hay opciones mejores que otras** y como todo, depende. Debes tener en cuenta los diferentes factores y lo importantes que son para ti. Factores como:

* Conocimiento del lenguaje de programación.
* Conocimiento de las herramientas.
* Rendimiento.
* Tiempo disponible para el desarrollo.
* Dinero.
* Necesidad de hacer UIs nativas.
* Reutilización de código.

Dale una importancia a cada uno de esos factores y escoge según el resultado.

Así, por ejemplo si solo te preocupa el rendimiento y vas sobrado de todo lo demás, deberías escoger desarrollos nativos.

Si quieres hacer una aplicación sencilla, no tienes mucho presupuesto y quieres portabilidad entre plataformas, Cordova es una buena opción.

---

¿Y tú?

¿Has tenido experiencia con un desarrollo híbrido?

¿Repetirías o prefieres hacer aplicaciones nativas? ¿Qué opinas al respecto?



---
Imagen del post:  [Good versus Evil](https://www.flickr.com/photos/helico/405632849/) by [kosmolaut](https://www.flickr.com/photos/69444890@N00/)
