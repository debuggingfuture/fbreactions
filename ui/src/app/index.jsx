console.log(process.env.NODE_ENV)
require('lib/semantic/semantic.css')
import Dataviz from './dataviz.jsx'
// boilerplate..
// https://github.com/whatwg/fetch/issues/56
import { Provider, connect } from 'react-redux'
import { combineReducers, createStore } from 'redux'
//
require('./index.css')
// TODO pre load locale-data
import zh from 'react-intl/locale-data/zh'
addLocaleData([...zh])
import { IntlProvider, FormattedDate, addLocaleData } from 'react-intl'
import { getReactionImageUrl } from './reaction.js'
import Tops from './tops'
import Report from './report.jsx'
import LikeButton from './likeButton.jsx'
import DatePicker from './datepicker.jsx'

import fetchReactions from './fetchReactions'

import { FETCH_AGG } from './store/actions'

// won't auto update until gulp script
let REACTION_TYPES = require('./meta.js').REACTION_TYPES

// TODO by daily (HK) emotion?
// http://stackoverflow.com/questions/260857/changing-website-favicon-dynamically
(function () {
  let reaction = _.sample(REACTION_TYPES)
  var link = document.createElement('link')
  link.type = 'image/x-icon'
  link.rel = 'shortcut icon'
  link.href = getReactionImageUrl(reaction)
  document.getElementsByTagName('head')[0].appendChild(link)
}())

// TODO
// first load set it
// cannot base on another state to reduce
function selectedDate (state = '', action) {
  switch (action.type) {
    case FETCH_AGG:
      return action.payload.selectedDate
  }
  return state
}
// https://github.com/acdlite/flux-standard-action
// Hacky to make use of meta to skip unrelated actions
function reactionsByDay (location, state = {}, action) {
  if (!action.payload) {
    return {}
  }
  let reactionsByDay = _.mapValues(action.payload.byDay, v => v ? v.reactions : {})
  switch (action.type) {
    case FETCH_AGG:
      if (location === action.meta.location) return reactionsByDay
  }
  return state
}
function tops (location, state = [], action) {
  if (!action.payload) {
    return []
  }
  let tops = action.payload.byDay[action.payload.selectedDate].tops
  switch (action.type) {
    case FETCH_AGG:
      if (location === action.meta.location) return tops
  }
  return state
}
// TODO tops is topsofDay
let store = createStore(
  combineReducers({
    selectedDate,
    'tw.reactionsByDay': reactionsByDay.bind(null, 'tw'),
    'tw.tops': tops.bind(null, 'tw'),
    'hk.reactionsByDay': reactionsByDay.bind(null, 'hk'),
    'hk.tops': tops.bind(null, 'hk')
  })
)

// Init fetch of data
fetchReactions(store.dispatch)()

ReactDOM.render(
  <Provider store={store}>
    <Dataviz location='hk' />
  </Provider>, document.getElementById('hk-viz')
)
ReactDOM.render(
  <Provider store={store}>
    <Dataviz location='tw' />
  </Provider>, document.getElementById('tw-viz'))

ReactDOM.render(
  <Provider store={store}>
    <Tops location='hk' />
  </Provider>, document.getElementById('hk-tops'))

ReactDOM.render(
  <Provider store={store}>
    <Tops location='tw' />
  </Provider>, document.getElementById('tw-tops'))

ReactDOM.render(
  <Provider store={store}>
    <IntlProvider locale='zh'>
      <div className='hscrollable'>
        <Report />
      </div>
    </IntlProvider>
  </Provider>, document.getElementById('reports'))

// var time
ReactDOM.render(
  <Provider store={store}>
    <DatePicker />
  </Provider>
  , document.getElementById('today'))

ReactDOM.render(
  <LikeButton />,
  document.getElementById('like-button')
)
