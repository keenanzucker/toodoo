
var Noot = React.createClass({

  onRemove: function() {
    this.props.handleRemove(this.props.id);
  },

  render: function() {
    return (
      <div className="Noot">
        <p>{this.props.text}</p>
        <button className="remove" onClick={this.onRemove}>Remove</button>
      </div>
    );
  }
});


var NootList = React.createClass({
  render: function() {
  	var nootNodes = this.props.data.map(function(noot){
  		return (
    		<Noot id={noot._id} key={noot._id} text={noot.text} handleRemove={this.props.handleRemove}/> 
      );
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
          placeholder="Say something..."
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
   	// var noots = this.state.data;
   	// console.log(noots);
    // var newNoots = noots.concat([noot]);
    // this.setState({data: newNoots});

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
      	this.setState({data: noots});
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
        console.log("From server val:" , data);

        var noots = this.state.data;

        noots = noots.filter(function(noot){
          return noot._id !== data._id;
        });

        this.setState({data:noots});


        // SPLICE SOMETHING?
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
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
        <NootList
           data={this.state.data}
           handleRemove={this.handleRemove}
        />
      </div>
    );
  }
});

ReactDOM.render(
  <NootApp url="/" pollInterval={5000} />,
  document.getElementById('content')
);


