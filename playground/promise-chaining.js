require('../src/db/mongoose');
const Task = require('../src/models/task');

Task.findOneAndUpdate({_id: '6211cce7b2252083b52a5665'}, {completed: true}).then(result => {
    console.log(result);
    return Task.find({completed: false});
}).then(results => {
    console.log(results);
}).catch(e => {
    console.log(e);
});