$r.Class("HorizontalLayout").extends("LayoutBase")(function () {

    this.updateLayout = function () {


        if(this.target)
        {
            var tempX = 0;

            var elements = this.target.elements.source;
            for(var i=0; i< elements.length ; i++)
            {
                var element = elements[i];
                element.setStyle("position", "absolute")
                element.setStyle("left",tempX + "px");
                tempX += 200;
            }
        }

    };

})
