$r.Class("Model")(function () {

    var bindedPropertiesDictionary = {};
    var observedPropertiesDictionary = {};

    var handleBindingsAndObservers = this.bind(handleBindingsAndObserversFn);

    this.init = function (simpleObject) {

      if(simpleObject !== null && simpleObject !== undefined)
      {

      }

    };

    this.bindProperty = function(propertyName){

        createGettersAndSetters(propertyName,this);
        var returnObj = {}

        returnObj.with = function (contextPropertyName, context) {

            if(!bindedPropertiesDictionary[propertyName])
            {
                bindedPropertiesDictionary[propertyName] = new $r.Dictionary();
                bindedPropertiesDictionary[propertyName].put(context,new $r.ArrayList([contextPropertyName]));
            }
            else
            {
                var propArray = bindedPropertiesDictionary[propertyName].get(context);
                if(!propArray){
                    bindedPropertiesDictionary[propertyName].put(context,new $r.ArrayList([contextPropertyName]));
                }
                else
                {
                   if(propArray.getItemIndex(contextPropertyName) === -1)
                   {
                       propArray.addItem(contextPropertyName);
                   }
                }
            }

        }

        return returnObj;

    }



    this.observe = function(propertyName, handler){

      createGettersAndSetters(propertyName,this);
      if(!observedPropertiesDictionary[propertyName])
      {
          observedPropertiesDictionary[propertyName] = new $r.ArrayList();

      }

      if(observedPropertiesDictionary[propertyName].getItemIndex(handler) === -1)
      {
          observedPropertiesDictionary[propertyName].addItem(handler);
      }
    }

    function createGettersAndSetters(propertyName,context){

        var propertyDescriptor = Object.getOwnPropertyDescriptor(context, propertyName);
        var propertyValue = context[propertyName];
        if (propertyDescriptor === undefined || !(propertyDescriptor.hasOwnProperty("get") && propertyDescriptor.hasOwnProperty("set")))
        {

            Object.defineProperty(context, propertyName,
                    {   set:setter,
                        get:getter,
                        enumerable:true,
                        configurable:true
                    });


        }

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

    function handleBindingsAndObserversFn(propertyName){

      if(observedPropertiesDictionary[propertyName] && observedPropertiesDictionary[propertyName].length > 0)
      {
          observedPropertiesDictionary[propertyName].forEach(function(item){
            item();
          })
      }

        if(bindedPropertiesDictionary[propertyName])
        {
            bindedPropertiesDictionary[propertyName].forEach(function(item){
                item.value.forEach(function(prop){

                    item.key[prop] = this[propertyName];

                }, this)
            },this)
        }
    }

});
