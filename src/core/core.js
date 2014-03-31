
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

'use strict';

(function(window, document) {'use strict';

    var LIBRARY_RAMA = "rama";
    var R_APP = "rapp";

    var libraryDictionary = {};

    var library = function(libraryName){

        var library = libraryDictionary[libraryName];
        if(library)
            return library;
        else
        {
            return constructLibrary(libraryName);
        }
    };

    //constructing core Library which is rama
    var rama = window.rama = constructLibrary(LIBRARY_RAMA);
    rama.library = library;


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

    $(document).ready(function() {
        initApplications();
    });

    //core functions
    function constructLibrary(libraryName){

        var Class;

        var library = {};
        libraryDictionary[libraryName] = library;

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
                newClass.className = classname;

                if(classname)
                {
                    library[classname] = newClass;
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

        library.Class = Class;

        library.$skins = {};

        library.skins = function (){

            for( var i in arguments)
            {
                var skinItem = arguments[i];
                library.$skins[skinItem.Class] = skinItem;
            }
        };

        //if it is not a core library, exposing classes available in core Library
        if(libraryName !== LIBRARY_RAMA)
        {

        }

        return library;

    }

})(window, document);