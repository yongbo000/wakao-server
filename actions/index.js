var articleAction = require('../actions/articleAction');
var funnyAction = require('../actions/funnyAction');
var imageAction = require('../actions/imageAction');
var otherAction = require('../actions/otherAction');

var actions = [];
actions.push(articleAction);
actions.push(funnyAction);
actions.push(imageAction);
actions.push(otherAction);

function getRules() { 
    var rules = [];
    for(var i=0;i<actions.length;i++){
        rules = rules.concat(actions[i].getRules())
    }
    return rules;
}

exports.getRules = getRules;