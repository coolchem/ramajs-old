
$r.Class("ItemRenderer").extends("Component")(function () {

    this.skinClass = "$r.ItemRendererSkin";

    this.init = function(){

        this.super.init();
        this.setAttribute("comp", "ItemRenderer");
    }

    var _data;
    this.get("data", function(){
        return _data;
    })

    this.set("data", function(value){

        _data = value;
    })

});
