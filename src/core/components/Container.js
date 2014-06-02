$r.Class("Container").extends("Component")(function () {

    var _htmlContent = [];
    this.get("htmlContent", function () {
        return _htmlContent;
    });

    this.set("htmlContent", function(newValue){

        _htmlContent = newValue;
    });

    this.skinParts = [
        {id:'contentGroup', required:false}
    ];

    this.contentGroup = null;

    this.partAdded = function (partName, instance) {

        this.super.partAdded(partName, instance);

        if (instance === this.contentGroup) {
            this.contentGroup.htmlContent = this.htmlContent;
        }
    };

})
