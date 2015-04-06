game.MiniMap = me.Entity.extend ({
init: function(x, y, settings) {
	this._super(me.Entity, "init", [x, y, {
        image: "minimap",
        width: 844,
        height: 119,
        spritewidth:"844",
        spriteheight:"119",
        getShape: function() {
        	return (new me.Rect(0, 0, 844, 119)).toPolygon();
        }
	 }]);
  this.floating = true;

   }
});