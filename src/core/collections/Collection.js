$r.Class("Collection").extends("EventDispatcher")(function () {


    var localIndex;
    var list;

    var sort;
    var filterFunction = null;

    var internalRefresh = this.bind(internalRefreshFn);
    var dataProvider_collectionChangeHandler = this.bind(dataProvider_collectionChangeHandlerFn);



    this.get("sort", function(){

        return sort;

    })


    this.set("sort", function(value){

        sort = value;

    })

    this.set("filterFunction", function(value){

        filterFunction = value;

    })

    this.get("filterFunction", function(){

        return filterFunction;

    })


    this.init = function (source) {

        this.super.init();
        this.source = source;

        internalRefreshFn(false);

    };

    var _dispatchEvents = 0

    var _source = null;

    this.get("source", function () {

        if(list)
            return list.source;
        return null;
    });

    this.set("source", function (s) {
        list = new $r.ArrayList(s);

        list.addEventListener($r.CollectionEvent.COLLECTION_CHANGE, dataProvider_collectionChangeHandler);
    });

    this.get("length", function () {

        if (localIndex)
        {
            return localIndex.length;
        }
        else if (list)
        {
            return list.length;
        }
        else
        {
            return 0;
        }
    });


    this.addItem = function (item) {

        this.addItemAt(item, this.length);
    };

    this.addItemAt = function (item, index) {

        if (index < 0 || index > this.length) {
            var message = "Index out of bounds Exception: Specified index " + index + "is out of bounds for" +
                    "this collection of length " + this.length;
            throw new RangeError(message);
        }

        var listIndex = index;
        //if we're sorted addItemAt is meaningless, just add to the end
        if (localIndex && sort)
        {
            listIndex = list.length;
        }
        else if (localIndex && filterFunction != null)
        {
            // if end of filtered list, put at end of source list
            if (listIndex == localIndex.length)
                listIndex = list.length;
            // if somewhere in filtered list, find it and insert before it
            // or at beginning
            else
                listIndex = list.getItemIndex(localIndex[index]);
        }
        list.addItemAt(item, listIndex);
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
        var i;

        if (localIndex && sort)
        {
/*            var startIndex = findItem(item, Sort.FIRST_INDEX_MODE);
            if (startIndex == -1)
                return -1;

            var endIndex = findItem(item, Sort.LAST_INDEX_MODE);
            for (i = startIndex; i <= endIndex; i++)
            {
                if (localIndex[i] == item)
                    return i;
            }

            return -1;*/
        }
        else if (localIndex && filterFunction != null)
        {
            var len = localIndex.length;
            for (i = 0; i < len; i++)
            {
                if (localIndex[i] == item)
                    return i;
            }

            return -1;
        }

        // fallback
        return list.getItemIndex(item);
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
        var listIndex = index;
        if (localIndex)
        {
            var oldItem = localIndex[index];
            listIndex = list.getItemIndex(oldItem);
        }
        return list.removeItemAt(listIndex);
    };

    this.removeAll = function () {

        var len = this.length;
        if (len > 0)
        {
            if (localIndex)
            {
                for (var i = len - 1; i >= 0; i--)
                {
                    this.removeItemAt(i);
                }
            }
            else
            {
                list.removeAll();
            }
        }

    }

    this.toArray = function(){

        var ret;
        if (localIndex)
        {
            ret = localIndex.concat();
        }
        else
        {
            ret = list.toArray();
        }
        return ret;
    }

    this.toString = function(){

        if (localIndex)
        {
            return localIndex.toString();
        }
        else
        {
            if (list && list.toString)
                return list.toString();
            else
                this.className;
        }

    }

    this.getItemAt = function (index) {

        if (index < 0 || index >= this.length) {
            var message = "Index out of bounds Exception: Specified index " + index + "is out of bounds for" +
                    "this collection of length " + this.length;
            throw new RangeError(message);
        }
        if (localIndex)
        {
            return localIndex[index];
        }
        else if (list)
        {
            return list.getItemAt(index);
        }

        return null;
    };

    this.setItemAt = function (item, index) {
        if (index < 0 || index >= this.length) {
            var message = "Index out of bounds Exception: Specified index " + index + "is out of bounds for" +
                    "this collection of length " + this.length;
            throw new RangeError(message);
        }

        var listIndex = index;
        if (localIndex)
        {
            if (index > localIndex.length)
            {
                listIndex = list.length;
            }
            else
            {
                var oldItem = localIndex[index];
                listIndex = list.getItemIndex(oldItem);
            }
        }
        return list.setItemAt(item, listIndex);
    }


    this.refresh = function () {

        internalRefresh(true);
    }

    this.forEach = function(fn,context){

        if (!isFunction(fn)) {
            throw new TypeError('iterator must be a function');
        }

        for(var i = 0; i < this.length; i++)
        {
            fn.call(context, this.getItemAt(i));
        }

    }

    function internalRefreshFn(dispatch)
    {
        if (sort || filterFunction != null)
        {
            if (list)
            {
                localIndex = list.toArray();
            }
            else
            {
                localIndex = [];
            }

            if (filterFunction != null)
            {
                var tmp = [];
                var len = localIndex.length;
                for (var i = 0; i < len; i++)
                {
                    var item = localIndex[i];
                    if (filterFunction(item))
                    {
                        tmp.push(item);
                    }
                }
                localIndex = tmp;
            }
            if (sort)
            {
                sort.sort(localIndex);
                dispatch = true;
            }
        }
        else if (localIndex)
        {
            localIndex = null;
        }

        if (dispatch)
        {
            var refreshEvent = new $r.CollectionEvent($r.CollectionEvent.COLLECTION_CHANGE);
            refreshEvent.kind = $r.CollectionEventKind.REFRESH;
            this.dispatchEvent(refreshEvent);
        }
    }

    function dataProvider_collectionChangeHandlerFn(event) {

        var newEvent = new $r.CollectionEvent($r.CollectionEvent.COLLECTION_CHANGE);
        for(var propName in newEvent)
        {
            if(event.hasOwnProperty(propName))
                newEvent[propName] = event[propName];
        }
        this.dispatchEvent(newEvent);
    }

})
