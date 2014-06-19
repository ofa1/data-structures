/**
 * Script file for demonstrating Linked List
 */

// Add a layer in the DOM
var layer = new fabric.Canvas('c', {
	backgroundColor : 'white',
	hoverCursor : 'pointer',

});

// add other configuration to textbox
layer.on({
	'object:over' : function(e) {
		console.log("mouse over");
		box.stroke('blue');
		box.strokeWidth(3);
		layer.renderAll();
	},
	'object:out' : function(e) {
		console.log(e);
		document.body.style.cursor = 'default';
		box.stroke('black');
		box.strokeWidth(1);
		layer.renderAll();
	},
	'object:selected' : function(e) {
		document.getElementById('input').value = e.target._objects[2].text;
		document.getElementById('after').value = e.target._objects[2].text;
	}
});

var boxWidth = 40;
var lineWidth = 20;
var lineHeight = 20;

// Create a new List object
var list = new List();

// add some items as example
for (var i = 1; i <= 1; i++) {
	list.add(i + '');
}

// Uncomment below lines to print the linked list in the console
// list.each(function(item) {
// console.log(item);
// });

// Function to add to the list, called from the input button in HTML
function addToList() {
	var ip = document.getElementById('input').value;
	if (ip == null)
		ip = 1;
	list.add(ip);
}

// Function to add to start of list, called from the input button in HTML
function addToStart() {
	var ip = document.getElementById('input').value;
	if (ip == null)
		ip = 1;
	list.insertAsFirst(ip);
}

// Function to add to start of list, called from the input button in HTML
function addAfter() {
	var after = document.getElementById('after').value;
	var d = document.getElementById('input').value;

	list.insertAfter(after, d);
}

function deleteFromList() {
	var ip = document.getElementById('input').value;
	if (ip == null)
		return;
	list.remove(ip);
}

/**
 * Constructor for List
 */
function List() {
	// Two variables in list: start and end nodes
	this.start = null;
	this.end = null;

	/**
	 * Static method to create a new node in the list returns an object node
	 * with the variables data, next, textbox
	 * 
	 * storing the graphical representation objects also in the same node for
	 * ease in later modifications
	 */
	List.makeNode = function(data) {
		// Text
		var text = new fabric.Text(data, {
			left : 15,
			top : 3,
			fontSize : 25,
			fontFamily : 'Calibri',
			fill : 'black',
			width : boxWidth,
			height : boxWidth,
			padding : 10,
			align : 'center'
		});

		// Box
		var box = new fabric.Rect({
			fill : 'white',
			stroke : 'black',
			width : boxWidth,
			height : boxWidth,
			strokeWidth : 1
		});

		// add line in GUI to 'connect' it to previous box
		var line = new fabric.Line([ -lineWidth, lineHeight, 0, lineHeight ], {
			// Line starts from negative of box's X till start of box
			stroke : 'black',
			visible : false
		});

		var textbox = new fabric.Group([ line, box, text ], {
			left : 10,
			top : 20,
		// evented : false,
		// selectable : false
		});

		layer.add(textbox);
		return {
			data : data,
			next : null,
			textbox : textbox
		};
	};

	// Method to add to the list
	this.add = function(data) {
		var x = 10;
		var y = 20;

		// If start node is null
		if (this.start === null) {
			this.start = List.makeNode(data);
			this.end = this.start;
		} else {
			// insert at the end
			this.end.next = List.makeNode(data);

			// get coordinates of previous node
			x = this.end.textbox.getLeft();
			y = this.end.textbox.top;

			// add node in list
			this.end = this.end.next;

			// set coordinates of current node
			// this.end.textbox.left = (x + boxWidth + lineWidth);
			// this.end.textbox.top = (y);
			var b = this.end.textbox;
			b.animate('left', x + boxWidth + lineWidth, {
				duration : 500,
				onChange : layer.renderAll.bind(layer),
				onComplete : function() {
					b._objects[0].visible = true;
					layer.renderAll();
				}
			});

			// make line visible
			// this.end.textbox._objects[0].visible = true;
		}
		layer.renderAll();

		this.end.data = data;
	};

	// Method to remove from the list
	this.remove = function(data) {
		var current = this.start;
		var previous = this.start;

		while (current !== null) {
			if (data === current.data) {

				// Destroy Graphical elements
				current.textbox.animate('left', '+=1000', {
					duration : 1000,
					onChange : layer.renderAll.bind(layer),
					onComplete : function() {
						layer.remove(current.textbox);
					},
					easing : fabric.util.ease["easeInElastic"]
				});

				// If element is start element
				if (current === this.start) {
					this.start = current.next;
					if (this.start === null)
						return;
					// remove connecting line
					this.start.textbox._objects[0].visible = false;
					layer.renderAll();

					// Rearrange the GUI
					this.rearrange(this.start, true);
					return;
				}

				// If element is last element
				if (current === this.end) {
					this.end = previous;
					previous.next = current.next;
					return;
				}

				// If element is middle element
				previous.next = current.next;

				// Rearrange GUI
				this.rearrange(previous.next, true);
				return;
			}
			// else, continue iterating
			previous = current;
			current.textbox.animate('shadow', 'black', {
				duration : 500,
				onChange : layer.renderAll.bind(layer)
			// }
			});
			current = current.next;
		}
	};

	// Method to rearrange the graphical layout
	this.rearrange = function(current, left) {
		while (current !== null) {
			// move left?
			if (left)
				current.textbox.left = (current.textbox.left - boxWidth - lineWidth);
			// move right
			else
				current.textbox.left = (current.textbox.left + boxWidth + lineWidth);
			current = current.next;
		}
		layer.renderAll();
	};

	// Method to insert data as first element in list
	this.insertAsFirst = function(d) {
		var temp = List.makeNode(d);
		temp.next = this.start;

		// make line visible
		this.start.textbox._objects[0].visible = true;

		// set first element
		this.start = temp;

		// rearrange GUI
		this.rearrange(temp.next, false);
	};

	this.insertAfter = function(t, d) {
		var current = this.start;
		while (current !== null) {
			if (current.data === t) {
				var temp = List.makeNode(d);
				// set coordinates of current node
				temp.textbox.x(current.textbox.x());
				temp.textbox.y(current.textbox.y());

				// make line visible
				temp.textbox._objects[0].visible = true;

				temp.next = current.next;
				if (current === this.end)
					this.end = temp;
				current.next = temp;

				this.rearrange(temp, false);

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

} // end List()
