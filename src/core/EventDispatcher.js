$r.Class("EventDispatcher")(function () {

    var eventListenersDictionary = {};

    this.init = function () {

        this[0] = document.createElement("event-dispatcher");
    };

    this.addEventListener = function (type, listener, useCapture) {

        this[0].addEventListener(type,listener,useCapture);

        if(eventListenersDictionary[type] === undefined || eventListenersDictionary[type] === null)
        {
            eventListenersDictionary[type] = [];
        }

        listener.useCapture = useCapture;

        eventListenersDictionary[type].push(listener);
    };

    this.removeEventListener = function (type, listener, useCapture) {
        this[0].removeEventListener(type, listener,useCapture);

        if(eventListenersDictionary[type] !== undefined && eventListenersDictionary[type] !== null)
        {
            var index = $r.arrayUtil.getItemIndex(listener,eventListenersDictionary[type])
            if(index > -1)
            {
                eventListenersDictionary[type].splice(index, 1)
            }

            if(eventListenersDictionary[type].length <= 0)
            {
                eventListenersDictionary[type] = null;
            }

        }
    };

    this.dispatchEvent = function (event) {

        var eventObject = event;
        if(event.getEventObject)
        {
            eventObject = event.getEventObject();
        }
        if (document.createEvent) {
            this[0].dispatchEvent(eventObject);
        } else {
            this[0].fireEvent("on" + eventObject.eventType, eventObject);
        }

        return !eventObject.defaultPrevented;

    };

    this.hasEventListener = function(type){

        if(eventListenersDictionary[type] !== undefined && eventListenersDictionary[type] !== null)
        {
            return true;
        }

        return false;

    }

    this.removeAllEventListeners = function(){

        for(var type in eventListenersDictionary)
        {
            if(eventListenersDictionary[type] !== null)
            {
                for (var i = eventListenersDictionary[type].length - 1; i >= 0; i -= 1) {

                    var item = eventListenersDictionary[type][i];
                    this.removeEventListener[type, item, item.useCapture];

                }
            }
        }
    }

});



