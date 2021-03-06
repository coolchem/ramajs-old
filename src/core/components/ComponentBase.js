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

    this.get("class",function(){
        return this.getAttribute('class')

    })
    this.set("class",function(value){
        this.setAttribute('class', $r.trim(value));
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
        while (this[0].firstChild) {
            this[0].removeChild(this[0].firstChild);
        }
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
        this[0].setAttribute(name, value);

    };

    this.setStyle = function(styleName, value){
            this[0].style[styleName] = value;
    }

    this.getStyle = function(styleName){
            return this[0].style[styleName];
    }

    this.hasClass = function (selector) {
        if (!this.getAttribute) return false;
        return ((" " + (this.getAttribute('class') || '') + " ").replace(/[\n\t]/g, " ").
                indexOf( " " + selector + " " ) > -1);
    }

    this.removeClass = function(cssClasses) {
        if (cssClasses && this.setAttribute) {
            $r.forEach(cssClasses.split(' '), function(cssClass) {
                this[0].setAttribute('class', trim(
                        (" " + (this.getAttribute('class') || '') + " ")
                                .replace(/[\n\t]/g, " ")
                                .replace(" " + $r.trim(cssClass) + " ", " "))
                );
            }, this);
        }
    }

    this.addClass = function(cssClasses) {
        if (cssClasses && this.setAttribute) {
            var existingClasses = (' ' + (this.getAttribute('class') || '') + ' ')
                    .replace(/[\n\t]/g, " ");

            $r.forEach(cssClasses.split(' '), function(cssClass) {
                cssClass = $r.trim(cssClass);
                if (existingClasses.indexOf(' ' + cssClass + ' ') === -1) {
                    existingClasses += cssClass + ' ';
                }
            }, this);

            this[0].setAttribute('class', $r.trim(existingClasses));
        }
    }

    this.toggleClass = function(selector) {
        if (selector) {
            $r.forEach(selector.split(' '), function(className){
                var classCondition = !this.hasClass(className);
                if(classCondition)
                    this.addClass(className)
                else
                    this.removeClass(className)
            }, this);
        }
    }

    this.$$createChildren = function () {

    };


    this.$$childrenCreated = function () {

        this.$$updateDisplay();

    };

    this.$$updateDisplay = function(){


    }

    this.focus = function(){

      if(arguments.length > 0 && arguments[0] === null)
      {
          this[0].blur();
          return
      }

        this[0].focus();
    }

    this.validateState = function(){

        if($r.isFunction(this.getCurrentState))
        {
            this.currentState = this.getCurrentState();
        }

    }

})
