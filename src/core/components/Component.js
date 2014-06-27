
$r.Class("Component").extends("ComponentBase")(function () {

    var attachSkin,findSkinParts,detachSkin,clearSkinParts,
            validateSkinChange,validateSkinState;

    attachSkin = this.bind(attachSkinFn);
    detachSkin = this.bind(detachSkinFn);
    findSkinParts = this.bind(findSkinPartsFn);
    clearSkinParts = this.bind(clearSkinPartsFn);
    validateSkinChange = this.bind(validateSkinChangeFn);
    validateSkinState =  this.bind(validateSkinStateFn);

    var _skinChanged = false;

    this.init = function(){

        this.super.init();
    this.setAttribute("comp", "Component");
    }

    var _skinElement = null;

    var _skinClass;

    var _skinClassSet = false;

    this.get("skinClass", function () {
        return _skinClass;
    })

    this.set("skinClass", function (newValue) {

        if(_skinClass !== newValue)
        {
            _skinClass = newValue;
            if(_skinClassSet)
                validateSkinChange();
        }

        if(!_skinClassSet)
            _skinClassSet = true;

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

        if(_currentState !== value)
        {
            _currentState = value;
            validateSkinState();
        }

    })

    this.$$createChildren = function () {
        validateSkinChange();
    };

    this.partAdded = function (partName, instance) {
        //Override this method to add functionality to various skin component
    };

    this.partRemoved = function (partName, instance) {
        //Override this method to add functionality to various skin component
    };

    function validateSkinStateFn(){

        if(_skinElement)
            _skinElement.currentState = _currentState;
    }

    function validateSkinChangeFn(){

        if (_skinElement)
            detachSkin();
        attachSkin();
    }

    function attachSkinFn() {

        if(this.skinClass)
        {
            _skinElement = new $r.Skin(this.skinClass);
            this.addElement(_skinElement);

            findSkinParts();
            validateSkinState();
        }
    }

    function detachSkinFn(){
        clearSkinParts();
        this.removeElement(_skinElement);
    }

    function clearSkinPartsFn(){

        if (_skinElement) {
            for (var j = 0; j < this.skinParts.length; j++) {
                var skinPart = this.skinParts[j];
                if(this[skinPart.id] !== null)
                {
                  this.partRemoved(skinPart.id, this[skinPart.id])
                }
            }
        }

    }

    function findSkinPartsFn() {
        if (_skinElement) {
            for (var j = 0; j < this.skinParts.length; j++) {
                var skinPart = this.skinParts[j];
                var skinPartFound = false;

                var skinPartElement = _skinElement.getSkinPart(skinPart.id);

                if (skinPartElement) {
                    skinPartFound = true;
                    this[skinPart.id] = skinPartElement;
                    this.partAdded(skinPart.id, skinPartElement)
                }

                if (skinPart.required === true && !skinPartFound) {
                    throw new ReferenceError("Required Skin part not found: " + skinPart.id + " in " + this.skin);
                }
            }
        }
    }

});
