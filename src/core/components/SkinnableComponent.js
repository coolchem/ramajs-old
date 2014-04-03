$r("SkinnableComponent").extends($r("Component"))(function () {

    var _inValidating = false;

    var _skinElement = null;

    var _skinClass;

    var classUtil = $r.$$classUtil;

    var componentUtil = $r.$$componentUtil;

    Object.defineProperty(this, "skinClass",
            {   get:function () {
                return _skinClass;
            },
                set:function (newValue) {
                    _skinClass = newValue;
                },
                enumerable:true,
                configurable:true
            });

    var _skinParts = [];
    Object.defineProperty(this, "skinParts",
            {   get:function () {
                return _skinParts;
            },
                set:function (newValue) {
                    defineSkinParts(newValue);
                },
                enumerable:true,
                configurable:true
            });

    function defineSkinParts(skinPartss) {

        for (var i = 0; i < skinPartss.length; i++) {
            _skinParts.push(skinPartss[i]);
        }

    }

    this.$$createChildren = function () {
        attachSkin(this);
    };

    this.$$childrenCreated = function () {
        this._super();
        findSkinParts(this);
    };


    function attachSkin(_this) {

        _skinElement = componentUtil.createComponent(classUtil.skinFactory(_this), $r.Class("Skin"));
        _this.addElement(_skinElement);

        if (_inValidating) {
            _skinElement.inValidate();
            _inValidating = false;
        }
    }


    this.partAdded = function (partName, instance) {
        //Override this method to add functionality to various skin component
    };


    this.inValidate = function () {

        this._super();
        if (_skinElement) {
            _skinElement.inValidate();
            _inValidating = false;
        }
        else
            _inValidating = true;

    };

    function findSkinParts(_this) {
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
