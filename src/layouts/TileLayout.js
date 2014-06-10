$r.Class("TileLayout").extends("LayoutBase")(function () {

    var _selectedIndex = 0;

    this.get("selectedIndex",function(){

        return _selectedIndex;
    });

    this.set("selectedIndex",function(newValue){

        selectedIndexChanged(newValue, this)
    });

    this.addElement = function (element) {
        this.super.addElement(element);
        element.setStyle("position", "absolute");
        if(this.elements.length -1 === _selectedIndex)
        {
            toggleElementsDisplay(element, true)
        }
        else
        {
            toggleElementsDisplay(element, false)
        }
    };


    this.initialize = function () {

        this.super.initialize();
        setupInitialStyles(this);

    };

    this.$$updateDisplay = function(){
        this.super.$$updateDisplay();
        setupStylesForChildElements(this);

    }

    function selectedIndexChanged(newIndex, _this){

        if(_selectedIndex !== newIndex)
        {
            for(var i=0; i< _this.elements.length; i++)
            {
                if(i === _selectedIndex)
                {
                    toggleElementsDisplay(_this.elements[i], false);
                }
                if(i === newIndex)
                {
                    toggleElementsDisplay(_this.elements[i], true);
                }
            }

            _selectedIndex = newIndex;
        }
    }


    function setupInitialStyles(_this){

        _this.setStyle("position", "absolute");
    }

    function setupStylesForChildElements(_this){

        for(var i=0; i< _this.elements.length; i++)
        {
            var element = _this.elements[i];

            element.setStyle("position", "absolute");
        }
    }

    function toggleElementsDisplay(element, display)
    {
        if(display === true)
        {
            element.display= "";
            element.visibility = "inherit";
        }
        else
        {
            element.display = "none"
            element.visibility = "hidden";
        }

    }




})
