var stage = new Kinetic.Stage({
	container : 'container',
	width : 768,
	height : 200
});

//Add a layer in the DOM
var layer = new Kinetic.Layer();

//create a group of objects (box, text, line)
var group = new Kinetic.Group({
	draggable : true
});
var x = 10;
var y = 10;
var text = new Kinetic.Text({
	x : x,
	y : y,
	text : 'text',
	fontSize : 25,
	fontFamily : 'Calibri',
	fill : 'black',
	width : 40,
	height : 40,
	padding : 10,
	align : 'center'
});

var box = new Kinetic.Rect({
	x : x,
	y : y,
	width : 40,
	height : 40,
	fill : 'white',
	stroke : 'black',
	strokeWidth : 1
});

// add cursor styling
text.on('mouseover', function() {
	document.body.style.cursor = 'pointer';
	box.stroke('blue');
	box.strokeWidth(3);
	layer.draw();
});
text.on('mouseout', function() {
	document.body.style.cursor = 'default';
	box.stroke('black');
	box.strokeWidth(1);
	layer.draw();
});


layer.add(box);
layer.add(text);
stage.add(layer);
layer.draw();