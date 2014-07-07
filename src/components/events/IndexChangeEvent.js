$r.Class("IndexChangeEvent").extends("Event")(function () {


    this.init = function (type,bubbles,cancelable,oldIndex,newIndex) {

        $r.setupDefaultsForArguments([bubbles,cancelable,oldIndex,newIndex], [false,false,-1,-1]);

        this.super.init(type, bubbles, cancelable);
        this.oldIndex = oldIndex;
        this.newIndex = newIndex;

    };

})

$r.IndexChangeEvent.CHANGING = "changing";
$r.IndexChangeEvent.CHANGE = "change";