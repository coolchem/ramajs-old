
rama.GroupBase.extend("DataGroup", function(){

    var _htmlContent = [];
    Object.defineProperty(this, "htmlContent",
            {   get : function(){
                return _htmlContent;
            },
                set : function(newValue){
                    _htmlContent = newValue;
                    setHTMLContent(this);
                },
                enumerable : true,
                configurable : true
            });

    this.$$createChildren = function(){

        if(this.htmlContent.length > 0)
        {
            for(var i = 0; i< this.htmlContent.length; i++)
            {
                var componentClassName = $(this.htmlContent[i]).attr(R_COMP);
                var comp = createComponent(this.htmlContent[i],classFactory(componentClassName));
                this.addElement(comp);
            }
        }
    };

    function setHTMLContent(_this)
    {
        if(_this.initialized)
        {
            _this[0].innerHTML = "";
            _this.$$createChildren();
        }
    }
});