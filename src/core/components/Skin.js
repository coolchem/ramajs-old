
rama.Group.extend("Skin", function(){

    this.getSkinPart = function(compId){

        var element = null;

        var dynamicElements = this.find('[' + COMP_ID + '=' + compId + ']');
        var skinPartDictionaryElement = skinPartDictionary[compId];

        if( skinPartDictionaryElement && dynamicElements && dynamicElements.length > 0)
        {
            if(skinPartDictionaryElement[0] === dynamicElements[0])
                return skinPartDictionaryElement;
        }

        return element;
    }
});