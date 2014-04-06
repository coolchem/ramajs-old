$r("Component").extends($r("EventDispatcher"))(function () {

    this.compid = "";
    this.comp = "";
    this.initialized = false;

    this.elements = [];

    this.parentComponent = null;

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

    this.inValidate = function () {

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

    this.replaceElement = function (element) {

        this[0].replaceChild(element);
    };

    this.hasAttribute = function(name){

        return this[0].hasAttribute(name);
    };

    this.getAttribute = function(name){

        return this[0].getAttribute(name);
    };


    this.setAttribute = function(name, value){

        return this[0].setAttribute(name, value);
    };



    this.$$createChildren = function () {

    };


    this.$$childrenCreated = function () {
    };


});
