$r.Class("SkinnableContainer").extends($r.Class("SkinnableComponent"))(function () {

    var _htmlContent = [];
    Object.defineProperty(this, "htmlContent",
            {   get:function () {
                return _htmlContent;
            },
                set:function (newValue) {
                    _htmlContent = newValue;
                },
                enumerable:true,
                configurable:true
            });

    this.skinParts = [
        {id:'contentGroup', required:true}
    ];

    this.contentGroup = null;

    this.partAdded = function (partName, instance) {

        this.super.partAdded(partName, instance);

        if (instance === this.contentGroup) {
            this.contentGroup.htmlContent = this.htmlContent;
        }
    };

});
