$r.Class("ListEvent").extends("Event")(function () {


    this.init = function (type) {

        this.super.init(type, false, true);
        this.renderer = renderer;
        this.index = index;

    };

})

$r.ListEvent.ITEM_RENDERER_CLICKED = "itemRendererClicked"