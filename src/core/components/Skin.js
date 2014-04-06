$r("Skin").extends($r("Group"))(function () {

    var componentUtil = $r.$$componentUtil;

    this.getSkinPart = function (compId) {

        var element = null;

        var dynamicElements = this.find('[' + componentUtil.COMP_ID + '=' + compId + ']');

        if (dynamicElements && dynamicElements.length > 0) {
           return $r.$$componentUtil.skinPartDictionary.get(dynamicElements[0]);
        }

        return element;
    }
});
