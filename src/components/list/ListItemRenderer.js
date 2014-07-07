
$r.Class("ListItemRenderer").extends("ItemRenderer")(function () {

    this.init = function(){
        this.super.init();
        this[0] = document.createElement("li");

    }

});
