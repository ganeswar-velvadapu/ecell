create table users (
    id integer primary key generated always as identity
    username varchar(50) unique not null
    email varchar(50) unique not null
    password text not null
    reward_points integer default 0
)


