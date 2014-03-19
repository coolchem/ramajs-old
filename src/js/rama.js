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

    var skinPartDictionary = {};

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





    Class.extend("Component", function(){

        this.compid = "";
        this.rcomp = "";
        this.initialized = false;

        this.elements = [];

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

        var _htmlContent = [];
        Object.defineProperty(this, "htmlContent",
                {   get : function(){
                    return _htmlContent;
                },
                    set : function(newValue){
                        _htmlContent = newValue;
                        setHTMLContent(this);
                    },
                    enumerable : true,
                    configurable : true
                });

        this.initialize = function(){

            this._super();
            createChildren(this);
        };

        this.addElement = function(element){

            element.initialize();
            this.elements.push(element);
            this.append(element);
        };

        this.inValidate = function(){
            this._super();
        };

        function createChildren(_this)
        {
           if(_this.htmlContent.length > 0)
           {
               for(var i = 0; i< _this.htmlContent.length; i++)
               {
                   var componentClass = $(_this.htmlContent[i]).attr(R_COMP);
                   var comp = createComponent(_this.htmlContent[i],rama[componentClass]);
                   _this.addElement(comp);
               }
           }
        }

        function setHTMLContent(_this)
        {
          if(_this.initialized)
          {
              _this[0].innerHTML = "";
              createChildren(_this);
          }
        }
    });

    rama.Group.extend("Skin", function(){

        this.getSkinPart = function(compId){

            var element = null;

            var dynamicElements = this.find('[' + COMP_ID + '=' + compId + ']');
            var skinPartDictionaryElement = skinPartDictionary[compId];

            if( skinPartDictionaryElement && dynamicElements && dynamicElements.length > 0)
            {
                if(skinPartDictionaryElement[0] === dynamicElements[0])
                    return skinPartDictionaryElement;
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

    function createComponent(node,componentClass)
    {
        var component = null;

        if(componentClass !== undefined && componentClass != null && componentClass !== "")
        {
            component = new componentClass();
        }
        else
        {
            component = new rama.Group();
            component[0] = node;
        }

        //applying node attributes

        if(node.attributes !== undefined && node.attributes.length > 0)
        {
            $.each(node.attributes, function() {
                component.attr(this.name, this.value);
            });

            applyAttributes(component, node.attributes);
        }



        //setting up html content

        var children = $(node).children();

        if(children !== undefined && children.length > 0)
        {
            //setting innerHTML to empty so that children are created through normal process
            component[0].innerHTML = "";
            for(var i=0; i< children.length; i++)
            {
                var childNode = children[i];
                component.htmlContent.push(childNode);
            }
        }

        registerSkinPart(component);

        return component;
    }

    function registerSkinPart(component)
    {
        if(component.attr(COMP_ID) && component.attr(COMP_ID) !== "")
        {
            skinPartDictionary[component.attr(COMP_ID)] = component;
        }
    }

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

        var _skinParts = [];
        Object.defineProperty(this, "skinParts",
                {   get : function(){
                    return _skinParts;
                },
                    set : function(newValue){
                        defineSkinParts(newValue);
                    },
                    enumerable : true,
                    configurable : true
                });


        this.initialize = function(){
           this._super();
           attachSkin(this);
        };

        function defineSkinParts(skinPartss){

            for (var i = 0; i < skinPartss.length; i++) {
                _skinParts.push(skinPartss[i]);
            }

        }

        this.partAdded = function(partName, instance){

        };

        function attachSkin(_this){

            if(_this.skin.indexOf(".html") !== -1)
            {

                /*var skinNode = $(getRemoteSkin(_this.skin))[0];
                compileSkin(skinNode);*/

                $.get(_this.skin, function(data) {

                    if(data.childNodes && data.childNodes[0] && $(data.childNodes[0]).attr(R_COMP) === "Skin")
                    {
                        //creating temp div to get proper element objects from html string;
                        var tempDiv = $("<div></div>");
                        tempDiv.html(data.childNodes[0].outerHTML);
                        compileSkin(tempDiv.children()[0]);
                    }

                });

            }
            else
            {
                compileSkin($(_this.skin));
            }

            function compileSkin(skinNode)
            {

                _skinElement = createComponent(skinNode, rama.Skin);
                _skinElement.initialize();
                _this.append(_skinElement);

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
                        throw new TypeError("Required Skin part not found: " + skinPart.id + " in " +_this.skin );
                    }
                }
            }
        }

    });

    rama.SkinnableComponent.extend("SkinnableContainer", function(){

        var _htmlContent = [];
        Object.defineProperty(this, "htmlContent",
                {   get : function(){
                    return _htmlContent;
                },
                    set : function(newValue){
                        _htmlContent = newValue;
                    },
                    enumerable : true,
                    configurable : true
                });

        this.skin = '<div rcomp="Skin">' +
                '<div rcomp="Group" compid="contentGroup">' +
                '</div>' +
                '</div>';

        this.skinParts = [{id:'contentGroup', required:true}];

        this.contentGroup = null;

        this.initialize = function(){
            this._super();
        };

        this.partAdded = function(partName, instance){

            this._super(partName, instance);

            if(instance === this.contentGroup)
            {
                this.contentGroup.htmlContent = this.htmlContent;
            }
        };

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

    function ApplicationManager(applicationClass, rootNode){

        var appClass = applicationClass;

        this.application = null;
        this.applicationNode = rootNode;


        this.initialize = function(){

            this.application = createComponent(rootNode[0], appClass);
            this.application.applicationManager = this;
            rootNode.replaceWith(this.application);
            this.application.initialize();
            this.application.inValidate();
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

    function getRemoteSkin(skinURL) {
        return $.ajax({
            type: "GET",
            url: skinURL,
            async: false
        }).responseText;
    }


    $(document).ready(function() {
        initApplications();
    });

})(window, document);
