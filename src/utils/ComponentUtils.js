/**
 * Created with IntelliJ IDEA.
 * User: varunreddy
 * Date: 3/30/14
 * Time: 9:30 AM
 * To change this template use File | Settings | File Templates.
 */

function classFactory(className)
{
    var libraryAndClass = getLibraryAndClass(className);

    if(libraryAndClass && libraryAndClass.library && libraryAndClass.className && libraryAndClass.className !== "")
    {
        return libraryAndClass.library[libraryAndClass.className];
    }

    return null;

}

function getRemoteSkin(skinURL) {
    return $.ajax({
        type: "GET",
        url: skinURL,
        async: false
    }).responseText;
}

function skinFactory(component)
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
}