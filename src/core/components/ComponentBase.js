
$r.ComponentBase = extend("EventDispatcher", function () {


    this.compid = "";
    this.comp = "";
    this.initialized = false;

    var _elements = [];

    this.get("textContent",function(){
        return this[0].textContent;

    })

    this.set("textContent",function(value){
        this[0].textContent = value;
    })

    this.get("elements",function(){
        return _elements

    })

    this.set("elements",function(value){
        _elements = value;
    })

    this.parentComponent = null;

    var _visibility = "";

    this.get("visibility",function(){
        return _visibility

    })

    this.set("visibility",function(value){
        _visibility= value;
        this.setStyle("visibility", _visibility);
    })

    var _display = "";

    this.get("display",function(){
        return _display

    })

    this.set("display",function(value){
        _display = value;
        this.setStyle("display", _display);
    })

    this.classConstructor = function () {

        this[0] = document.createElement("div");
    };

    this.find = function(selector){
        return $r.find(selector, this[0]);
    };

    this.initialize = function () {

        if (this.initialized)
            return;
        this.$$createChildren();
        this.$$childrenCreated();

        this.initialized = true;
    };

    this.addElement = function (element) {
        element.parentComponent = this;
        element.initialize();
        this.elements.push(element);
        this[0].appendChild(element[0])
    };

    this.removeElement = function (element) {

        this[0].removeChild(element[0]);
    };

    this.removeAllElements = function (element) {

        this[0].innerHTML = "";
        this.elements = [];
    };

    this.replaceElement = function (element) {

        this[0].replaceChild(element);
    };

    this.hasAttribute = function(name){

        return this[0].hasAttribute(name);
    };

    this.getAttribute = function(name){

        return this[0].getAttribute(name);
    };


    this.setAttribute = function(name, value)
    {
        var nameAndState = name.split('.');
        var propertyName = $r.camelCase(nameAndState[0].toLowerCase());
        if(typeof this[propertyName] !== "function")
        {
            if(nameAndState.length === 1)
            {
                this[0].setAttribute(nameAndState[0], value);
                this[propertyName] = value;
            }
        }
    };

    this.setStyle = function(styleName, value){
        this[0].style[styleName] = value;
    }

    this.getStyle = function(styleName){
        return this[0].style[styleName];
    }


    this.$$createChildren = function () {

    };


    this.$$childrenCreated = function () {

        this.$$updateDisplay();

    };

    this.$$updateDisplay = function(){


    }



})
