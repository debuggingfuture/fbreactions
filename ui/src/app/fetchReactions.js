import { FETCH_AGG, fetchAndUpdateSelectedDate } from './store/actions'

const API_ENDPOINT = 'https://8zbfsx31e0.execute-api.ap-northeast-1.amazonaws.com/prod/reactions'

var Ajv = require('ajv');
var ajv = new Ajv(); // options can be passed, e.g. {allErrors: true}
var ApiType = require('../common/types-api');

var validateApi = ajv.compile(ApiType.schema)

function getEndpoint (location, offset)  {
  offset = offset || 0
  location = location || ''
  return `${API_ENDPOINT}?location=${location}&offset=${offset}`
}

export default (dispatch) => function (offset) {
  // Init fetch of data
  ;['hk', 'tw'].map(location => fetch(getEndpoint(location, offset))
    .then(function (res) {
      return res.json()
    })
    .then(function (data) {
      var isValid = validateApi(data)
      console.log('API res valid:'+isValid);
      console.log(ajv.errors);
      // silent failure
      return data;
    })
    .then(function (byDayData) {
      dispatch(fetchAndUpdateSelectedDate(location, byDayData))
    })
  )
}
