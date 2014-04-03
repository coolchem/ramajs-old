$r("Skin").extends($r("Group"))(function () {

    var componentUtil = $r.$$componentUtil;

    this.getSkinPart = function (compId) {

        var element = null;

        var dynamicElements = this.find('[' + componentUtil.COMP_ID + '=' + compId + ']');
        var skinPartDictionaryElement = $r.$$componentUtil.skinPartDictionary[compId];

        if (skinPartDictionaryElement && dynamicElements && dynamicElements.length > 0) {
            if (skinPartDictionaryElement[0] === dynamicElements[0])
                return skinPartDictionaryElement;
        }

        return element;
    }
});
