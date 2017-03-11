title: 'Aurelia series 2: Router'
date: 2015-08-3 20:00:00
tags: ['frontend', 'aurelia']
---
![Aurelia Framework](/images/2015-08/splash.png)

Con el calor que hace últimamente hay pocas ganas de ponerse a escribir un post :P, pero quiero continuar con el blog y de momento tenemos para rato con nuestra serie de tutoriales de **[Aurelia](http://aurelia.io/)** :)

Si recuerdas el [tutorial anterior](/2015/07/aurelia-1-mvvm-e-inyeccion-dependencias/), lo habíamos dejado en que teníamos una vista en la que presentábamos un listado de películas, tal que así:

![listado](/images/2015-08/listado.png)

**En este post vamos a ver cómo utilizar el [router de Aurelia](https://github.com/aurelia/router)**, con el objetivo de tener varias "pantallas" en la aplicación, y pasar de una a otra mediante un menú.


**NOTA**: me han preguntado si Aurelia está listo para usar en producción. La respuesta es **NO**. Peeero, está lo suficientemente avanzado para poder ir echándole un vistazo, aprender cómo funciona y decidir si te gusta.

Cómo sabes, en JavaScript todo va a una velocidad de vértigo y no está de más adelantar trabajo :P

----
Bueno, vamos a meternos en harina.

## Un poco de orden

Antes de empezar a hablar del routing, voy a hacer un par de cosas en la aplicación:

* La primera es añadir [Bootstrap](http://getbootstrap.com/), ya que ahora mismo la aplicación es más fea que un pie, pero como el tutorial no va de escribir CSS tampoco quiero romperme la cabeza con los estilos.
* Después vamos a reestructurar la aplicación y prepararla para añadir el router.

### Bootstrap y barra de navegación

Añadir un framework CSS es muy tonto, y estoy seguro de que con todo lo que hemos visto de jspm ya sabrás hacerlo tú mismo, aun así ahí te va:

![instalar bootstrap](/images/2015-08/bootstrap-install.png)

Ahora no tenemos más que agregar el CSS correspondiente al index.html (como toque friki adicional, le he puesto un [wallpaper chulo](http://alpha.wallhaven.cc/wallpaper/225285) que he encontrado como fondo):

![agregando css](/images/2015-08/adding-css.png)

Ahora toca adecentar un poco la plantilla principal y añadir una pequeña barra de navegación:

![app-html](/images/2015-08/app-html-1.png)

Con estos pequeños retoques hemos pegado un buen cambiazo :)

![aspecto con bootstrap](/images/2015-08/aspecto-bootstrap.png)

### Reorganizando el código

Como es natural, a la hora de ir engordando la aplicación surgirán nuevas vistas, *viewmodels* y más código que no deberíamos tener "tirado" directamente en la carpeta public, que es como lo tenemos ahora.

En este sentido, para organizar esto se suelen plantear dos alternativas diferentes:

* **Organizar por tipo de componente**: es decir, crear una carpeta para las vistas, otra para los modelos etc. Si por ejemplo has usado Angular, sería el equivalente a crear una carpeta para las directivas, controladores, plantillas...

* **Organizar por funcionalidad**: en este caso se crea una carpeta por funcionalidad presente en la aplicación. Por ejemplo en este caso podríamos crear una carpeta "films" y agrupar ahí dentro todo lo relativo a las pelis (vistas, modelos y demás). Si más adelante queremos agregar una sección "personajes", podemos crear una carpeta específica para todo ese código.

En el caso de Aurelia y de esta aplicación, me parece más natural la segunda alternativa, así que vamos a mover toda la funcionalidad relativa a las pelis a una carpeta llamada *films*.

De modo que tendríamos algo como esto:

![estructura](/images/2015-08/folders.png)

Así:

* En films tenemos vista y *viewmodel* del listado de pelis, junto con el modelo. Cambian los nombres, pero hacen lo que antes se hacía todo en *app*.
* El fichero *app*, junto con su vista, se encargarán de presentar y configurar el *routing*.

![ficheros para films](/images/2015-08/films.png)

## Añadiendo el Router

### Qué es el *routing*

El ***routing* o enrutado consiste en el mecanismo por el cual, en base al contenido de la barra de navegación, la aplicación presenta una vista diferente**. Es decir, https://jsjutsu.com/ no presenta lo mismo que https://jsjutsu.com/acerca-de/, pero esto es enrutado del lado del servidor.

Aurelia, como muchos otros frameworks JavaScript, permiten realizar **enrutado del lado del cliente**. Es decir, que **no se realice una petición al servidor. Por ello es mucho más rápido**.

Además es una herramienta que ayuda a reducir complejidad, aislando diferentes funcionalidades en códigos independientes.

### Incorporando el *router* de Aurelia

Para agregar el router de Aurelia el viewmodel que contenga el router será responsable de **exportar una función *configureRouter***, en el que se definen las rutas de la aplicación:

![app.js](/images/2015-08/app-js.png)

Como ves, se configura cada ruta como un objeto de un array, en el cual:

* Se definen las rutas en las que se activará.
* El viewmodel correspondiente, como moduleId.
* Un título y un flag *nav*, que servirá para poderlo incluir fácilmente en la barra de navegación.

Por otra parte necesitamos una vista, que debe incluir la **etiqueta *router-view*** en el lugar donde queramos vayan apareciendo las vistas, **así como la barra de navegación**. En este caso:

![app.html](/images/2015-08/app-html.png)

Aquí:

* Al exponer el objeto router, podemos iterar por él con *repeat.for*. *router.navigation* expone las rutas configuradas con el flag nav = true;
* En cada iteración, mostramos un enlace con el título.

Así nos queda lo siguiente (fíjate cómo cambia la ruta en la barra de navegación):

![ruta1](/images/2015-08/ruta1.png)
![ruta2](/images/2015-08/ruta2.png)

---

En este post hemos visto el concepto de **routing del lado del cliente** y  **cómo utilizar el router de Aurelia**. Como ves, es muy sencillo ir escalando la aplicación de forma ordenada, utilizando rutas.

Te recuerdo que tienes todo el **[código en Github](https://github.com/er1x/aur-tuto)**, bajo el tag tuto2.

Y... cualquier duda, comentario, aportación... comentarios abajo :D
