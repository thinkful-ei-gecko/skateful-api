const xss = require('xss')

const CommentsService = {
  getById(db, id) {
    return db
      .from('skateful_comments AS comm')
      .select(
        'comm.id',
        'comm.comment',
        'comm.date_published',
        'comm.skater_id',
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
      .leftJoin(
        'skateful_users AS usr',
        'comm.user_id',
        'usr.id',
      )
      .where('comm.id', id)
      .first()
  },

  insertComment(db, newComment) {
    return db
      .insert(newComment)
      .into('skateful_comments')
      .returning('*')
      .then(([comment]) => comment)
      .then(comment =>
        CommentsService.getById(db, comment.id)
      )
  },

  serializeComment(comment) {
    const { user } = comment
    return {
      id: comment.id,
      comment: xss(comment.comment),
      skater_id: comment.skater_id,
      date_published: new Date(comment.date_published),
      user: {
        id: user.id,
        user_name: user.user_name,
        full_name: user.email,
        date_published: new Date(user.date_published),
      },
    }
  }
}

module.exports = CommentsService