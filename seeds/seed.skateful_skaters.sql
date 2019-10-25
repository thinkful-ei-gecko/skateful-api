BEGIN;

TRUNCATE 
  skateful_skaters,
  skateful_users
  RESTART IDENTITY CASCADE;

INSERT INTO skateful_skaters (name, location, instagram, bio)
VALUES
  ('First Skater', 'Location 1', '@skater123', 
    'A skateboarder who primarily focuses on...'),
  ('Second Skater', 'Location 2', '@skater432',
    'Invented the twiggle drop lol, jk that is not a real ting'),
  ('Third Skater', 'Location 3', '@gccisl4y3r69',
    'swagged out skater from hodgebridge');

INSERT INTO skateful_users (user_name, email, password, admin)
VALUES
  ('admin', 'dundermifflin@email.com', '$2a$12$lHK6LVpc15/ZROZcKU00QeiD.RyYq5dVlV/9m4kKYbGibkRc5l4Ne', true),
  ('b.deboop', 'BodeepDeboop@email.com', '$2a$12$VQ5HgWm34QQK2rJyLc0lmu59cy2jcZiV6U1.bE8rBBnC9VxDf/YQO', false),
  ('c.bloggs', 'CharlieBloggs@yapoo.com', '$2a$12$2fv9OPgM07xGnhDbyL6xsuAeQjAYpZx/3V2dnu0XNIR27gTeiK2gK', false),
  ('s.smith', 'SamSmith@doogle.com', '$2a$12$/4P5/ylaB7qur/McgrEKwuCy.3JZ6W.cRtqxiJsYCdhr89V4Z3rp.', false),
  ('lexlor', 'AlexTaylor@coldmail.com', '$2a$12$Hq9pfcWWvnzZ8x8HqJotveRHLD13ceS7DDbrs18LpK6rfj4iftNw.', false),
  ('wippy', 'PingWonIn@boop.com', '$2a$12$ntGOlTLG5nEXYgDVqk4bPejBoJP65HfH2JEMc1JBpXaVjXo5RsTUu', false);

INSERT INTO skateful_comments (user_id, skater_id, comment, points)
VALUES
  (1, 1, 'Wow, did you see his Celery part?! It was bonkers!!', 4),
  (2, 1, 'Yeah dude!!!', 2),
  (3, 2, 'Sauce God', 9),
  (2, 1, 'I just like commenting on things!', 0);

COMMIT;