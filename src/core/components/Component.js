$r("Component")(function () {

    this.compid = "";
    this.comp = "";
    this.initialized = false;
    this.parentComponent = null;

    this.elements = [];

    this.super = function () {

    };

    this.$$super = function () {

        $.extend(this, $("<div></div>")); //every component starts of as empty div
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
        this.append(element);
    };

    this.removeElement = function (element) {

        this.remove(element);
    };


    this.$$createChildren = function () {

    };


    this.$$childrenCreated = function () {

    };


});
