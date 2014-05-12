"use strict";

var $r;
var packages = {};
var classes = {};
var skins = {};


$r = window.$r = constructPackage(PACKAGE_RAMA);

var Class
(function () {
    Class = function () {

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

function rPackage(packageName) {

    var rPackage = packages[packageName];
    if (rPackage)
        return rPackage;
    else {
        return constructPackage(packageName);
    }
}
;

function Application(applicationname, constructor) {

    createClassItem(applicationname, $r, constructor, classes[APPLICATION]);
}
;


function initApplications() {

    var appNodes = $r.find('[' + R_APP + ']');

    for (var i = 0; i < appNodes.length; i++) {
        var appNode = appNodes[i];
        var application = classFactory(getQualifiedName($r,appNode.getAttribute(R_APP)));

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
            skins[getQualifiedName(rPackage, skinItem.skinClass)] = skinItem;
        }
    };

    rPackage.Class = function (className) {

        if (className !== undefined && className !== null && className !== "") {

            var qualifiedClassName = getQualifiedName(rPackage, className);
            var classItem = classes[qualifiedClassName];

            if (classItem === null || classItem === undefined) {

                //this means the class has never been register in the package so
                //so register the Class into package
                createClassItem(className, rPackage);
            }

            classItem = classes[qualifiedClassName];
            return getPackageReturnFunction(classItem);
        }
        else {
            throw new ReferenceError("Class Name not specified exception: The Class Name value was specified as 'undefined' or 'null' or an empty string");
        }


    };

    rPackage.new = function (className, constructorArguments) {

        var classConstructor = classFactory(getQualifiedName(rPackage, className));
        return new classConstructor(constructorArguments);

    };

    packages[packageName] = rPackage;

    return rPackage;

}

function getQualifiedName(rPackage, className) {
    return rPackage.packageName + "." + className
}

//qualified class name is full path to the Class [packageName][className]
function classFactory(qualifiedClassName) {

    var classItem = classes[qualifiedClassName];

    if (classItem === null || classItem === undefined || classItem.classConstructor === null || classItem.classConstructor === undefined) {
        throw new ReferenceError("Class Note Found Exception: The requested Class " + qualifiedClassName + " could not be found\n" +
                "Please Make sure it is registered in the package ");
    }
    else {

        var baseClass;
        if (classItem.superClassItem !== null && classItem.superClassItem !== undefined) {
            baseClass = classFactory(classItem.superClassItem.qualifiedClassName);
            baseClass.className = classItem.superClassItem.className;
        }
        else {

            baseClass = Class;
        }

        var subClass = classItem.classConstructor;
        subClass.className = classItem.className;


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

function createClassItem(className, rPackage, classConstructor, superClassItem) {
    var newClassItem = {};
    newClassItem.className = className;
    newClassItem.qualifiedClassName = getQualifiedName(rPackage, className);
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

    newClassItem.package = rPackage;
    classes[newClassItem.qualifiedClassName] = newClassItem;
}

function getPackageReturnFunction(classItem) {

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


    function RClass(subclassInstance, baseClassInstance, constructorArguments, isBaseClassConstruction) {

        this.super = function () {
            if (baseClassInstance[baseClassInstance.classNameString])
                baseClassInstance[baseClassInstance.classNameString].apply(baseClassInstance, arguments);
        }

        this[subclassInstance.classNameString] = function () {
            if (subclassInstance[subclassInstance.classNameString])
                subclassInstance[subclassInstance.classNameString].apply(this, arguments);
            else
                this.super.apply(this, arguments)
        }

        for (var propName in subclassInstance) {
            if (propName !== subclassInstance.classNameString) {
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
            this[subclassInstance.classNameString].apply(this, constructorArguments);
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

    var newInstance = new RClass(subclassInstance, baseClassInstance, constructorArguments, isBaseClassConstruction)

    return newInstance;

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