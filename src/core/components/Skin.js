$r.Class("Skin").extends($r.Class("GroupBase"))(function () {

    var STATES = "states";

    var skinStates = {};

    var _compiledElements = {};

    var stateManagedProperties = {};

    var _currentState = "";

    this.get("currentState",function(){
        return _currentState

    })

    this.set("currentState",function(value){

        if(skinStates[value])
        {
            _currentState = value;
            skinStates[_currentState].apply();
        }
        else
        {
            throw new ReferenceError("State not Found Exception: The state '" + value +
                    "' being set on the component is not found in the skin");
        }
    })

    this.Skin = function(skinClass){
         this.super();
        compileSkin($r.skinFactory(skinClass),this);
    }

    this.getSkinPart = function (compId) {

        return _compiledElements[compId];
    }


    function compileSkin(skinNode,_this){

        //applying skinNode attributes
        if (skinNode.attributes !== undefined && skinNode.attributes.length > 0) {

            for (var j = 0; j < skinNode.attributes.length; j++) {
                var attr = skinNode.attributes[j];
                _this.setAttribute(attr.name, attr.value);
            }
        }

        //setting up html content
        if (skinNode.children !== undefined && skinNode.children.length > 0) {
            //setting innerHTML to empty so that children are created through normal process
            _this[0].innerHTML = "";


            for (var i = 0; i < skinNode.children.length; i++)
            {
                var childNode = skinNode.children[i];

                if(childNode.tagName.toLowerCase() === $r.STATES)
                {
                    for (var j = 0; j < childNode.children.length; j++)
                    {
                        var stateNode = childNode.children[j];
                        if(stateNode.getAttribute("name") !== null && stateNode.getAttribute("name") !== undefined)
                        {
                            var state = $r.new("State", [stateNode.getAttribute("name"), stateNode.getAttribute("stateGroups")]);
                            skinStates[state.name] = state;
                        }
                    }
                }
                else
                {
                    _this.htmlContent.push(compileHTMLNode(childNode));
                }

            }
        }

        //setting up skin states
        for(var stateName in skinStates)
        {
            var state = skinStates[stateName];
            if(stateManagedProperties.hasOwnProperty(stateName))
            {
                state.registerComponents(stateManagedProperties[stateName])
            }
        }

    }

    function compileHTMLNode(node)
    {
        var componentClass = null;
        var component = null;
        if(node.getAttribute(R_COMP) !== undefined && node.getAttribute(R_COMP) !== null)
        {
            componentClass = $r.classFactory(node.getAttribute(R_COMP))
        }

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
                registerStateManagedComponents(component, attr.name, attr.value);
            }
        }

        if (node.children !== undefined && node.children.length > 0) {
            //setting innerHTML to empty so that children are created through normal process
            component.innerHTML = "";
            for (var i = 0; i < node.children.length; i++) {
                var childNode = node.children[i];
                var childComponent = compileHTMLNode(childNode);
                if(component.htmlContent)
                {
                    component.htmlContent.push(childComponent);
                }
            }
        }

        registerSkinPart(component);

        return component;
    }

    function registerSkinPart(component) {

        var componentAttr = component.getAttribute(COMP_ID);
        if (componentAttr !== null && componentAttr !== undefined && componentAttr !== "") {
            _compiledElements[componentAttr] = component;
        }
    }

    function registerStateManagedComponents(component, attrName, attrValue){
        var nameAndState = attrName.split('.');
        var propertyName = $r.camelCase(nameAndState[0].toLowerCase());
        if(typeof component[propertyName] !== "function")
        {
            if(nameAndState.length == 2)
            {
                var stateName = nameAndState[1].toLowerCase();
                if(stateManagedProperties[stateName] === undefined)
                {
                    stateManagedProperties[stateName] = [];
                }

                stateManagedProperties[stateName].push({component:component,propertyName:propertyName,value:attrValue})
            }
        }

    }

});
