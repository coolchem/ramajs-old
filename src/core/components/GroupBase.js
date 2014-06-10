$r.Class("GroupBase").extends("ComponentBase")(function () {


    var _layout = null;

    this.get("layout",function(){

        return _layout;
    });

    this.set("layout",function(value){

        if(value)
        {
            _layout = value;
        }

    });

    this.init = function(){
        this.super.init();
        this.setAttribute("comp", "GroupBase");

    }

    this.$$updateDisplay = function(){

       if(_layout)
       {
           _layout.target = this;
           _layout.updateLayout();
       }
    }

})
