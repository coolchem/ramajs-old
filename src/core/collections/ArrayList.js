$r.ArrayList = extend("EventDispatcher", function () {

    this.classConstructor = function (source) {

        this.super();

        disableEvents();
        this.source = source;
        enableEvents();

    };

    var _dispatchEvents = 0

    var _source = null;

    this.get("source", function () {

        return _source;
    });

    this.set("source", function (s) {
        var i;
        var len
        _source = s ? s : [];
        len = _source.length;
        if (_dispatchEvents == 0) {
            var event = new $r.CollectionEvent();
            event.kind = $r.CollectionEventKind.RESET;
            this.dispatchEvent(event);
        }
    });

    this.get("length", function () {

        if (_source)
            return _source.length;
        else
            return 0;
    });


    this.addItem = function (item) {

        this.addItemAt(item, this.length);
    };

    this.addItemAt = function (item, index) {

        if (index < 0 || index >= this.length) {
            var message = "Index out of bounds Exception: Specified index " + index + "is out of bounds for" +
                    "this collection of length " + this.length;
            throw new RangeError(message);
        }

        _source.splice(index, 0, item);
        internalDispatchEvent(this,$r.CollectionEventKind.ADD, item, index);
    }

    this.addAll = function (addList) {

        this.addAllAt(addList, this.length);
    }

    this.addAllAt = function (addList, index) {

        var length = addList.length;
        for (var i = 0; i < length; i++) {
            this.addItemAt(addList.getItemAt(i), i + index);
        }
    }

    this.getItemIndex = function (item) {
        return $r.arrayUtil.getItemIndex(item, _source);
    };

    this.removeItem = function (item) {
        var index = this.getItemIndex(item);
        var result = index >= 0;
        if (result)
            this.removeItemAt(index);

        return result;

    }

    this.removeItemAt = function (index) {

        if (index < 0 || index >= this.length) {
            var message = "Index out of bounds Exception: Specified index " + index + "is out of bounds for" +
                    "this collection of length " + this.length;
            throw new RangeError(message);
        }

        var removed = _source.splice(index, 1)[0];

        internalDispatchEvent(this, $r.CollectionEventKind.REMOVE, removed, index);
        return removed;
    };

    this.removeAll = function () {

        if (this.length > 0) {
            _source.splice(0, this.length);
            internalDispatchEvent(this,$r.CollectionEventKind.RESET);
        }

    }

    this.toArray = function(){

        return _source.concat();
    }

    this.toString = function(){

        _source.toString();

    }

    this.getItemAt = function (index) {

        if (index < 0 || index >= this.length) {
            var message = "Index out of bounds Exception: Specified index " + index + "is out of bounds for" +
                    "this collection of length " + this.length;
            throw new RangeError(message);
        }

        return _source[index];
    };

    this.setItemAt = function (item, index) {
        if (index < 0 || index >= this.length) {
            var message = "Index out of bounds Exception: Specified index " + index + "is out of bounds for" +
                    "this collection of length " + this.length;
            throw new RangeError(message);
        }

        var oldItem = source[index];
        source[index] = item;

        if (_dispatchEvents == 0) {
            var hasCollectionListener = this.hasEventListener($r.CollectionEvent.COLLECTION_CHANGE);
            if (hasCollectionListener) {
                var event = new $r.CollectionEvent($r.CollectionEvent.COLLECTION_CHANGE);
                event.kind = $r.CollectionEventKind.REPLACE;
                event.location = index;
                var updateInfo = {};
                updateInfo.oldValue = oldItem;
                updateInfo.newValue = item;
                updateInfo.property = index;
                event.items.push(updateInfo);
                this.dispatchEvent(event);
            }
        }
        return oldItem;
    }


    this.refresh = function () {

    }


    function enableEvents() {
        _dispatchEvents++;
        if (_dispatchEvents > 0)
            _dispatchEvents = 0;
    }


    function disableEvents() {
        _dispatchEvents--;
    }

    function itemUpdateHandler(event) {
        internalDispatchEvent(this,$r.CollectionEventKind.UPDATE, event);
    }

    function internalDispatchEvent(_this,kind, item, location) {
        if (_dispatchEvents == 0) {
            if (hasEventListener($r.CollectionEvent.COLLECTION_CHANGE)) {
                var event = new $r.CollectionEvent($r.CollectionEvent.COLLECTION_CHANGE);
                event.kind = kind;
                event.items.push(item);
                event.location = location;
                _this.dispatchEvent(event);
            }

        }
    }


})
