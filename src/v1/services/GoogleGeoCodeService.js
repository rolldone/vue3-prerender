import BaseService from "./BaseService";

export default BaseService.extend({
  reverseGeoCode : function(props){
    window.staticType(props,[Object]);
    window.staticType(props.latlng,[String]);
    try{
      let url = window.HTTP_REQUEST.GOOGLE_GEOCODE.REVERSE_GEOCODE;
      let resData = this.getData(url,props);
      if (resData.status == "error") throw resData.data.responseJSON;
      return resData;
    }catch(ex){
      throw ex;
    }
  },
  parseAddressComponents : function(props){
		window.staticType(props,[Array]);
		try{
      if(props.length == 0) return null;
      /* Get only index 0 */
      let address_components = props[0].address_components;
      let formatted_address = props[0].formatted_address;
			let components = {};
			address_components.map((value, index) => {
				value.types.map((value2, index2) => {
					components[value2] = value.long_name;
					if (value2==='country')
						components.country_id = value.short_name;
					if (value2==='administrative_area_level_1')
						components.state_code = value.short_name;
				});
			});
			components = (function(props){
        let filterComponent = {};
        filterComponent.formatted_address = formatted_address;
				for(var key in props){
					switch(key){
						case 'street_number':
							filterComponent.street_number = props[key]; 
							break;
						case 'locality':
							filterComponent.city = props[key]; 
							break;
						case 'country':
							filterComponent.country = props[key];
							break; 
						case 'country_id': 
							filterComponent.country_id = props[key];
							break;
						case 'postal_code': 
							filterComponent.postal_code = props[key];
							break;
						case 'route': 
							filterComponent.route = props[key];
							break;
						default:
							filterComponent[key] = props[key];
							break;
					}
				}
				return filterComponent;
			})(components);
			return components;
		}catch(ex){
			throw ex;
		}
	},
});