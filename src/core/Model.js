$r.Class("Model")(function () {

    $r.Observable(this);

    this.init = function (simpleObject) {

      if(simpleObject !== null && simpleObject !== undefined)
      {
         for(var propName in simpleObject)
         {
             if(typeof simpleObject[propName] !== "function")
             {
                 this[propName] = simpleObject[propName];
             }
         }
      }

    };

});
