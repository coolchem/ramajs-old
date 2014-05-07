"use strict";


var Class
(function(){
    Class = function(){

    };
    Class.className = "Class";

    Class.prototype.get = function (propertyName, getter) {

        Object.defineProperty(this, propertyName,
                {   get:getter,
                    enumerable:true,
                    configurable:true
                });
    }

    Class.prototype.set = function (propertyName, setter) {

        Object.defineProperty(this, propertyName,
                {   set:setter,
                    enumerable:true,
                    configurable:true
                });
    }

})();

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

    createClassItem(applicationname, $r, constructor, $r.$$classDictionary[APPLICATION]);
};


function initApplications() {

    var appNodes = $r.find('[' + R_APP + ']');

    for (var i = 0; i < appNodes.length; i++) {
        var appNode = appNodes[i];
        var application = $r.ClassFactory(appNode.getAttribute(R_APP));

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

    var library = {};

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

    library.Class = function (className) {

        if (className !== undefined && className !== null && className !== "") {
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
        }
        else {
            throw new ReferenceError("Class Name not specified exception: The Class Name value was specified as 'undefined' or 'null' or an empty string");
        }


    };

    library.ClassFactory = function (className) {

        var classItem = library.$$classDictionary[className];

        if (classItem === null || classItem === undefined || classItem.classConstructor === null || classItem.classConstructor === undefined) {
            throw new ReferenceError("Class Note Found Exception: The requested Class " + className + " could not be found\n" +
                    "Please Make sure it is registered in the library ");
        }
        else {

            var baseClass;
            if (classItem.superClassItem !== null && classItem.superClassItem !== undefined) {
                baseClass = classItem.superClassItem.library.ClassFactory(classItem.superClassItem.name);
                baseClass.className = classItem.superClassItem.name;
            }
            else {

                baseClass = Class;
            }

            var subClass = classItem.classConstructor;
            subClass.className = className;


            return function () {
                var constructorArguments = null;
                var isBaseClassConstruction = false;

                if (arguments[0] !== undefined) {
                    if (arguments[0] === true) {
                        isBaseClassConstruction = true;
                    }
                    else {
                        constructorArguments = arguments[0];
                    }
                }
                return constructClass(subClass, baseClass, constructorArguments, isBaseClassConstruction);
            };
        }
    };

    library.new = function (className, constructorArguments) {

        var classConstructor = library.ClassFactory(className);

        return new classConstructor(constructorArguments);

    };

    libraryDictionary[libraryName] = library;

    return library;

}

function createClassItem(className, library, classConstructor, superClassItem) {
    var newClassItem = {};
    newClassItem.name = className;
    if (classConstructor === null || classConstructor === undefined) {
        newClassItem.classConstructor = Class;
    }
    else {
        classConstructor.prototype = new Class();
        newClassItem.classConstructor = classConstructor;

    }

    if (superClassItem === undefined) {
        newClassItem.superClassItem = null;
    }
    else {
        newClassItem.superClassItem = superClassItem;
    }

    newClassItem.library = library;
    library.$$classDictionary[className] = newClassItem;
}

function getLibraryReturnFunction(classItem) {

    var returnFunction = function (constructor) {

        constructor.prototype = new Class();
        classItem.classConstructor = constructor;
    };


    returnFunction.extends = function (baseClassItem) {

        var classItem = this.classItem;
        var superClassItem = baseClassItem;
        return function (constructor) {
            constructor.prototype = new Class();
            classItem.classConstructor = constructor;
            classItem.superClassItem = superClassItem.classItem;
        };
    };


    returnFunction.classItem = classItem;


    return returnFunction;
}



function constructClass(subClass, baseClass, constructorArguments, isBaseClassConstruction) {

    var baseClassInstance = new baseClass(true);
    var subclassInstance = new subClass();
    subclassInstance.classNameString = subClass.className;


    function RClass(subclassInstance, baseClassInstance, constructorArguments, isBaseClassConstruction){

       this.super = function(){
           if(baseClassInstance[baseClassInstance.classNameString])
               baseClassInstance[baseClassInstance.classNameString].apply(baseClassInstance,arguments);
       }

       this[subclassInstance.classNameString] = function()
       {
           if(subclassInstance[subclassInstance.classNameString])
               subclassInstance[subclassInstance.classNameString].apply(this, arguments);
           else
               this.super.apply(this,arguments)
       }

        for(var propName in subclassInstance)
        {
           if(propName !== subclassInstance.classNameString)
           {
               var propertyDescriptor = Object.getOwnPropertyDescriptor(subclassInstance, propName);
               if(propertyDescriptor !== undefined && (propertyDescriptor.hasOwnProperty("get") || propertyDescriptor.hasOwnProperty("set")))
               {
                   var newPrototypeDescripter = {};
                   var basePropertyDescriptor = Object.getOwnPropertyDescriptor(baseClassInstance, propName)
                   for (var descriptorName in propertyDescriptor)
                   {
                       if(basePropertyDescriptor !== undefined && basePropertyDescriptor.hasOwnProperty(descriptorName))
                       {
                           if(typeof propertyDescriptor[descriptorName] === "function" && typeof basePropertyDescriptor[descriptorName] === "function")
                           {
                               newPrototypeDescripter[descriptorName] = getterSetterSuperFunctionFactory(propName,propertyDescriptor[descriptorName],basePropertyDescriptor[descriptorName],descriptorName)
                           }
                           else
                           {
                               newPrototypeDescripter[descriptorName] = basePropertyDescriptor[descriptorName];
                           }
                       }
                       else
                       {
                           newPrototypeDescripter[descriptorName] = propertyDescriptor[descriptorName];
                       }

                   }
                   Object.defineProperty(this, propName, newPrototypeDescripter);
               }
               else if(typeof subclassInstance[propName] === "function" && typeof baseClassInstance[propName] === "function")
               {
                   this[propName] = superFunctionFactory(propName,subclassInstance[propName],baseClassInstance[propName]);

               }
               else
               {
                   this[propName] = subclassInstance[propName];

               }
           }
        }

        if(!isBaseClassConstruction)
        {
            this[subclassInstance.classNameString].apply(this, constructorArguments);
        }

        function getterSetterSuperFunctionFactory(propName, fn, superFunction,type,baseClassInstance)
        {
            return function(){
                var temp = this.super;
                if(type === "get")
                {
                    Object.defineProperty(this.super, propName,
                            {   get:contextFunction(superFunction, this),
                                enumerable:true,
                                configurable:true
                            });
                }else if(type === "set")
                {
                    Object.defineProperty(this.super, propName,
                            {   set:contextFunction(superFunction, this),
                                enumerable:true,
                                configurable:true
                            });
                }

                function contextFunction(fn,context){
                    return function(){
                        return superFunction.apply(this, arguments);
                    }
                }

                var ret = fn.apply(this, arguments);
                this.super = temp;
                return ret;
            }
        }

        function superFunctionFactory(propName, fn, superFunction)
        {
            return function(){
                var temp = this.super;
                this.super[propName] = (function(context){
                    return function(){
                        superFunction.apply(context,arguments);
                    }
                })(this);
                var ret = fn.apply(this, arguments);
                this.super = temp;
                return ret;
            }
        }
    }

    RClass.prototype = baseClassInstance;

    var newInstance = new RClass(subclassInstance, baseClassInstance, constructorArguments, isBaseClassConstruction)

    return newInstance;

}

var Dictionary = function () {

    var dictionary = {};
    var dictionaryArray = [];

    dictionary.get = function (key) {

        var item = getKeyItem(key);
        if (item !== undefined) {
            return item.value;
        }
    };
    dictionary.put = function (key, value) {

        var item = getKeyItem(key);
        if (item !== undefined) {
            item.value = value;
        }
        else {
            dictionaryArray.push({key:key, value:value});
        }
    };

    dictionary.remove = function (key) {
        for (var i = 0; i < dictionaryArray.length; i++) {
            var item = dictionaryArray[i];
            if (item.key === key) {
                dictionaryArray.splice(i, 1);
                break;
            }
        }
    };

    function getKeyItem(key) {

        for (var i = 0; i < dictionaryArray.length; i++) {
            var item = dictionaryArray[i];
            if (item.key === key) {
                return item;
            }
        }

    }

    return dictionary;
};
