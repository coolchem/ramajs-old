
$r.Class("State").extends("EventDispatcher")(function () {

    this.propertySetters = [];
    var _name;

    var _initialized = false;

    this.get('name', function(){

        return _name;
    });

    var _stateGroups;
    this.get('stateGroups', function(){

        return _stateGroups;
    });

    this.init = function(name,stateGroups){
        this.super.init();
        _name = name;
        _stateGroups = stateGroups;
    }

    this.initialize = function(){

        if(!_initialized)
        {

            _initialized = true;
        }

    }

    this.apply = function(){

        for(var i = 0; i< this.propertySetters.length; i++)
        {
            var componentItem = this.propertySetters[i];

            componentItem.component[componentItem.propertyName] = componentItem.value;
        }

    }

})
