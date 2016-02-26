
var Noot = React.createClass({

  onRemove: function() {
    this.props.handleRemove(this.props.id);
  },

  onToggle: function(){
    this.props.handleToggle(this.props.id);
  },

  render: function() {
    return (
      <div className="Noot">
        <input  className="toggle" type="checkbox" checked={this.props.done} onChange={this.onToggle} />
        <label >{this.props.text}</label>
        <button className="remove" onClick={this.onRemove}>Remove</button>
      </div>
    );
  }
});

var FilterButton = React.createClass({

  onClick: function(){
    console.log(this.props.type);
    this.props.handleFilter(this.props.type);
  },

  render: function(){

    return (
      <input type='button' className="FilterButton" onClick={this.onClick} value={this.props.type} />
    );
  }

});

var NootList = React.createClass({
  render: function() {
  	var nootNodes = this.props.data.map(function(noot){
      if (noot){
  		return (
    		<Noot id={noot._id} 
          key={noot._id} 
          text={noot.text} 
          done={noot.done}
          handleRemove={this.props.handleRemove}
          handleToggle={this.props.handleToggle}
        /> 

      );
    }
  	}, this);

  	return (
  		<div className="nootList">
  			{nootNodes}
  		</div>
  	);
  }
});

var NootForm = React.createClass({
  getInitialState: function() {
    return {text: ''};
  },

  handleTextChange: function(e) {
    this.setState({text: e.target.value});
  },

  handleSubmit: function(e) {
    e.preventDefault();
    var text = this.state.text;
    if (!text) {
      return;
    }
    this.props.onNootSubmit({text: text});
    this.setState({text: ''});
  },

  render: function() {
    return (
      <form className="NootForm" onSubmit={this.handleSubmit}>
        <input
          type="text"
          placeholder="I have too doo....."
          value={this.state.text}
          onChange={this.handleTextChange}
        />
        <input type="submit" value="Post" />
      </form>
    );
  }
});

var NootApp = React.createClass({
  loadNootsFromServer: function() {
    $.ajax({
      url: '/api/noots',
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },

   handleNootSubmit: function(noot) {
    $.ajax({
      url: '/api/compose',
      dataType: 'json',
      type: 'POST',
      data: noot,
      success: function(data) {
        console.log("THIS DATA: ", data);

        var noots = this.state.data;
        console.log(noots);
        noots.push(data);
        this.setState({data: noots});

      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },

  handleRemove: function(nootId){
    console.log('removing Noot with id: ' + nootId);

    $.ajax({
      url: '/api/remove',
      dataType: 'json',
      type: 'POST',
      data: {idToRemove: nootId},
      success: function(data) {  

        // var noots = this.state.data;
        // noots = noots.filter(function(noot){
        //   return noot._id !== data._id;
        // });
        // this.setState({data:noots});

        this.loadNootsFromServer();

      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },

  handleToggle: function(nootId){
    console.log('toggling Noot with id: ' + nootId);

    $.ajax({
      url: '/api/toggle',
      dataType: 'json',
      type: 'POST',
      data: {idToToggle: nootId},
      success: function(data){

        var noots = this.state.data;
        noots = noots.filter(function(noot){
          if (noot._id == nootId){
            if (noot.done == true){
              console.log("TO FALSE!");
              noot.done == false;
            } else {
              noot.done == true;
              console.log("TO TRUE!");
            }
          }
          return noot
        });

        this.loadNootsFromServer();
        // this.setState({data:noots});

      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },

  handleEdit: function(noot){
    console.log("Editting noot with id: " + noot._id);

    $.ajax({
      url: '/api/edit',
      dataType: 'json',
      type: 'POST',
      data: noot,
      success: function(data){

        // this.setState({data:noots});

      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });

  },

  handleFilter: function(type){
    console.log("TYPE: ",  type);
    this.setState({type: type});
  },

  getInitialState: function() {
    return {data: []};
  },
  componentDidMount: function() {
    this.loadNootsFromServer();
    setInterval(this.loadNootsFromServer, this.props.pollInterval);
  },
  render: function() {
    return (
      <div className="NootApp">
        <h1>Noots TooDoo</h1>
        <NootForm onNootSubmit={this.handleNootSubmit} />
        <FilterButton handleFilter={this.handleFilter} type="all" /> 
        <FilterButton handleFilter={this.handleFilter} type="active" /> 
        <FilterButton handleFilter={this.handleFilter} type="done" /> 

        <NootList
          handleRemove={this.handleRemove}
          handleToggle={this.handleToggle}
          data={this.state.data.filter(function(noot){

          switch(this.state.type){
            case 'all':
              return noot;
              break;
            case 'active': 
              if(!noot.done){
                return noot;
              }
              break;
            case 'done':
              if(noot.done){
                return noot;
              }
              break;
            default:
              return noot;        
          }
           }.bind(this))}
        />
      </div>
    );
  }
});

ReactDOM.render(
  <NootApp url="/" pollInterval={5000} />,
  document.getElementById('content')
);


