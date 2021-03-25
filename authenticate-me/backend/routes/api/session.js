const express = require('express')
const asyncHandler = require('express-async-handler');

const { setTokenCookie, restoreUser } = require('../../utils/auth');
const { User } = require('../../db/models');

const router = express.Router();

// Log In -- TESTED, OK
router.post('/', asyncHandler(async (req, res, next) => {
  const { credential, password } = req.body;

  const user = await User.login({ credential, password });

  if(!user) {
    const err = new Error('Login failed.');
    err.status = 401;
    err.title = 'Login failed.';
    err.errors = ['The provided credentials were invalid.'];
    return next(err);
  }

  await setTokenCookie(res, user);

  return res.json({ user });
}))

// Log out -- TESTED, OK
router.delete('/', (_req, res) => { // _req indicates it should not be changed/used here
  res.clearCookie('token') // remove token from session
  return res.json({ message: 'success' });
});


module.exports = router;
