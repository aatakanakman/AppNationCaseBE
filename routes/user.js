const express = require('express');
const jwt = require('jsonwebtoken');
const { auth, requireAdmin } = require('../middleware/auth');
const UserModel = require('../models/UserModel');

const router = express.Router();

router.get('/', auth, async (req, res) => {
  const userModel = new UserModel(req.dbClient);
  const users = await userModel.getAllUsers();
  res.json(users);
});

router.get('/:id', auth, async (req, res) => {
  const userModel = new UserModel(req.dbClient);
  const user = await userModel.getById(req.params.id);
  if (!user)
    return res.status(404).send('The user with the given ID was not found.');
  res.json(user);
});

router.post('/', auth, requireAdmin, async (req, res) => {
  const userModel = new UserModel(req.dbClient);
  const newUser = await userModel.create({ ...req.body });
  res.json({
    success: true,
    message: 'User created successfully',
    data: { ...newUser },
  });
});

router.patch('/:id', auth, requireAdmin, async (req, res) => {
  const userModel = new UserModel(req.dbClient);
  const updatedUser = await userModel.update(req.params.id, req.body);
  if (!updatedUser)
    return res.status(404).send('The user with the given ID was not found.');
  res.json({ success: true, updatedUser });
});

router.delete('/:id', auth, requireAdmin, async (req, res) => {
  const userModel = new UserModel(req.dbClient);
  const deleted = await userModel.delete(req.params.id);
  if (!deleted)
    return res.status(404).send('The user with the given ID was not found.');
  res.json({ success: true });
});

router.post('/auth', async (req, res) => {
  const userModel = new UserModel(req.dbClient);
  const { username, password } = req.body;

  console.log(req.body);

  const user = await userModel.authenticate(username, password);

  if (!user) {
    return res.status(400).send({
      success: false,
      message: 'Invalid username or password.',
    });
  }

  const token = jwt.sign({ id: user.id, role: user.role }, 'my_secret_jwt', {
    expiresIn: '1h',
  });

  res.json({
    success: true,
    token,
    role: user.role,
  });
});

module.exports = router;
