
$r.Class("Component").extends("ComponentBase")(function () {

    var attachSkin,findSkinParts;

    this.init = function(){

        this.super.init();
        attachSkin = $r.bindFunction(attachSkinFn, this);
        findSkinParts = $r.bindFunction(findSkinPartsFn, this);

    }

    var _skinElement = null;

    var _skinClass;

    this.get("skinClass", function () {
        return _skinClass;
    })

    this.set("skinClass", function (newValue) {
        _skinClass = newValue;
    })

    var _skinParts = [];
    this.get("skinParts", function () {
        return _skinParts;
    })

    this.set("skinParts", function (newValue) {
        defineSkinParts(newValue);
    })

    function defineSkinParts(skinPartss) {

        for (var i = 0; i < skinPartss.length; i++) {
            _skinParts.push(skinPartss[i]);
        }

    }

    var _currentState = "";

    this.get("currentState",function(){
        return _currentState

    })

    this.set("currentState",function(value){
        _currentState = value;
        _skinElement.currentState = value;
    })

    this.$$createChildren = function () {
        attachSkin(this);
    };

    this.$$childrenCreated = function () {
        this.super.$$childrenCreated();
        findSkinParts(this);
    };


    function attachSkinFn(_this) {

        _skinElement = new $r.Skin(_this.skinClass);
        _this.addElement(_skinElement);
    }


    this.partAdded = function (partName, instance) {
        //Override this method to add functionality to various skin component
    };

    function findSkinPartsFn(_this) {
        if (_skinElement) {
            for (var j = 0; j < _this.skinParts.length; j++) {
                var skinPart = _this.skinParts[j];
                var skinPartFound = false;

                var skinPartElement = _skinElement.getSkinPart(skinPart.id);

                if (skinPartElement) {
                    skinPartFound = true;
                    _this[skinPart.id] = skinPartElement;
                    _this.partAdded(skinPart.id, skinPartElement)
                }

                if (skinPart.required === true && !skinPartFound) {
                    throw new ReferenceError("Required Skin part not found: " + skinPart.id + " in " + _this.skin);
                }
            }
        }
    }

});
