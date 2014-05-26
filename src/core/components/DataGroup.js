$r.DataGroup = extend("Group", function () {

    var indexToRenderer= [];
    var dataProviderChanged;

    this.set("htmlContent", function (newValue) {

    });

    var _dataProvider = null;

    this.get("dataProvider", function () {

        return _dataProvider;
    });

    this.set("dataProvider", function (value) {

        if (_dataProvider == value)
            return;
        _dataProvider = value;
        dataProviderChanged = true;
        setDataProvider(this)
        this.dispatchEvent((new $r.Event("dataProviderChanged")).eventObject);


    });

    var _itemRenderer = null;

    this.set("itemRenderer", function (value) {

        if(typeof value === "string")
        {
           _itemRenderer = $r.classFactory(value)
        }
        else
        {
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
        setDataProvider(this);

    };


    function setDataProvider(_this) {
        if (_this.initialized) {
            removeAllItemRenderers(_this);
            createItemRenderers(_this);
            addDataProviderListener();
        }
    }


    function removeAllItemRenderers(_this) {

        indexToRenderer = [];
    }

    function createItemRenderers(_this) {
        if (!_dataProvider) {
            removeAllItemRenderers(_this);
            return;
        }
        if(_itemRenderer)
        {
            for (var index = 0; index < _dataProvider.length; index++) {

                  var renderer = new _itemRenderer();
                  if(typeof _dataProvider === "array")
                  {
                      renderer.data = _dataProvider[index]
                  }
                  else if(_dataProvider.source)
                  {
                      renderer.data  = _dataProvider.source[index];
                  }

                 _this.addElement(renderer);
            }
        }


    }

    function addDataProviderListener() {
        if (_dataProvider)
            _dataProvider.addEventListener($r.CollectionEvent.COLLECTION_CHANGE, dataProvider_collectionChangeHandler, false, 0, true);
    }

    function removeDataProviderListener() {
        if (_dataProvider)
            _dataProvider.removeEventListener($r.CollectionEvent.COLLECTION_CHANGE, dataProvider_collectionChangeHandler);
    }


    function dataProvider_collectionChangeHandler(event) {
        switch (event.kind) {
            case $r.CollectionEventKind.ADD:
            {
                // items are added
                // figure out what items were added and where
                // for virtualization also figure out if items are now in view
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
                // items are added
                // figure out what items were removed
                // for virtualization also figure out what items are now in view
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
                dataProviderChanged = true;
                invalidateProperties();
                break;
            }

            case $r.CollectionEventKind.RESET:
            {
                // reset everything
                removeDataProviderListener();
                dataProviderChanged = true;
                invalidateProperties();
                break;
            }

            case $r.CollectionEventKind.UPDATE:
            {
                // if a renderer is currently being updated, let's
                // just ignore any UPDATE events.
                if (renderersBeingUpdated)
                    break;

                //update the renderer's data and data-dependant
                //properties.
                for (var i = 0;
                     i < event.items.length;
                     i++) {
                    var pe = event.items[i];
                    if (pe) {
                        var index = dataProvider.getItemIndex(pe.source);
                        var renderer = indexToRenderer[index];
                        setUpItemRenderer(renderer, index, pe.source);
                    }
                }
                break;
            }
        }
    }


})
