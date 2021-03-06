$r.Class("DataGroup").extends("GroupBase")(function () {


    var indexToRenderer = [];

    var setDataProvider,itemRemoved,itemAdded,dataProvider_collectionChangeHandler;


    setDataProvider = this.bind(setDataProviderFn);
    itemRemoved = this.bind(itemRemovedFn);
    itemAdded = this.bind(itemAddedFn);
    dataProvider_collectionChangeHandler = this.bind(dataProvider_collectionChangeHandlerFn);

    this.init = function(){
        this.super.init();
        this.setAttribute("comp", "DataGroup");
    }

    var _dataProvider = null;

    this.get("dataProvider", function () {

        return _dataProvider;
    });

    this.set("dataProvider", function (value) {

        if (_dataProvider == value)
            return;
        _dataProvider = value;
        setDataProvider()
        var event = new $r.Event("dataProviderChanged");
        this.dispatchEvent(event);


    });

    var _itemRenderer = null;

    this.set("itemRenderer", function (value) {

        if (typeof value === "string") {
            _itemRenderer = $r.classFactory(value)
        }
        else {
            _itemRenderer = value;
        }

    });


    this.get("itemRenderer", function () {

        return _itemRenderer;
    });

    var _itemRendererFunction = null;

    this.get("itemRendererFunction", function () {

        return _itemRendererFunction;
    });

    this.set("itemRendererFunction", function (value) {

        _itemRendererFunction = value;
    });


    this.initialize = function () {

        this.super.initialize();
        setDataProvider();

    };

    this.getItemRendererAtIndex= function(index){

        return this.elements.getItemAt(index);
    }

    this.getItemRendererForItem = function(item){

        if(_dataProvider)
        {
            this.elements.forEach(function(renderer){
                if(renderer.data === item)
                {
                  return renderer;
                }

            })
        }

        return null;
    }

    function setDataProviderFn() {
        if (this.initialized) {
            removeAllItemRenderers(this);
            createItemRenderers(this);
            addDataProviderListener();

            this.$$updateDisplay();
        }
    }


    function removeAllItemRenderers(_this) {

        _this.removeAllElements();
        indexToRenderer = [];

    }

    function addDataProviderListener() {
        if (_dataProvider)
            _dataProvider.addEventListener($r.CollectionEvent.COLLECTION_CHANGE, dataProvider_collectionChangeHandler, false, 0, true);
    }

    function removeDataProviderListener() {
        if (_dataProvider)
            _dataProvider.removeEventListener($r.CollectionEvent.COLLECTION_CHANGE, dataProvider_collectionChangeHandler);
    }


    function dataProvider_collectionChangeHandlerFn(event) {
        switch (event.kind) {
            case $r.CollectionEventKind.ADD:
            {
                // items are added
                adjustAfterAdd(event.items, event.location);
                break;
            }

            case $r.CollectionEventKind.REPLACE:
            {
                // items are replaced
                adjustAfterReplace(event.items, event.location);
                break;
            }

            case $r.CollectionEventKind.REMOVE:
            {
                // items are removed
                adjustAfterRemove(event.items, event.location);
                break;
            }

            case $r.CollectionEventKind.MOVE:
            {
                // one item is moved
                adjustAfterMove(event.items[0], event.location, event.oldLocation);
                break;
            }

            case $r.CollectionEventKind.REFRESH:
            {
                // from a filter or sort...let's just reset everything
                removeDataProviderListener();
                setDataProvider();
                break;
            }

            case $r.CollectionEventKind.RESET:
            {
                // reset everything
                removeDataProviderListener();
                setDataProvider()
                break;
            }

            case $r.CollectionEventKind.UPDATE:
            {

                break;
            }
        }

        this.$$updateDisplay();
    }


    function removeRendererAt(index) {
        var renderer = indexToRenderer[index];
        if (renderer) {
            var item;

            if (renderer.data && _itemRenderer != null)
                item = renderer.data;
            else
                item = renderer;
            itemRemoved(item, index);
        }
    }


    function itemRemovedFn(item, index) {
        // Remove the old renderer at index from indexToRenderer[], from the
        // DataGroup, and clear its data property (if any).

        var oldRenderer = indexToRenderer[index];

        if (indexToRenderer.length > index)
            indexToRenderer.splice(index, 1);

        /*        dispatchEvent(new RendererExistenceEvent(
         RendererExistenceEvent.RENDERER_REMOVE, false, false, oldRenderer, index, item));*/

        if (oldRenderer.data && oldRenderer !== item)
            oldRenderer.data = null;

        var child = oldRenderer;
        if (child)
        {
            this.removeElement(child);
            var evt = new $r.DataGroupEvent($r.DataGroupEvent.ITEM_RENDERER_REMOVED, child, index);
            this.dispatchEvent(evt);
        }

    }

    function createRendererForItem(item) {
        if (_itemRenderer != null) {
            var renderer = new _itemRenderer();
            renderer.data = item;
            return renderer
        }
        return null;
    }

    function createItemRenderers(_this) {
        if (!_dataProvider) {
            removeAllItemRenderers(_this);
            return;
        }

        var dataProviderLength = _dataProvider.length;

        // Remove the renderers we're not going to need
        for (var index = indexToRenderer.length - 1; index >= dataProviderLength; index--)
            removeRendererAt(index);

        // Reset the existing renderers
        for (index = 0; index < indexToRenderer.length; index++) {
            var item = _dataProvider.getItemAt(index);
            var renderer = indexToRenderer[index]

            removeRendererAt(index);
            itemAdded(item, index);
        }

        // Create new renderers
        for (index = indexToRenderer.length; index < dataProviderLength; index++)
            itemAdded(_dataProvider.getItemAt(index), index);

    }


    function itemAddedFn(item, index) {
        var myItemRenderer = createRendererForItem(item);
        indexToRenderer.splice(index, 0, myItemRenderer);
        this.addElementAt(myItemRenderer, index);
        var evt = new $r.DataGroupEvent($r.DataGroupEvent.ITEM_RENDERER_ADDED, myItemRenderer,index);
        this.dispatchEvent(evt);
    }

    function adjustAfterAdd(items, location) {
        var length = items.length;
        for (var i = 0; i < length; i++) {
            itemAdded(items[i], location + i);
        }

        // the order might have changed, so we might need to redraw the other
        // renderers that are order-dependent (for instance alternatingItemColor)
        resetRenderersIndices();
    }


    function adjustAfterRemove(items, location) {
        var length= items.length;
        for (var i = length - 1; i >= 0; i--) {
            itemRemoved(items[i], location + i);
        }

// the order might have changed, so we might need to redraw the other
// renderers that are order-dependent (for instance alternatingItemColor)
        resetRenderersIndices();
    }

    /**
     *  @private
     */
    function adjustAfterMove(item, location, oldLocation) {
        itemRemoved(item, oldLocation);
        itemAdded(item, location);
        resetRenderersIndices();
    }

    /**
     *  @private
     */
    function adjustAfterReplace(items, location) {
        var length= items.length;
        for (var i= length - 1;i >= 0; i-- )
        {
            itemRemoved(items[i].oldValue, location + i);
        }

        for (i = length - 1; i >= 0; i--) {
            itemAdded(items[i].newValue, location);
        }
    }


    function resetRenderersIndices() {
        if (indexToRenderer.length == 0)
            return;
        var indexToRendererLength = indexToRenderer.length;
        for (var index = 0; index < indexToRendererLength; index++)
            resetRendererItemIndex(index);
    }

    function resetRendererItemIndex(index)
    {
        var renderer = indexToRenderer[index]
        if (renderer)
            renderer.itemIndex = index;
    }


})
