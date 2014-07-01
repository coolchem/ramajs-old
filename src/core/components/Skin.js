$r.Class("Skin").extends("Group")(function () {

    var compileHTMLNode = this.bind(compileHTMLNodeFn);

    var skinStates = {};

    var _compiledElements = {};

    var stateManagedProperties = {};

    var _currentState = "";

    this.ownerComponent = null;

    this.get("currentState",function(){
        return _currentState

    })

    this.set("currentState",function(value){

        if(skinStates[value])
        {
            _currentState = value;
            skinStates[_currentState].apply();
        }
        else if(value !== "")
        {
            throw new ReferenceError("State not Found Exception: The state '" + value +
                    "' being set on the component is not found in the skin");
        }
    })

    this.init = function(skinClass){
        this.super.init();
        compileHTMLNode(this,$r.skinFactory(skinClass));
        this.setAttribute("comp", "Skin");
        for(var stateName in skinStates)
        {
            var state = skinStates[stateName];
            if(stateManagedProperties.hasOwnProperty(stateName))
            {
                state.registerComponents(stateManagedProperties[stateName])
            }
        }
    }

    this.getSkinPart = function (compId) {

        return _compiledElements[compId];
    }

    function createComponentFromNode(node){

        var componentClass = null;
        var component = null;
        if(node.getAttribute(R_COMP) !== undefined && node.getAttribute(R_COMP) !== null)
        {
            componentClass = $r.classFactory(node.getAttribute(R_COMP))
        }

        if (componentClass !== undefined && componentClass != null && componentClass !== "") {
            component = new componentClass();
            component.__isRamaSupportedComponent__ = true;
        }
        else {
            component = new $r.Group();
            component.__isRamaSupportedComponent__ = false;
        }

        component[0] = node;
        return component;
    }

    function compileHTMLNodeFn(component,node)
    {
        //applying node attributes
        if (node.attributes !== undefined && node.attributes.length > 0) {

            for (var j = 0; j < node.attributes.length; j++) {
                var attr = node.attributes[j];
                component.setAttribute(attr.name, attr.value);

                if(component !== this)
                    registerStateManagedComponents(component, attr.name, attr.value);
            }
        }

        if (node.children !== undefined && node.children.length > 0) {


            for (var i = 0; i < node.children.length; i++) {
                var childNode = node.children[i];

                var continueProcessingNode = true;
                if(component === this)
                {
                    if(childNode.tagName.toLowerCase() === $r.STATES)
                    {
                        for (var j = 0; j < childNode.children.length; j++)
                        {
                            var stateNode = childNode.children[j];
                            if(stateNode.getAttribute("name") !== null && stateNode.getAttribute("name") !== undefined)
                            {
                                var state = new $r.State(stateNode.getAttribute("name"), stateNode.getAttribute("stateGroups"));
                                skinStates[state.name] = state;
                            }
                        }

                        continueProcessingNode = false;
                    }
                }

                if(continueProcessingNode){
                    //checking if tag name matches a property name in the component and
                    //the property should be an array
                    var childNodeTagName = $r.camelCase(childNode.tagName.toLowerCase());
                    if(component[childNodeTagName] &&  component[childNodeTagName] instanceof Array)
                    {
                        for (var k = 0; k < childNode.children.length; k++)
                        {
                            var childComponent1 = createComponentFromNode(childNode.children[k]);
                            compileHTMLNode(childComponent1,childNode.children[k]);
                            component[childNodeTagName].push(childComponent1);
                        }

                    }
                    else if(childNodeTagName === $r.LAYOUT) //now checking if the child tag name is layout
                    {
                        //Removing layout support to be addressed later
                        /*                    var layoutClass = $r.classFactory(childNode.getAttribute("class"))
                         if(layoutClass)
                         {
                         component.layout = new layoutClass();
                         for (var j = 0; j < childNode.attributes.length; j++) {
                         var attr = childNode.attributes[j];
                         component.layout[$r.camelCase(attr.name)] = attr.value

                         if(component !== this)
                         registerStateManagedComponents(component.layout, attr.name, attr.value);
                         }
                         }*/


                    }
                    else
                    {

                        var childComponent = createComponentFromNode(childNode);
                        compileHTMLNode(childComponent,childNode);
                        if(component.htmlContent)
                        {
                            component.htmlContent.push(childComponent);
                        }
                    }
                }

            }

            //setting innerHTML to empty so that children are created through normal process
            if(component.__isRamaSupportedComponent__)
                component.removeAllElements();
        }

        if(component !== this)
            registerSkinPart(component);

        return component;
    }

    function registerSkinPart(component) {

        var componentAttr = component.getAttribute("id");
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

})