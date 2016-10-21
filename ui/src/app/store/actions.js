export const FETCH_AGG = 'FETCH_AGG'
export function fetchAndUpdateSelectedDate (location, byDayData) {
  return _.assign({ type: FETCH_AGG, meta: {'location': location}}, {payload: {
      byDay: byDayData,
      selectedDate: Object.keys(byDayData).sort().reverse()[0]
  }})
}
