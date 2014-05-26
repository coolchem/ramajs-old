"use strict";

var $r;
var packages = {};
var classes = {};
var skins = {};


$r = window.$r = constructPackage(PACKAGE_RAMA);

var Class = function () {
};

Class.prototype.isA = function(constructorFunction){
   if(this.constructor === constructorFunction)
   {
       return true;
   }

    return false;
}

$r.Class = Class;

function rPackage(packageName) {

    var rPackage = packages[packageName];
    if (rPackage)
        return rPackage;
    else {
        return constructPackage(packageName);
    }
};

function extend(baseClassName, constructor){

    return function(){

        var baseClass = classFactory(baseClassName);
        preProcessClassConstructors(constructor)
        var subClass  = constructor;

        var constructorArguments = null;
        var isBaseClassConstruction = false;

        if (arguments[0] !== undefined) {
            if (arguments[0] === true) {
                isBaseClassConstruction = true;
            }
            else {
                constructorArguments = arguments;
            }
        }

        return constructClass(subClass, baseClass, constructorArguments, isBaseClassConstruction)

    }
}

function preProcessClassConstructors(constructor){

    constructor.prototype.get = function (propertyName, getter) {

        Object.defineProperty(this, propertyName,
                {   get:getter,
                    enumerable:true,
                    configurable:true
                });
    }

    constructor.prototype.set = function (propertyName, setter) {

        Object.defineProperty(this, propertyName,
                {   set:setter,
                    enumerable:true,
                    configurable:true
                });
    }

}

//qualified class name is full path to the Class [packageName][className]
function classFactory(qualifiedClassName) {
    var classConstructor = $r[qualifiedClassName];
    var packageAndLibrary = qualifiedClassName.split(".");

    if(packageAndLibrary.length > 1)
    {
        classConstructor = packages[packageAndLibrary[0]][packageAndLibrary[1]];
    }

    if(typeof classConstructor !== "function" || classConstructor === null || classConstructor === undefined)
    {
        throw new ReferenceError("Class Note Found Exception: The Class " + qualifiedClassName + " could not be found\n" +
                "Please Make sure it is registered in the package ");
    }

    return classConstructor;
}

function constructClass(subClass, baseClass, constructorArguments, isBaseClassConstruction) {

    var baseClassInstance = new baseClass(true);
    var subclassInstance = new subClass();

    function RClass(subclassInstance, baseClassInstance, constructorArguments, isBaseClassConstruction) {

        this.super = function () {
            if (baseClassInstance.classConstructor)
                    baseClassInstance.classConstructor.apply(baseClassInstance, arguments);
        }

        this.classConstructor = function () {
            if (subclassInstance.classConstructor)
                   subclassInstance.classConstructor.apply(this, arguments);
            else
                this.super.apply(this, arguments)
        }

        for (var propName in subclassInstance) {
            if (propName !== "classConstructor") {
                var propertyDescriptor = Object.getOwnPropertyDescriptor(subclassInstance, propName);
                if (propertyDescriptor !== undefined && (propertyDescriptor.hasOwnProperty("get") || propertyDescriptor.hasOwnProperty("set"))) {
                    var newPrototypeDescripter = {};
                    var basePropertyDescriptor = Object.getOwnPropertyDescriptor(baseClassInstance, propName)
                    for (var descriptorName in propertyDescriptor) {
                        if (basePropertyDescriptor !== undefined && basePropertyDescriptor.hasOwnProperty(descriptorName)) {
                            if (typeof propertyDescriptor[descriptorName] === "function" && typeof basePropertyDescriptor[descriptorName] === "function") {
                                newPrototypeDescripter[descriptorName] = getterSetterSuperFunctionFactory(propName, propertyDescriptor[descriptorName], basePropertyDescriptor[descriptorName], descriptorName)
                            }
                            else {
                                newPrototypeDescripter[descriptorName] = basePropertyDescriptor[descriptorName];
                            }
                        }
                        else {
                            newPrototypeDescripter[descriptorName] = propertyDescriptor[descriptorName];
                        }

                    }
                    Object.defineProperty(this, propName, newPrototypeDescripter);
                }
                else if (typeof subclassInstance[propName] === "function" && typeof baseClassInstance[propName] === "function") {
                    this[propName] = superFunctionFactory(propName, subclassInstance[propName], baseClassInstance[propName]);

                }
                else {
                    this[propName] = subclassInstance[propName];

                }
            }
        }

        if (!isBaseClassConstruction) {
            this.classConstructor.apply(this, constructorArguments);
        }

        function getterSetterSuperFunctionFactory(propName, fn, superFunction, type, baseClassInstance) {
            return function () {
                var temp = this.super;
                if (type === "get") {
                    Object.defineProperty(this.super, propName,
                            {   get:bindFunction(superFunction, this),
                                enumerable:true,
                                configurable:true
                            });
                } else if (type === "set") {
                    Object.defineProperty(this.super, propName,
                            {   set:bindFunction(superFunction, this),
                                enumerable:true,
                                configurable:true
                            });
                }

                var ret = fn.apply(this, arguments);
                this.super = temp;
                return ret;
            }
        }

        function superFunctionFactory(propName, fn, superFunction) {
            return function () {
                var temp = this.super;
                this.super[propName] = (function (context) {
                    return function () {
                        superFunction.apply(context, arguments);
                    }
                })(this);
                var ret = fn.apply(this, arguments);
                this.super = temp;
                return ret;
            }
        }
    }

    RClass.prototype = baseClassInstance;
    RClass.prototype.constructor = subClass;
    var instance = new RClass(subclassInstance, baseClassInstance, constructorArguments, isBaseClassConstruction);

    return instance;

}


function Application(applicationname, constructor) {

    $r[applicationname] = extend("RApplication",constructor);
};


function initApplications() {

    var appNodes = $r.find('[' + R_APP + ']');

    for (var i = 0; i < appNodes.length; i++) {
        var appNode = appNodes[i];
        var application = $r[appNode.getAttribute(R_APP)];

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

        this.application = new appClass();
        this.application.applicationManager = this;
        var parentNode = rootNode.parentNode;
        parentNode.replaceChild(this.application[0], rootNode);
        this.application.initialize();
    }

}

//core functions
function constructPackage(packageName) {

    var rPackage = {};
    rPackage.packageName = packageName;

    rPackage.skins = function () {

        for (var i in arguments) {
            var skinItem = arguments[i];
            skins[getQualifiedName(this, skinItem.skinClass)] = skinItem;
        }
    };

    packages[packageName] = rPackage;

    return rPackage;

}

function getQualifiedName(rPackage, className) {
    return rPackage.packageName + "." + className
}



function skinFactory(qualifiedCLassName) {
    var skinNode = null;

    var skinClassItem = skins[qualifiedCLassName];

    if (skinClassItem === null || skinClassItem === undefined || skinClassItem.skinClass === null || skinClassItem.skinClass === "") {
        throw new ReferenceError("Skin Class Note Found Exception: The requested Skin Class " + qualifiedCLassName + " could not be found\n" +
                "Please Make sure it is registered properly in the package ");
    }
    else {
        var tempDiv = document.createElement('div');
        if (!skinClassItem.skin || skinClassItem.skin !== "") {
            if (skinClassItem.skinURL && skinClassItem.skinURL !== "") {

                skinClassItem.skin = getRemoteSkin(skinClassItem.skinURL);
            }
        }

        tempDiv.innerHTML = skinClassItem.skin;
        skinNode = tempDiv.children[0];
        tempDiv.removeChild(skinNode);
    }

    return skinNode;
}

function getRemoteSkin(skinURL) {

    var xmlhttp;
    if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp = new XMLHttpRequest();
    }
    else {// code for IE6, IE5
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }

    xmlhttp.open("GET", skinURL, false);
    xmlhttp.send();

    return xmlhttp.responseText;
}

function isDefined(value) {
    return typeof value !== 'undefined';
}

function bindFunction(fn, context) {
    return function () {
        return fn.apply(context, arguments);
    }
}

function camelCase(name) {
    return name.
            replace(SPECIAL_CHARS_REGEXP,function (_, separator, letter, offset) {
                return offset ? letter.toUpperCase() : letter;
            }).
            replace(MOZ_HACK_REGEXP, 'Moz$1');
}

function cleanWhitespace(node) {
    for (var i = 0; i < node.childNodes.length; i++) {
        var child = node.childNodes[i];
        if (child.nodeType == 3 && !/\S/.test(child.nodeValue)) {
            node.removeChild(child);
            i--;
        }
        if (child.nodeType == 1) {
            cleanWhitespace(child);
        }
    }
    return node;
}

function setupDefaultsForArguments(argumentsList,valuesList){

    for (var i = 0; i < argumentsList.length; i++) {

        if(argumentsList[i] === undefined)
        {
            argumentsList[i] = valuesList[i];
        }
    }
}