title: 'Optimizar AngularJS: one-time bindings'
date: 2016-04-21 20:30:00
tags: ['angular']
---

![](/images/2016-04/t5yjwmlkrjbcjcwpxtxa.jpg)

AngularJS, y las **aplicaciones JavaScript** del lado del cliente en general **no se caracterizan por su ligereza en el consumo de memoria**. Una de las características que incrementa el consumo de la misma es el data-binding, es decir, la característica que hace que cuando cambien los datos en el modelo, la vista se actualice de forma automática.

**Una de las formas de optimizar AngularJS en cuanto a consumo de memoria es utilizar one-time bindings** (lo traduciría como enlaces de una sola vez, pero me suena fatal 😛 ).

## Ejemplo con *Two-way databinding*

En este código que te presento a continuación tienes una aplicación de ejemplo en la que se presentan 10000 variables de un Array, en un listado:

```html
<body ng-app="app" ng-controller="MainController as main">

  <ul>
    <li ng-repeat="el in main.data">{{ el.foo }}</li>
  </ul>


  <script src="https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.5.5/angular.js"></script>
  <script>
    var data = []
    for (var i = 0; i < 10000; i++) {
      data.push({foo: i})
    }

    angular
      .module('app', [])
      .controller('MainController', [function () {
        this.data = data
      }])
  </script>
</body>
```

Aquí, Angular está vigilando cambios por el propio array y cada uno de los 10000 elementos que estamos representando en la lista, dando como resultado **10001 watchers registrados por AngularJS** para vigilar los cambios en cada una de estas variables:

![Mogollón de watchers](/images/2016-04/two-way-watchers.PNG)

Y, por supuesto, **el consumo de memoria se incrementa**:

![Consumo de memoria con two-way binding](/images/2016-04/two-way.png)



## Ejemplo con *One-time databinding*

Si queremos optimizar AngularJS podemos utilizar el mecanismo de one-time binding en los lugares donde no necesitemos que se observen cambios en las variables. Esto se hace poniendo **dos puntos (::) delante de la variable** que en principio sería observada:

```html
<ul>
  <li ng-repeat="el in ::main.data">{{ ::el.foo }}</li>
</ul>
```

En este caso estaríamos reduciendo en 10001 el número de watchers, ya que Angular simplemente pone el valor una vez en la vista y luego se olvida aunque se produzcan actualizaciones.

![Sin watchers](/images/2016-04/one-time-watchers.PNG)


Esto, tiene su reflejo en el consumo de memoria:

![Consumo de memoria con one-time binding](/images/2016-04/one-time.png)


Aunque este ejemplo es un poco exagerado, como ves ahora **estamos consumiendo la mitad de memoria** en esa vista, ya que estamos simplemente representando valores que no se van a actualizar.

---

Si alguna vez te encuentras con con un consumo de memoria excesivo en tu aplicación o simplemente quieres optimizarla en cuanto a uso de memoria, es interesante que le eches un vistazo a los atributos de scope de Angular que están siendo vigilados y utilizar este mecanismo para eliminar estos watchers.
