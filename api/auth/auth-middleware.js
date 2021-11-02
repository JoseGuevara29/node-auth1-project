const Users = require("../users/users-model");
/*
  If the user does not have a session saved in the server

  status 401
  {
    "message": "You shall not pass!"
  }
*/
function restricted() {
  if (req.session && req.session.user) {
    next();
  } else {
    res.status(401).json("You shall not pass!");
  }
}

/*
  If the username in req.body already exists in the database

  status 422
  {
    "message": "Username taken"
  }
*/
async function checkUsernameFree(req, res, next) {
  try {
    const rows = await Users.findBy({ username: req.body.username });
    //rows returns an array of objects.
    if (!rows.length) {
      //if array is empty then no user with that name.
      next();
    } else {
      res.status(422).json("Username taken");
    }
  } catch (e) {
    console.log("in the auth middleware");
    res.status(500).json(`server error: ${e.message}`);
  }
}

/*
  If the username in req.body does NOT exist in the database

  status 401
  {
    "message": "Invalid credentials"
  }
*/
async function checkUsernameExists(req, res, next) {
  try {
    const rows = await Users.findBy({ username: req.body.username });
    //rows returns an array of objects.
    if (rows.length) {
      //if array is empty then no user with that name.
      req.userData = rows[0];
      next();
    } else {
      res.status(401).json("Invalid credentials");
    }
  } catch (e) {
    res.status(500).json(`server error: ${e.message}`);
  }
}

/*
  If password is missing from req.body, or if it's 3 chars or shorter

  status 422
  {
    "message": "Password must be longer than 3 chars"
  }
*/
function checkPasswordLength() {
  try {
    if (!req.body.password || req.body.password <= 3) {
      res.status(422).json("Password must be longer than 3 chars");
    } else {
      next();
    }
  } catch {
    res.status(500).json(`server error ${e.message}`);
  }
}

// Don't forget to add these to the `exports` object so they can be required in other modules
module.exports = {
  checkPasswordLength,
  checkUsernameExists,
  checkUsernameFree,
  restricted,
};
