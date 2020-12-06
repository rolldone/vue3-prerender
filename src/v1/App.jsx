import { ref, watch, reactive,  onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import BaseVue from "../base/BaseVue";
import ExampleView from "./example/ExampleView";
import RouteActionFunction from "./partials/RouteActionFunction";
let router = null;
let route = null;
const AppClass = BaseVue.extend({
	data : function(){
		return reactive({
			template : null,
		});
	},
	construct : function(props,context){
		let self = this;
		self.RouteActionFunction = (RouteActionFunction.create(props,self,'app.route_view')).setup();
		self.setInitDOMSelection(self.RouteActionFunction.map.LOAD);
		watch(route,function(to,from){
			/* Listen url are changed */
			switch(to.name){
				case 'auth.logout':
				case 'auth.register':
				case 'auth.login':
					self.set('template','auth');
					break;
				case 'auth.oauth.callback':
					self.set('template','oauth');
					break;
				default:
					/* Check true condition */
		      /* For nested condition */
		      switch(true){
						case to.name.match('home') != null:
							self.set('template','home');
							break;
		      	case to.name.match('order_wizard') != null:
		      		self.set('template','order');
		      		break;
		      	default:
		      		self.set('template','main');
		      		break;
		      }
          break;
			}
		});
	},
	setInitDOMSelection : function(action,props){
		let self = this;
		self.RouteActionFunction.join(action,props,function(action,props){
			switch(action){
				case 'GLOBAL_POP_STATE':
				case 'MANUAL_STATE':
					/* This is important for prevent duplicate component */
					self.set('template',null);
					break;
			}
		});
	}
});
export default {
  setup(props,context){
		router = useRouter();
		route = useRoute();
    let appClass = AppClass.create(props,context);
    return appClass.setup();
  },
  render(h){
		let {template} = this.get();
		/* Authentication segment */
		switch(template){
			case 'example':
				return <ExampleView></ExampleView>;
			case 'home':
				return (<HomeView></HomeView>);
			case 'main':
				return (<div id="main">
					{/* <SideMenu ref={(ref)=>this.setRef('sideRef',ref)}></SideMenu> */}
					<div class="pusher">
						<router-view></router-view>
					</div>
				</div>);
			default:
				return null;
		}
  }
};