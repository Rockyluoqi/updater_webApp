/**
 * Created by Luoqi on 4/14/2016.
 */
/**
 * custom React class names begin with an uppercase letter
 */
var CommentBox = React.createClass({
  render: function () {
    return  (
    <div className = "CommentBox">
      Hello World! I am a CommentBox.
    </div>
    );
  }

  render: function() {
    return (
      React.createElement('div', {className: "commentBox"},
        "Hello, world! I am a CommentBox."
      )
    );
  }
});

ReactDOM.render(
  <CommentBox />,
  document.getElementById('content')
);
