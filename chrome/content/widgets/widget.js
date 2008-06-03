function Widget() {
  this.properties;
  this.view;

  this.setProperties = function(properties) {
    this.properties = properties;
  }

  this.setStorage = function(storage) {
    this.storage = storage;
  }

  this.updateView = function() {
    this.view.style.left = this.properties.left || "";
    this.view.style.top = this.properties.top || "";
    this.view.style.width = this.properties.width || "";
    this.view.style.height = this.properties.height || "";

    var icon = Dom.child(this.view, "icon");
    icon.style.background = "url(" + this.getIconURL() + ")";

    var title = Dom.child(this.view, "title");
    title.innerHTML = this.properties.title || "";
  }

  this.renderView = function() {
    this.view = Dom.get("widget").cloneNode(true);
    Dom.child(this.view, "body").appendChild(this.createView());
    this.view.id = this.properties.id;

    Drag.enable(this.view);
    this.updateView();

    var self = this;
    var title = Dom.child(this.view, "title");
    title.addEventListener("dblclick", function() {
      self.editTitle.call(self);
    }, false);

    var remove = Dom.child(this.view, "remove");
    remove.addEventListener("click", function() {
      self.remove.call(self);
    }, false);

    var refresh = Dom.child(this.view, "refresh");
    refresh.addEventListener("click", function() {
      self.refresh.call(self);
    }, false);

    var properties = Dom.child(this.view, "properties");
    properties.addEventListener("click", function() {
       self.openProperties.call(self);
    }, false);

    this.view.addEventListener("drop", function() {
      self.properties.left = Widget.snapToGrid(self.view.offsetLeft);
      self.properties.top = Widget.snapToGrid(self.view.offsetTop);
      self.properties.width = Widget.snapToGrid(self.view.offsetWidth);
      self.properties.height = Widget.snapToGrid(self.view.offsetHeight);
      self.save.call(self);
      self.updateView.call(self);
    }, false);

    return this.view;
  }

  this.remove = function() {
    if (Utils.confirm("Remove widget?")) {
      if (this.view) Dom.remove(this.view);
      this.storage.removeObject(this.properties.id);
      return true;
    }
  }

  this.refresh = function() {}
  this.openProperties = function() {}

  this.save = function() {
    this.storage.saveObject(this.properties);
  }

  this.getIconURL = function() {
    return Bookmark.getFaviconURL(this.properties.url);
  }

  this.editTitle = function() {
    var self = this;
    var title = Dom.child(self.view, "title");

    function removeInput() {
      title.innerHTML = self.properties.title;
    }
    function updateTitle() {
      self.properties.title = title.firstChild.value;
      self.save.call(self);
      removeInput();
    }
    function onKeyUp(e) {
      switch(e.keyCode) {
        case e.DOM_VK_RETURN: updateTitle(); break;
        case e.DOM_VK_ESCAPE: removeInput(); break;
      }
    }
    title.innerHTML = "<input type='text'>";
    var input = title.firstChild;
    input.value = this.properties.title;
    input.focus();
    input.select();
    input.addEventListener("blur", updateTitle, false);
    input.addEventListener("keyup", onKeyUp, false);
  }
}

Widget.HEADER_HEIGHT = 20;

Widget.snapToGrid = function(value) {
  const GRID_INTERVAL = 10;
  var value = value + GRID_INTERVAL / 2;
  return value - value % GRID_INTERVAL;
}
