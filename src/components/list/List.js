
//Events Dispatched:
// $r.IndexChangeEvent.CHANGING;
// $r.IndexChangeEvent.CHANGE;
// ListEvent.ITEM_RENDERER_CLICKED;
$r.Class("List").extends("Component")(function(){

    this.skinClass = "$r.ListSkin";

    //this is where all the properties are stored until the data group is initialized
    var tempDataGroupProperties = {},
    dispatchChangeAfterSelection = false,
    _proposedSelectedIndex = -1,
    _pendingSelectedItem = null,
    dataProviderChanged = false,
    doingWholesaleChanges = false;

    //Binding functions;
    var itemRendererClicked = this.bind(itemRendererClickedFn),
    setSelectedIndex = this.bind(setSelectedIndexFn),
    setSelectedItem = this.bind(setSelectedItemFn),
    dataProvider_collectionChangeHandler = this.bind(dataProvider_collectionChangeHandlerFn),
    validateProperties = this.bind(validatePropertiesFn),
    itemSelected = this.bind(itemSelectedFn),
    commitSelection = this.bind(commitSelectionFn);

    this.dataGroup = null;
    this.skinParts = [{id:"dataGroup", required:"false"}];

    this.get("dataProvider", function () {

        if(this.dataGroup)
        {
            return  this.dataGroup.dataProvider
        }

        return tempDataGroupProperties.dataProvider;
    });

    this.set("dataProvider", function (value) {


        if (this.dataProvider)
            this.dataProvider.removeEventListener($r.CollectionEvent.COLLECTION_CHANGE, dataProvider_collectionChangeHandler,false);

        if (value)
            value.addEventListener($r.CollectionEvent.COLLECTION_CHANGE, dataProvider_collectionChangeHandler, false);

        dataProviderChanged = true;
        doingWholesaleChanges = true;

        if(this.dataGroup)
        {
            this.dataGroup.dataProvider =  value;
        }
        else
            tempDataGroupProperties.dataProvider = value;

        validateProperties();
    });


    this.set("itemRenderer", function (value) {

        if (this.dataGroup)
        {
            this.dataGroup.itemRenderer = value;
        }
        else
            tempDataGroupProperties.itemRenderer = value;


    });


    this.get("itemRenderer", function () {

        if(this.dataGroup)
        {
           return  this.dataGroup.itemRenderer
        }

        return  tempDataGroupProperties.itemRenderer
    });

    var _selectedIndex = -1;

    this.get("selectedIndex", function(){
        return _selectedIndex;

    })

    this.set("selectedIndex", function(value){

        setSelectedIndex(value,false);
    })

    var _selectedItem = null;

    this.get("selectedItem", function(){

        if (this.selectedIndex == -1 || this.dataProvider == null)
            return undefined;
        return this.dataProvider.length > this.selectedIndex ? this.dataProvider.getItemAt(this.selectedIndex) : undefined;

    })

    this.set("selectedItem", function(value){
        setSelectedItem(value, false)
    })


    this.init = function(){
        this.super.init();
        this[0] = document.createElement("ul");
        this.setAttribute("comp", "List");

    }

    this.initialize = function(){
        this.super.initialize();
        validateProperties();

    }

    this.partAdded = function(partName,instance){
        this.super.partAdded(partName, instance)

        if(instance === this.dataGroup)
        {
            if(tempDataGroupProperties.itemRenderer !== undefined)
            {
                this.dataGroup.itemRenderer = tempDataGroupProperties.itemRenderer;
            }
            if(tempDataGroupProperties.dataProvider !== undefined)
            {

                this.dataGroup.dataProvider =  tempDataGroupProperties.dataProvider;
            }

            this.dataGroup.addEventListener($r.DataGroupEvent.ITEM_RENDERER_ADDED, handleItemRendererAdded);
            this.dataGroup.addEventListener($r.DataGroupEvent.ITEM_RENDERER_REMOVED, handleItemRendererRemoved);

        }

    }

    this.partRemoved = function (partName, instance) {
        this.super.partRemoved(partName, instance)
        if(instance === this.dataGroup)
        {
            if(tempDataGroupProperties.itemRenderer !== undefined)
            {
                tempDataGroupProperties.itemRenderer = this.dataGroup.itemRenderer;
            }
            if(tempDataGroupProperties.dataProvider !== undefined)
            {

                tempDataGroupProperties.dataProvider = this.dataGroup.dataProvider;
            }

            this.dataGroup.removeEventListener($r.DataGroupEvent.ITEM_RENDERER_ADDED, handleItemRendererAdded);
            this.dataGroup.removeEventListener($r.DataGroupEvent.ITEM_RENDERER_REMOVED, handleItemRendererRemoved);

        }
    };

    function handleItemRendererAdded(event){

      if(event.renderer)
      {
          addEventListenersToRenderer(event.renderer, event.index)
      }
    }

    function handleItemRendererRemoved(event){

        if(event.renderer)
        {
            removeEventListenersFromRenderer(event.renderer)
        }
    }

    function addEventListenersToRenderer(renderer, index){

        renderer.addEventListener("click", handleRendererClicked);


        function handleRendererClicked(event){

            itemRendererClicked(renderer, index);
        }

    }

    function itemRendererClickedFn(renderer, index){

        if(_selectedIndex !== index)
        {
            setSelectedIndex(index, true);
        }
    }

    function removeEventListenersFromRenderer(renderer){
        renderer.removeAllEventListeners();

    }

    function validatePropertiesFn(){

        var changedSelection = false;

        if (dataProviderChanged)
        {
            dataProviderChanged = false;
            doingWholesaleChanges = false;

            if (this.selectedIndex >= 0 && this.dataProvider && this.selectedIndex < this.dataProvider.length)
                itemSelected(selectedIndex);
            else
                setSelectedIndex(-1, false);
        }

        if (_pendingSelectedItem !== undefined)
        {
            if (this.dataProvider)
                _proposedSelectedIndex = this.dataProvider.getItemIndex(_pendingSelectedItem);
            else
                _proposedSelectedIndex = -1;

            _pendingSelectedItem = undefined;
        }

        if (_proposedSelectedIndex != -2)
            changedSelection = commitSelection();
    }

    function itemSelectedFn(index, isSelected){

       if(this.dataGroup)
       {
           var renderer =  this.dataGroup.elements.getItemAt(index);
           if(renderer.hasState && renderer.hasState("selected"))
           {
               if(isSelected)
                    renderer.currentState  = "selected";
               else
                   renderer.currentState = "";
           }
       }

    }

    function commitSelectionFn(){

        // Step 1: make sure the proposed selected index is in range.
        var maxIndex = this.dataProvider ? this.dataProvider.length - 1 : -1;
        var oldSelectedIndex = _selectedIndex;
        var e

        if (_proposedSelectedIndex < -1)
            _proposedSelectedIndex = -1;
        if (_proposedSelectedIndex > maxIndex)
            _proposedSelectedIndex = maxIndex;

        // Caching value of proposed index prevents its being changed in the dispatch
        // of the changing event, if that results in a call into this function
        var tmpProposedIndex = _proposedSelectedIndex;

        // Step 2: dispatch the "changing" event. If preventDefault() is called
        // on this event, the selection change will be cancelled.
        if (dispatchChangeAfterSelection)
        {
            e = new $r.IndexChangeEvent($r.IndexChangeEvent.CHANGING, false, true);
            e.oldIndex = _selectedIndex;
            e.newIndex = _proposedSelectedIndex;
            if (!this.dispatchEvent(e))
            {
                // The event was cancelled. Cancel the selection change and return.
                itemSelected(_proposedSelectedIndex, false);
                _proposedSelectedIndex = -1;
                dispatchChangeAfterSelection = false;
                return false;
            }
        }

        // Step 3: commit the selection change and caret change
        _selectedIndex = tmpProposedIndex;
        _proposedSelectedIndex = -1;

        if (oldSelectedIndex != -1)
            itemSelected(oldSelectedIndex, false);
        if (_selectedIndex != -1)
            itemSelected(_selectedIndex, true);

        if (dispatchChangeAfterSelection)
        {
            e = new $r.IndexChangeEvent($r.IndexChangeEvent.CHANGE);
            e.oldIndex = oldSelectedIndex;
            e.newIndex = _selectedIndex;
            this.dispatchEvent(e);
            dispatchChangeAfterSelection = false;
        }

        return true;
    }


    function setSelectedIndexFn(newIndex,dispatchChangeEvent)
    {
        if (newIndex == this.selectedIndex)
        {
            return;
        }

        if (dispatchChangeEvent)
            dispatchChangeAfterSelection = (dispatchChangeAfterSelection || dispatchChangeEvent);

        _proposedSelectedIndex = newIndex;
        validateProperties();
    }

    function setSelectedItemFn(item,dispatchChangeEvent)
    {
        if (this.selectedItem === item)
            return;

        if (dispatchChangeEvent)
            dispatchChangeAfterSelection = (dispatchChangeAfterSelection || dispatchChangeEvent);

        _pendingSelectedItem = item;
        validateProperties();
    }


    function dataProvider_collectionChangeHandlerFn(event) {
        switch (event.kind) {
            case $r.CollectionEventKind.ADD:
            {
                // items are added
                itemAdded(event.location);
                break;
            }
            case $r.CollectionEventKind.REMOVE:
            {
                // items are removed
                itemRemoved(event.location);
                break;
            }
            case $r.CollectionEventKind.REFRESH:
            {
                setSelectedIndex(-1, false);
                break;
            }

            case $r.CollectionEventKind.RESET:
            {
                if (this.dataProvider.length == 0)
                {
                    setSelectedIndex(-1, false);
                }
                else
                {
                    dataProviderChanged = true;
                    validateProperties();
                }
                break;
            }
        }
    }

    function itemRemoved(index){

        if (_selectedIndex == -1 || doingWholesaleChanges)
            return;

        if (index == _selectedIndex)
        {
            adjustSelection(-1);
        }
        else if (index < _selectedIndex)
        {
            // An item below the selected index has been removed, bump
            // the selected index backing variable.
            adjustSelection(_selectedIndex - 1);
        }

    }

    function itemAdded(index){

        if (doingWholesaleChanges)
            return;

        if (index <= _selectedIndex)
        {
            // If an item is added before the selected item, bump up our
            // selected index backing variable.
            adjustSelection(selectedIndex + 1);
        }
    }

    function adjustSelection(newIndex){

        if (_proposedSelectedIndex != -2)
            _proposedSelectedIndex = newIndex;
        else
            _selectedIndex = newIndex;
        validateProperties();
    }


});
