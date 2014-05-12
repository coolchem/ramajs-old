$r.Class("State").extends($r.Class("EventDispatcher"))(function () {

    var _stateManagedComponents = [];
    var _name;
    this.get('name', function(){

      return _name;
    });

    var _stateGroups;
    this.get('stateGroups', function(){

        return _stateGroups;
    });

    this.State = function(name,stateGroups){
        this.super();
        _name = name;
        _stateGroups = stateGroups;
    }

    this.registerComponents = function(componentsArray){

        for(var i = 0; i<componentsArray.length; i++)
        {
            var componentItem = componentsArray[i];
            _stateManagedComponents.push(componentItem);
        }

    }

    this.apply = function(){

        for(var i = 0; i<_stateManagedComponents.length; i++)
        {
            var componentItem = _stateManagedComponents[i];

            componentItem.component[componentItem.propertyName] = componentItem.value;
        }

    }

});
