"use strict";



var libraryDictionary = {};


var library = function (libraryName) {

    var library = libraryDictionary[libraryName];
    if (library)
        return library;
    else {
        return constructLibrary(libraryName);
    }
};

var Application = function (applicationname, constructor) {
    var newClassItem = {};
    newClassItem.name = applicationname;
    newClassItem.classConstructor = constructor;
    newClassItem.classConstructor.className = applicationname;
    newClassItem.superClassItem = $r("Application").classItem;
    newClassItem.library = $r;
    $r.$$classDictionary[applicationname] = newClassItem;
};


function initApplications() {

    var appNodes = $r.find('[' + R_APP + ']');

    for (var i = 0; i < appNodes.length; i++) {
        var appNode = appNodes[i];
        var application = $r.Class(appNode.getAttribute(R_APP));

        if (application) {
            initApplication(application, appNode)
        }
    }


}

function initApplication(application, appNode) {

    var applicationManager = new ApplicationManager(application, appNode);
    applicationManager.initialize();

}

function ApplicationManager(applicationClass, rootNode) {

    var appClass = applicationClass;

    this.application = null;
    this.applicationNode = rootNode;


    this.initialize = function () {

        this.application = $r.$$componentUtil.createComponent(rootNode, appClass);
        this.application.applicationManager = this;
        var parentNode = rootNode.parentNode;
        parentNode.replaceChild(this.application[0], rootNode);
        this.application.initialize();
        this.application.inValidate();
    }

}

//core functions
function constructLibrary(libraryName) {

    var library = function (className) {

        var classItem = library.$$classDictionary[className];

        if (classItem === null || classItem === undefined) {

            //this means the class has never been register in the library so
            //so register the Class into library
            createClassItem(className, library);


        }

        classItem = library.$$classDictionary[className];

        //1.when i get class name, I need to register the class somewhere

        //2.then return a function so user can register a constructor class for the given classname

        //3.also the return function should have an extend function which take the argument of a return value of requesting a class name which is essentially a constructor

        //4.the extend function should then register that constructor as base class for the class registered in step 2

        return getLibraryReturnFunction(classItem);
    };

    library.$$classDictionary = {};
    library.libraryName = libraryName;

    library.$skins = {};


    library.skins = function () {

        for (var i in arguments) {
            var skinItem = arguments[i];
            library.$skins[skinItem.skinClass] = skinItem;
        }
    };

    library.skinClass = function (className) {

        var skinClassItem = library.$skins[className];

        if (skinClassItem === null || skinClassItem === undefined || skinClassItem.skinClass === null || skinClassItem.skinClass === "") {
            throw new ReferenceError("Skin Class Note Found Exception: The requested Skin Class " + className + " could not be found\n" +
                    "Please Make sure it is registered properly in the library ");
        }
        else {
            return library.libraryName + ":" + className;
        }


    };

    library.Class = function (className, constructorArguments) {

        var classItem = library.$$classDictionary[className];

        if (classItem === null || classItem === undefined || classItem.classConstructor === null || classItem.classConstructor === undefined) {
            throw new ReferenceError("Class Note Found Exception: The requested Class " + className + " could not be found\n" +
                    "Please Make sure it is registered in the library ");
        }
        else {

            var baseClass;
            if (classItem.superClassItem !== null && classItem.superClassItem !== undefined) {
                baseClass = classItem.superClassItem.library.Class(classItem.superClassItem.name);
            }
            else
            {
                baseClass = function(){};
            }

            var constructor = function () {

                var subClass = classItem.classConstructor;
                return classConstructor.constructClass(baseClass, subClass,constructorArguments);
            };
            return constructor
        }


    };

    library.new = function (className, constructorArguments) {

        var classConstructor = library.Class(className, constructorArguments);

        return new classConstructor();

    };

    libraryDictionary[libraryName] = library;

    return library;

}

function createClassItem(className, library)
{
    var newClassItem = {};
    newClassItem.name = className;
    newClassItem.classConstructor = function () {
    };
    newClassItem.classConstructor.className = className;
    newClassItem.superClassItem = null;
    newClassItem.library = library;
    library.$$classDictionary[className] = newClassItem;
}

function getLibraryReturnFunction(classItem) {

    var returnFunction = function (constructor) {

        classItem.classConstructor = constructor;
        classItem.classConstructor.className = classItem.name;
    };


    returnFunction.extends = function (baseClassItem) {

        var classItem = this.classItem;
        var superClassItem = baseClassItem;
        return function (constructor) {

            classItem.classConstructor = constructor;
            classItem.superClassItem = superClassItem.classItem;
        };
    };


    returnFunction.classItem = classItem;


    return returnFunction;
}

var classConstructor = {};
(function () {

    var initializing = false;

    classConstructor.constructClass = function (baseClass, subClass, constructorArguments) {

        initializing = true;
        var _super = new baseClass();
        var baseObject = new baseClass();
        initializing = false;


        function _superFactory(name, fn) {
            return function () {
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

        function _getSetsuperFactory(name, fn, source) {
            return function () {
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

        for (var propName in constructorInstance) {
            if (typeof constructorInstance[propName] === "function" && typeof _super[propName] === "function") {
                baseObject[propName] = _superFactory(propName, constructorInstance[propName])
            }
            else {
                var propertyDescriptor = Object.getOwnPropertyDescriptor(constructorInstance, propName);
                if (propertyDescriptor !== undefined && (propertyDescriptor.hasOwnProperty("get") || propertyDescriptor.hasOwnProperty("set"))) {
                    var newPrototypeDescripter = {};
                    for (var descriptorName in propertyDescriptor) {
                        if (typeof propertyDescriptor[descriptorName] === "function") {
                            newPrototypeDescripter[descriptorName] = _getSetsuperFactory(descriptorName, propertyDescriptor[descriptorName], propertyDescriptor)
                        }
                        else {
                            newPrototypeDescripter[descriptorName] = propertyDescriptor[descriptorName]
                        }
                    }
                    Object.defineProperty(baseObject, propName, newPrototypeDescripter);
                }
                else {
                    baseObject[propName] = constructorInstance[propName];
                }

            }
        }

        /* The dummy class constructor */
        function RClass() {
            if (!initializing && this.super) {
                this.super.apply(this, arguments);
            }

            if (!initializing && this.$$super) {
                this.$$super.apply(this, arguments);
            }
        }

        /* Populate our constructed prototype object */
        RClass.prototype = baseObject;

        /* Enforce the constructor to be what we expect */
        RClass.prototype.constructor = subClass;


        return construct(RClass, constructorArguments);


        function construct(constructor, args) {
            function F() {
                return constructor.apply(this, args);
            }
            F.prototype = constructor.prototype;
            return new F();
        }
    }

}());
