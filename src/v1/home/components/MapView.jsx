import BaseVue from "../../../base/BaseVue";
import { reactive, onMounted } from 'vue';
import config from '@config';
import mergeImages from 'merge-images';
import ListMapView from "./ListMapView";
import MapViewSearch from "./MapViewSearch";

export const MapViewClass = BaseVue.extend({
  data : function(){
    return reactive({
      query : {},
      select_marker : {},
      currentLocation: {
        lat: "48.583505",
        long: "7.745782",
      },
      marker_datas : [],
      style : {
        body : {
          width : '100%',
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
      self.setInitDOMSelection('HEAD_SEARCH');
      let jsonParseUrl = self.jsonParseUrl();
      self.setUpdate('query',jsonParseUrl.query);
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
      debugger;
			navigator.geolocation.getCurrentPosition(self.showPosition.bind(self));
		} else {
			x.innerHTML = "Geolocation is not supported by this browser.";
		}
  },
  returnLeafletIcon: window.L.Icon.extend({
    options: {
      iconSize: [34,55],
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
      case 'LIST_DATA_VIEW':
        self.listMapView = self.getRef('listMapViewRef');
        if(self.listMapView == null) return;
        self.listMapView.setOnChangeListener(async function(action,parseData,index){
          switch(action){
            case 'BUSINESS_SELECTED':
              var marker_datas = self.get('marker_datas');
              /* Reset old select marker */
              var select_marker = self.get('select_marker');
              if(Object.keys(select_marker).length > 0){
                var markerItem = marker_datas[select_marker.index];
                var icon = select_marker.options.icon;
                icon.options.iconSize = [34, 55];
                icon.options.iconUrl = markerItem.marker_img;
                select_marker.setIcon(icon);
              }

              var markerItem = marker_datas[index];
              self.mymap.setView(self.markers["marker-" + index]._latlng);
              var icon = self.markers["marker-"+index].options.icon;
              icon.options.iconSize = [44, 65];
              icon.options.iconUrl = markerItem.marker_select_img;
              self.markers["marker-"+index].setIcon(icon);
              self.markers["marker-"+index].index = index;
              await self.set('select_marker',self.markers["marker-" + index]);
              break;
            case 'BACK':
              /* Reset old select marker */
              var select_marker = self.get('select_marker');
              var marker_datas = self.get('marker_datas');
              var markerItem = marker_datas[select_marker.index];
              var icon = select_marker.options.icon;
              icon.options.iconSize = [34, 55];
              icon.options.iconUrl = markerItem.marker_img;
              select_marker.setIcon(icon);
              break;
          }
        });
        if(props == null) return;
        window.staticType(props.id,[Number]);
        window.staticType(props.index,[Number]);
        let { search } = self.get('query');
        self.listMapView.selectBusiness({
          search : search,
          ...props
        });
        break;
      case 'LOAD_DATA':
        self.setUpdate("currentLocation", {
          lat: props.lat || self.get("currentLocation.lat"),
          long: props.long || self.get("currentLocation.long"),
        });
        let location_datas = self.get('marker_datas')||[];
        self.markers = {};
        // Init icon
        feather.replace();
        /* Defaultnya harusnya posisi restaurantnya */
        console.log("currentLocation.lat", self.get("currentLocation.lat"));
        if(self.mymap != null){
          self.mymap.off();
          self.mymap.remove();
        }
        self.mymap = window.L.map("mapsingleid",{ 
          scrollWheelZoom: false,
          zoomControl: false
        }).setView([self.get("currentLocation.lat"), self.get("currentLocation.long")], 13);
        window.L.control.zoom({ position: 'topright' }).addTo(self.mymap);
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
          self.markers["marker-" + a] = window.L.marker([
            parseFloat(location_datas[a].business_latitude),
            parseFloat(location_datas[a].business_longitude)
          ], {
            icon: new self.returnLeafletIcon({
              // iconUrl: "https://dummyimage.com/32x32/000/fff.png&text=" + (a + 1),
              iconUrl : location_datas[a].marker_img
            })
            // focus: false,
            // interactive: false
          }).addTo(self.mymap).on('click',function(a,e){
            self.mymap.panTo(e.target.getLatLng());
            self.handleClick.call(self,'MARKER_CLICK',{ 
              ...location_datas[a],
              index : a
            });
          }.bind(window.L,a));
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
            // console.log("ev", ev.target.getCenter());
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
        case 'HEAD_SEARCH':
        self.headSearch = self.getRef('headSearchRef');
        if(self.headSearch == null) return;
        self.headSearch.setOnChangeListener(async function(action,val){
          switch(action){
            case 'ON_TYPING':
              await self.setUpdate('query',{
                search_location : val
              });
              self.updateCurrentState(self.get('query'));
              // self.setProducts(await self.getProducts());
              break;
          }
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
    window.staticType(props.datas,[Array,null]);
    window.staticType(props.lat,[Number,null]);
    window.staticType(props.long,[Number,null]);
    await self.markerManipulate(props.datas);
    self.setInitDOMSelection('LOAD_DATA',props);
    self.setInitDOMSelection('LIST_DATA_VIEW');
  },
  markerManipulate : async function(props){
    let self = this;
    let markers = [];
    for(var a=0;a<props.length;a++){
      let newResizeImage = await self.resizeImage(config.ARTYWIZ_HOST+props[a].business_logo,20,20);
      let wrapper = await self.resizeImage('/public/img/map/wrapper.svg',34,55);
      let newResizeImageSelected = await self.resizeImage(config.ARTYWIZ_HOST+props[a].business_logo,30,30);
      let wrapperSelected = await self.resizeImage('/public/img/map/wrapper.svg',44,65);
      let newMerge = await mergeImages([{
        src : wrapper,
        x: 0, 
        y: 0,
        width: 1,
        height: 1
      },{
        src : newResizeImage,
        width: 1,
        height: 1,
        x : 7,
        y : 7
      }]);
      let newMergeSelected = await mergeImages([{
        src : wrapperSelected,
        x: 0, 
        y: 0,
        width: 1,
        height: 1
      },{
        src : newResizeImageSelected,
        width: 1,
        height: 1,
        x : 7,
        y : 7
      }]);
      markers.push({
        ...props[a],
        marker_img : newMerge,
        marker_select_img : newMergeSelected
      });
    }
    await self.set('marker_datas',markers);
  },
  resizeImage : function(url, width, height) {
    let self = this;
    return new Promise(function(resolve){
      var sourceImage = new Image();
      sourceImage.setAttribute('crossorigin', 'anonymous');
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
      sourceImage.onerror = function(){
        resolve(self.resizeImage('/public/img/map/broken_image.svg',width,height));
      };
      sourceImage.src = url;
    });
  },
  handleClick : async function(action,props,e){
    let self = this;
    switch(action){
      case 'MARKER_CLICK':
        self.setInitDOMSelection('LIST_DATA_VIEW',{
          index : props.index,
          id : props.id
        });
        return;
        /* Must Clear first for good effect */
        await self.set('select_marker',{});
        await self.set('select_marker',props);
        self.mymap.setView(new window.L.LatLng(props.business_latitude, props.business_longitude));
        self.displayPopUp('SHOW',props,e);
        break;
      case 'PAGINATION':
        
        break;
    }
  },
  displayPopUp : function(action,props,e){
    switch(action){
      case 'SHOW':
        return;
        let mapsingleid = $('#mapsingleid');
        let mapWidth = mapsingleid.width();
        let mapHeight = mapsingleid.height();
        let firstResultWidth = mapsingleid.width() - ((mapWidth * 66)/100);
        let secondResultWidth = firstResultWidth - ((firstResultWidth * 10)/100);
        let firstResultheight = mapsingleid.height() - ((mapHeight * 70)/100);
        let secondResultHeight = firstResultheight + ((firstResultheight * 70)/100);
        $('.marker-content').css('left',firstResultWidth); // <<< use pageX and pageY
        $('.marker-content').css('top',firstResultheight);
        $('.marker-content').css('display','inline');
        $(".marker-content").css("position", "absolute");  // <<< also make it absolute!
        $('.marker-content.mobile.only').css('left',"54.15px"); // <<< use pageX and pageY
        $('.marker-content.mobile.only').css('top',"165.535px");
        $('.marker-content.mobile.only').css('display','inline');
        $(".marker-content.mobile.only").css("position", "absolute");
        break;
      case 'HIDE':
        $('.marker-content').css('display','none');
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
    let { style, marker_datas } = this.get();
    var appShopList = ()=>{
      return (<ListMapView marker_datas={marker_datas} ref={(ref)=>this.setRef('listMapViewRef',ref)}></ListMapView>);
    };
    return (<div style={style.body}>
      <div class="mobile only" sty>
        {appShopList()}
      </div>
      <div class="display mobile hidden computer" id="app_map_view">
        <div class="on_computer">
          {appShopList()}
        </div>
        <div style="height: inherit;">
          
          <div style={style.map_wrapper} id="mapsingleid"></div>
        </div>
      </div>
    </div>);
  }
};