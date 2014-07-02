$r.Class("PropertySetter")(function(){

    this.target = null;
    this.name = null;
    this.value;

    var oldValue;


    this.init = function(target, name, value)
    {
        this.target = target;
        this.name = name;
        this.value = value;

    }

    this.initialize = function(){


    }

    this.apply = function(){

        if(this.target)
        {
            oldValue = this.target[this.name];

           this.target[this.name] = this.value;
        }

    }

    this.remove = function(){

        if(this.target)
        {
            this.target[this.name] = oldValue;
        }

    }


})
