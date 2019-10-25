const express = require('express')
const xss = require('xss')
const SkatersService = require('./skaters-service')
const { requireAuth } = require('../middleware/jwt-auth')
const path = require('path')
const skatersRouter = express.Router()
const jsonParser = express.json()
const CommentsService = require('../comments/comments-service')

const serializeSkater = skater => ({
  id: skater.id,
  name: skater.name,
  location: xss(skater.location),
  instagram: xss(skater.instagram),
  date_created: skater.date_created,
  bio: skater.bio,
  img_url: skater.img_url,
  up_votes: skater.up_votes
})

skatersRouter
  .route('/')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db')
    SkatersService.getAllSkaters(knexInstance)
      .then(skaters => {
        res.json(skaters.map(serializeSkater))
      })
      .catch(next)
  })
  .post(requireAuth, jsonParser, (req, res, next) => {
    const { name, location, instagram, bio, img_url } = req.body
    const newSkater = { name, location, instagram, bio, img_url }
    const validateSkater = { name, location, instagram, bio }

    for (const [key, value] of Object.entries(validateSkater))
      if (value == null)
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` }
        })
    
    SkatersService.insertSkater(
      req.app.get('db'),
      newSkater
    )
      .then(skater => {
        res
          .status(201)
          .location(path.posix.join(req.orignalURL + `/${skater.id}`))
          .json(serializeSkater(skater))
      })
      .catch(next)
  })

skatersRouter
  .route('/:skater_id')
  .all(requireAuth)
  .all((req, res, next) => {
    SkatersService.getById(
      req.app.get('db'),
      req.params.skater_id
    )
      .then(skater => {
        if (!skater) {
          return res.status(404).json({
            error: `Skater doesn't exist`
          })
        }
        res.skater = skater
        next()
      })
      .catch(next)
  })
  .get((req, res, next) => {
    res.json(serializeSkater(res.skater))
  })
  .delete((req, res, next) => {
    SkatersService.deleteSkater(
      req.app.get('db'),
      req.params.skater_id
    )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  })
  .patch(requireAuth, jsonParser, (req,res, next) => {
    const { name, location, instagram, bio, img_url, up_votes } = req.body
    const skaterToUpdate = { name, location, instagram, bio, img_url, up_votes }
 
    const numberOfValues = Object.values(skaterToUpdate).filter(Boolean).length
      if (numberOfValues === 0) {
        return res.status(400).json({
          error: {
            message: `Request body must contain either name, location, instagram, bio, or up_votes`
        }
      })
    }
    SkatersService.updateSkater(
      req.app.get('db'),
      req.params.skater_id,
      skaterToUpdate
    )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  })

skatersRouter.route('/:skater_id/comments/')
.all(requireAuth)
.all(checkSkaterExists)
.get((req, res, next) => {
  SkatersService.getCommentsForSkater(
    req.app.get('db'),
    req.params.skater_id
  )
    .then(comments => {
      res.json(comments.map(SkatersService.serializeSkaterComment))
    })
    .catch(next)
})

async function checkSkaterExists(req, res, next) {
try {
  const skater = await SkatersService.getById(
    req.app.get('db'),
    req.params.skater_id
  )

  if (!skater)
    return res.status(404).json({
      error: `Skater doesn't exist`
    })

  res.skater = skater
      next()
    }   
      catch (error) {
        next(error)
      }
  }

skatersRouter.route('/:skater_id/comments')
.all(requireAuth)
.post(requireAuth, jsonParser, (req, res, next) => {
  const { skater_id, comment } = req.body
  const newComment = { skater_id, comment }

  for (const [key, value] of Object.entries(newComment))
    if (value == null)
      return res.status(400).json({
        error: `Missing '${key}' in request body`
      })

  newComment.user_id = req.user.id

  CommentsService.insertComment(
    req.app.get('db'),
    newComment
  )
    .then(comment => {
      res
        .status(201)
        .location(path.posix.join(req.originalUrl, `/${comment.id}`))
        .json(CommentsService.serializeComment(comment))
    })
    .catch(next)
  })
   
skatersRouter.route(`/:skater_id/comments/:comment_id`)
.all(requireAuth)
  .get((req, res, next) => {
    SkatersService.getCommentForSkater(
      req.app.get('db'),
      req.params.skater_id,
      req.params.comment_id
    )
    .then(comments => {
      res.json(comments.map(SkatersService.serializeSkaterComment))
    })
    .catch(next)
  })
  .delete((req, res, next) => {
    SkatersService.deleteComment(
      req.app.get('db'),
      req.params.comment_id
    )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  })
  .patch(requireAuth, jsonParser, (req, res, next) => {
    const { comment } = req.body
    const commentToUpdate = { comment }

    SkatersService.updateComment(
      req.app.get('db'),
      req.params.comment_id,
      commentToUpdate
    )
    .then(numRowsAffected => {
      res.status(201).json({})
    })
    .catch(next)
  })


module.exports = skatersRouter