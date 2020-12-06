import BaseService from "./BaseService";

export default BaseService.extend({
	getAutoComplete: async function(props) {
		window.staticType(props, [Object]);
		window.staticType(props.input, [String]);
		window.staticType(props.types, [String]);
		window.staticType(props.language, [String]);
		try {
			let url = window.HTTP_REQUEST.GOOGLE_PLACE.AUTO_COMPLETE;
			let formData = this.objectToFormData({
				...props
			});
			let resData = await this.postData(url, formData);
			return resData;
		} catch (ex) {
			throw ex;
		}
	},
	getDetails: async function(props) {
		// input=bar&placeid=PLACE_ID&key=API_KEY
		window.staticType(props, [Object]);
		window.staticType(props.input, [String]);
		window.staticType(props.placeid, [String]);
		window.staticType(props.language, [String]);
		try {
			let url = window.HTTP_REQUEST.GOOGLE_PLACE.DETAILS;
			let formData = this.objectToFormData({
				...props
			});
			let resData = await this.postData(url, formData);
			return resData;
		} catch (ex) {
			throw ex;
		}
	},
	parseAddressComponents : function(props){
		window.staticType(props,[Array]);
		try{
			let components = {};
			props.map((value, index) => {
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
