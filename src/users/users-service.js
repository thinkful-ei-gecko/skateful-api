const xss = require('xss')
const bcrypt = require('bcryptjs')

const UsersService = {
  getAllUsers(db) {
    return db
      .from('skateful_users AS user')
      .select(
        'user.id',
        'user.user_name',
        'user.date_voted',
        )
      .groupBy('user.id')
  },
    hasUserWithUserName(db, user_name) {
      return db('skateful_users')
        .where({ user_name })
        .first()
        .then(user => !!user)
    },
    insertUser(db, newUser) {
      return db
        .insert(newUser)
        .into('skateful_users')
        .returning('*')
        .then(([user]) => user)
    },
    validatePassword(password) {
      if (password.length < 6) {
        return 'Password must be longer than 6 characters'
      }
      if (password.length > 72) {
        return 'Password must be less than 72 characters'
      }
      if (password.startsWith(' ') || password.endsWith(' ')) {
        return 'Password must not start or end with empty spaces'
      }
    },
    hashPassword(password){
        return bcrypt.hash(password, 12)
    },
    serializeUser(user) {
      return {
        id: user.id,
        user_name: xss(user.user_name),
        email: xss(user.email),
        date_created: new Date(user.date_created),
        admin: user.admin,
      }
    },
  }
  
  module.exports = UsersService
  