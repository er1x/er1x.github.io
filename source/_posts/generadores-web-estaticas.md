title: 'Generadores de sitios estáticos: un término medio entre un CMS y un desarrollo a medida'
date: 2015-12-12 12:42:42
tags: ['hexo', 'jekyll', 'docpad', 'cms']
---

![Generadores de Sitios Estáticos](/images/2015-12/ssg.jpg)

Es posible que si te pasas de vez en cuando por aquí hayas visto que no he publicado nada en un tiempo. La cosa es que **he estado migrando el contenido a un nuevo sistema "CMS"**. Este sistema es... **una web estática** :P


## ¿Y eso?

Pues... más que nada por aprender a usar una herramienta de este tipo, que es muy útil. Últimamente me he encontrado con que quería hacer algunos cambios y he llegado a la conclusión de que **lo más sencillo y rápido es utilizar páginas estáticas**. No a pelo, sino con un **generador de páginas estáticas**

He cambiado el sistema de blogging y cambiado el aspecto. Ahora:

* El tema que uso es más clásico, pero pienso que **se lee mejor y se puede buscar contenido más fácilmente**.

* **Es más rápido**.

* Escribo los posts directamente en mi editor de texto, [Atom](https://atom.io/). Y mi control de cambios es un **repositorio de GIT**.

* Cuando termino un post, genero un sitio estático y lo sincronizo directamente en el VPS. Sólo necesita un servidor estático sencillo. Ni PHP, ni Node.js ni nada. Un **[Nginx](https://www.nginx.com/) a pelo**.


## Generadores de Sitios estáticos: flexibilidad y rapidez

Un generador de sitios estáticos, como el que utilizo, que es [Hexo](https://hexo.io/), opera de la siguiente forma:

* Escribes tu contenido, normalmente en [Markdown](https://daringfireball.net/projects/markdown/).
* Generas las páginas con un comando, que a grandes rasgos lo que hace es incrustar las partes de ese Markdown dentro de una plantilla que hayas definido.

### Ventajas

* Respecto a un CMS: **en un CMS (Drupal, Wordpress etc.) tienes menos control sobre el código**. Un CMS está pensado para que pueda escribir un artículo todo el mundo. Sea técnico o no. No vas a poner a escribir a un periodista en Markdown, decirle que haga commit y luego genere el HTML.


* Respecto a un desarrollo completo: **desarrollar un CMS a medida es más costoso en tiempo y dinero**. Es lo más flexible, desde luego, pero no es una opción razonable para la mayoría de los casos.

En mi opinión **un generador de sitios estáticos es ideal para blogs de gente con conocimientos técnicos y webs de startups**. Precisamente porque son flexibles, baratos, sencillos y se benefician de gente que sabe desarrollo web. Y escalan estupendamente.


## Oye ¿Y qué pasa con Wordpress? ¡Lo usa todo el mundo!

![Wordress](/images/2015-12/wordpress.png)

### Wordpress tiene mil cosas que no necesito

Wordpress está pensado para hacer de todo. Tiene mil plugins e historias que lo hacen pesado y complejo. Yo solo necesito escribir posts, que tú los puedas leer rápido y bien, y poder cambiar de vez en cuando algo en el código sin volverme loco.

Evidentemente, si lo que quieres montar una plataforma más compleja que un blog o una web con contenidos sencillos, Wordpress es una plataforma estupenda para ello.

### Es más lento

Precisamente **por estar tan sobrecargado, Wordpress es más lento que un sitio estático**. El servidor tiene que interpretar el PHP, buscar el contenido en la base de datos, crear el HTML y devolverlo al usuario. Eso sin contar con el resto de plugins e historias que estén instaladas.

Este blog que lees ahora está hosteado en un VPS con 512MB de RAM. **Podría tener un pico de 10000 visitas y no pasaría nada**.

### Es más inseguro

Por estar tan extendido, Wordpress se ha convertido en el blanco de muchos ataques, y tienes que estar mucho más pendiente de la seguridad. Es como Windows: como lo usa todo el mundo, los malos están más interesados en atacarlo.

Un sitio estático no hay por dónde cogerlo. Es una página HTML ya generada que se le manda al usuario. Punto.


### Es más caro

Wordpress requiere de más recursos en el servidor, por tanto éste es más caro. Además, si tu página empieza a recibir muchas visitas, tendrías que contratar un plan de hosting con más recursos aún, lo cual sube más el precio.

---

## Generadores interesantes

### [Jekyll](http://jekyllrb.com/)

Es el generador por excelencia. Está hecho en Ruby. Yo no lo utilizo simplemente porque conozco más Node.js y me da más confianza poder modificar algo más fácilmente si me surge la necesidad.

### [Hexo](https://hexo.io/)

Es un generador especial para blogs. Este blog que lees está hecho con él. Es sencillo y rápido.

### [Metalsmith](http://www.metalsmith.io/)

Metalsmith es un generador hecho a base de plugins. Lee los ficheros de input y les va aplicando diferentes plugins hasta escribir el resultado en el directorio destino.

### [Docpad](http://docpad.org/)

Docpad es un generador de sitios flexible que puedes usar para hacer desde un blog hasta el sitio web de tu startup. Por defecto utiliza Coffeescript, aunque no es obligatorio que lo uses.

---
Creo que este tipo de generadores son una opción estupenda para muchos casos y que los CMS tradicionales cada vez más se están convirtiendo en un *overkill*.

¿Tú que opinas al respecto?
