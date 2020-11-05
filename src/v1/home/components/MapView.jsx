import BaseVue from "../../../base/BaseVue";
import { reactive, onMounted } from 'vue';
import config from '@config';
import mergeImages from 'merge-images';

const artywiz_users = [{
  id : 1,
  lat : 48.583782,
  long : 7.746497,
  product_name : 'Ciabatta',
  price : 3,
  unit : 'EUR',
  description : "La ciabatta est un pain blanc originaire d'Italie, dont l'une des...",
  ingredient : "yeast, milk, water, olive oil, biga, unbleached all-purpose flour, ....",
  image : '/public/img/map/sample_product.png',
  store : {
    image : "/public/img/map/users/user_1.png",
    address : '0,2 km | 15-3 Rue des Pucelles 67000 Strasbourg',
    store_name : 'BOULANGERIE DE LA REINE',
    phone : '03 88 23 23 23'
  },
  
},{
  id : 2,
  lat : 48.583718,
  long : 7.744763,
  product_name : 'Ciabatta',
  price : 3,
  unit : 'EUR',
  description : "La ciabatta est un pain blanc originaire d'Italie, dont l'une des...",
  ingredient : "yeast, milk, water, olive oil, biga, unbleached all-purpose flour, ....",
  image : '/public/img/map/sample_product.png',
  store : {
    image : "/public/img/map/users/user_2.png",
    address : '0,2 km | 15-3 Rue des Pucelles 67000 Strasbourg',
    store_name : 'BOULANGERIE DE LA REINE',
    phone : '03 88 23 23 23'
  },
},{
  id : 3,
  lat : 48.583125,
  long : 7.748121,
  product_name : 'Ciabatta',
  price : 3,
  unit : 'EUR',
  description : "La ciabatta est un pain blanc originaire d'Italie, dont l'une des...",
  ingredient : "yeast, milk, water, olive oil, biga, unbleached all-purpose flour, ....",
  image : '/public/img/map/sample_product.png',
  store : {
    image : "/public/img/map/users/user_3.png",
    address : '0,2 km | 15-3 Rue des Pucelles 67000 Strasbourg',
    store_name : 'BOULANGERIE DE LA REINE',
    phone : '03 88 23 23 23'
  },
},{
  id : 4,
  lat : 48.584520,
  long : 7.747375,
  product_name : 'Ciabatta',
  price : 3,
  unit : 'EUR',
  description : "La ciabatta est un pain blanc originaire d'Italie, dont l'une des...",
  ingredient : "yeast, milk, water, olive oil, biga, unbleached all-purpose flour, ....",
  image : '/public/img/map/sample_product.png',
  store : {
    image : "/public/img/map/users/user_4.png",
    address : '0,2 km | 15-3 Rue des Pucelles 67000 Strasbourg',
    store_name : 'BOULANGERIE DE LA REINE',
    phone : '03 88 23 23 23'
  },
},{
  id : 5,
  lat : 48.584772,
  long : 7.745106,
  product_name : 'Ciabatta',
  price : 3,
  unit : 'EUR',
  description : "La ciabatta est un pain blanc originaire d'Italie, dont l'une des...",
  ingredient : "yeast, milk, water, olive oil, biga, unbleached all-purpose flour, ....",
  image : '/public/img/map/sample_product.png',
  store : {
    image : "/public/img/map/users/user_5.png",
    address : '0,2 km | 15-3 Rue des Pucelles 67000 Strasbourg',
    store_name : 'BOULANGERIE DE LA REINE',
    phone : '03 88 23 23 23'
  },
}];

export const MapViewClass = BaseVue.extend({
  data : function(){
    return reactive({
      select_marker : {},
      currentLocation: {
        lat: "48.583505",
        long: "7.745782",
      },
      markers : [],
      style : {
        body : {
          width : '100%',
          height : '70%',
          padding : '12px'
        },
        map_wrapper : {
          width : '100%',
          height : '100%',
        }
      }
    });
  },
  construct : function(props,context){
    let self = this;
    onMounted(function(){

    });
  },
  showPosition: async function(position) {
		let self = this;
		try {
			await self.set("currentLocation.lat", position.coords.latitude);
			await self.set("currentLocation.long", position.coords.longitude);
			self.setInitDOMSelection('LOAD_DATA');
			let lati = self.get("currentLocation.lat");
			let longi = self.get("currentLocation.long");
			if (lati != null && longi != null) {
				document.getElementById("btn-get-location").style.display = "none";
			}
		} catch (ex) {
			console.error("ex ", ex);
		}
	},
  getLocation: function() {
		let self = this;
		if (location.protocol != "https:") {
			self.set(
				"currentLocation.lat",
				self.get("currentLocation.lat") || 48.583505
			);
			self.set(
				"currentLocation.long",
				self.get("currentLocation.long") || 7.745782
			);
			self.initMap();
			document.getElementById("btn-get-location").style.display = "none";
			return;
		}
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(self.showPosition.bind(self));
		} else {
			x.innerHTML = "Geolocation is not supported by this browser.";
		}
  },
  returnLeafletIcon: window.L.Icon.extend({
    options: {
      // shadowUrl: 'leaf-shadow.png',
      // iconSize: [32, 32]
      // shadowSize:   [50, 64],
      // iconAnchor:   [22, 94],
      // shadowAnchor: [4, 62],
      // popupAnchor:  [-3, -76]
    }
  }),
  setInitDOMSelection : async function(action,props){
    let self = this;
    switch(action){
      case 'LOAD_DATA':
        self.setUpdate("currentLocation", {
          lat: props.lat || self.get("currentLocation.lat"),
          long: props.long || self.get("currentLocation.long"),
        });
        let location_datas = self.get('markers')||[];
        self.markers = {};
        // Init icon
        feather.replace();
        /* Defaultnya harusnya posisi restaurantnya */
        console.log("currentLocation.lat", self.get("currentLocation.lat"));
        self.mymap = window.L.map("mapsingleid").setView([self.get("currentLocation.lat"), self.get("currentLocation.long")], 13);
        let tile_layer = window.L.tileLayer(`https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=${config.MAPBOX_ACCESS_TOKEN}`, {
          attribution:
            'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
          maxZoom: 18,
          id: "mapbox/streets-v11",
          tileSize: 512,
          zoomOffset: -1,
        }).addTo(self.mymap);
        self.markers['marker-you'] = window.L.marker([self.get("currentLocation.lat"), self.get("currentLocation.long")], {
          focus: true,
          interactive: false,
          icon: new self.returnLeafletIcon({iconUrl: '/public/img/map/you.png'})
        }).addTo(self.mymap);
        /* Set location of orders */
        for (var a = 0; a < location_datas.length; a++) {
          self.markers["marker-" + a] = L.marker([
            parseFloat(location_datas[a].lat),
            parseFloat(location_datas[a].long)
          ], {
            icon: new self.returnLeafletIcon({
              // iconUrl: "https://dummyimage.com/32x32/000/fff.png&text=" + (a + 1),
              iconUrl : location_datas[a].marker_img
            })
            // focus: false,
            // interactive: false
          }).addTo(self.mymap).on('click',self.handleClick.bind(self,'MARKER_CLICK',{ 
						...location_datas[a],
						index : a
					}));
          // self.corner.push(new L.LatLng(parseFloat(location_datas[a].lat), parseFloat(location_datas[a].long)));
        }
        var markerBounds = window.L.latLngBounds([self.markers['marker-you'].getLatLng()]);
        self.mymap.fitBounds(markerBounds);
        tile_layer.on("load", function() {
          self.setInitDOMSelection("map_search_dropdown");
        });
        self.mymap.on("zoomend", function() {
          // self.mymap.setView(new window.L.LatLng(self.get("currentLocation.lat"), self.get("currentLocation.long")));
        });
        // self.mymap.dragging.disable();
        self.mymap.on("drag", function(ev) {
          if (self.marker == null) {
            console.log("ev", ev.target.getCenter());
            self.displayPopUp('HIDE',{});
            let center = ev.target.getCenter();
            if (self.pendingLatLong != null) {
              self.pendingLatLong.cancel();
            }
            self.pendingLatLong = _.debounce(function(getMarkerPosition) {
              self.setUpdate("currentLocation", {
                lat: getMarkerPosition.lat || self.get("currentLocation.lat"),
                long: getMarkerPosition.lng || self.get("currentLocation.long"),
              });
            }, 1000);
            self.pendingLatLong(center);
            return;
          }
          let center = self.mymap.getCenter();
          let setMarker = self.marker.setLatLng([center.lat, center.lng]);
          let getMarkerPosition = self.marker.getLatLng();
          if (self.pendingLatLong != null) {
            self.pendingLatLong.cancel();
          }
          self.pendingLatLong = _.debounce(function(getMarkerPosition) {
            self.set("currentLocation.lat", getMarkerPosition.lat);
            self.set("currentLocation.long", getMarkerPosition.lng);
            // self.getAddress();
          }, 1000);
          self.pendingLatLong(getMarkerPosition);
        });
        break;
    }
  },
  setOnChangeListener : function(func){
    let self = this;
    self.onChangeListener = func;
  },
  startMap : async function(props){
    let self = this;
    window.staticType(props,[Object]);
    await self.markerManipulate(artywiz_users);
    self.setInitDOMSelection('LOAD_DATA',props);
  },
  markerManipulate : async function(props){
    let self = this;
    let markers = [];
    await self.set('markers',markers);
    for(var a=0;a<props.length;a++){
      let newResizeImage = await self.resizeImage(props[a].store.image,30,30);
      let newMerge = await mergeImages([{
        src : "/public/img/map/wrapper.png",
        x: 0, 
        y: 0
      },{
        src : newResizeImage,
        width: 1,
        height: 1,
        x : 7,
        y : 7
      }]);
      markers.push({
        ...props[a],
        marker_img : newMerge
      });
    }
    await self.set('markers',markers);
  },
  resizeImage : function(url, width, height) {
    return new Promise(function(resolve){
      var sourceImage = new Image();
      sourceImage.onload = function() {
        // Create a canvas with the desired dimensions
        var canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
  
        // Scale and draw the source image to the canvas
        canvas.getContext("2d").drawImage(sourceImage, 0, 0, width, height);
  
        // Convert the canvas to a data URL in PNG format
        resolve(canvas.toDataURL());
      };
      sourceImage.src = url;
    });
  },
  handleClick : async function(action,props,e){
    let self = this;
    switch(action){
      case 'MARKER_CLICK':
        await self.set('select_marker',props);
        self.mymap.setView(new window.L.LatLng(props.lat, props.long));
        self.displayPopUp('SHOW',props,e);
        break;
      case 'PAGINATION':
        
        break;
    }
  },
  displayPopUp : function(action,props,e){
    switch(action){
      case 'SHOW':
        let mapsingleid = $('#mapsingleid');
        let mapWidth = mapsingleid.width();
        let mapHeight = mapsingleid.height();
        let firstResultWidth = mapsingleid.width() - ((mapWidth * 50)/100);
        let secondResultWidth = firstResultWidth - ((firstResultWidth * 10)/100);
        let firstResultheight = mapsingleid.height() - ((mapHeight * 50)/100);
        let secondResultHeight = firstResultheight + ((firstResultheight * 70)/100);
        $('#marker-content').css('left',secondResultWidth); // <<< use pageX and pageY
        $('#marker-content').css('top',secondResultHeight);
        $('#marker-content').css('display','inline');
        $("#marker-content").css("position", "absolute");  // <<< also make it absolute!
        break;
      case 'HIDE':
        $('#marker-content').css('display','none');
        return;
    }
  } 
});

export default {
  setup(props,context){
    let mapViewClass = MapViewClass.create(props,context).setup();
    return mapViewClass;
  },
  render(h){
    let { style, select_marker } = this.get();
    return (<div style={style.body}>
      <div style={style.map_wrapper} id="mapsingleid"></div>
      {Object.keys(select_marker).length > 0?
      <div style="display:none;width:300px;z-index:2147483647" id="marker-content">
      <div class="ui card" style="display:block;">
        <div class="ui grid title" style="margin:0;">
          <div class="four wide column" style="padding:0;">
            <div class="image">
              <img style="width:30px;" src={select_marker.store.image}/>
            </div>
          </div>
          <div class="ten wide column text">
            <h5>{select_marker.store.store_name}</h5>
            <span style="">{select_marker.store.address}</span>
          </div>
        </div>
        <div class="content" style="padding:0;">
          <div class="ui grid price" style="margin:0;">
            <div class="six wide column">
              <div class="image">
                <img src={select_marker.image}/>
              </div>
            </div>
            <div class="ten wide column text">
              <h5>{select_marker.product_name}</h5>
              <span style="">{select_marker.price}€ TTC</span>
            </div>
          </div>
          <div class="ui grid description" style="margin:0;">
            <div class="sixteen wide column">
              <span>{select_marker.description}</span>
            </div>
          </div>
          <div class="ui grid ingredient" style="margin:0;">
            <div class="sixteen wide column title">
              <span class="text">Ingrédients</span>
            </div>
            <div class="sixteen wide column body">
              <span class="text">{select_marker.ingredient}</span>
            </div>
          </div>
          <div class="ui grid" style="margin:0;">
            <div class="twelve wide column"></div>
            <div class="four wide column pagination">
              <div class="wrap">
                <div>
                  <i class="arrow left icon" onClick={this.handleClick.bind(this,'PAGINATION',{ action : 'LEFT' })}></i>
                </div>
                <div>
                  <i class="arrow right icon" onClick={this.handleClick.bind(this,'PAGINATION',{ action : 'RIGHT' })}></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="extra content" style="padding:0;">
          <div class="ui grid action" style="margin:0;">
            <div class="twelve wide column">
              <div class="ui grid">
                <div class="five wide column">
                  <img src="/public/img/map/call_me.png" alt=""/>
                </div>
                <div class="ten wide column phone">
                  <div class="wrap">
                    <h5>Commander au</h5>
                    <h3>03 88 23 23 23 </h3>
                  </div>
                </div>
              </div>
            </div>
            <div class="four wide column" style="background: #ECF0F5;">
              <div class="direct_to">
                <img src="/public/img/map/direct_to.png" alt=""/>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>:
    null}
    </div>);
  }
};