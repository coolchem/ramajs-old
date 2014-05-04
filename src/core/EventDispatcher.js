$r.Class("EventDispatcher")(function () {

    this.EventDispatcher = function () {

        this[0] = document.createElement("event-dispatcher");
    };

    this.addEventListener = function (type, listener, useCapture) {
        this[0].addEventListener.apply(this[0], arguments);
    };

    this.removeEventListener = function (type, listener, useCapture) {
        this[0].removeEventListener.apply(this[0], arguments);
    };

    this.dispatchEvent = function (event) {

        if (document.createEvent) {
            this[0].dispatchEvent(event);
        } else {
            this[0].fireEvent("on" + event.eventType, event);
        }

    };

});


