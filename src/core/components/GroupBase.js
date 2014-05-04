$r.Class("GroupBase").extends($r.Class("Component"))(function () {


    var classUtil = $r.$$classUtil;

    var componentUtil = $r.$$componentUtil;

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

                this.$createAndAddChild(this.htmlContent[i]);
            }
        }
    };

    this.$createAndAddChild = function(componentNode){
            var componentClassName = componentNode.getAttribute(componentUtil.R_COMP);
            var comp = componentUtil.createComponent(componentNode, classUtil.classFactory(componentClassName));
            this.addElement(comp);
            return comp;
    };

    function setHTMLContent(_this) {
        if (_this.initialized) {
            _this[0].innerHTML = "";
            _this.$$createChildren();
        }
    }
});
