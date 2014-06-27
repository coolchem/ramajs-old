$r.Class("CollectionEvent").extends("Event")(function () {


    this.init = function (type, bubbles,cancelable,kind, location,
                                                       oldLocation, items) {

    $r.setupDefaultsForArguments([bubbles,cancelable,kind, location,
        oldLocation, items], [false, false,null,-1,-1,null]);

        this.super.init(type, bubbles, cancelable);
    this.kind = kind;
    this.location = location;
    this.oldLocation = oldLocation;
    this.items = items ? items : [];

    };

})

$r.CollectionEvent.COLLECTION_CHANGE = "collectionChange";