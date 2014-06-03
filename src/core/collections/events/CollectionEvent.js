$r.Class("CollectionEvent").extends("Event")(function () {



    this.init = function (type, bubbles,cancelable,kind, location,
                                     oldLocation, items) {

        $r.setupDefaultsForArguments([bubbles,cancelable,kind, location,
            oldLocation, items], [false, false,null,-1,-1,null]);

        this.super.init(type, bubbles, cancelable);

        this.event.kind = kind;
        this.event.location = location;
        this.event.oldLocation = oldLocation;
        this.event.items = items ? items : [];

    };

})

$r.CollectionEvent.COLLECTION_CHANGE = "collectionChange";