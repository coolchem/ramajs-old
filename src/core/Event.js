$r.Class("Event")(function () {

    var event = null; // The custom event that will be created

    if (document.createEvent) {
        event = document.createEvent("HTMLEvents");
    } else {
        event = document.createEventObject();
    }

    var _name,_bubbles,_cancellable;

    this.init = function (name, bubbles, cancellable) {

        _name = name;
        _bubbles = bubbles;
        _cancellable = cancellable;
    };

    this.getEventObject = function(){

        if (document.createEvent) {
            event.initEvent(_name, _bubbles, _cancellable);
        } else {
            event.eventType = _name;
        }

        event.eventName = _name;

        //setting all the public properties on the "this" to the event object
        for (var propName in this) {

            event[propName] = this[propName];
        }
        return event;

    }

} )
