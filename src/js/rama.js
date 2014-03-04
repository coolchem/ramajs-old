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

    Class = function(){};

    Class.extend = function(classname, constructor)
    {
        var thisClass = this;
        var newClass = function(){
            var baseClass = thisClass;
            var subClass = constructor;
            var className = classname;

            var constructedClass = constructClass(baseClass, subClass, className);

            if (constructedClass.super) {
                constructedClass.super.apply(constructedClass, arguments);
            }

            if (constructedClass.$$super) {
                constructedClass.$$super.apply(constructedClass, arguments);
            }

            return constructedClass;
        };

        newClass.baseClass = this;
        newClass.subClass = constructor;
        newClass.extend = Class.extend;

        if(classname)
        {
            rama[classname] = newClass;
        }
    };

    function constructClass(baseClass, subClass, subClassName)
    {
        var baseObject = new baseClass();

        subClass.prototype =  baseObject;
        subClass.prototype.className = subClassName;

        var subObject = new subClass();

        function _superFactory(name,fn) {
            return function() {
                var tmp = this._super;

                /* Add a new ._super() method that is the same method */
                /* but on the super-class */
                this._super = baseObject[name];

                /* The method only need to be bound temporarily, so we */
                /* remove it when we're done executing */
                var ret = fn.apply(this, arguments);
                this._super = tmp;

                return ret;
            };
        }

/*        for (var name in subObject) {
            if(typeof subObject[name] === "function" && typeof baseObject[name] === "function")
            {
                subObject[name]._super = subClass.prototype;
            }
        }*/
        subObject._super = subClass.prototype;
        return subObject;
    }

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

            this._super.$$super();
            $.extend(this, $("<div></div>"))
        };

        this.initialize = function(){

            this._super.initialize();
            createChildren(this);

        };

        this.addElement = function(element){

            if(!element.initialized) //too see if its a framework component
                element.initialize();

            this.append(element);
        };

        this.inValidate = function(){
            this._super.inValidate();
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


        this.$$super = function(){
            this._super.$$super();
        };


        this.initialize = function(){
           this._super.initialize();
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

            this._super.inValidate();
            if(this._skinElement)
            {
                this._skinElement.inValidate();
                this._inValidating = false;
            }
            else
                this._inValidating = true;

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



    Class.extend("baseClass", function(){

        var testProperty = "humm";
        Object.defineProperty(this, "testProperty",
                {   get : function(){
                    return testProperty;
                },
                    set : function(newValue){
                        testProperty = newValue;
                    },
                    enumerable : true,
                    configurable : true
                });

        this.initialize = function()
        {
            console.log("baseClass");
        }

    });

    rama.baseClass.extend("subClass1", function(){

        this.testProperty = "subClass1Test";

        this.initialize = function()
        {
            this._super.initialize();
            console.log("subClass1");
        }

    });

    rama.baseClass.extend("subClass2", function(){

        this.initialize = function()
        {
            this._super.initialize();
            console.log("subClass2");
        }

    });

    var sub1 = new rama.subClass1();
    var sub2 = new rama.subClass2();
    console.log(sub1.testProperty);
    console.log(sub2.testProperty);

    sub1.initialize();
    sub2.initialize();

})(window, document);
