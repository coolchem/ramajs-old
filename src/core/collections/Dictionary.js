$r.Class("Dictionary")(function(){

    var dictionaryArray = [];

    var isFunction = function (fn) {
        var isFunc = (typeof fn === 'function' && !(fn instanceof RegExp)) || toString.call(fn) === '[object Function]';
        if (!isFunc && typeof window !== 'undefined') {
            isFunc = fn === window.setTimeout || fn === window.alert || fn === window.confirm || fn === window.prompt;
        }
        return isFunc;
    };


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

    this.hasKey = function(key){
        var item = getKeyItem(key);
        if(item !== undefined)
        {
            return true;
        }
        else
        {
            return false;
        }
    }

    this.forEach = function(fn,context){

        if (!isFunction(fn)) {
            throw new TypeError('iterator must be a function');
        }

        for(var i = 0; i < dictionaryArray.length; i++)
        {
            fn.call(context, dictionaryArray[i]);
        }

    }

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


})
