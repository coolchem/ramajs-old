
function componentUtil(){


    var componentUtil = {};
    var SPECIAL_CHARS_REGEXP = /([\:\-\_]+(.))/g;
    var MOZ_HACK_REGEXP = /^moz([A-Z])/;

    componentUtil.R_COMP = R_COMP;
    componentUtil.COMP_ID = COMP_ID;

    var skinPartDictionary = componentUtil.skinPartDictionary = new Dictionary();

    componentUtil.createComponent = function(node, componentClass) {
        var component = null;

        if (componentClass !== undefined && componentClass != null && componentClass !== "") {
            component = new componentClass();
        }
        else {
            component = $r.new("Group");
            component[0] = node;
        }

        //applying node attributes

        if (node.attributes !== undefined && node.attributes.length > 0) {

            for (var j = 0; j < node.attributes.length; j++) {
                var attr = node.attributes[j];
                component.setAttribute(attr.name, attr.value);
            }
            applyAttributes(component, node.attributes);
        }

        //setting up html content

        if (node.children !== undefined && node.children.length > 0) {
            //setting innerHTML to empty so that children are created through normal process
            component[0].innerHTML = "";
            for (var i = 0; i < node.children.length; i++) {
                var childNode = node.children[i];
                component.htmlContent.push(childNode);
            }
        }

        registerSkinPart(component);

        return component;
    };

    function registerSkinPart(component) {

        var componentAttr = component.getAttribute(COMP_ID);

        if (componentAttr !== null && componentAttr !== undefined && componentAttr !== "") {

            skinPartDictionary.put(component[0], component);
        }
    }

    function applyAttributes(object, attrs) {
        for (var i = 0; i < attrs.length; i++) {
            var attr = attrs[i];
            object[camelCase(attr.name.toLowerCase())] = attr.value;
        }
    }

    function camelCase(name) {
        return name.
                replace(SPECIAL_CHARS_REGEXP,function (_, separator, letter, offset) {
                    return offset ? letter.toUpperCase() : letter;
                }).
                replace(MOZ_HACK_REGEXP, 'Moz$1');
    }

    function cleanWhitespace(node) {
        for (var i = 0; i < node.childNodes.length; i++) {
            var child = node.childNodes[i];
            if (child.nodeType == 3 && !/\S/.test(child.nodeValue)) {
                node.removeChild(child);
                i--;
            }
            if (child.nodeType == 1) {
                cleanWhitespace(child);
            }
        }
        return node;
    }

    return componentUtil;
}


