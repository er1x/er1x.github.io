title: 'Cómo tunear tu terminal para ser más productivo'
date: 2015-08-21 12:11:00
tags: ['herramientas', 'terminal']
---
![Keyboard](/images/2015-08/keyboard-2.jpg)

El **emulador de terminal es una herramienta fundamental para cualquier desarrollador**.

En este post te voy a explicar **qué es lo que utilizo y cómo lo tengo configurado**. Los pasos que voy a reproducir son los que uso en mi máquina de desarrollo (Linux Mint 17.2 Rafaela), pero deberían servirte para todo tipo de Linux.

Si usas OSX imagino que poco cambiará la cosa, salvo el tema del emulador. La mayoría de gente que veo usa [iTerm2](https://www.iterm2.com/), que supongo que será lo mejor.

## Emulador de terminal: *Terminator*

**Terminator** es un emulador de terminal estupendo que creo mucho mejor a la terminal por defecto de Gnome u otros porque **puedes abrir terminales múltiples y escribir en todas ellas simultáneamente**.

Ésta característica lo hace muy útil si tienes que ejecutar la misma acción en varias máquinas.

![terminator](/images/2015-08/terminal1.png)


Puedes instalarlo directamente desde el gestor de paquetes de tu distribución.


### Atajos en Terminator

Para ser ágil con Terminator te recomiendo que te acostumbres a estos atajos:

* **Abrir nueva terminal a la derecha**: Ctrl + Shift + E
* **Abrir nueva terminal abajo**: Ctrl + Shift + O
* **Cerrar una terminal**: Ctrl + D
* **Desplazarse entre terminales**: Alt + *flechas de dirección*
* **Activar/Desactivar retransmisión**: yo estos los tengo mapeados en las teclas F1 y F2. Para ello haz click derecho / Preferencias / Keybindings y asigna una tecla a broadcast-all y broadcast-off. También puedes hacer grupos de retransmisión (yo no los uso).

### Colores

Los esquemas de colores que vienen con Terminator por defecto no me gustan mucho, así que yo utilizo **[estos temas](https://github.com/mbadolato/iTerm2-Color-Schemes)**.

Para instalar un tema, debes hacer lo siguiente:

1- Elige un tema :D
2- Vete al repo de github [en la carpeta terminator](https://github.com/mbadolato/iTerm2-Color-Schemes/tree/master/terminator) y copia el contenido del fichero con el tema que quieras.
3- Edita el fichero ~/.config/terminator/config y añade el tema copiado a la sección [profiles].
![temas](/images/2015-08/themes.png)
4- Establece el tema por defecto con click derecho / Preferencias / Layouts y creando un tema nuevo con el profile del tema que quieras.

![profile](/images/2015-08/profile.png)

**Bonus**: para que el tema se mantenga cuando dividas la terminal añade **always\_split\_with\_profile = True** en la sección [global config] de la configuración de terminator.

## Shell: *ZSH*

Otra cosa que hago siempre es establecer ZSH como intérprete de comandos en lugar de BASH. ¿Por qué?

* Completa rutas y comandos pulsando *tab*.
* Historial de comandos parciales con flechas de dirección.
* *Globbing* extendido (puedes hacer cosas como *ls path/\*\*/\*.js* ).
* Puedes cambiar entre directorios sin hacer cd.
* Puedes usar *oh my zsh*, que tiene alias predefinidos para comandos comunes (pej: *l* en lugar de *ls -lah*).

Para instalar ZSH puedes hacerlo desde el gestor de paquetes y para establecer ZSH como tu intérprete por defecto basta con ejecutar:

```bash
chsh -s /bin/zsh
```

### Oh My Zsh

**[Oh My Zsh](https://github.com/robbyrussell/oh-my-zsh)** es un conjunto de configuraciones para ZSH.

Instalarlo es tan sencillo como hacer:

```bash
sh -c "$(curl -fsSL https://raw.github.com/robbyrussell/oh-my-zsh/master/tools/install.sh)"
```

Estas configuraciones te permiten:

* Cambiar el prompt y un tema asociado (puedes verlos [aquí](https://github.com/robbyrussell/oh-my-zsh/wiki/themes)).
* Activar plugins para git, adb, virtualenv... (una lista [aquí](https://github.com/robbyrussell/oh-my-zsh/tree/master/plugins)).

Para activar/desactivar temas y plugins debes editar el fichero **~/.zshrc**.

## SPF13VIM

VIM no es mi editor de cabecera pero sí que lo utilizo cuando tengo que escribir algo rápidamente, o cuando tengo que editar algo en un servidor por SSH.

Para hacerlo un poco más potente sin tener que romperme la cabeza utilizo [SPF13](http://vim.spf13.com/), que puedes instalar de forma sencilla con:

```bash
curl http://j.mp/spf13-vim3 -L -o - | sh
```

![spf13vim](/images/2015-08/vim.png)


Para personalizar spf13vim puedes editar **~/.vimrc.local**, por ejemplo el mío es así:

```bash
colorscheme jellybeans
set smartindent
set tabstop=2
set shiftwidth=2
set expandtab
```


## NVM

Como trabajo con Node.js, lo instalo de la forma más práctica, con NVM (*Node Version Manager*). Ya **[escribí un post](/2015/05/instalar-nodejs/)** sobre esta forma de instalar Node.js, pero si necesitas un comando rápido :)

```bash
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.26.1/install.sh | bash
```

----

Éstas son las herramientas que yo uso... pero estoy seguro de que no son las únicas. Así que si quieres aportar algo eres más que bienvenido.

Ale, a pasarlo bien :D

---


Imagen del post: [John Ward](http://www.flickr.com/photos/33624275@N00/) | [CC](http://creativecommons.org/licenses/by/2.0/)
