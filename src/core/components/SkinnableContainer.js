
rama.SkinnableComponent.extend("SkinnableContainer", function(){

    var _htmlContent = [];
    Object.defineProperty(this, "htmlContent",
            {   get : function(){
                return _htmlContent;
            },
                set : function(newValue){
                    _htmlContent = newValue;
                },
                enumerable : true,
                configurable : true
            });

    this.skin = '<div comp="Skin">' +
            '<div comp="Group" compid="contentGroup">' +
            '</div>' +
            '</div>';

    this.skinParts = [{id:'contentGroup', required:true}];

    this.contentGroup = null;

    this.partAdded = function(partName, instance){

        this._super(partName, instance);

        if(instance === this.contentGroup)
        {
            this.contentGroup.htmlContent = this.htmlContent;
        }
    };

});