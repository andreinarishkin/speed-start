justoff.sstart.ThumbnailPropertiesXul = new function () {

	var File = justoff.sstart.File
	var Dom = justoff.sstart.Dom
	var URL = justoff.sstart.URL

	this.initialize = function () {
		var properties = window.arguments[0].properties;
		this.isFolder = properties.isFolder;
		Dom.get("thumbnail-properties").setAttribute("title", Dom.get("thumbnail-properties").getAttribute("title") + ": " + properties.title);
		if (this.isFolder) {
			Dom.get("name").value = properties.title || "";
			Dom.get("urlrow").hidden = true;
		} else {
			Dom.get("url").value = properties.url || "";
			Dom.get("namerow").hidden = true;
		}
		Dom.get("bgColor").value = properties.background || "#FFFFFF";
		Dom.get("width").value = properties.width || "";
		Dom.get("height").value = properties.height || "";
		if (properties.customImage && properties.customImage.slice(0,6) in {"file:/":1, "http:/":1, "https:":1}) {
			Dom.get("customImage").value = properties.customImage || "";
		} else {
			if (properties.customImage) {
				Dom.get("customImage").value = properties.customImage.slice(9);
				this.origImage = properties.customImage;
			} else {
				Dom.get("customImage").value = "";
			}
		}
	}

	this.onAccept = function () {
		var properties = window.arguments[0].properties;
		if (this.isFolder) {
			properties.title = Dom.get("name").value;
		} else {
			var url = Dom.get("url").value;
			if (url != properties.url) properties.title = "";
			if (url) {
				try {
					if (URL.getScheme(url)) {
						properties.url = url;
					}
				} catch (e) {
					properties.url = "http://" + url;
				}
			} else {
				properties.url = "about:blank";
			}
		}
		properties.background = (Dom.get("bgColor").value == "") ? "#FFFFFF" : Dom.get("bgColor").value;
		properties.width = Dom.get("width").value;
		properties.height = Dom.get("height").value;
		if (Dom.get("customImage").value == "" || Dom.get("customImage").value.slice(0,6) in {"file:/":1, "http:/":1, "https:":1}) {
			properties.customImage = Dom.get("customImage").value;
		} else {
			var dir = File.getDataDirectory();
			try {
				dir.append("tmp." + this.hashWord + "." + Dom.get("customImage").value);
				if (dir.exists()) {
					dir.moveTo(null, this.hashWord + "." + Dom.get("customImage").value);
					properties.customImage = this.hashWord + "." + Dom.get("customImage").value;
				}
			} catch (e) {
				return;
			}
		}
		if (this.origImage) {
			var dir = File.getDataDirectory();
			try {
				dir.append(this.origImage);
				if (dir.exists()) {
					dir.remove(false);
				}
			} catch (e) {}
		}
	}

	this.onCancel = function () {
		window.arguments[0].properties = null;
		if (this.tmpName) {
			var dir = File.getDataDirectory();
			try {
				dir.append("tmp." + this.hashWord + "." + this.tmpName);
				if (dir.exists()) {
					dir.remove(false);
				}
			} catch (e) {}
		}
	}

	this.browseCustomImage = function () {
		var file = File.chooseFile("open", ["images"]);
		if (file) {
			if (!(Dom.get("customImage").value.slice(0,6) in {"file:/":1, "http:/":1, "https:":1})) {
				var dir = File.getDataDirectory();
				try {
					dir.append("tmp." + this.hashWord + "." + this.tmpName);
					if (dir.exists()) {
						dir.remove(false);
					}
				} catch (e) {}
			}
			this.hashWord = (Math.random().toString(36)+'00000000000000000').slice(2, 10);
			file.copyTo(File.getDataDirectory(), "tmp." + this.hashWord + "." + file.leafName);
			Dom.get("customImage").value = file.leafName;
			this.tmpName = file.leafName;
		}
	}

}