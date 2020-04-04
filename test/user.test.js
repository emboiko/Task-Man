const request = require("supertest");
const app = require("../src/app");
const User = require("../src/models/user");
const { userOneId, userOne, setupDB } = require("./fixtures/db");

beforeEach(setupDB);

test("Should sign up a new user", async () => {
    const response = await request(app)
        .post("/users")
        .send({
            name: "Eddie",
            email: "eddie@example.com",
            password: "TestPass555"
        })
        .expect(201);

    const user = await User.findById(response.body.user._id);

    expect(user).not.toBeNull();

    expect(response.body).toMatchObject({
        user: {
            name: "Eddie",
            email: "eddie@example.com"
        },
        token: user.tokens[0].token
    });

    expect(user.password).not.toBe("TestPass555");
});

test("Should login an existing user", async () => {
    const response = await request(app)
        .post("/users/login")
        .send({
            email: userOne.email,
            password: userOne.password
        })
        .expect(200);

    const user = await User.findById(userOneId);

    expect(response.body.token).toBe(user.tokens[1].token);
});

test("Should not login a non-existing user", async () => {
    await request(app)
        .post("/users/login")
        .send({
            email: "notauser@example.com",
            password: "foobarbinbaz"
        })
        .expect(400);
});

test("Should fetch a user's profile", async () => {
    await request(app)
        .get("/users/me")
        .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200);
});

test("Should not get profile for unauthenticated user", async () => {
    await request(app)
        .get("/users/me")
        .send()
        .expect(401);
});

test("Should delete profile for authenticated user", async () => {
    await request(app)
        .delete("/users/me")
        .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200);

    const user = await User.findById(userOneId);
    expect(user).toBeNull()
});

test("Should not delete profile for unauthenticated user", async () => {
    await request(app)
        .delete("/users/me")
        .send()
        .expect(401);
});

test("Should upload avatar for authenticated user", async () => {
    await request(app)
        .post("/users/me/avatar")
        .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
        .attach("avatar", "test/fixtures/jones.jpg")
        .expect(200);

    const user = await User.findById(userOneId);

    expect(user.avatar).toEqual(expect.any(Buffer));
});

test("Should update valid fields in a user's profile", async () => {
    await request(app)
        .patch("/users/me")
        .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
        .send({
            name: "Alex",
            email: "alex@example.com"
        })
        .expect(202);

    const user = await User.findById(userOneId);
    expect(user.name).toEqual("Alex");
    expect(user.email).toEqual("alex@example.com");
});

test("Should not update invalid fields in a user's profile", async () => {
    await request(app)
        .patch("/users/me")
        .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
        .send({
            name: "Alex",
            email: "alex@example.com",
            location: "Somewhere else"
        })
        .expect(400);
});
