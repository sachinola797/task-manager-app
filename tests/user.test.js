const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/user');
const {userOne, setupDatabase} = require('./fixtures/db');


beforeEach(setupDatabase)


test("Should sign-up a new user", async() => {
    const response = await request(app)
                .post('/users/create').send({
                    name: "Sachin1",
                    email: 'sachin1@gmail.com',
                    password: 'Test@1234',
                })
                .expect(201);
    // Assert that the database was changed correctly
    const user = await User.findById(response.body.user._id);
    expect(user).not.toBeNull();

    // Assert about the response
    expect(response.body).toMatchObject({
        user: {
            name: "Sachin1",
            email: 'sachin1@gmail.com',
        },
        token: user.tokens[0].token,
    });

    expect(user).not.toBe('Test@1234');
})

test("Should login existing user", async() => {
    await request(app)
        .post('/login').send({
            email: userOne.email,
            password: userOne.password,
        })
        .expect(200);
})

test("Should not login non-existing user", async() => {
    await request(app)
        .post('/login').send({
            email: "test@gmail.com",
            password: "test123",
        }).expect(400);
})

test("Should get profile for user", async() => {
    await request(app)
        .get('/users/' + userOne._id)
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200);
})

test("Should not get profile for unauthenticated user", async() => {
    await request(app)
        .get('/users/' + userOne._id)
        .send()
        .expect(401);
})


test("Should delete authenticated user", async() => {
    await request(app)
        .delete('/users/delete/' + userOne._id)
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200);
})


test("Should not delete unauthenticated user", async() => {
    await request(app)
        .delete('/users/delete/' + userOne._id)
        .send()
        .expect(401);
})

test("Should upload avatar image", async() => {
    await request(app)
        .post('/users/upload/avatar')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .attach('avatar', 'tests/fixtures/picture.png')
        .expect(200);

        const user = await User.findById(userOne._id);
        expect(user.avatar).toEqual(expect.any(Buffer));
})
