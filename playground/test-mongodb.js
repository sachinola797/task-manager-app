// CRUD create read update delete

const { MongoClient, ObjectId } = require('mongodb')

const connectionURL = 'mongodb://127.0.0.1:27017'
const databaseName = 'task-manager'

MongoClient.connect(connectionURL, { useNewUrlParser: true }, (err, client) => {
    if (err) {
        return console.log('Unable to connect to database!')
    }

    const db = client.db(databaseName);
    // db.collection('users').insertMany([
    //     {
    //         name: 'Vikas',
    //         age: 24
    //     },
    //     {
    //         name: 'Rohi',
    //         age: 21
    //     }
    // ], (err, result) => {
    //     if (err)  {
    //         return console.log('Enable to insert the user');
    //     }

    //     console.log(result);
    // })

    // db.collection('tasks').insertMany([
    //     {
    //         description: 'Bring Groceries',
    //         completed: true,
    //     },
    //     {
    //         description: 'Take car to the service',
    //         completed: false,
    //     },
    //     {
    //         description: 'Search for new home',
    //         completed: true,
    //     },
    // ], (err, result) => {
    //     if (err)  {
    //         return console.log('Enable to insert the user');
    //     }

    //     console.log(result);
    // })

    // db.collection('tasks').findOne({_id: new ObjectId("6211b287ce87d97e3a774359")}, (err, result) => {
    //     if (err)  {
    //         return console.log('Error: ', err);
    //     }
    //     console.log(result);
    // });
    // db.collection('tasks').find({completed : true}).toArray((err, results) => {
    //     if (err)  {
    //         return console.log('Error: ', err);
    //     }
    //     console.log(results);
    // });

    // db.collection('users').updateOne({
    //     _id: new ObjectId("6211c14de4610a275b202125")
    // }, {
    //     $set: { name: "Tester Vivek" }
    // }).then(result => {
    //     console.log(result);
    // }).catch(err => {
    //     console.log(err);
    // })

    db.collection('users').deleteOne({
       age: 21
    }).then(result => {
        console.log(result);
    }).catch(err => {
        console.log(err);
    })
})