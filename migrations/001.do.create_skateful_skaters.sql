CREATE TABLE skateful_skaters (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    name TEXT NOT NULL,
    location TEXT NOT NULL,
    instagram TEXT,
    bio TEXT,
    img_url TEXT DEFAULT 'https://i.ibb.co/nnK0MQN/Screen-Shot-2019-10-17-at-11-08-47-AM.png' NOT NULL,
    up_votes INTEGER DEFAULT 0,
    date_created TIMESTAMP DEFAULT now() NOT NULL
);