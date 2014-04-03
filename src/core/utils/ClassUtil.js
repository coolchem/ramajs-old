
$r.$$classUtil = (function(){

    var LIBRARY_RAMA = "$r";
    var R_APP = "rapp";

    var libraryDictionary = $r.$$libraryDictionary;

    var classFactory =  function(className)
    {
        var libraryAndClass = getLibraryAndClass(className);

        if(libraryAndClass && libraryAndClass.library && libraryAndClass.className && libraryAndClass.className !== "")
        {
            return libraryAndClass.library.Class(libraryAndClass.className);
        }

        return null;

    };

    var skinFactory = function(component)
    {
        var skinNode = null;

        var skinClassName = component.skinClass;

        if(!skinClassName || skinClassName !== "")
        {
            var libraryAndClass = getLibraryAndClass(skinClassName);

            if(libraryAndClass.library && libraryAndClass.className && libraryAndClass.className !== "")
            {
                var skinItem = libraryAndClass.library.$skins[libraryAndClass.className];

                if(skinItem.skin && skinItem.skin !== "")
                {
                    skinNode = $(skinItem.skin)[0];
                }
                else if(skinItem.skinURL && skinItem.skinURL !== "")
                {
                    skinItem.skin = getRemoteSkin(skinItem.skinURL);

                    skinNode = $(skinItem.skin)[0];
                }
            }

        }

        return skinNode;
    };





    function getRemoteSkin(skinURL) {
        return $.ajax({
            type: "GET",
            url: skinURL,
            async: false
        }).responseText;
    }

    function getLibraryAndClass(className)
    {
        var libraryAndClass = null;
        if(className !== undefined && className !== "")
        {
            libraryAndClass = {};
            var names = className.split(':');

            var libraryName = LIBRARY_RAMA;
            var extractedClassName = "";

            if(names.length > 1)
            {
                libraryName = names[0];
                extractedClassName = names[1];
            }
            else if(names.length === 1)
            {
                extractedClassName = names[0];
            }

            libraryAndClass.library = libraryDictionary[libraryName];
            libraryAndClass.className = extractedClassName;
        }

        return libraryAndClass;
    }


    return {

        classFactory:classFactory,
        skinFactory:skinFactory,
        LIBRARY_RAMA:LIBRARY_RAMA

    };

}());
