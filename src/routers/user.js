const User = require("../models/user");
const express = require("express");
const auth = require("../middleware/auth.js");

const router = new express.Router() ;

router.post("/signup", async function (req, res){
  // console.log(req.body)
  const user = new User(req.body);
  try {
    await user.save();
    const token = await user.generateAuthToken();
    // console.log(token)
    res.send({ user, token });
  } catch (error) {
    res.status(400).send();
  }
});

router.post("/login", async function(req, res){
  // console.log(req.body)
  try {
    // console.log('adf')
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    // console.log(user)
    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (error) {
    res.status(400).send();
  }
});

router.post("/logout", auth, async function(req, res){
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await req.user.save();
    res.status(200).send();
  } catch (e) {
    res.status(500).send();
  }
});

router.post("/logoutAll", auth, async function(req, res) {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.status(200).send("All were logout");
  } catch (error) {
    res.status(500).send();
  }
});

router.get("/me", auth, (req, res) => {
  res.send(req.user);
});

router.patch("/users/me", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", "email", "password"];

  const isValidOperation = updates.every((update) => {
    return allowedUpdates.includes(update);
  });

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid Operation" });
  }

  const _id = req.user._id;

  try {
    updates.forEach((update) => (req.user[update] = req.body[update]));
    await req.user.save();
    res.send(req.user);
  } catch (e) {
    res.status(400).send();
  }
});

module.exports = router;
