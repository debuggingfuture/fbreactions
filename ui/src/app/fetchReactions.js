import { FETCH_AGG, fetchAndUpdateSelectedDate } from './store/actions'

function getEndpoint (location, offset) {
  var url = 'https://8zbfsx31e0.execute-api.ap-northeast-1.amazonaws.com/prod/reactions'
  url += '?location=' + location
  url += '&offset=' + offset || 0
  return url
}

export default (dispatch) => function (offset) {
  // Init fetch of data
  ;['hk', 'tw'].map(location => fetch(getEndpoint(location, offset))
    .then(function (res) {
      return res.json()
    })
    .then(function (byDayData) {
      dispatch(fetchAndUpdateSelectedDate(location, byDayData))
    })
  )
}
