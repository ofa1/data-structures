/**
 *
 */
var stage = new Kinetic.Stage({
	container : 'container',
	width : 768,
	height : 200
});
var layer = new Kinetic.Layer();
var group = new Kinetic.Group({
	draggable : true
});
var list = new List();

for (var i = 1; i <= 10; i++) {
	list.add(i);
}

layer.add(group);
stage.add(layer);
list.remove(10);

// list.each(function(item) {
// console.log(item);
// //     alert(item.data);
// });
function addToList() {
	var ip = document.getElementById('input').value;
	if (ip == null)
		ip = 1;
	list.add(ip);
}

function List() {
	List.makeNode = function() {
		return {
			x : 10,
			y : 20,
			data : null,
			next : null,
			text : null,
			box : null,
			line : null
		};
	};
	this.start = null;
	this.end = null;

	this.add = function(data) {
		var x = 10;
		var y = 20;

		if (this.start === null) {
			this.start = List.makeNode();
			this.end = this.start;
		} else {
			this.end.next = List.makeNode();
			x = this.end.x + 60;
			y = this.end.y;
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

	this.remove = function(data) {
		var current = this.start;
		var previous = this.start;

		while (current !== null) {
			if (data === current.data) {
				current.box.destroy();
				current.text.destroy();
				current.line.destroy();
				layer.draw();
				if (current === this.start) {
					this.start = current.next;
					return;
				}
				if (current === this.end) {
					this.end = previous;
					previous.next = current.next;
					return;
				}
				previous.next = current.next;

				return;
			}
			previous = current;
			current = current.next;
		}
	};

	this.rearrange = function(current) {
		while(current !== null) {
			current.box.x = current.box.x - 40;
			current.text.x = current.text.x - 40;
			current = current.next;
		}
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
