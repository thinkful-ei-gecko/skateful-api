const xss = require('xss')

const SkatersService = {
    getAllSkaters(db) {
        return db
          .from('skateful_skaters AS sk8r')
          .select(
            'sk8r.id',
            'sk8r.name',
            'sk8r.date_created',
            'sk8r.instagram',
            'sk8r.location',
            'sk8r.img_url',
            'sk8r.bio',
            'sk8r.up_votes',
            db.raw(
              `count(DISTINCT comm) AS number_of_comments`
            ),
            db.raw(
              `json_strip_nulls(
                json_build_object(
                    'id', usr.id,
                    'user_name', usr.user_name,
                    'email', usr.email
                )
              ) AS "author"`
            ),
          )
          .leftJoin(
            'skateful_comments AS comm',
            'sk8r.id',
            'comm.skater_id',
          )
          .leftJoin(
            'skateful_users AS usr', 
            'sk8r.added_by',
            'usr.id',
          )
          .groupBy('sk8r.id', 'usr.id')
      },
    insertSkater(knex, newSkater) {
        return knex
            .insert(newSkater)
            .into('skateful_skaters')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },
    
  getById(db, id) {
    return SkatersService.getAllSkaters(db)
      .where('sk8r.id', id)
      .first()
  },
    deleteSkater(knex, id) {
        return knex('skateful_skaters')
            .where({ id })
            .delete()
    },
    deleteComment(knex, id) {
      return knex('skateful_comments')
          .where({ id })
          .delete()
    },
    updateSkater(knex, id, newSkaterFields) {
        return knex('skateful_skaters')
            .where({ id })
            .update(newSkaterFields)
    },
    updateComment(knex, id, newCommentFields) {
      return knex('skateful_comments')
        .where({ id })
        .update(newCommentFields)
    },
    getCommentForSkater(db, skater_id, comment_id) {
      return db
          .from('skateful_comments AS comm')
          .select(
            'comm.id',
            'comm.comment',
            'comm.date_published',
            db.raw(
              `json_strip_nulls(
                row_to_json(
                  (SELECT tmp FROM (
                    SELECT
                      usr.id,
                      usr.user_name,
                      usr.email,
                      usr.date_created
                  ) tmp)
                )
              ) AS "user"`
            )
          )
          .where('comm.id', comment_id)
          .where('comm.skater_id', skater_id)
          .leftJoin(
            'skateful_users AS usr',
            'comm.user_id',
            'usr.id',
          )
          .groupBy('comm.id', 'usr.id')
              
    },
    getCommentsForSkater(db, skater_id) {
        return db
          .from('skateful_comments AS comm')
          .select(
            'comm.id',
            'comm.comment',
            'comm.date_published',
            db.raw(
              `json_strip_nulls(
                row_to_json(
                  (SELECT tmp FROM (
                    SELECT
                      usr.id,
                      usr.user_name,
                      usr.email,
                      usr.date_created
                  ) tmp)
                )
              ) AS "user"`
            )
          )
          .where('comm.skater_id', skater_id)
          .leftJoin(
            'skateful_users AS usr',
            'comm.user_id',
            'usr.id',
          )
          .groupBy('comm.id', 'usr.id')
    },
    serializeSkater(skater) {
        const { author } = skater
        return {
          id: skater.id,
          name: skater.name,
          instagram: xss(skater.instagram),
          bio: xss(skater.bio),
          location: xss(skater.location),
          date_created: new Date(skater.date_created),
          number_of_comments: Number(skater.number_of_comments) || 0,
          author: {
            id: author.id,
            user_name: author.user_name,
            email: author.email,
            date_created: new Date(author.date_created),
          },
        }
      },
    serializeSkaterComment(comment) {
      const { user } = comment
        return {
          id: comment.id,
          skater_id: comment.skater_id,
          comment: xss(comment.comment),
          date_published: new Date(comment.date_published),
          user: {
            id: user.id,
            user_name: user.user_name,
            email: user.email,
            date_created: new Date(user.date_created),
          },
        }
      },
}

module.exports = SkatersService;