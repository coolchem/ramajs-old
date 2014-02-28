
(function(window, document, GLOBAL) {'use strict';

    var applicationsDictionary = {};
    var RX_APPLICATION = "RX-APPLICATION";
    var RX_LAYOUT = "LAYOUT";
    var RX_STATES = "STATES";
    var Class;
    var SPECIAL_CHARS_REGEXP = /([\:\-\_]+(.))/g;
    var MOZ_HACK_REGEXP = /^moz([A-Z])/;

    var rama = window.rama = {

    };
    Object.prototype.define = function (properties) {
        if (Object.isExtensible(this)) {
            var keys = Object.keys(properties);
            var length = keys.length;
            var descriptors = {};

            for (var i = 0; i < length; i++) {
                var key = keys[i];

                var descriptor = Object.getOwnPropertyDescriptor(properties, key);

                if (/^_/.test(key)) {
                    descriptor.enumerable = false;
                    key = key.slice(1);
                }

                if (/_$/.test(key)) {
                    descriptor.configurable = false;
                    key = key.slice(0, -1);
                }

                if (descriptor.hasOwnProperty("value") && /^[0-9A-Z_]+$/.test(key)) {
                    descriptor.writable = false;

                    var words = key.toLowerCase().split("_");
                    var number = words.length;

                    for (var j = 1; j < number; j++) {
                        var word = words[j];
                        words[j] = word.charAt(0).toUpperCase() + word.slice(1);
                    }

                    key = words.join("");
                }

                descriptors[key] = descriptor;
            }

            Object.defineProperties(this, descriptors);
        }
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
         * @param {Object} properties - hash of properties (init will be the constructor)
         * @param {Object} [classMethods] - optional class methods to add to the class
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


            var constructorInstance = new classConstructor();

            for (var name in constructorInstance) {
                if(typeof constructorInstance[name] === "function" && typeof _super[name] === "function")
                {
                    prototype[name] = _superFactory(name,constructorInstance[name])
                }
                else
                {
                    prototype[name] = constructorInstance[name];
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
                /* Save the class onto Q */
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

            this.application.initialize();

            $(this.applicationNode).append(this.application);

        }

    }

    Class.extend("Component", function(){


        this.super = function()
        {

        };

        this.$$super = function(){

            extend(this, $('<div></div>'));
            this.css("position", "absolute");
        };


        var width = 0;
        this.define({
            get width() {
                return width;
            },
            set width(value) {
                width = value;
            }
        });

        var height = 0;
        this.define({
            get height() {
                return height;
            },
            set height(value) {
                height = value;
            }
        });

        var minWidth = 0;
        this.define({
            get minWidth() {
                return minWidth;
            },
            set minWidth(value) {
                minWidth = value;
            }
        });

        var minHeight = 0;
        this.define({
            get minHeight() {
                return minHeight;
            },
            set minHeight(value) {
                minHeight = value;
            }
        });

        var top = 0;
        this.define({
            get top() {
                return top;
            },
            set width(value) {
                top = value;
            }
        });

        var bottom = 0;
        this.define({
            get bottom() {
                return bottom;
            },
            set bottom(value) {
                bottom = value;
            }
        });

        var left = 0;
        this.define({
            get left() {
                return left;
            },
            set left(value) {
                left = value;
            }
        });

        var right = 0;
        this.define({
            get right() {
                return right;
            },
            set right(value) {
                right = value;
            }
        });

        var paddingLeft = 0;
        this.define({
            get paddingLeft() {
                return paddingLeft;
            },
            set paddingLeft(value) {
                paddingLeft = value;
            }
        });

        var paddingRight = 0;
        this.define({
            get paddingRight() {
                return paddingRight;
            },
            set paddingRight(value) {
                paddingRight = value;
            }
        });

        var paddingTop = 0;
        this.define({
            get paddingTop() {
                return paddingTop;
            },
            set paddingTop(value) {
                paddingTop = value;
            }
        });

        var paddingBottom = 0;
        this.define({
            get paddingBottom() {
                return paddingBottom;
            },
            set paddingBottom(value) {
                paddingBottom = value;
            }
        });

        this.parent = null;
        this.elements = [];


        this.initialize = function(){


        };

        this.addElement = function(element){

            this.elements.push(element);
            element.initialize();
            this.append(element);
        };

        this.removeElement = function(element){

        };

    });

    rama.Component.extend("group", function(){
        this.layout = null;

    });

    rama.group.extend("skin", function(){
        this.skinStates = [];
    });

    rama.Component.extend("skinnableComponent", function(){

        this.skinParts = [];
        this.skin = null;


        this.partAdded = function(partName, instance){

        };

    });

    rama.skinnableComponent.extend("skinnableContainer", function(){


    });

    rama.Component.extend("Application", function(){

        this.applicationManager = null;
    });



    Class.extend("Layout", function()
    {
        this.target = null;

        this.updateLayout = function(){

        };
    });

    function initApplications(){

        var appNodes = document.getElementsByTagName(RX_APPLICATION);

        for(var i=0; i< appNodes.length; i++)
        {
            var appNode = appNodes[i];
            var application = rama[appNode.id];

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



    //Display center manage, add, update and delete of components

    function constructComponent(component)
    {
        if(component.skin && component.skin !== "")
        {
            component.skinElement = $(component.skin);
            //applying attributes
            applyAttributes(component, component.skinElement[0].attributes);

            //finding layout
            for(var i=0; i<component.skinElement[0].childNodes.length; i++)
            {
                var childNode = component.skinElement[0].childNodes[i];
                if(childNode.tagName === RX_LAYOUT)
                {
                    setLayout(component, childNode);
                }
                else if(childNode.tagName === RX_STATES)
                {
                    setStates(component, childNode);
                }
                else
                {
                    var elementClass = rama[camelCase(childNode.tagName.toLowerCase())];
                    if(elementClass)
                    {
                        var element =  new elementClass();
                        component.addElement(element);
                        applyAttributes(element,childNode.attributes);

                    }
                    else
                    {   var element2 = new rama.Component();
                        element2.html(childNode.outerHTML);
                        component.addElement(element2);
                        applyAttributes(element2, childNode.attributes);
                    }
                }
            }

            //apply skinParts
            if(component.skinParts)
            {
                for(var j=0; j< component.skinParts.length; j++)
                {
                    var skinPart = component.skinParts[j];
                    var skinPartFound = false;
                    for (var k=0; k< component.elements.length; k++)
                    {
                        var skinElement1 = component.elements[k];
                        if(skinElement1.id === skinPart.id)
                        {
                            skinPartFound = true;
                            component[skinPart.id] = skinElement1;
                            break;
                        }
                    }

                    if(skinPart.required === true && !skinPartFound)
                    {
                        console.log("Required Skin part not found")
                    }
                }
            }
        }
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

    function extend(destination, source) {
        for (var property in source)
            destination[property] = source[property];
        return destination;
    }

    function camelCase(name) {
        return name.
                replace(SPECIAL_CHARS_REGEXP, function(_, separator, letter, offset) {
                    return offset ? letter.toUpperCase() : letter;
                }).
                replace(MOZ_HACK_REGEXP, 'Moz$1');
    }

    function isString(value){return typeof value == 'string';}

    $(document).ready(function() {
        initApplications();
    });


})(window, document, this);
