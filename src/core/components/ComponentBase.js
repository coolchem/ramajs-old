$r.Class("ComponentBase").extends("EventDispatcher")(function () {


    this.id = "";
    this.comp = "";
    this.initialized = false;
    this.parentApplication = null;

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

    this.initialize = function () {

        if (this.initialized)
            return;
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
        element.parentApplication = this.parentApplication;
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
