/**
 * Created by Luoqi on 4/13/2016.
 */
var LikeButton = React.createClass({
  getInitialState: function () {
    return {liked: false};
  },
  handleClick: function (event) {
    this.setState({liked: !this.state.liked});
  },
  render: function () {
    var text = this.state.liked ? 'like' : 'haven\'t liked';
    return ( <p onClick={this.handleClick}> You {text} this. Click to toggle. </p> );
  }
});

React.render(<LikeButton />, document.getElementById('example'));


var Input = React.createClass({
  getInitialState: function () {
    return {value: 'Hello!'};
  }, handleChange: function (event) {
    this.setState({value: event.target.value});
  }, render: function () {
    var value = this.state.value;
    return ( <div><input type="text" value={value} onChange={this.handleChange}/> <p>{value}</p></div> );
  }
});
React.render(<Input/>, document.body);


Hello = React.createClass({
  getInitialState: function () {
    return {opacity: 1.0};
  }, componentDidMount: function () {
    this.timer = setInterval(function () {
      var opacity = this.state.opacity;
      opacity -= .05;
      if (opacity < 0.1) {
        opacity = 1.0;
      }
      this.setState({opacity: opacity});
    }.bind(this), 100);
  }, render: function () {
    return ( <div style={{opacity: this.state.opacity}}> Hello {this.props.name} </div> );
  }
});
React.render(<Hello name="world"/>, document.body);


UserGist = React.createClass({
  getInitialState: function () {
    return {username: '', lastGistUrl: ''};
  }, componentDidMount: function () {
    $.get(this.props.source, function (result) {
      var lastGist = result[0];
      if (this.isMounted()) {
        this.setState({username: lastGist.owner.login, lastGistUrl: lastGist.html_url});
      }
    }.bind(this));
  }, render: function () {
    return ( <div> {this.state.username}'s last gist is <a href={this.state.lastGistUrl}>here</a>. </div> );
  }
});
React.render(<UserGist source="https://api.github.com/users/octocat/gists"/>, document.body);
