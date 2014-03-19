/**
 * Created with IntelliJ IDEA.
 * User: varunreddy
 * Date: 2/15/14
 * Time: 9:39 AM
 * To change this template use File | Settings | File Templates.
 */

rama.SkinnableContainer.extend("MainContainer", function(){

    this.skin = 'views/main/skins/mainContainerSkin.html';

    this.skinParts = [{id:'testButton', required:true}];

    this.testButton = null;

    var _contentGroup = null;

    this.partAdded = function(partName, instance)
    {
        this._super(partName, instance);


        if(instance === this.testButton)
        {
            this.testButton[0].addEventListener('click', handleTestButtonClick)
        }

        if(instance === this.contentGroup)
        {
            _contentGroup = instance;
        }

    };


    function handleTestButtonClick(){

        if(_contentGroup)
        {
            if(_contentGroup[0].style.display === "none")
            {
                _contentGroup[0].style.display = "";
                return;
            }

            _contentGroup[0].style.display = "none";
        }
    }

});


rama.SkinnableComponent.extend("MainComponent", function(){

     this.skin = 'views/main/skins/mainComponentSkin.html';

     this.skinParts = [];

     this.partAdded = function(partName, instance)
     {
        this._super(partName, instance);
     };

});


