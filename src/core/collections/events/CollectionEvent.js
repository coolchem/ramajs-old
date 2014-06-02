$r.CollectionEvent = extend("Event", function () {



    this.init = function (type, bubbles,cancelable,kind, location,
                                     oldLocation, items) {

        $r.setupDefaultsForArguments([bubbles,cancelable,kind, location,
            oldLocation, items], [false, false,null,-1,-1,null]);

        this.super.init(type, bubbles, cancelable);

        this.eventObject.kind = kind;
        this.eventObject.location = location;
        this.eventObject.oldLocation = oldLocation;
        this.eventObject.items = items ? items : [];

    };

})

$r.CollectionEvent.COLLECTION_CHANGE = "collectionChange";