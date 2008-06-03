function Factory(storage) {
  function getURL(type) {
    switch(type) {
      case "search": return "desktop://search/";
    }
  }

  this.createWidget = function(type, x, y) {
    var properties = {
      left:     Widget.snapToGrid(x),
      top:      Widget.snapToGrid(y),
      isFolder: type == "folder",
      url:      getURL(type)
    }
    storage.saveObject(properties);
    createWidget(properties);
  }

  function createWidget(properties) {
    var widget;
    switch(properties.url) {
      case "desktop://search/": widget = new Search(); break;
      default: widget = new Thumbnail(); break;
    }
    widget.setProperties(properties);
    widget.setStorage(storage);
    document.body.appendChild(widget.renderView());
  }

  this.createWidgets = function() {
    var objects = storage.getObjects();
    for(var i in objects) {
      createWidget(objects[i]);
    }
  }
}
