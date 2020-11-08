export default {
  setup(props,context){
    return {
      handleClick : function(action,props,e){
        alert(action);
      }
    };
  },
  render(h){
    return (<div>Lorem ipsum dolor sit amet consectetur 
      adipisicing elit. Ut quisquam aliquid cupiditate qui nulla incidunt placeat rem, 
      porro quod cumque quam, reprehenderit quas numquam autem pariatur vel aperiam quo atque!
      <button onClick={this.handleClick.bind(this,'TEST')}>Test</button>
    </div>);
  }
};