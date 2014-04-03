$r("GroupBase").extends($r("Component"))(function () {

    var classUtil = $r.$$classUtil;

    var componentUtil = $r.$$componentUtil;

    var _htmlContent = [];
    Object.defineProperty(this, "htmlContent",
            {   get:function () {
                return _htmlContent;
            },
                set:function (newValue) {
                    _htmlContent = newValue;
                    setHTMLContent(this);
                },
                enumerable:true,
                configurable:true
            });

    this.$$createChildren = function () {

        if (this.htmlContent.length > 0) {
            for (var i = 0; i < this.htmlContent.length; i++) {
                var componentClassName = $(this.htmlContent[i]).attr(componentUtil.R_COMP);
                var comp = componentUtil.createComponent(this.htmlContent[i], classUtil.classFactory(componentClassName));
                this.addElement(comp);
            }
        }
    };

    function setHTMLContent(_this) {
        if (_this.initialized) {
            _this[0].innerHTML = "";
            _this.$$createChildren();
        }
    }
});
