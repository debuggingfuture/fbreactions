import {getReactionImageUrl} from './reaction.js';

export default React.createClass({
  getInitialState: function() {
    return {liked: false};
  },
  handleClick: function(event) {
    FB.ui({
      method: 'share',
      href: 'https://fbreactions.io',
    }, function(response){});
    this.setState({liked: true});
  },
  render: function() {
    var reaction = this.state.liked ? 'love' : 'like';

    return (
      <div >
        <a href="javascript:void(0)">
          <img onClick={this.handleClick} className="like-button-img" src={getReactionImageUrl(reaction)}/>
        </a>
      </div>
    );
  }
});
