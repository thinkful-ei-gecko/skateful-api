const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

function makeUsersArray() {
  return [
    {
      id: 1,
      user_name: 'test-user-1',
      email: 'TU1@email.com',
      password: 'password',
      date_created: new Date('2029-01-22T16:28:32.615Z'),
    },
    {
      id: 2,
      user_name: 'test-user-2',
      email: 'TU2@email.com',
      password: 'password',
      date_created: new Date('2029-01-22T16:28:32.615Z'),
    },
    {
      id: 3,
      user_name: 'test-user-3',
      email: 'TU3@email.com',
      password: 'password',
      date_created: new Date('2029-01-22T16:28:32.615Z'),
    },
    {
      id: 4,
      user_name: 'test-user-4',
      email: 'TU4@email.com',
      password: 'password',
      date_created: new Date('2029-01-22T16:28:32.615Z'),
    },
  ]
}

function makeSkatersArray(users) {
  return [
    {
      id: 1,
      name: 'First skater',
      location: 'los angeles',
      instagram: 'skater1',
      date_created: new Date('2029-01-22T16:28:32.615Z'),
      bio: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus consequuntur deserunt commodi, nobis qui inventore corrupti iusto aliquid debitis unde non.Adipisci, pariatur.Molestiae, libero esse hic adipisci autem neque ?',
      img_url: 'https://i.ibb.co/nnK0MQN/Screen-Shot-2019-10-17-at-11-08-47-AM.png',
      up_votes: 0
    },
    {
      id: 2,
      name: 'Second skater',
      location: 'new mexico',
      instagram: 'skater2',
      date_created: new Date('2029-01-22T16:28:32.615Z'),
      bio: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus consequuntur deserunt commodi, nobis qui inventore corrupti iusto aliquid debitis unde non.Adipisci, pariatur.Molestiae, libero esse hic adipisci autem neque ?',
      img_url: 'https://i.ibb.co/nnK0MQN/Screen-Shot-2019-10-17-at-11-08-47-AM.png',
      up_votes: 0
    },
    {
      id: 3,
      name: 'Third skater',
      location: 'New York',
      instagram: 'skater3',
      date_created: new Date('2029-01-22T16:28:32.615Z'),
      bio: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus consequuntur deserunt commodi, nobis qui inventore corrupti iusto aliquid debitis unde non.Adipisci, pariatur.Molestiae, libero esse hic adipisci autem neque ?',
      img_url: 'https://i.ibb.co/nnK0MQN/Screen-Shot-2019-10-17-at-11-08-47-AM.png',
      up_votes: 0
    },
    {
      id: 4,
      name: 'Fourth skater',
      location: 'australia',
      instagram: 'skater4',
      date_created: new Date('2029-01-22T16:28:32.615Z'),
      bio: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus consequuntur deserunt commodi, nobis qui inventore corrupti iusto aliquid debitis unde non.Adipisci, pariatur.Molestiae, libero esse hic adipisci autem neque ?',
      img_url: 'https://i.ibb.co/nnK0MQN/Screen-Shot-2019-10-17-at-11-08-47-AM.png',
      up_votes: 0
    },
  ]
}

function makeCommentsArray(users, skaters) {
  return [
    {
      id: 1,
      comment: 'First test comment!',
      skater_id: skaters[0].id,
      user_id: users[0].id,
      date_published: new Date('2029-01-22T16:28:32.615Z'),
    },
    {
      id: 2,
      comment: 'Second test comment!',
      skater_id: skaters[0].id,
      user_id: users[1].id,
      date_published: new Date('2029-01-22T16:28:32.615Z'),
    },
    {
      id: 3,
      comment: 'Third test comment!',
      skater_id: skaters[0].id,
      user_id: users[2].id,
      date_published: new Date('2029-01-22T16:28:32.615Z'),
    },
    {
      id: 4,
      comment: 'Fourth test comment!',
      skater_id: skaters[0].id,
      user_id: users[3].id,
      date_published: new Date('2029-01-22T16:28:32.615Z'),
    },
    {
      id: 5,
      comment: 'Fifth test comment!',
      skater_id: skaters[skaters.length - 1].id,
      user_id: users[0].id,
      date_published: new Date('2029-01-22T16:28:32.615Z'),
    },
    {
      id: 6,
      comment: 'Sixth test comment!',
      skater_id: skaters[skaters.length - 1].id,
      user_id: users[2].id,
      date_published: new Date('2029-01-22T16:28:32.615Z'),
    },
    {
      id: 7,
      comment: 'Seventh test comment!',
      skater_id: skaters[3].id,
      user_id: users[0].id,
      date_published: new Date('2029-01-22T16:28:32.615Z'),
    },
  ];
}

function makeExpectedSkater(users, skater) {
  return {
    id: skater.id,
    name: skater.name,
    instagram: skater.instagram,
    location: skater.location,
    bio: skater.bio,
    img_url: skater.img_url,
    date_created: skater.date_created.toISOString(),
    up_votes: skater.up_votes
  }
}

function makeExpectedSkaterComments(users, skaterId, comments) {
  const expectedComments = comments
    .filter(comment => comment.skater_id === skaterId)

  return expectedComments.map(comment => {
    const commentUser = users.find(user => user.id === comment.user_id)
    return {
      id: comment.id,
      comment: comment.comment,
      date_published: comment.date_published.toISOString(),
      user: {
        id: commentUser.id,
        user_name: commentUser.user_name,
        email: commentUser.email,
        date_created: commentUser.date_created.toISOString(),
      }
    }
  })
}

function makeMaliciousSkater(user) {
  const maliciousSkater = {
    id: 911,
    instagram: 'badman',
    date_created: new Date(),
    name: 'Naughty naughty very naughty &lt;script&gt;alert("xss");&lt;/script&gt;',
    bio: `Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.`,
    location: 'badlands'
}
  const expectedSkater = {
    ...makeExpectedSkater([user], maliciousSkater),
    name: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
    bio: `Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.`,
  }
  return {
    maliciousSkater,
    expectedSkater,
  }
}

function makeSkatersFixtures() {
  const testUsers = makeUsersArray()
  const testSkaters = makeSkatersArray(testUsers)
  const testComments = makeCommentsArray(testUsers, testSkaters)
  return { testUsers, testSkaters, testComments }
}

function cleanTables(db) {
  return db.transaction(trx =>
    trx.raw(
      `TRUNCATE
        skateful_skaters,
        skateful_users,
        skateful_comments
      `
    )
    .then(() =>
      Promise.all([
        trx.raw(`ALTER SEQUENCE skateful_skaters_id_seq minvalue 0 START WITH 1`),
        trx.raw(`ALTER SEQUENCE skateful_users_id_seq minvalue 0 START WITH 1`),
        trx.raw(`ALTER SEQUENCE skateful_comments_id_seq minvalue 0 START WITH 1`),
        trx.raw(`SELECT setval('skateful_skaters_id_seq', 0)`),
        trx.raw(`SELECT setval('skateful_users_id_seq', 0)`),
        trx.raw(`SELECT setval('skateful_comments_id_seq', 0)`),
      ])
    )
  )
}

function seedUsers(db, users) {
  const preppedUsers = users.map(user => ({
    ...user,
    password: bcrypt.hashSync(user.password, 1)
  }))
  return db.into('skateful_users').insert(preppedUsers)
    .then(() =>
    db.raw(
      `SELECT setval('skateful_users_id_seq', ?)`,
      [users[users.length - 1].id],
    )
  )}

  function seedSkatersTables(db, users, skaters, comments=[]) {
    // use a transaction to group the queries and auto rollback on any failure
    return db.transaction(async trx => {
      await seedUsers(trx, users)
      await trx.into('skateful_skaters').insert(skaters)
      // update the auto sequence to match the forced id values
      await trx.raw(
        `SELECT setval('skateful_skaters_id_seq', ?)`,
        [skaters[skaters.length - 1].id],
      )
      // only insert comments if there are some, also update the sequence counter
      if (comments.length) {
        await trx.into('skateful_comments').insert(comments)
        await trx.raw(
          `SELECT setval('skateful_comments_id_seq', ?)`,
          [comments[comments.length - 1].id],
        )
      }
    })
  }
  
function seedMaliciousSkater(db, user, skater) {
  return seedUsers(db, [user])
    .then(() =>
      db
        .into('skateful_skaters')
        .insert([skater])
    )
}

function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
  const token = jwt.sign({ user_id: user.id }, secret, {
         subject: user.user_name,
         algorithm: 'HS256',
       })
       return `Bearer ${token}`
      }

module.exports = {
  makeUsersArray,
  makeSkatersArray,
  makeExpectedSkater,
  makeExpectedSkaterComments,
  makeMaliciousSkater,
  makeCommentsArray,

  makeSkatersFixtures,
  cleanTables,
  seedSkatersTables,
  seedMaliciousSkater,
  makeAuthHeader,
  seedUsers,
}