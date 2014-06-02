$r.EventDispatcher = extend("Class",function () {

    var eventListenersDictionary = {};

    this.init = function () {

        this[0] = document.createElement("event-dispatcher");
    };

    this.addEventListener = function (type, listener, useCapture) {
        if($r.isDefined(listener))
            listener = $r.bindFunction(listener, this);
        this[0].addEventListener(type,listener,useCapture);

        if(eventListenersDictionary[type] === undefined || eventListenersDictionary[type] === null)
        {
            eventListenersDictionary[type] = [];
        }

        eventListenersDictionary[type].push(listener);
    };

    this.removeEventListener = function (type, listener, useCapture) {
        this[0].removeEventListener.apply(this[0], arguments);

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

        if (document.createEvent) {
            this[0].dispatchEvent(event);
        } else {
            this[0].fireEvent("on" + event.eventType, event);
        }

    };

    this.hasEventListener = function(type){

        if(eventListenersDictionary[type] !== undefined && eventListenersDictionary[type] !== null)
        {
            return true;
        }

        return false;

    }

});



