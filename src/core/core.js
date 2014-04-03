var LIBRARY_RAMA = "$r";
var R_APP = "rapp";

var libraryDictionary = {};


var library = function (libraryName) {

    var library = libraryDictionary[libraryName];
    if (library)
        return library;
    else {
        return constructLibrary(libraryName);
    }
};

//constructing core Library which is rama
var $r = window.$r = constructLibrary(LIBRARY_RAMA);
$r.library = library;
$r.$$libraryDictionary = libraryDictionary;

$r.Application = function (applicationname, constructor) {
    var newClassItem = {};
    newClassItem.name = applicationname;
    newClassItem.constructor = constructor;
    newClassItem.constructor.className = applicationname;
    newClassItem.superClassItem = $r("Application").classItem;
    newClassItem.library = $r;
    $r.$$classDictionary[applicationname] = newClassItem;
};


function initApplications() {

    var appNodes = $(document).find('[' + R_APP + ']');

    for (var i = 0; i < appNodes.length; i++) {
        var appNode = $(appNodes[i]);
        var application = $r.Class(appNode.attr(R_APP));

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

        this.application = $r.$$componentUtil.createComponent(rootNode[0], appClass);
        this.application.applicationManager = this;
        rootNode.replaceWith(this.application);
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
            var newClassItem = {};
            newClassItem.name = className;
            newClassItem.constructor = function () {
            };
            newClassItem.constructor.className = className;
            newClassItem.superClassItem = null;
            newClassItem.library = library;

            library.$$classDictionary[className] = newClassItem;


        }

        classItem = library.$$classDictionary[className];

        //1.when i get class name, I need to register the class somewhere

        //2.then return a function so user can register a constructor class for the given classname

        //3.also the return function should have an extend function which take the argument of a return value of requesting a class name which is essentially a constructor

        //4.the extend function should then register that constructor as base class for the class registered in step 2

        var returnFunction = function (construcotr) {

            returnFunction.classItem.constructor = construcotr;

        };


        returnFunction.extends = function (baseClassItem) {

            var classItem = this.classItem;
            var superClassItem = baseClassItem;
            return function (constructor) {

                classItem.constructor = constructor;
                classItem.superClassItem = superClassItem.classItem;
            };
        };


        returnFunction.classItem = classItem;


        return returnFunction;

    };

    library.$$classDictionary = {};
    library.libraryName = libraryName;

    library.$skins = {};


    library.skins = function () {

        for (var i in arguments) {
            var skinItem = arguments[i];
            library.$skins[skinItem.Class] = skinItem;
        }
    };

    library.skinClass = function (className) {

        var skinClassItem = library.$skins[className];

        if(skinClassItem === null || skinClassItem === undefined || skinClassItem.Class === null ||  skinClassItem.Class === "")
        {
            throw new ReferenceError("Skin Class Note Found Exception: The requested Skin Class " + className + " could not be found\n" +
                    "Please Make sure it is registered properly in the library ");
        }
        else
        {
            return library.libraryName + ":" + className;
        }


    };

    library.Class = function (className) {

        var classItem = library.$$classDictionary[className];

        if(classItem === null || classItem === undefined || classItem.constructor === null ||  classItem.constructor === undefined)
        {
            throw new ReferenceError("Class Note Found Exception: The requested Class " + className + " could not be found\n" +
                    "Please Make sure it is registered in the library ");
        }
        else
        {
            if(classItem.superClassItem !== null && classItem.superClassItem !== undefined)
            {
                var constructor = function () {
                    var baseClass = classItem.superClassItem.library.Class(classItem.superClassItem.name);
                    var subClass = classItem.constructor;
                    return classConstructor.constructClass(baseClass, subClass);
                };
                return constructor
            }
            else
            {
                return classItem.constructor;
            }

        }


    };

    libraryDictionary[libraryName] = library;

    return library;

}

var classConstructor = {};
(function () {

    var initializing = false;

    classConstructor.constructClass = function (baseClass, subClass) {

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

        for (var name in constructorInstance) {
            if (typeof constructorInstance[name] === "function" && typeof _super[name] === "function") {
                baseObject[name] = _superFactory(name, constructorInstance[name])
            }
            else {
                var propertyDescriptor = Object.getOwnPropertyDescriptor(constructorInstance, name);
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
                    Object.defineProperty(baseObject, name, newPrototypeDescripter);
                }
                else {
                    baseObject[name] = constructorInstance[name];
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

        RClass.className = subClass.className;

        return new RClass();
    }

}());
