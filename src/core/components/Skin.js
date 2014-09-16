$r.Class("Skin").extends("Group")(function () {

    var compileHTMLNode = this.bind(compileHTMLNodeFn);

    var skinStates = [];

    var _compiledElements = {};

    var stateManagedProperties = {};

    var _currentState = "";

    var setCurrentState = this.bind(setCurrentStateFn);

    this.ownerComponent = null;

    this.get("currentState",function(){
        return _currentState

    })

    this.set("currentState",function(value){

        if (_currentState !== value) {
            setCurrentState(value);
        }

    })

    this.init = function(skinClass){
        this.super.init();

        this[0] = $r.skinFactory(skinClass)
        compileHTMLNode(this,this[0]);
        this.setAttribute("comp", "Skin");

        $r.forEach(skinStates, function (state) {

            if (stateManagedProperties.hasOwnProperty(state.name)) {

                state.propertySetters.push.apply(state.propertySetters, stateManagedProperties[state.name]);
            }

            $r.forEach(state.stateGroups, function(stateGroup){

                if (stateManagedProperties.hasOwnProperty(stateGroup)) {

                    state.propertySetters.push.apply(state.propertySetters, stateManagedProperties[stateGroup]);
                }
            })


        })
    }

    this.getSkinPart = function (compId) {

        return _compiledElements[compId];
    }

    this.hasState = function(stateName)
    {
        for (var i = 0; i < skinStates.length; i++)
        {
            if (skinStates[i].name == stateName)
                return true;
        }
        return false;

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
                                var state = new $r.State(stateNode.getAttribute("name"), stateNode.getAttribute("state_groups"));
                                skinStates.push(state);
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
            if(!component.__isRamaSupportedComponent__)
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
        if(nameAndState.length == 2)
        {
            var stateName = nameAndState[1].toLowerCase();
            if(stateManagedProperties[stateName] === undefined)
            {
                stateManagedProperties[stateName] = [];
            }

            var propertySetter = new $r.PropertySetter(component,propertyName,attrValue)

            stateManagedProperties[stateName].push(propertySetter);
        }
        else
        {
            component[propertyName] =  attrValue;
        }

    }


    function setCurrentStateFn(stateName) {

        var oldState = getState(_currentState);

        if (this.initialized) {

            if(isBaseState(stateName))
            {
                removeState(oldState);
                _currentState = stateName;

            }
            else
            {

                var destination = getState(stateName);

                initializeState(stateName);

                // Remove the existing state
                removeState(oldState);
                _currentState = stateName;

                applyState(destination);
            }

        }
    }

    function isBaseState(stateName) {
        return !stateName || stateName == "";
    }

    function initializeState(stateName)
    {
        var state = getState(stateName)

        if (state)
        {
            state.initialize();
        }
    }

    function removeState(state){

        if(state)
        {
            for(var i = 0; i< state.propertySetters.length; i++)
            {
                state.propertySetters[i].remove();
            }
        }

    }
    function applyState(state){

        if(state)
        {
            for(var i = 0; i< state.propertySetters.length; i++)
            {
                state.propertySetters[i].apply();
            }
        }

    }

    function getState(stateName)
    {
        if (!skinStates || isBaseState(stateName))
            return null;

        for (var i = 0; i < skinStates.length; i++)
        {
            if (skinStates[i].name == stateName)
                return skinStates[i];
        }

        throw new ReferenceError("State not Found Exception: The state '" + stateName +
                "' being set on the component is not found in the skin");

        return null;
    }

})