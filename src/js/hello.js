const Hello = React.createClass({
  render: function() {
    return (
      <div>I am a React component</div>
    );
  }
});

const mountNode = document.getElementById('container');

ReactDOM.render(<Hello/>, mountNode);
