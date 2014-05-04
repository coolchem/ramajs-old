$r.Class("Dictionary")(function(){

    var dictionaryArray = [];

    this.get = function(key){

        var item = getKeyItem(key);
        if(item !== undefined)
        {
            return item.value;
        }
    };
    this.put = function(key, value){

        var item = getKeyItem(key);
        if(item !== undefined)
        {
            item.value = value;
        }
        else
        {
            dictionaryArray.push({key:key, value:value});
        }
    };

    this.remove = function(key){
        for(var i = 0; i<dictionaryArray.length; i++)
        {
            var item = dictionaryArray[i];
            if(item.key === key)
            {
                dictionaryArray.splice(i, 1);
                break;
            }
        }
    };

    function getKeyItem(key){

        for(var i = 0; i<dictionaryArray.length; i++)
        {
            var item = dictionaryArray[i];
            if(item.key === key)
            {
                return item;
            }
        }

    }


});
