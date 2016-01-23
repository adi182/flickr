	// Saving the scripts functions and variables in an object will help keep it self contained and stop conflict
	// with other JS on the page 
	var flickrLoader = {
			// cb - run this  function to kick start the process
			cb: function(data){
				// setup container for image gallery
			var con = document.getElementById("photocontainer");
				con.innerHTML = con.innerHTML + '<h1>'+data.title+'</h1>';
				con.innerHTML = con.innerHTML + '<ul id="photocon"></ul>';
				var photocon = document.getElementById("photocon");

			// loop through results in feed
			for (i = 0; i < data.items.length; i++) {
				
				// create new list element
				var photo = document.createElement("li"); 
				photo.picid = this.link2id(data.items[i].link);
				photo.onclick = function() { flickrLoader.selectPhoto(this) };
				
				// create new image
				var img = document.createElement('img');
				if (((i-1) % 4) === 3) { // add class for every third image for old browser support
					photo.className = 'newrow';
				}
				if (((i-1) % 2) === 1) {  // add class for every second image for old browser support
					photo.className = photo.className +  ' mobilerow';
				}
				img.alt = data.items[i].title;
				img.src = data.items[i].media.m;
				// add photo to list element
				photo.appendChild(img);
				// add list element to container
				photocon.appendChild(photo);
				this.checkId(photo);
			}
		},
		// link2id will take an image url and return the image ID
		// the ID is later stored to save selected images
		link2id:function(lk){  
			var urlChunks = String(lk).split('/');
			return urlChunks[urlChunks.length - 2];
		},
		// read saved data
		// key = the name of the variable
		readData: function (key) {
			if(typeof(Storage) !== "undefined") {
				return localStorage.getItem(key);
			} else {
				var e = key + "=";
                var j = document.cookie.split(";");
                for (var l = 0; l < j.length; l++) {
                        var h = j[l];
                        while (h.charAt(0) == " ") {
                                h = h.substring(1, h.length)
                        }
                        if (h.indexOf(e) == 0) {
                                return h.substring(e.length, h.length)
                        }
                }
                return 
			}
        },
		// saveData - This will store data in local storage, if its an old browser we use cookies
		// key = name of variable
		// value = the data to store
		// days = how many days to store cookie for
        saveData: function (key, value, days) {
			if(typeof(Storage) !== "undefined") {  // is local storage available?
				localStorage.setItem(key, value);
			} else { // if local storage is not available use cookies
                var l = new Date;
                l.setDate(l.getDate() + days);
                var h = escape(value) + (days == null ? "" : "; expires=" + l.toUTCString());
                document.cookie = key + "=" + h;
			}
        },
		// selectPhoto is the function which is run with an on click on each of the photos
		selectPhoto: function(el){
			// get currentsaved data
			var c = this.readData('flickfav');
			
			// if no data has previously been saved, save some
			if( (typeof c === 'undefined') || (c == null)){
				c = '-' + el.picid + '-';
				this.saveData('flickfav',c,10);
				this.setClass(el);
				//alert('cookie created '+el.picid);
				return
			}
			
			// if the picture id has been found in the stored data - remove it
              if(c.indexOf(el.picid) > -1){
				c = c.replace('-' + el.picid + '-', '');
				//alert('new cookie = ' + c);
				this.removeClass(el);
				this.saveData('flickfav',c,10);
				//alert('removed '+el.picid);
			  }else{ // add image to our stored data
				c = c + '-' + el.picid + '-';
				this.setClass(el);
				this.saveData('flickfav',c,10);
				//alert('added '+el.picid);
			  }
		},
		// checkId - handle clicks of images and set/remove class 
		checkId: function(el){
			var c = this.readData('flickfav');
			if( (typeof c === 'undefined') || (c == null)){
				return false;
				}
              if(c.indexOf(el.picid) > -1){
				this.setClass(el);
				return true;
			  }else{
				this.removeClass(el);
				return false;
			  }			
		},
		setClass: function(el){
			el.className = el.className + ' selected';
		},
		removeClass: function(el){
			el.className = el.className.replace('selected','');
		}

	}
	
var tags = 'london';
var script = document.createElement('script');
script.src = 'http://api.flickr.com/services/feeds/photos_public.gne?format=json&jsoncallback=flickrLoader.cb&tags=' + tags;
var head = document.getElementsByTagName("head")[0];
head.appendChild(script);
