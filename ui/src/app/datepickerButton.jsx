export default React.createClass({
  displayName: 'ExampleCustomInput',

  propTypes: {
    onClick: React.PropTypes.func,
    value: React.PropTypes.string
  },

  render () {
    return (
      <img className='calendar-button' onClick={this.props.onClick} src='http://www.freeiconspng.com/uploads/calendar-icon-png-14.png' />
    )
  }
})
