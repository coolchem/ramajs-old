"use strict";

var $r;
var packages = {};
var classes = {};
var skins = {};


$r = window.$r = constructPackage(PACKAGE_RAMA);

var rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;

var RClass = function () {

    var constructors = [];

    this.isA = function(constructorFunction){

        for(var i=0; i< constructors.length; i++)
        {
            if(constructorFunction === constructors[i])
                return true;
        }
        return false
    }

    this.get = function (propertyName, getter) {

        Object.defineProperty(this, propertyName,
                {   get:getter,
                    enumerable:true,
                    configurable:true
                });
    }

    this.set = function (propertyName, setter) {

        Object.defineProperty(this, propertyName,
                {   set:setter,
                    enumerable:true,
                    configurable:true
                });
    }

    this.bind = function (fn) {

        return bindFunction(fn, this)
    }

    this.__addConstructor__ = function(constructor){
        constructors.push(constructor);
    }
};


function rPackage(packageName) {

    var rPackage = packages[packageName];
    if (rPackage)
        return rPackage;
    else {
        return constructPackage(packageName);
    }
}
;

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

    rPackage.Class = function (className) {

        var returnFunction = function (constructorFunction) {

            setupClass(rPackage, className, constructorFunction)
        }

        returnFunction.extends = function (qualifiedClassName) {

            return function (constructorFunction) {

                setupClass(rPackage, className, constructorFunction, qualifiedClassName)
            }
        }

        return returnFunction;
    }

    packages[packageName] = rPackage;

    return rPackage;

}

function setupClass(rPackage, className, constructorFunction, superClassName) {

    var newConstructorFunction = function () {

        var superRef = null;
        var baseClass = null;
        var constructorArguments = null;
        var isBaseClassConstruction = false;

        if (arguments.length > 0 && arguments[0] !== undefined) {
            if (arguments[0] === "isBaseClassConstruction") {
                isBaseClassConstruction = true;
            }
            else {
                constructorArguments = arguments;
            }
        }

        if (superClassName && superClassName !== "") {
            baseClass = classFactory(superClassName);
        }


        if (!isBaseClassConstruction) {
            RClass.apply(this);
            this.__addConstructor__(this.constructor);
        }

        var tempSubClassInstance = {};
        RClass.apply(tempSubClassInstance);
        constructorFunction.apply(tempSubClassInstance);
        if (baseClass !== null) {
            baseClass.call(this, "isBaseClassConstruction");
            superRef = {};
            initializeSuperReference(superRef,tempSubClassInstance, this)
            this.__addConstructor__(baseClass);
        }

        constructorFunction.apply(this);


        this.className = getQualifiedName(rPackage, className);

        if (superRef) {
            processSuperReference(superRef, this);
        }

        if (!isBaseClassConstruction && this.init) {
            this.init.apply(this, constructorArguments);
        }
    }

    newConstructorFunction.className = getQualifiedName(rPackage, className);

    rPackage[className] = newConstructorFunction
}

function initializeSuperReference(superRef,subclassInstance, context){
    for (var propName in subclassInstance) {
        if (propName !== "get" && propName !== "set" && propName !== "bind" && propName !== "isA" && propName !== "__addConstructor__") {
            var propertyDescriptor = Object.getOwnPropertyDescriptor(context, propName);
            if (propertyDescriptor !== undefined && (propertyDescriptor.hasOwnProperty("get") || propertyDescriptor.hasOwnProperty("set"))) {
                for (var descriptorName in propertyDescriptor) {

                    if (typeof propertyDescriptor[descriptorName] === "function") {
                        propertyDescriptor[descriptorName] = bindFunction(propertyDescriptor[descriptorName], context);
                    }
                }
                Object.defineProperty(superRef, propName, propertyDescriptor)
            }
            else if (typeof context[propName] === "function") {
                superRef[propName] = bindFunction(context[propName], context);
            }
        }

    }
}

function processSuperReference(superRef, context){
    for (var propName in superRef) {
        var propertyDescriptor = Object.getOwnPropertyDescriptor(context, propName);
        if (propertyDescriptor !== undefined && (propertyDescriptor.hasOwnProperty("get") || propertyDescriptor.hasOwnProperty("set"))) {

            var newPrototypeDescripter = {};
            var basePropertyDescriptor = Object.getOwnPropertyDescriptor(superRef, propName);
            for (var descriptorName in propertyDescriptor) {

                if (basePropertyDescriptor !== undefined && basePropertyDescriptor.hasOwnProperty(descriptorName)) {
                    if (typeof propertyDescriptor[descriptorName] === "function" && typeof basePropertyDescriptor[descriptorName] === "function") {
                        newPrototypeDescripter[descriptorName] = superFunctionFactory(propertyDescriptor[descriptorName], context, superRef);
                    }
                    else {
                        newPrototypeDescripter[descriptorName] = basePropertyDescriptor[descriptorName];
                    }
                }
                else {
                    newPrototypeDescripter[descriptorName] = propertyDescriptor[descriptorName];
                }
            }
            Object.defineProperty(context, propName, newPrototypeDescripter)
        }
        else if (typeof context[propName] === "function") {
            context[propName] = superFunctionFactory(context[propName], context, superRef);
        }
    }
}

function superFunctionFactory(superFunction, context, superObj) {
    return function () {
        context.super = superObj;
        var ret = superFunction.apply(context, arguments);
        context.super = null;
        return ret;
    }
}

//qualified class name is full path to the Class [packageName][className]
function classFactory(qualifiedClassName) {
    var classConstructor = $r[qualifiedClassName];
    var packageAndLibrary = qualifiedClassName.split(".");

    if (packageAndLibrary.length > 1) {
        if (packages[packageAndLibrary[0]] === null || packages[packageAndLibrary[0]] === undefined) {
            throw new ReferenceError("Package Not Found Exception: The Package " + packageAndLibrary[0] + " could not be found\n" +
                    "Please Make sure it is registered.");
        }
        else {
            classConstructor = packages[packageAndLibrary[0]][packageAndLibrary[1]];
        }

    }

    if (typeof classConstructor !== "function" || classConstructor === null || classConstructor === undefined) {
        throw new ReferenceError("Class Not Found Exception: The Class " + qualifiedClassName + " could not be found\n" +
                "Please Make sure it is registered in the package " + packageAndLibrary[0]);
    }

    return classConstructor;
}

function Application(applicationname, constructor) {

    $r.Class(applicationname).extends("RApplication")(constructor);
}
;


function initApplications() {


    var appNodes = document.querySelectorAll('[' + R_APP + ']');

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

function ApplicationManager(applicationClass, appNode) {

    var appClass = applicationClass;

    this.application = null;
    this.applicationNode = appNode;


    this.initialize = function () {

        this.application = new appClass();
        if (appNode.attributes !== undefined && appNode.attributes.length > 0) {

            for (var j = 0; j < appNode.attributes.length; j++) {
                var attr = appNode.attributes[j];
                this.application.setAttribute(attr.name, attr.value);
            }
        }
        this.application.applicationManager = this;
        this.application.setAttribute("comp", appNode.getAttribute(R_APP));
        this.application.parentApplication = this.application;
        var parentNode = appNode.parentNode;
        parentNode.replaceChild(this.application[0], appNode);
        this.application.initialize();
    }

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

function isFunction (fn) {
    var isFunc = (typeof fn === 'function' && !(fn instanceof RegExp)) || toString.call(fn) === '[object Function]';
    if (!isFunc && typeof window !== 'undefined') {
        isFunc = fn === window.setTimeout || fn === window.alert || fn === window.confirm || fn === window.prompt;
    }
    return isFunc;
};

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

function setupDefaultsForArguments(argumentsList, valuesList) {

    for (var i = 0; i < argumentsList.length; i++) {

        if (argumentsList[i] === undefined) {
            argumentsList[i] = valuesList[i];
        }
    }
}

function forEach(arr, callback, thisObj) {
    if (arr == null) {
        return;
    }
    var i = -1,
            len = arr.length;
    while (++i < len) {
        // we iterate over sparse items since there is no way to make it
        // work properly on IE 7-8. see #64
        if ( callback.call(thisObj, arr[i], i, arr) === false ) {
            break;
        }
    }
}

function trim( text ) {
    return text == null ?
            "" :
            ( text + "" ).replace( rtrim, "" );
}

var supportsTouch = !!('ontouchstart' in window) || !!('msmaxtouchpoints' in window.navigator);

function Observable(item){

    makeItemObservable.call(item);
    return item;

}

function makeItemObservable(){
    var bindedPropertiesDictionary = {};
    var observedPropertiesDictionary = {};

    var handleBindingsAndObservers = bindFunction(handleBindingsAndObserversFn, this);

    this.bindProperty = function(propertyName){

        createGettersAndSetters(propertyName,this);
        var returnObj = {}

        returnObj.with = function (contextPropertyName, context) {

            if(!bindedPropertiesDictionary[propertyName])
            {
                bindedPropertiesDictionary[propertyName] = new $r.Dictionary();
                bindedPropertiesDictionary[propertyName].put(context,new $r.ArrayList([contextPropertyName]));
            }
            else
            {
                var propArray = bindedPropertiesDictionary[propertyName].get(context);
                if(!propArray){
                    bindedPropertiesDictionary[propertyName].put(context,new $r.ArrayList([contextPropertyName]));
                }
                else
                {
                    if(propArray.getItemIndex(contextPropertyName) === -1)
                    {
                        propArray.addItem(contextPropertyName);
                    }
                }
            }

        }

        return returnObj;

    }



    this.observe = function(propertyName, handler){

        createGettersAndSetters(propertyName,this);
        if(!observedPropertiesDictionary[propertyName])
        {
            observedPropertiesDictionary[propertyName] = new $r.ArrayList();

        }

        if(observedPropertiesDictionary[propertyName].getItemIndex(handler) === -1)
        {
            observedPropertiesDictionary[propertyName].addItem(handler);
        }
    }

    function createGettersAndSetters(propertyName,context){

        var propertyDescriptor = Object.getOwnPropertyDescriptor(context, propertyName);
        var propertyValue = context[propertyName];
        if (propertyDescriptor === undefined || !(propertyDescriptor.hasOwnProperty("get") && propertyDescriptor.hasOwnProperty("set")))
        {

            Object.defineProperty(context, propertyName,
                    {   set:setter,
                        get:getter,
                        enumerable:true,
                        configurable:true
                    });


        }
        else
        {

        }

        function getter(){

            return propertyValue;
        }

        function setter(value){

            if(value !== propertyValue)
            {
                var oldValue = propertyValue;
                propertyValue = value;
                handleBindingsAndObservers(propertyName,oldValue,propertyValue)

            }


        }
    }

    function handleBindingsAndObserversFn(propertyName,oldValue,newValue){

        if(observedPropertiesDictionary[propertyName] && observedPropertiesDictionary[propertyName].length > 0)
        {
            observedPropertiesDictionary[propertyName].forEach(function(item){
                item.apply(null, [this,oldValue,newValue]);
            },this)
        }

        if(bindedPropertiesDictionary[propertyName])
        {
            bindedPropertiesDictionary[propertyName].forEach(function(item){
                item.value.forEach(function(prop){

                    item.key[prop] = newValue;

                }, this)
            },this)
        }
    }
}