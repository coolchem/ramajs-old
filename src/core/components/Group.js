$r.Group = extend("ComponentBase", function () {


    var _htmlContent = [];

    this.get("htmlContent",function(){

        return _htmlContent;
    });

    this.set("htmlContent",function(newValue){

        _htmlContent = newValue;
        setHTMLContent(this);
    });

    this.$$createChildren = function () {

        if (this.htmlContent.length > 0) {
            for (var i = 0; i < this.htmlContent.length; i++) {

                this.addElement(this.htmlContent[i]);
            }
        }
    };

    function setHTMLContent(_this) {
        if (_this.initialized) {
            _this.removeAllElements();
            _this.$$createChildren();
            _this.$$updateDisplay();
        }
    }
})
