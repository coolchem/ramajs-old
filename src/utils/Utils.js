/**
 * Created with IntelliJ IDEA.
 * User: varunreddy
 * Date: 3/29/14
 * Time: 8:29 PM
 * To change this template use File | Settings | File Templates.
 */


function applyAttributes(object, attrs)
{
    for(var i=0; i< attrs.length; i++)
    {
        var attr = attrs[i];
        object[camelCase(attr.name.toLowerCase())] = attr.value;
    }
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

function cleanWhitespace(node)
{
    for (var i=0; i<node.childNodes.length; i++)
    {
        var child = node.childNodes[i];
        if(child.nodeType == 3 && !/\S/.test(child.nodeValue))
        {
            node.removeChild(child);
            i--;
        }
        if(child.nodeType == 1)
        {
            cleanWhitespace(child);
        }
    }
    return node;
}

function camelCase(name) {
    return name.
            replace(SPECIAL_CHARS_REGEXP, function(_, separator, letter, offset) {
                return offset ? letter.toUpperCase() : letter;
            }).
            replace(MOZ_HACK_REGEXP, 'Moz$1');
}

function isString(value){return typeof value == 'string';}