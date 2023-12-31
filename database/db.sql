DROP DATABASE IF EXISTS prueba;
CREATE DATABASE prueba;

USE prueba;

CREATE TABLE users(
    id INT PRIMARY KEY UNSIGNED AUTO_INCREMENT;
    username VARCHAR(20) NOT NULL;
    password VARCHAR(50) NOT NULL;
)

CREATE TABLE fotos(
    id INT PRIMARY KEY UNSIGNED AUTO_INCREMENT;
    titulo VARCHAR(30) NOT NULL;
    url VARCHAR(100) NOT NULL;
    description TEXT;
    user_id VARCHAR(20) NOT NULL;
    CONSTRAINT fk_user FOREIGN KEY(user_id) REFERENCES users(id)

)