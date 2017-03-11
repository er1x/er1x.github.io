title: Cómo instalar Node.js / io.js de la forma más fácil
date: 2015-05-20 20:43:00
tags: nodejs
---

![node.js / io.js](/images/2015-05/iojsnode.jpg)

Las primeras veces que tuve que instalar Node.js empecé utilizando la versión del repositorio de Ubuntu, la cual siempre estaba desactualizada con respecto a la actual. Esto en un entorno tan nuevo como Node es un problema.

Además para instalar paquetes globalmente siempre tenía que hacerlo con *sudo*, y esto no acababa de gustarme.

Más adelante opté por compilarlo cada vez que lo tenía que instalar, lo cual me dio mejor resultado: esta vez podía instalarlo donde me diera la gana y no tenía problemas con el *sudo*, pero esto también tenía un inconveniente: si quería sustituir la versión me tocaba andar moviendo cosas, bajarme el nuevo y compilarlo otra vez.

Hace poco descubrí una solución excelente a este problema: esta solución es **Node Version Manager (NVM)** y la puedes encontrar [aquí](https://github.com/creationix/nvm) .


**DISCLAIMER** : este procedimiento **sólo es válido para sistemas Linux y OSX**.

## Instalar NVM

En el caso de OSX deberás tener instalado Xcode. En Linux instala previamente los paquetes build-essential y libssl-dev con el gestor de paquetes de tu distribución.

En mi caso (Linux Mint), esto es:

```bash
apt-get install build-essential libssl-dev
```

Una vez satisfechos estos requisitos podemos realizar la instalación abriendo una terminal y pegando lo siguiente:

**NOTA**: el siguiente comando está puesto con la versión de NVM en el momento de escribir el post (v0.25.4). Para ver cuál es la última versión puedes ir a https://github.com/creationix/nvm/releases/latest.

```bash
curl https://raw.githubusercontent.com/creationix/nvm/v0.25.4/install.sh | bash
```

Caso de no tener el comando *curl* se puede usar *wget*:

```bash
wget -qO- https://raw.githubusercontent.com/creationix/nvm/v0.25.4/install.sh | bash
```


**El script instalará nvm y configurará la shell que utilicemos para reconocer el comando nvm**. Esto lo hace agregando unas cuantas líneas al fichero *.bashrc*, o como en mi caso a *.zshrc*, ya que uso un [ZSH vitaminado](https://github.com/robbyrussell/oh-my-zsh) como intérprete de comandos.

¡Listo! Ahora si escribes **nvm --version** en la terminal te debería aparecer algo como esto:

```bash
nvm --version
> 0.25.1
```

## Instalar Node.js / io.js con NVM

Tan sencillo como:

```bash
nvm install io.js
```

Para Node.js pon **node** en lugar de io.js. Esto en el futuro no será necesario, ya que afortunadamente, parece que ambos proyectos [volverán a fusionarse](https://github.com/iojs/io.js/issues/1664#issuecomment-101828384).

Puedes instalar varias versiones tanto de io.js como de Node.js. Para ver todas las versiones disponibles ejecuta:

```bash
nvm ls-remote
```

Por último, para utilizar la versión que quieras utiliza el comando *nvm use <versión>*. Por defecto si no pones versión cogerá la última.

```bash
nvm use iojs
 > Now using io.js v1.8.1
node -v
 > v1.8.1
```

Ten en cuenta que cuando abras una nueva terminal no tendrás disponible el comando *node* directamente, sino que tendrás que utilizar *nvm use* de nuevo.
Esto puedes solucionarlo, por ejemplo, agregando *nvm use iojs* al final de tu *.bashrc*. Así:

```bash
echo "nvm use iojs" >> ~/.bashrc
```

Otra opción es añadir $NVM_DIR/*version*/bin a tu path, pero yo prefiero nvm use porque me permite cambiar entre versiones.

## Actualizar la versión de Node.js / io.js

Actualizar la versión es tan sencillo como instalar la nueva:

```bash
nvm install iojs
```

¿Pero, y los paquetes globales que tuviéramos instalados en la anterior? Lo solucionamos con nvm reinstall-packages *version_anterior*:

```bash
nvm reinstall-packages iojs-v1.8.1
```

Para eliminar la versión vieja:

```bash
nvm uninstall iojs-v1.8.1
```

## Ventajas de utilizar NVM para instalar Node.js / io.js

Para mí este método es el más cómodo por varias razones:

- Permite instalar la última versión sin irte a la página y con un solo comando. Tan cómodo como un apt-get pero con versiones actuales.
- La instala en *~/.nvm/versions*, es decir, **en tu home**, con lo cual nunca tendrás problemas de permisos.
- Puedes tener varias versiones a la vez, y cambiar entre ellas con *nvm use*. Yo, por ejemplo utilizo esto para Ghost, que funciona con Node.js, mientras que mis desarrollos los hago con la última versiónde io.js, que tiene mejor soporte de ES6.


Y tú, ¿qué opinas de NVM? ¿Prefieres instalar Node de otra forma?
