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

    var R_APP = "rApp";
    var RX_LAYOUT = "LAYOUT";
    var RX_STATES = "STATES";
    var R_COMP = "rComp";
    var COMP_ID = "compId";
    var Class;

    var rama = window.rama = {

    };

    (function(){
        var initializing = false;
        /** The base Class implementation (does nothing)
         *
         * @constructor
         * @for Class
         */
        Class = function(){};

        /**
         * See if a object is a specific class
         *
         * @method isA
         * @param {String} className - class to check against
         */
        Class.prototype.isA = function(className) {
            return this.className === className;
        };

        /**
         * Create a new Class that inherits from this class
         *
         * @method extend
         * @param {String} className
         */
        Class.extend = function(className, classConstructor) {
            /* No name, don't add onto Q */
            if(!isString(className)) {
                className = null;
            }
            var _super = this.prototype,
            ThisClass = this;

            /* Instantiate a base class (but only create the instance, */
            /* don't run the init constructor) */
            initializing = true;
            var prototype = new ThisClass();
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


            var constructorInstance = new classConstructor();

            for (var name in constructorInstance) {
                if(typeof constructorInstance[name] === "function" && typeof _super[name] === "function")
                {
                    prototype[name] = _superFactory(name,constructorInstance[name])
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
                        Object.defineProperty(prototype,name, newPrototypeDescripter);
                    }
                    else
                    {
                        prototype[name] = constructorInstance[name];
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
            RClass.prototype = prototype;




            /* Enforce the constructor to be what we expect */
            RClass.prototype.constructor = classConstructor;
            /* And make this class extendable */
            RClass.extend = Class.extend;

            if(className) {
                rama[className] = RClass;

                /* Let the class know its name */
                RClass.prototype.className = className;
                RClass.className = className;
            }

            return RClass;
        };
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

        this.compId = null;
        this.rComp = "";
        this.initialized = false;
        this.htmlNode = null;

        this.super = function()
        {

        };

        this.$$super = function(){

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

        this.$$super = function(){

            this._super();
            $.extend(this, $("<div></div>"))
        };

        this.initialize = function(){

            this._super();
            createChildren(this);

        };

        this.addElement = function(element){

            if(!element.initialized) //too see if its a framework component
                element.initialize();

            this.append(element);
        };

        this.inValidate = function(){
            this._super();
        };

        function createChildren(_this)
        {
            if(_this.htmlNode)
            {
                _this.html(_this.htmlNode.html());

                applyAttributes(_this, _this.htmlNode[0].attributes);
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
                    }
                }
            }
        }
    });

    rama.Group.extend("Skin", function(){

    });

    rama.Component.extend("SkinnableComponent", function(){

        this._inValidating = false;
        this.skinParts = [];

        this._skinElement = null;
        this._skin = "";

        this.$$super = function(){
            this._super();
        };


        this.initialize = function(){
           this._super();
           this._skin = this.skin;
           attachSkin(this);
        };

        this.partAdded = function(partName, instance){

        };

        function attachSkin(_this){

            if(_this._skin.indexOf(".html") !== -1)
            {
                $.get(_this._skin, function(data) {

                    if(data.childNodes && data.childNodes[0] && $(data.childNodes[0]).attr(R_COMP) === "Skin")
                    {
                        _this._skinElement = new rama.Skin();
                        _this._skinElement.htmlNode = $(data.childNodes[0]);
                        _this.addElement(_this._skinElement);
                        _this._skinElement.addClass(_this.htmlNode.attr("class"));

                        if(_this._inValidating)
                        {
                            _this._skinElement.inValidate();
                            _this._inValidating = false;
                        }

                        findSkinParts(_this);

                    }

                });
            }
        }

        this.addElement = function(element){

            if(!element.initialized) //too see if its a framework component
                element.initialize();

            this.htmlNode.append(element);
        };

        this.inValidate = function(){

            this._super();
            if(_this._skinElement)
            {
                _this._skinElement.inValidate();
                _this._inValidating = false;
            }
            else
                _this._inValidating = true;

        };

        function findSkinParts(_this){
            if(_this._skinElement)
            {
                for(var j=0; j< _this.skinParts.length; j++)
                {
                    var skinPart = _this.skinParts[j];
                    var skinPartFound = false;

                    var dynamicElements = _this.htmlNode.find('[' + COMP_ID + '=' +skinPart.id + ']');

                    if(dynamicElements.length>0)
                    {
                      skinPartFound = true;
                      _this[skinPart.id] = dynamicElements[0];
                      _this.partAdded(skinPart.id,dynamicElements[0])
                    }

                    if(skinPart.required === true && !skinPartFound)
                    {
                        throw new TypeError("Required Skin part not found");
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



    Class.extend("Layout", function()
    {
        this.target = null;

        this.updateLayout = function(){

        };
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


    function setLayout(component, layoutNode)
    {
        if(layoutNode.childNodes && layoutNode.childNodes.length > 0)
        {
            var layoutTypeNode = layoutNode.childNodes[0];
            var layout = rama[camelCase(layoutTypeNode.tagName.toLowerCase())];

            component.layout = new layout();
        }

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

    function applyAttributes(component, attrs)
    {
        for(var i=0; i< attrs.length; i++)
        {
            var attr = attrs[i];
            component[attr.name] = attr.value;
        }
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
