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

var boxWidth = 40;
var lineWidth = 20;
var lineHeight = 20;

//Create a new List object
var list = new List();

//add some items as example
for (var i = 1; i <= 5; i++) {
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

//Function to add to start of list, called from the input button in HTML
function addToStart() {
	var ip = document.getElementById('input').value;
	if (ip == null)
		ip = 1;
	list.insertAsFirst(ip);
}

//Function to add to start of list, called from the input button in HTML
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
	/**
	 * Method to create a new node in the list
	 * returns an object node with the variables data, next, textbox
	 * 
	 * storing the graphical representation objects also in the same node for ease in later modifications
	*/ 
	List.makeNode = function() {
		var textbox = new Kinetic.Group({
			x : 10,
			y : 20,
			draggable : false
		});
		//Text
		var text = new Kinetic.Text({
			text : ' ',
			fontSize : 25,
			fontFamily : 'Calibri',
			fill : 'black',
			width : boxWidth,
			height : boxWidth,
			padding : 10,
			align : 'center'
		});

		//Box
		var box = new Kinetic.Rect({
			fill : 'white',
			stroke : 'black',
			width : boxWidth,
			height : boxWidth,
			strokeWidth : 1
		});
		
		//add line in GUI to 'connect' it to previous box
		var line = new Kinetic.Line({
			//Line starts from negative of box's X till start of box
			points : [-lineWidth, lineHeight,  0 , lineHeight],
			stroke : 'black',
			visible : false
		});
		textbox.add(line);
		textbox.add(box);
		textbox.add(text);
		
		// add other configuration to textbox
		textbox.on('mouseover', function() {
			document.body.style.cursor = 'pointer';
			box.stroke('blue');
			box.strokeWidth(3);
			layer.draw();
		});
		textbox.on('mouseout', function() {
			document.body.style.cursor = 'default';
			box.stroke('black');
			box.strokeWidth(1);
			layer.draw();
		});
		textbox.on('click', function() {
			document.getElementById('input').value = text.text();
			document.getElementById('after').value = text.text();
		});
		layer.add(textbox);
		return {
			data : null,
			next : null,
			textbox : textbox
		};
	};
	this.start = null;
	this.end = null;

	//Method to add to the list
	this.add = function(data) {
		var x = 10;
		var y = 20;
		
		//If start node is null
		if (this.start === null) {
			this.start = List.makeNode();
			this.end = this.start;
		} else {
			//insert at the end
			this.end.next = List.makeNode();
			
			//get coordinates of previous node
			x = this.end.textbox.x();
			y = this.end.textbox.y();
			
			//add node in list
			this.end = this.end.next;
			
			//set coordinates of current node 
			this.end.textbox.x(x + boxWidth + lineWidth);
			this.end.textbox.y(y);
			
			//make line visible
			this.end.textbox.getChildren(function(node){
				   return node.getClassName() === 'Line';
			}).visible(true);
		}

		//set data in GUI
		this.end.textbox.getChildren(function(node){
			   return node.getClassName() === 'Text';
		}).text(data);
		
		
		layer.draw();
		
		this.end.data = data;
	};

	//Method to remove from the list
	this.remove = function(data) {
		var current = this.start;
		var previous = this.start;

		while (current !== null) {
			if (data === current.data) {
				
				//Destroy Graphical elements
				current.textbox.destroy();
				layer.draw();
				
				//If element is start element
				if (current === this.start) {
					this.start = current.next;
					
					//remove connecting line
					this.start.textbox.getChildren(function(node){
						   return node.getClassName() === 'Line';
					}).visible(false);
					layer.draw();
					
					//Rearrange the GUI
					this.rearrange(this.start, true);
					return;
				}
				
				//If element is last element
				if (current === this.end) {
					this.end = previous;
					previous.next = current.next;
					return;
				}
				
				//If element is middle element
				previous.next = current.next;
				
				//Rearrange GUI
				this.rearrange(previous.next, true);
				return;
			}
			//else, continue iterating
			previous = current;
			current = current.next;
		}
	};

	//Method to rearrange the graphical layout
	this.rearrange = function(current, left) {
		while(current !== null) {
			//move left?
			if(left)
				current.textbox.x(current.textbox.x() - boxWidth - lineWidth);
			//move right
			else
				current.textbox.x(current.textbox.x() + boxWidth + lineWidth);
			current = current.next;
		}
		layer.draw();
	};

	//Method to insert data as first element in list
	this.insertAsFirst = function(d) {
		var temp = List.makeNode();
		temp.next = this.start;
		
		//make line visible
		this.start.textbox.getChildren(function(node){
			   return node.getClassName() === 'Line';
		}).visible(true);
		
		//set first element
		this.start = temp;
		
		//set text
		this.start.textbox.getChildren(function(node){
			   return node.getClassName() === 'Text';
		}).text(d);
		temp.data = d;
		
		//rearrange GUI
		this.rearrange(temp.next, false);
	};

	this.insertAfter = function(t, d) {
		var current = this.start;
		while (current !== null) {
			if (current.data === t) {
				var temp = List.makeNode();
				temp.data = d;
				//set coordinates of current node 
				temp.textbox.x(current.textbox.x());
				temp.textbox.y(current.textbox.y());
				
				//make line visible
				temp.textbox.getChildren(function(node){
					   return node.getClassName() === 'Line';
				}).visible(true);
				
				//set data in GUI
				temp.textbox.getChildren(function(node){
					   return node.getClassName() === 'Text';
				}).text(d);
				
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

}	//end List()
