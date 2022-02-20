require('../src/db/mongoose');
const User = require('../src/models/user');

const updateAgeAndCount = async (id, age) => {
    const user = await User.findByIdAndUpdate(id, {age});
    const count = await User.countDocuments({ age: user.age});
    return count;
}

updateAgeAndCount('62122fcd738d938833603c23', 23).then(count => {
    console.log('count',count);
}).catch(e => {
    console.log(e);
})