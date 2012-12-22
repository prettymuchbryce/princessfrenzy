function surrogateCtor() {}
 
function extend(base, sub, methods) {
  surrogateCtor.prototype = base.prototype;
  sub.prototype = new surrogateCtor();
  sub.prototype.constructor = sub;
  // Add a reference to the parent's prototype
  sub.base = base.prototype;
 
  // Copy the methods passed in to the prototype
  for (var name in methods) {
    sub.prototype[name] = methods[name];
  }
  // so we can define the constructor inline
  return sub;
}