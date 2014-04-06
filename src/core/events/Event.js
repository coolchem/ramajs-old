$r("Event")(function () {

    this.eventObject = null; // The custom event that will be created

    if (document.createEvent) {
        this.eventObject = document.createEvent("HTMLEvents");
    } else {
        this.eventObject = document.createEventObject();
    }

    this.$$super = function (name, bubbles, cancellable) {

        if (document.createEvent) {
            this.eventObject.initEvent(name, bubbles, cancellable);
        } else {
            this.eventObject.eventType = name;
        }

        this.eventObject.eventName = name;
    };

});
