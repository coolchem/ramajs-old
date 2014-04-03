$r.$$componentUtil = (function(){



    var SPECIAL_CHARS_REGEXP = /([\:\-\_]+(.))/g;
    var MOZ_HACK_REGEXP = /^moz([A-Z])/;



    var R_COMP = "comp";
    var COMP_ID = "compid";

    var skinPartDictionary = {};

    var createComponent =  function(node,componentClass)
    {
        var component = null;

        if(componentClass !== undefined && componentClass != null && componentClass !== "")
        {
            component = new componentClass();
        }
        else
        {
            component = new $r.Class("Group")();
            component[0] = node;
        }

        //applying node attributes

        if(node.attributes !== undefined && node.attributes.length > 0)
        {
            $.each(node.attributes, function() {
                component.attr(this.name, this.value);
            });

            applyAttributes(component, node.attributes);
        }



        //setting up html content

        var children = $(node).children();

        if(children !== undefined && children.length > 0)
        {
            //setting innerHTML to empty so that children are created through normal process
            component[0].innerHTML = "";
            for(var i=0; i< children.length; i++)
            {
                var childNode = children[i];
                component.htmlContent.push(childNode);
            }
        }

        registerSkinPart(component);

        return component;
    };

    function registerSkinPart(component)
    {
        if(component.attr(COMP_ID) && component.attr(COMP_ID) !== "")
        {
            skinPartDictionary[component.attr(COMP_ID)] = component;
        }
    }

    function applyAttributes(object, attrs)
    {
        for(var i=0; i< attrs.length; i++)
        {
            var attr = attrs[i];
            object[camelCase(attr.name.toLowerCase())] = attr.value;
        }
    }

    function camelCase(name) {
        return name.
                replace(SPECIAL_CHARS_REGEXP, function(_, separator, letter, offset) {
                    return offset ? letter.toUpperCase() : letter;
                }).
                replace(MOZ_HACK_REGEXP, 'Moz$1');
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


    return {
        R_COMP:R_COMP,
        COMP_ID:COMP_ID,
        createComponent:createComponent,
        skinPartDictionary:skinPartDictionary
    };
}());
