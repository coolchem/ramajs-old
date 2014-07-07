$r.Class("DataGroupEvent").extends("Event")(function () {


    this.init = function (type, renderer, index) {

        this.super.init(type, false, true);
        this.renderer = renderer;
        this.index = index;

    };

})

$r.DataGroupEvent.ITEM_RENDERER_ADDED = "itemRendererAdded";
$r.DataGroupEvent.ITEM_RENDERER_REMOVED = "itemRendererRemoved";