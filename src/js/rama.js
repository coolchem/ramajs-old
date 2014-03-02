
(function(window, document, GLOBAL) {'use strict';

    var applicationsDictionary = {};

    var skinCache = {};

    var R_APP = "rApp";
    var RX_LAYOUT = "LAYOUT";
    var RX_STATES = "STATES";
    var R_COMP = "rComp";
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
            this.application.htmlNode = this.applicationNode;
            this.application.initialize();

            $(this.applicationNode).append(this.application);

            this.application.inValidate();

        }

    }

    Class.extend("Component", function(){

        this.initialized = false;

        this.super = function()
        {

        };

        this.$$super = function(){

            extend(this, $('<div></div>'));
        };

        this.htmlNode = null;

        this.parent = null;
        this.elements = [];


        this.initialize = function(){

           this.initialized  = true;
        };

        this.inValidate = function(){

        };

        this.addElement = function(element){

            this.elements.push(element);
            if(!element.initialized)
                element.initialize();

            this.append(element);
        };

        this.removeElement = function(element){

        };



    });

    rama.Component.extend("Group", function(){

        this.layout = null;
        this.states = [];

        this.$$super = function(){

            this._super();
            this.css("position", "absolute");
        };

        this.initialize = function(){

            this._super();

            if(this.htmlNode)
            {
                //applying attributes
                applyAttributes(this, this.htmlNode.attributes);

                for(var i=0; i<this.htmlNode.childNodes.length; i++)
                {
                    var childNode = this.htmlNode.childNodes[i];
                    if(childNode.tagName === RX_LAYOUT)
                    {
                        setLayout(this, childNode);
                    }
                    else if(childNode.tagName === RX_STATES)
                    {
                        setStates(this, childNode);
                    }
                    else if(childNode.nodeType !== 3)
                    {
                        var elementClass = rama[$(childNode).attr(R_COMP)];
                        if(elementClass)
                        {
                            var element =  new elementClass();
                            element.htmlNode = childNode;
                            this.addElement(element);
                        }
                        else
                        {   var element2 = new rama.Component();
                            this.addElement(element2);
                        }
                    }
                }
            }
        };

        this.inValidate = function(){

            this._super();
        };
    });

    rama.Group.extend("Skin", function(){

    });

    rama.Component.extend("SkinnableComponent", function(){

        var inValidating = false;
        this.skinParts = [];
        var _skin = "";

        var skinElement = null;


        this.initialize = function(){

            this._super();
           _skin = this.skin;
           attachSkin(this);
           findSkinParts();
        };

        this.partAdded = function(partName, instance){

        };

        var attachSkin = function (_this){

            if(_skin.indexOf(".html") !== -1)
            {
                $.get(_skin, function(data) {

                    if(data.childNodes && data.childNodes[0] && $(data.childNodes[0]).attr(R_COMP) === "Skin")
                    {
                        skinElement = new rama.Skin();
                        skinElement.htmlNode = data.childNodes[0];
                        _this.addElement(skinElement);
                        applyAttributes(skinElement, _this.htmlNode);

                        if(inValidating)
                        {
                            skinElement.inValidate();
                            inValidating = false;
                        }
                    }

                });
            }
        };

        this.inValidate = function(){

            this._super();
            if(skinElement)
            {
                skinElement.inValidate();
                inValidating = false;
            }
            else
                inValidating = true;

        };

        function findSkinParts(){
/*            if(component.skinParts)
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
            }*/
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

    function extend(destination, source) {
        for (var property in source)
            destination[property] = source[property];
        return destination;
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


})(window, document, this);
