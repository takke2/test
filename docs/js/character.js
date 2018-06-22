fcunction CharacterShot(){
	this.position = new Point();
	this.size = 0;
	this.speed = 0;
	this.alive = false;
}

CharacterShot.prototype.set = function(p, vector, size, speed){
	this.position.x = p.x;
	this.position.y = p.y;
	this.position.z = p.z;
	this.vector.x = vector.x;
	this.vector.y = vector.y;
	this.vector.z = vector.z;
	
	this.size = size;
	this.speed = speed;
	
	this.alive = true;
};

CaracterShot.prototype.move = function(){
	this.position.x += this.vector.x * this.speed;
	this.position.y += this.vector.y * this.speed;
	this.position.z += this.vector.z * this.speed;
	
	if(this.position.x > size || this.position.y > size || this.position.z > size){
		this.alive = false;
	}
};

function Enemy(){
	this.position. = new Point();
	this.size = 0;
	this.type = 0;
	this.param = 0;
	this.alive = false;
}

Enemy.prototype.set = function(p, size, speed){
	this.position.x = p.x;
	this.position.y = p.y;
	this.position.z = p.z;
	
	this.speed = speed;
	this.size = size;
	
	this.param = 0;
	
	this.alive = true;
};

Enemy.prototype.move = function(vector){
	this.param++;
	
	this.position.x += vector.x * this.speed;
	this.position.y += vector.y * this.speed;
	this.position.z += vector.z * this.speed;
};