$r.Class("Event")(function (name, bubbles, cancellable) {

    this.event = null; // The custom event that will be created

    if (document.createEvent) {
        this.event = document.createEvent("HTMLEvents");
    } else {
        this.event = document.createEventObject();
    }

    this.init = function (name, bubbles, cancellable) {

        if (document.createEvent) {
            this.event.initEvent(name, bubbles, cancellable);
        } else {
            this.event.eventType = name;
        }

        this.event.eventName = name;
    };

} )
