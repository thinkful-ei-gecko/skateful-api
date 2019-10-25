const knex = require('knex')
const app = require('../src/app')
const helpers = require('./test-helpers')

describe('Skaters Endpoints', function() {
  let db

  const {
    testUsers,
    testSkaters,
    testComments,
  } = helpers.makeSkatersFixtures()

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL,
    })
    app.set('db', db)
  })

  after('disconnect from db', () => db.destroy())

  before('cleanup', () => helpers.cleanTables(db))

  afterEach('cleanup', () => helpers.cleanTables(db))

  describe(`GET /api/skaters`, () => {
    context(`Given no skaters`, () => {
      it(`responds with 200 and an empty list`, () => {
        return supertest(app)
          .get('/api/skaters')
          .expect(200, [])
      })
    })

    context('Given there are skaters in the database', () => {
      beforeEach('insert skaters', () =>
        helpers.seedSkatersTables(
          db,
          testUsers,
          testSkaters,
          testComments,
        )
      )

      it('responds with 200 and all of the skaters', () => {
        const expectedSkaters = testSkaters.map(skater =>
          helpers.makeExpectedSkater(
            testUsers,
            skater,
            testComments,
          )
        )
        return supertest(app)
          .get('/api/skaters')
          .expect(200, expectedSkaters)
      })
    })

    context(`Given an XSS attack skater`, () => {
      const testUser = helpers.makeUsersArray()[1]
      const {
        maliciousSkater,
        expectedSkater,
      } = helpers.makeMaliciousSkater(testUser)

      beforeEach('insert malicious skater', () => {
        return helpers.seedMaliciousSkater(
          db,
          testUser,
          maliciousSkater,
        )
      })

      it('removes XSS attack content', () => {
        return supertest(app)
          .get(`/api/skaters`)
          .expect(200)
          .expect(res => {
            expect(res.body[0].name).to.eql(expectedSkater.name)
            expect(res.body[0].bio).to.eql(expectedSkater.bio)
          })
      })
    })
  })

  describe(`GET /api/skaters/:skater_id`, () => {
    context(`Given no skaters`, () => {
      beforeEach(() =>
        helpers.seedUsers(db, testUsers)
      )

      it(`responds with 404`, () => {
        const skaterId = 123456
        return supertest(app)
          .get(`/api/skaters/${skaterId}`)
          .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
          .expect(404, { error: `Skater doesn't exist` })
      })
    })

    context('Given there are skaters in the database', () => {
      beforeEach('insert skaters', () =>
        helpers.seedSkatersTables(
          db,
          testUsers,
          testSkaters,
          testComments,
        )
      )

      it('responds with 200 and the specified skater', () => {
        const skaterId = 2
        const expectedSkater = helpers.makeExpectedSkater(
          testUsers,
          testSkaters[skaterId - 1],
          testComments,
        )

        return supertest(app)
          .get(`/api/skaters/${skaterId}`)
          .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
          .expect(200, expectedSkater)
      })
    })

    context(`Given an XSS attack Skater`, () => {
      const testUser = helpers.makeUsersArray()[1]
      const {
        maliciousSkater,
        expectedSkater,
      } = helpers.makeMaliciousSkater(testUser)

      beforeEach('insert malicious Skater', () => {
        return helpers.seedMaliciousSkater(
          db,
          testUser,
          maliciousSkater,
        )
      })

      it('removes XSS attack content', () => {
        return supertest(app)
          .get(`/api/skaters/${maliciousSkater.id}`)
          .set('Authorization', helpers.makeAuthHeader(testUser))
          .expect(200)
          .expect(res => {
            expect(res.body.name).to.eql(expectedSkater.name)
            expect(res.body.bio).to.eql(expectedSkater.bio)
          })
      })
    })
  })

  describe(`GET /api/skaters/:skater_id/comments`, () => {
    context(`Given no skaters`, () => {
      beforeEach(() =>
        helpers.seedUsers(db, testUsers)
      )

      it(`responds with 404`, () => {
        const skaterId = 123456
        return supertest(app)
          .get(`/api/skaters/${skaterId}/comments`)
          .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
          .expect(404, { error: `Skater doesn't exist` })
      })
    })

    context('Given there are comments for skater in the database', () => {
      beforeEach('insert skaters', () =>
        helpers.seedSkatersTables(
          db,
          testUsers,
          testSkaters,
          testComments,
        )
      )

      it('responds with 200 and the specified comments', () => {
        const skaterId = 1
        const expectedComments = helpers.makeExpectedSkaterComments(
          testUsers, skaterId, testComments
        )

        return supertest(app)
          .get(`/api/skaters/${skaterId}/comments`)
          .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
          .expect(200, expectedComments)
      })
    })
  })
})

describe('Comments Endpoints', function() {
    let db
  
    const {
      testSkaters,
      testUsers,
    } = helpers.makeSkatersFixtures()
  
    before('make knex instance', () => {
      db = knex({
        client: 'pg',
        connection: process.env.TEST_DB_URL,
      })
      app.set('db', db)
    })
  
    after('disconnect from db', () => db.destroy())
  
    before('cleanup', () => helpers.cleanTables(db))
  
    afterEach('cleanup', () => helpers.cleanTables(db))
  
    describe(`POST /api/skaters/:skaterId/comments`, () => {
      beforeEach('insert skaters', () =>
        helpers.seedSkatersTables(
          db,
          testUsers,
          testSkaters,
        )
      )
  
      it(`creates a comment, responding with 201 and the new comment`, function() {
        this.retries(3)
        const testSkater = testSkaters[0]
        const testUser = testUsers[0]
        const skater_id = testSkater.id
        const newComment = {
          comment: 'Test new comment',
          skater_id: testSkater.id,
        }
        return supertest(app)
          .post(`/api/skaters/${skater_id}/comments`)
          .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
          .send(newComment)
          .expect(201)
          .expect(res => {
            expect(res.body).to.have.property('id')
            expect(res.body.comment).to.eql(newComment.comment)
            expect(res.body.skater_id).to.eql(newComment.skater_id)
            expect(res.body.user.id).to.eql(testUser.id)
            expect(res.headers.location).to.eql(`/api/skaters/${skater_id}/comments/${res.body.id}`)
            const expectedDate = new Date().toLocaleString()
            const actualDate = new Date(res.body.date_published).toLocaleString()
            expect(actualDate).to.eql(expectedDate)
          })
          .expect(res =>
            db
              .from('skateful_comments')
              .select('*')
              .where({ id: res.body.id })
              .first()
              .then(row => {
                expect(row.comment).to.eql(newComment.comment)
                expect(row.skater_id).to.eql(newComment.skater_id)
                expect(row.user_id).to.eql(testUser.id)
                const expectedDate = new Date().toLocaleString('en', { timeZone: 'UTC' })
                const actualDate = new Date(row.date_created).toLocaleString()
                expect(actualDate).to.eql(expectedDate)
              })
          )
      })
  
      const requiredFields = ['comment', 'skater_id']
  
      requiredFields.forEach(field => {
        const testSkater = testSkaters[0]
        const testUser = testUsers[0]
        const newComment = {
          comment: 'Test new comment',
          skater_id: testSkater.id,
        }
  
        it(`responds with 400 and an error message when the '${field}' is missing`, () => {
          delete newComment[field]
          const testSkater = testSkaters[0]
          const skater_id = testSkater.id
          return supertest(app)
            .post(`/api/skaters/${skater_id}/comments`)
            .set('Authorization', helpers.makeAuthHeader(testUser))
            .send(newComment)
            .expect(400, {
              error: `Missing '${field}' in request body`,
            })
        })
      })
    })
  })
  