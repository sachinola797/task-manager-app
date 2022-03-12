const request = require('supertest');
const Task = require('../src/models/task');
const app = require('../src/app');
const {userOne, setupDatabase} = require('./fixtures/db');


beforeEach(setupDatabase)

test('Should create task for user', async() => {
    const response = await request(app)
                        .post('/tasks/create')
                        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
                        .send({
                            title : 'My First Task',
                            description: 'Nothing much'
                        })
                        .expect(201);

    const task = await Task.findById(response.body._id);
    expect(task).not.toBeNull();
    expect(task).toMatchObject({
        title : 'My First Task',
        description: 'Nothing much',
        completed: false,
    });
})