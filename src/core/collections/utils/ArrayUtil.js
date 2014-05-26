function ArrayUtil(){

    var arrayUtil = {};
    arrayUtil.toArray = function(obj){
        if (obj == null)
            return [];

        else if (obj instanceof Array)
        {
            return obj;
        }
    else
        return [ obj ];
    }

    arrayUtil.getItemIndex = function(item, source){

        if(source instanceof Array)
        {
            var n = source.length;
            for (var i = 0; i < n; i++)
            {
                if (source[i] === item)
                    return i;
            }
        }
        return -1;

    }

    return arrayUtil;

}
