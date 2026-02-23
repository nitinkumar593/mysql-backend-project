-- CREATE TABLE user(
--     id INT PRIMARY KEY,
--     username VARCHAR(50) UNIQUE,
--     email VARCHAR(50) UNIQUE NOT NULL,
--     password VARCHAR(50) NOT NULL
-- );
ALTER TABLE user
MODIFY id VARCHAR(36) ;

