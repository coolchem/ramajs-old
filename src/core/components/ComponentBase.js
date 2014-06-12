$r.Class("ComponentBase").extends("EventDispatcher")(function () {


    this.compid = "";
    this.comp = "";
    this.initialized = false;
    this.stage = null;

    var _elements = new $r.ArrayList();

    this.init = function () {

        this[0] = document.createElement("div");

    };

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

    this.get("visibility",function(){
        return this.getStyle("visibility");

    })
    this.set("visibility",function(value){
        this.setStyle("visibility", value);
    })

    this.get("display",function(){
        return this.getStyle("display")

    })
    this.set("display",function(value){
        this.setStyle("display", value);
    })

    this.get("width",function(){
        return this.getStyle("width")

    })
    this.set("width",function(value){
        this.setStyle("width", value);
    })

    this.get("height",function(){
        return this.getStyle("height")

    })
    this.set("height",function(value){
        this.setStyle("height", value);
    })

    this.get("top",function(){
        return this.getStyle("top")

    })
    this.set("top",function(value){
        this.setStyle("top", value);
    })

    this.get("bottom",function(){
        return this.getStyle("bottom")

    })
    this.set("bottom",function(value){
        this.setStyle("bottom", value);
    })

    this.get("left",function(){
        return this.getStyle("left")

    })
    this.set("left",function(value){
        this.setStyle("left", value);
    })

    this.get("right",function(){
        return this.getStyle("right")

    })
    this.set("right",function(value){
        this.setStyle("right", value);
    })

    this.get("paddingLeft",function(){
        return this.getStyle("paddingLeft")

    })
    this.set("paddingLeft",function(value){
        this.setStyle("paddingLeft", value);
    })

    this.get("paddingRight",function(){
        return this.getStyle("paddingRight")

    })
    this.set("paddingRight",function(value){
        this.setStyle("paddingRight", value);
    })

    this.get("paddingTop",function(){
        return this.getStyle("paddingTop")

    })
    this.set("paddingTop",function(value){
        this.setStyle("paddingTop", value);
    })

    this.get("paddingBottom",function(){
        return this.getStyle("paddingBottom")

    })
    this.set("paddingBottom",function(value){
        this.setStyle("paddingBottom", value);
    })




    this.find = function(selector){
        return $r.find(selector, this[0]);
    };

    this.initialize = function () {

        if (this.initialized)
            return;
        this.setStyle("position", "absolute");
        this.$$createChildren();
        this.$$childrenCreated();
        this.initialized = true;
    };

    this.addElement = function (element) {
        this.addElementAt(element, _elements.length)

    };

    this.addElementAt = function (element, index) {

        if(index === -1)
        {
            index = 0;
        }

        if(_elements.length <= 0 || index > this.elements.length-1)
        {
            this[0].appendChild(element[0])
        }
        else
        {
            var refChild = _elements.source[index][0];
            this[0].insertBefore(element[0], refChild)
        }

        element.parentComponent = this;
        element.stage = this.stage;
        element.initialize();
        this.elements.addItemAt(element,index);

    };

    this.removeElement = function (element) {
        this.elements.removeItem(element);
        this[0].removeChild(element[0]);
    };

    this.removeAllElements = function (element) {

        this[0].innerHTML = "";
        this.elements = new $r.ArrayList();
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
