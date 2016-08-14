const Hello = React.createClass({
  render: function() {
    return (
      <div>What is this</div>
    );
  }
});

const mountNode = document.getElementById('container');

ReactDOM.render(<Hello/>, mountNode);
