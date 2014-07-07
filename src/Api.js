
$r.package = rPackage;
//All Core Components which are exposed

//All the functions and properties which are exposed
$r.classFactory = classFactory;
$r.skinFactory = skinFactory;
$r.Application = Application;
$r.isDefined = isDefined;
$r.bindFunction = bindFunction;
$r.camelCase = camelCase;
$r.cleanWhitespace = cleanWhitespace;
$r.arrayUtil = ArrayUtil();
$r.setupDefaultsForArguments =setupDefaultsForArguments;
$r.forEach = forEach;
$r.trim = trim;

$r.STATES = STATES;
$r.LAYOUT = LAYOUT;
$r.R_COMP = R_COMP;
$r.Observable = Observable;
$r.isFunction = isFunction;
$r.supportsTouch = supportsTouch;

//Core skins
$r.skins({skinClass:"ContainerSkin",skin:"<div><div id='contentGroup'></div></div>"},
        {skinClass:"ListSkin",skin:"<div><div id='dataGroup' comp='DataGroup'></div></div>"},
        {skinClass:"ItemRendererSkin",skin:"<div></div>"})




