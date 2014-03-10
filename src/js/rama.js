/**
 * RamaJS JavaScript Framework v1.0
 * DEVELOPED BY
 * Varun Reddy Nalagatla
 * varun8686@gmail.com
 *
 * Copyright 2014 Varun Reddy Nalagatla a.k.a coolchem
 * Released under the MIT license
 *
 * FORK:
 * https://github.com/coolchem/rama
 */
(function(window, document) {'use strict';

    var applicationsDictionary = {};

    var skinCache = {};

    var R_APP = "rapp";
    var RX_LAYOUT = "LAYOUT";
    var RX_STATES = "STATES";
    var R_COMP = "rcomp";
    var COMP_ID = "compid";
    var Class;
    var SPECIAL_CHARS_REGEXP = /([\:\-\_]+(.))/g;
    var MOZ_HACK_REGEXP = /^moz([A-Z])/;



    var rama = window.rama = {

    };

    (function(){

        var initializing = false;

        Class = function(){};

        Class.extend = function(classname, constructor)
        {
            var thisClass = this;
            var newClass = function(){
                var baseClass = thisClass;
                var subClass = constructor;
                var className = classname;

                var constructedClass = constructClass(baseClass, subClass, className);

                return constructedClass;
            };
            newClass.extend = Class.extend;

            if(classname)
            {
                rama[classname] = newClass;
            }

            return newClass;
        };

        function constructClass(baseClass, subClass, subClassName)
        {

            initializing = true;
            var _super = new baseClass();
            var baseObject = new baseClass();
            initializing = false;


            function _superFactory(name,fn) {
                return function() {
                    var tmp = this._super;

                    /* Add a new ._super() method that is the same method */
                    /* but on the super-class */
                    this._super = _super[name];

                    /* The method only need to be bound temporarily, so we */
                    /* remove it when we're done executing */
                    var ret = fn.apply(this, arguments);
                    this._super = tmp;

                    return ret;
                };
            }

            function _getSetsuperFactory(name,fn,source) {
                return function() {
                    var tmp = this._super;

                    /* Add a new ._super() method that is the same method */
                    /* but on the super-class */
                    this._super = source[name];

                    /* The method only need to be bound temporarily, so we */
                    /* remove it when we're done executing */
                    var ret = fn.apply(this, arguments);
                    this._super = tmp;

                    return ret;
                };
            }


            var constructorInstance = new subClass();

            for (var name in constructorInstance) {
                if(typeof constructorInstance[name] === "function" && typeof _super[name] === "function")
                {
                    baseObject[name] = _superFactory(name,constructorInstance[name])
                }
                else
                {
                    var propertyDescriptor =  Object.getOwnPropertyDescriptor(constructorInstance,name);
                    if( propertyDescriptor !== undefined && (propertyDescriptor.hasOwnProperty("get") || propertyDescriptor.hasOwnProperty("set")))
                    {
                        var newPrototypeDescripter = {};
                        for(var descriptorName in propertyDescriptor)
                        {
                            if(typeof propertyDescriptor[descriptorName] === "function" )
                            {
                                newPrototypeDescripter[descriptorName] = _getSetsuperFactory(descriptorName,propertyDescriptor[descriptorName],propertyDescriptor)
                            }
                            else
                            {
                                newPrototypeDescripter[descriptorName] = propertyDescriptor[descriptorName]
                            }
                        }
                        Object.defineProperty(baseObject,name, newPrototypeDescripter);
                    }
                    else
                    {
                        baseObject[name] = constructorInstance[name];
                    }

                }
            }

            /* The dummy class constructor */
            function RClass() {
                if ( !initializing && this.super ) {
                    this.super.apply(this, arguments);
                }

                if ( !initializing && this.$$super ) {
                    this.$$super.apply(this, arguments);
                }
            }

            /* Populate our constructed prototype object */
            RClass.prototype = baseObject;

            /* Enforce the constructor to be what we expect */
            RClass.prototype.constructor = subClass;

            RClass.className = subClassName;

            return new RClass();
        }

    }());





    function ApplicationManager(applicationClass, rootNode){

        var appClass = applicationClass;

        this.application = null;
        this.applicationNode = rootNode;


        this.initialize = function(){

            this.application = new appClass();
            this.application.applicationManager = this;
            this.application.htmlNode = this.applicationNode;
            this.application.initialize();
            this.application.inValidate();
        }

    }

    Class.extend("Component", function(){

        this.compid = "";
        this.rcomp = "";
        this.initialized = false;
        this.isCustomElement = true;
        this.htmlNode = null;

        this.super = function()
        {

        };

        this.$$super = function(){

            $.extend(this, $("<div></div>")); //every component starts of as empty div
        };

        this.initialize = function(){

           this.initialized  = true;
        };

        this.inValidate = function(){

        };

        this.addElement = function(element){

        };

        this.removeElement = function(element){

        };

    });

    rama.Component.extend("Group", function(){

        this.customComponents = [];

        this.initialize = function(){

            this._super();
            createChildren(this);
            if(this.htmlNode)
                this.htmlNode.replaceWith(this);
        };

        this.addElement = function(element){

            if(!element.initialized && element.isCustomElement === true) //too see if its a framework component
                element.initialize();

            this.append(element);
        };

        this.inValidate = function(){
            this._super();

            if(this.layout)
            {
                this.css("position", "absolute");
                this.layout.updateLayout();
            }
        };

        function createChildren(_this)
        {
            if(_this.htmlNode)
            {
                _this.html(_this.htmlNode.html());

                var attributes = _this.htmlNode.prop("attributes");

                $.each(attributes, function() {
                    _this.attr(this.name, this.value);
                });

                applyAttributes(_this, _this.htmlNode[0].attributes);
            }


            //find if any layout is specified
            var layoutNode =  _this[0].getElementsByTagName(RX_LAYOUT);
            if(layoutNode && layoutNode.length > 0)
            {
                _this.layout = null;
                setLayout(_this, layoutNode[0]);

            }

            //find and compile custom components if available

            var customComponents = _this.find('[' + R_COMP + ']');

            for( var i= 0; i< customComponents.length; i++)
            {
                var customComponentNode = $(customComponents[i]);

                var customComponentClass = rama[customComponentNode.attr(R_COMP)];
                if(customComponentClass)
                {
                    var custComp = new customComponentClass();
                    custComp.htmlNode = customComponentNode;
                    custComp.initialize();
                    //customComponentNode.replaceWith(custComp);
                    _this.customComponents.push(custComp);
                }
            }
        }
    });

    rama.Group.extend("Skin", function(){

        this.getSkinPart = function(compId){

            var element = null;

            if(this.customComponents && this.customComponents.length > 0)
            {
                for (var i = 0; i< this.customComponents.length ; i++)
                {
                    var customComp = this.customComponents[i];
                    if(customComp[COMP_ID] === compId)
                    {
                        return customComp;
                    }
                }
            }

            var dynamicElements = this.find('[' + COMP_ID + '=' + compId + ']');

            if(dynamicElements && dynamicElements.length > 0)
            {
                return dynamicElements[0];
            }

            return element;
        }
    });

    Class.extend("Layout", function()
    {
        this.target = null;

        this.updateLayout = function(){

           console.log(this.target);
        };
    });

    function setLayout(component, layoutNode)
    {
        if(layoutNode.childNodes && layoutNode.childNodes.length > 0)
        {
            layoutNode = cleanWhitespace(layoutNode);
            var layoutTypeNode = layoutNode.childNodes[0];
            var layout = rama[camelCase(layoutTypeNode.tagName.toLowerCase())];
            if(layout)
            {
                component.layout = new layout();
                component.layout.target = component;
                applyAttributes(component.layout, layoutTypeNode.attributes)
            }
        }
    }


    rama.Component.extend("SkinnableComponent", function(){

        var _inValidating = false;
        this.skinParts = [];

        var _skinElement = null;

        var _skin;

        Object.defineProperty(this, "skin",
                {   get : function(){
                    return _skin;
                },
                    set : function(newValue){
                        _skin = newValue;
                    },
                    enumerable : true,
                    configurable : true
                });


        this.initialize = function(){
           this._super();
           attachSkin(this);
        };

        this.partAdded = function(partName, instance){

        };

        function attachSkin(_this){

            if(_skin.indexOf(".html") !== -1)
            {
                $.get(_skin, function(data) {

                    if(data.childNodes && data.childNodes[0] && $(data.childNodes[0]).attr(R_COMP) === "Skin")
                    {
                        compileSkin($(data.childNodes[0]));
                    }

                });
            }

            function compileSkin(skinNode)
            {
                _skinElement = new rama.Skin();
                _skinElement.htmlNode = skinNode;

                _skinElement.initialize();

                if(_this.htmlNode)
                {
                    _skinElement.addClass(_this.htmlNode.attr("class"));
                    _this.htmlNode.append(_skinElement);
                }
                else
                {
                    _this.append(_skinElement);
                }


                if(_inValidating)
                {
                    _skinElement.inValidate();
                    _inValidating = false;
                }

                findSkinParts(_this);
            }
        }



        this.inValidate = function(){

            this._super();
            if(_skinElement)
            {
                _skinElement.inValidate();
                _inValidating = false;
            }
            else
                _inValidating = true;

        };

        function findSkinParts(_this){
            if(_skinElement)
            {
                for(var j=0; j< _this.skinParts.length; j++)
                {
                    var skinPart = _this.skinParts[j];
                    var skinPartFound = false;

                    var skinPartElement = _skinElement.getSkinPart(skinPart.id);

                    if(skinPartElement)
                    {
                      skinPartFound = true;
                      _this[skinPart.id] = skinPartElement;
                      _this.partAdded(skinPart.id,skinPartElement)
                    }

                    if(skinPart.required === true && !skinPartFound)
                    {
                        throw new TypeError("Required Skin part not found " + _this.skin);
                    }
                }
            }
        }

    });

    rama.SkinnableComponent.extend("SkinnableContainer", function(){


    });

    rama.SkinnableComponent.extend("Application", function(){

        this.applicationManager = null;
    });

    function initApplications(){

        var appNodes = $(document).find('[' + R_APP + ']');

        for(var i=0; i< appNodes.length; i++)
        {
            var appNode = $(appNodes[i]);
            var application = rama[appNode.attr(R_APP)];

            if(application)
            {
                initApplication(application, appNode)
            }
        }

    }

    function initApplication(application, appNode){

       var applicationManager = new ApplicationManager(application, appNode);
       applicationManager.initialize();

    }



    function setStates(component, statesNode)
    {
        if(statesNode.childNodes && statesNode.childNodes.length > 0)
        {
            if(!component.states)
                component.states = [];
            for(var i=0; i< statesNode.childNodes.length; i++)
            {
               var state = {};
               var stateNode = statesNode.childNodes[i];
               applyAttributes(state, stateNode.attributes);
               component.states.push(state);
            }
        }

    }

    function applyAttributes(object, attrs)
    {
        for(var i=0; i< attrs.length; i++)
        {
            var attr = attrs[i];
            object[camelCase(attr.name.toLowerCase())] = attr.value;
        }
    }

    function camelCase(name) {
        return name.
                replace(SPECIAL_CHARS_REGEXP, function(_, separator, letter, offset) {
                    return offset ? letter.toUpperCase() : letter;
                }).
                replace(MOZ_HACK_REGEXP, 'Moz$1');
    }

    function cleanWhitespace(node)
    {
        for (var i=0; i<node.childNodes.length; i++)
        {
            var child = node.childNodes[i];
            if(child.nodeType == 3 && !/\S/.test(child.nodeValue))
            {
                node.removeChild(child);
                i--;
            }
            if(child.nodeType == 1)
            {
                cleanWhitespace(child);
            }
        }
        return node;
    }

    function isString(value){return typeof value == 'string';}

    $(document).ready(function() {
        initApplications();
    });

})(window, document);
