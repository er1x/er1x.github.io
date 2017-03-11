title: Cómo generar currículums multiformato desde un JSON
tags:
  - herramientas
  - nodejs
date: 2016-01-25 07:00:00
---
![HackMyResume](/images/2016-01/hackmyresume.jpg)


De vez en cuando toca **actualizar el *Currículum Vitae*... y ¡es un coñazo!**
Hay sitios en los que te piden un PDF... un Word... o a lo mejor prefieres tenerlo colgado en tu propia web en formato HTML.

¿No molaría tener tu CV en un **formato práctico** y **exportarlo al formato de salida que quieres con un comando**?

¿Y cambiar de estilo fácilmente tambien?

¡Pues puedes hacerlo con **[HackMyResume](https://github.com/hacksalot/HackMyResume)**!

## Cómo es un currículum vitae en formato *JSON Resume*

El **formato que usaremos será [JSON-Resume](https://jsonresume.org/)**, que los desarrolladores JavaScript conocemos bien.

Un currículum en JSON es algo tal que así:

```json
{
  "basics": {
    "name": "Geralt",
    "label": "Brujo",
    "picture": "",
    "email": "geralt@kaermorhen.com",
    "phone": "(555) 111-5432",
    "website": "http://geraltthewitcher.wyz",
    "summary": "Cazador de monstruos desde hace un porrón de años",
    "location": {
      "address": "1 Kaer Morhen",
      "postalCode": "KM 11111",
      "city": "Kaer Morhen",
      "countryCode": "KA",
      "region": "Kaedwen"
    },
    "profiles": [{
      "network": "Twitter",
      "username": "g3r4lt",
      "url": "http://twitter.com/g3r4lt"
    }]
  },
  "work": [{
    "position": "Freelance",
    "startDate": "1900-01-01",
    "endDate": "2014-01-01",
    "summary": "Siempre he trabajado en lo mismo!"
  }],
  "education": [{
    "institution": "Escuela de brujos de Kaer Morhen",
    "area": "Alquimia",
    "studyType": "Bachelor",
    "startDate": "1890-01-01",
    "endDate": "1900-01-01",
    "gpa": "4.0",
    "courses": [
      "ALC101 - Alquimia Básica"
    ]
  }],
  "skills": [{
    "name": "Alquimia",
    "level": "Maestro",
    "keywords": [
      "alquimia",
      "pociones"
    ]
  }, {
    "name": "Esgrima",
    "level": "Maestro",
    "keywords": [
      "espadas",
      "plata",
      "acero"
    ]
  }],
  "languages": [{
    "language": "Común",
    "fluency": "Nativo"
  }],
  "interests": [{
    "name": "Música",
    "keywords": [
      "Leoncilla de Cintra"
    ]
  }],
  "references": [{
    "name": "Vesemir",
    "reference": "No escucha lo que le dicen, es un cabezota"
  },{
    "name": "Jaskier",
    "reference": "Es un buen tío, pero no sabe disfrutar de una buena--------"
  }]
}
```

## Oki. Ya tengo uno, ¿y ahora? *Enter [HackMyResume](https://github.com/hacksalot/HackMyResume)*

Bueeeno, nos ha costado un poco pero ya tenemos nuestro CV en JSON. Ahora **vamos a utilizar HackMyResume para generar algo legible**.


### Instalando HackMyResume

Sólo necesitas [Node.js](/2015/05/instalar-nodejs/) y:

```bash
npm install hackmyresume -g
```

¡Listo!

### Generar un CV en PDF

Ahora a **generar un CV a partir de un JSON, por ejemplo en PDF**:

```bash
$ hackmyresume build cv.json to cv.pdf

*** HackMyResume v1.5.2 ***
Reading resume: cv.json
Applying MODERN theme (5 formats)
Generating PDF  resume: cv.pdf
The MODERN theme says: "To get colored skill
progress bars, make sure your resume includes a `level`
element for each skill!"
```

Por defecto, quedan tal que así:

![Ejemplo 1](/images/2016-01/cv1.png)

## Cambiando el aspecto

El formato por defecto no está mal, pero la gracia de esto es poder elegir entre un montón de temas fácilmente.

Con un poco de curro, puedes hacer cosas tan chulas como ésta:

![Formato CV guay](https://camo.githubusercontent.com/00afbd9815d114297d10c97383a31fa2f957b010/687474703a2f2f666c75656e746465736b2e636f6d2f696d672f666c75656e7463765f6465736b746f705f616c7068612e706e67)


### Temas JSON Resume

Si, como yo, te conformas con algo más modesto y que lleve menos curro, puedes instalar temas ya hechos.

Puedes encontrar **mogollón de temas para HackMyResume en [NPM](https://www.npmjs.com), buscando por *jsonresume-theme...***

![Buscar temas](/images/2016-01/json-resume-find.png)

Los instalas vía NPM, y después los usas con -t:

```bash
$ npm i jsonresume-theme-contempo
$ hackmyresume build cv.json to cv.pdf -t node_modules/json-resume-contempo
```

![Ejemplo 2](/images/2016-01/cv2.png)

La mayoría están para formato HTML:

```bash
$ npm i jsonresume-theme-eloquent
$ hackmyresume build cv.json to cv.html -t node_modules/json-resume-eloquent
```

![Ejemplo 3](/images/2016-01/cv3.png)

---

¿Qué te parece el formato JSON-Resume y HackMyResume?

Yo creo que es una opción interesante para **currículums de desarrolladores web**. Es cómodo mantener un fichero JSON y si te curras un poco un tema en HTML te puede quedar chulo. Y a la vez que demuestras tus conocimientos de maquetación creas un currículum chulo.

¿Qué opinas?
