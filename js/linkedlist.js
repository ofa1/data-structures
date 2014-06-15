/**
 * Script file for demonstrating Linked List 
 */

//Create a KineticJS Stage
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

//Create a new List object
var list = new List();

//add 10 items as example
for (var i = 1; i <= 10; i++) {
	list.add(i+'');
}
//add the group to the layer
layer.add(group);

//add layer to stage
stage.add(layer);


list.remove(10);

//Uncomment below lines to print the linked list in the console
//list.each(function(item) {
//console.log(item);
//});

//Function to add to the list, called from the input button in HTML
function addToList() {
	var ip = document.getElementById('input').value;
	if (ip == null)
		ip = 1;
	list.add(ip);
}

function deleteFromList() {
	var ip = document.getElementById('input').value;
	if (ip == null)
		return;
	list.remove(ip);
}

/**
 * Constructor for List
 * 
 */
function List() {
	/**
	 * Method to create a new node in the list
	 * returns an object node with the variables data, next, text, box, line
	 * 
	 * storing the graphical representation objects also in the same node for ease in later modifications
	*/ 
	List.makeNode = function() {
		return {
			data : null,
			next : null,
			text : null,
			box : null,
			line : null
		};
	};
	this.start = null;
	this.end = null;

	//Method to add to the list
	this.add = function(data) {
		var x = 10;
		var y = 20;

		if (this.start === null) {
			this.start = List.makeNode();
			this.end = this.start;
		} else {
			this.end.next = List.makeNode();
			x = this.end.box.x() + 60;
			y = this.end.box.y();
			this.end = this.end.next;
			this.end.x = x;
			this.end.y = y;
			var line = new Kinetic.Line({
				points : [x - 10, y + 25, x + 10, y + 25],
				stroke : 'black',
				lineJoin : 'miter'
			});
			group.add(line);
			this.end.line = line;
		}

		var text = new Kinetic.Text({
			x : x,
			y : y,
			text : data,
			fontSize : 25,
			fontFamily : 'Calibri',
			fill : 'black',
			width : 50,
			height : 50,
			padding : 10,
			align : 'center'
		});

		var box = new Kinetic.Rect({
			x : x,
			y : y,
			width : 50,
			height : 50,
			fill : 'white',
			stroke : 'black',
			strokeWidth : 1
		});
		// add cursor styling
		group.on('mouseover', function() {
			document.body.style.cursor = 'pointer';
		});
		group.on('mouseout', function() {
			document.body.style.cursor = 'default';
		});

		group.add(box);
		group.add(text);

		layer.draw();
		this.end.data = data;
		this.end.text = text;
		this.end.box = box;
	};

	//Method to remove from the list
	this.remove = function(data) {
		var current = this.start;
		var previous = this.start;

		while (current !== null) {
			if (data === current.data) {
				current.box.destroy();
				current.text.destroy();
				if(current.line !== null)
					current.line.destroy();
				layer.draw();
				if (current === this.start) {
					this.start = current.next;
					this.start.line.destroy();
					layer.draw();
					this.rearrange(this.start);
					return;
				}
				if (current === this.end) {
					this.end = previous;
					previous.next = current.next;
					return;
				}
				previous.next = current.next;
				this.rearrange(previous.next);
				return;
			}
			previous = current;
			current = current.next;
		}
	};

	//Method to rearrange the graphical layout
	this.rearrange = function(current) {
		while(current !== null) {
			current.box.x(current.box.x() - current.box.width() - 10);
			current.text.x(current.text.x() - current.box.width() - 10);
			if(current.line !== null)
			{
				current.line.setPoints([current.box.x()-10, current.box.y()+25, current.box.x(), current.box.y()+25]);
			}
			current = current.next;
		}
		layer.draw();
	};

	this.insertAsFirst = function(d) {
		var temp = List.makeNode();
		temp.next = this.start;
		this.start = temp;
		temp.data = d;
	};

	this.insertAfter = function(t, d) {
		var current = this.start;
		while (current !== null) {
			if (current.data === t) {
				var temp = List.makeNode();
				temp.data = d;
				temp.next = current.next;
				if (current === this.end)
					this.end = temp;
				current.next = temp;

				return;
			}
			current = current.next;
		}
	};

	this.item = function(i) {
		var current = this.start;
		while (current !== null) {
			i--;
			if (i === 0)
				return current;
			current = current.next;
		}
		return null;
	};

	this.each = function(f) {
		var current = this.start;
		while (current !== null) {
			f(current);
			current = current.next;
		}

	};

}
