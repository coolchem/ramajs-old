/**
 * RamaJS JavaScript Framework v1.0
 * DEVELOPED BY
 * Varun Reddy Nalagatla
 * varun8686@gmail.com
 *
 * Copyright 2014 Varun Reddy Nalagatla a.k.a coolchem
 * Released under the MIT license
 *
 * FORK:
 * https://github.com/coolchem/rama
 */
(function(window, document) {'use strict';

    var skinPartDictionary = {};

    function registerSkinPart(component)
    {
        if(component.attr(COMP_ID) && component.attr(COMP_ID) !== "")
        {
            skinPartDictionary[component.attr(COMP_ID)] = component;
        }
    }

    function setLayout(component, layoutNode)
    {
        if(layoutNode.childNodes && layoutNode.childNodes.length > 0)
        {
            layoutNode = cleanWhitespace(layoutNode);
            var layoutTypeNode = layoutNode.childNodes[0];
            var layout = rama[camelCase(layoutTypeNode.tagName.toLowerCase())];
            if(layout)
            {
                component.layout = new layout();
                component.layout.target = component;
                applyAttributes(component.layout, layoutTypeNode.attributes)
            }
        }
    }

    function createComponent(node,componentClass)
    {
        var component = null;

        if(componentClass !== undefined && componentClass != null && componentClass !== "")
        {
            component = new componentClass();
        }
        else
        {
            component = new rama.Group();
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
    }

    $(document).ready(function() {
        initApplications();
    });

})(window, document);
