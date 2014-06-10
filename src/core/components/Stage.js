$r.Class("Stage").extends("ComponentBase")(function () {

    this.init = function(){
        this.super.init();
        this.setAttribute("comp", "Stage");

    }

    this.setApplication = function (application) {
        this.stage = this;
        this.addElement(element);

    };
})
