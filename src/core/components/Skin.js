$r.Class("Skin").extends($r.Class("Group"))(function () {

    var componentUtil = $r.$$componentUtil;

    var states = [];

    this.$$createChildren = function () {

        if (this.htmlContent.length > 0) {
            for (var i = 0; i < this.htmlContent.length; i++) {

                if(this.htmlContent[i].tagName.toLowerCase() === componentUtil.STATES)
                {
                    if(this.htmlContent[i].children.length > 0)
                    {
                        //console.log(this.htmlContent[i][0]);
                    }
                }
                else
                {
                    this.$createAndAddChild(this.htmlContent[i]);
                }
            }
        }
    };

    this.$createAndAddChild = function(componentNode){
        var comp = this.super.$createAndAddChild(componentNode);

/*        for (var i = 0; i < comp.attributes.length; i++) {
            var attr = attrs[i];

            object[camelCase(attr.name.toLowerCase())] = attr.value;
        }*/
    };


    this.getSkinPart = function (compId) {

        var element = null;

        var dynamicElements = this.find('[' + componentUtil.COMP_ID + '=' + compId + ']');

        if (dynamicElements && dynamicElements.length > 0) {
           return $r.$$componentUtil.skinPartDictionary.get(dynamicElements[0]);
        }

        return element;
    }
});
