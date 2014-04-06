
function classUtil(){

    var classUtil = {};
    classUtil.classFactory = function(className) {
        var libraryAndClass = getLibraryAndClass(className);

        if (libraryAndClass && libraryAndClass.library && libraryAndClass.className && libraryAndClass.className !== "") {
            return libraryAndClass.library.Class(libraryAndClass.className);
        }

        return null;

    };

    classUtil.skinFactory = function(component) {
        var skinNode = null;

        var skinClassName = component.skinClass;

        if (!skinClassName || skinClassName !== "") {
            var libraryAndClass = getLibraryAndClass(skinClassName);

            if (libraryAndClass.library && libraryAndClass.className && libraryAndClass.className !== "") {
                var skinItem = libraryAndClass.library.$skins[libraryAndClass.className];
                var tempDiv = document.createElement('div');
                if (skinItem.skin && skinItem.skin !== "") {
                    tempDiv.innerHTML = skinItem.skin;

                    skinNode = tempDiv.children[0];

                    tempDiv.removeChild(skinNode);
                }
                else if (skinItem.skinURL && skinItem.skinURL !== "") {

                    skinItem.skin = getRemoteSkin(skinItem.skinURL);

                    tempDiv.innerHTML = skinItem.skin;

                    skinNode = tempDiv.children[0];

                    tempDiv.removeChild(skinNode);
                }
            }

        }

        return skinNode;
    };

    function getRemoteSkin(skinURL) {

        var xmlhttp;
        if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
            xmlhttp = new XMLHttpRequest();
        }
        else {// code for IE6, IE5
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }

        xmlhttp.open("GET", skinURL, false);
        xmlhttp.send();

        return xmlhttp.responseText;
    }

    function getLibraryAndClass(className) {
        var libraryAndClass = null;
        if (className !== null && className !== undefined && className !== "") {
            libraryAndClass = {};
            var names = className.split(':');

            var libraryName = LIBRARY_RAMA;
            var extractedClassName = "";

            if (names.length > 1) {
                libraryName = names[0];
                extractedClassName = names[1];
            }
            else if (names.length === 1) {
                extractedClassName = names[0];
            }

            libraryAndClass.library = libraryDictionary[libraryName];
            libraryAndClass.className = extractedClassName;
        }

        return libraryAndClass;
    }

    return classUtil;
}




