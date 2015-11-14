
module.exports = function extend (Child, Parent) {
    var F = function() {};

    F.prototype = Parent.prototype;

    Child.prototype = new F();
    Child.prototype.constructor = Child;

    Child.prototype.super = Parent.prototype.constructor;
    return Child;
}
