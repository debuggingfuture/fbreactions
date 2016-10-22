import _ from 'lodash'
export function getReactionImageUrl (reaction) {
  return 'images/' + reaction.toLowerCase() + '.png'
}

export function getReactionsWithRatio (reactions) {
  // var total = _.values(reactions)
  if (_.isEmpty(reactions)) {
    return []
  }
  // cal w/ LIKE
  let total = _.sum(_.values(reactions))
  let noLikes = _.omit(reactions, ['LIKE'])
  let ratio_total = _.sum(_.values(noLikes)) / total
  return _.map(noLikes, (v, k, o) => (
    {
      'type': k,
      'ratio': v / total,
      'ratio_total': ratio_total,
      'count': v
    }))
}
