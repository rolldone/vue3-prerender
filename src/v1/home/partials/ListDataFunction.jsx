import ListData from "../components/ListData";
import GridDataFunction from "./GridDataFunction";

export default GridDataFunction.extend({
  render(h){
    return (<ListData ref={(ref)=>this.setRef('ownRefData',ref)}></ListData>);
  }
});