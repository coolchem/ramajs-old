$r.Class("Model").extends("EventDispatcher")(function () {

    var bindedPropertiesDictionary = {};
    var observedPropertiesDictionary = {};

    this.init = function (simpleObject) {

      this.super.init();
      if(simpleObject !== null && simpleObject !== undefined)
      {

      }

    };

    this.bindProperty = function(propertyName){

        var returnObj = {}

        returnObj.with = function (propertyName, context) {

        }

        return returnObj;

    }



    this.observe = function(propertyName, handler){

      if(!observedPropertiesDictionary[propertyName])
      {
          observedPropertiesDictionary[propertyName] = new $r.ArrayList();
          createGettersAndSetters(propertyName,this);
      }

      if(observedPropertiesDictionary[propertyName].getItemIndex(handler) === -1)
      {
          observedPropertiesDictionary[propertyName].addItem(handler);
      }
    }

    function createGettersAndSetters(propertyName,context){

        var propertyValue = context[propertyName];

        Object.defineProperty(context, propertyName,
                {   set:setter,
                    get:getter,
                    enumerable:true,
                    configurable:true
                });

        function getter(){

           return propertyValue;
        }

        function setter(value){

            if(value != propertyValue)
            {
                propertyValue = value;
                handleBindingsAndObservers(propertyName);
            }


        }

    }

    function handleBindingsAndObservers(propertyName){

      if(observedPropertiesDictionary[propertyName] && observedPropertiesDictionary[propertyName].length > 0)
      {
          observedPropertiesDictionary[propertyName].forEach(function(item){
            item();
          })
      }
    }

})
