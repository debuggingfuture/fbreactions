var getRandomByWeight = function(itemByWeight) {
    var random_num = _.random(0, _.sum(_.values(itemByWeight)));
    var weight_sum = 0;
    //console.log(random_num)
    var items =  _.keys(itemByWeight);
    for (var i = 0; i < items.length; i++) {
        weight_sum += itemByWeight[items[i]];
        weight_sum = +weight_sum.toFixed(2);

        if (random_num <= weight_sum) {
            return items[i];
        }
    }
};

module.exports{
  getRandomByWeight:getRandomByWeight
}
