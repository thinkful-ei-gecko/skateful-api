const express = require('express')
const UsersService = require('./users-service')
const usersRouter = express.Router()
const jsonBodyParser = express.json()
const path = require('path')

const serializeUser = user => ({
  id: user.id,
  name: user.user_name,
  admin: user.admin,
  date_voted: user.date_voted
})

usersRouter
  .post('/', jsonBodyParser, (req, res) => {
    const { password, user_name, email } = req.body

    for (const field of ['email', 'user_name', 'password'])
      if (!req.body[field])
        return res.status(400).json({
        error: `Missing '${field}' in request body`
    })

    const passwordError = UsersService.validatePassword(password)

    if (passwordError)
      return res.status(400).json({ error: passwordError })

    UsersService.hasUserWithUserName(
      req.app.get('db'),
      user_name
    )
      .then(hasUserWithUserName => {
        if (hasUserWithUserName)
          return res.status(400).json({ error: `Username already exists`})
      })
      return UsersService.hashPassword(password)
        .then(hashedPassword => {
          const newUser = {
            user_name,
            password: hashedPassword,
            email,
            date_created: 'now()',
          }

       return UsersService.insertUser(
         req.app.get('db'),
         newUser
       )
         .then(user => {
           res
             .status(201)
             .location(path.posix.join(req.originalUrl, `/${user.id}`))
             .json(UsersService.serializeUser(user))
         })
    })
  .get((req, res, next) => {
    const knexInstance = req.app.get('db')
    UsersService.getAllUsers(knexInstance)
      .then(users => {
        res.json(users.map(serializeUser))
      })
      .catch(next)
  })
})

module.exports = usersRouter
