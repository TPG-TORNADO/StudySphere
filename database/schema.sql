CREATE DATABASE IF NOT EXISTS studysphere;
USE studysphere;

CREATE TABLE IF NOT EXISTS users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(120) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    bio VARCHAR(500),
    role VARCHAR(20) NOT NULL DEFAULT 'USER',
    enabled BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS study_groups (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(120) NOT NULL,
    description VARCHAR(1000) NOT NULL,
    created_by_id BIGINT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_study_groups_created_by FOREIGN KEY (created_by_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS group_memberships (
    user_id BIGINT NOT NULL,
    study_group_id BIGINT NOT NULL,
    joined_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, study_group_id),
    CONSTRAINT fk_group_memberships_user FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT fk_group_memberships_group FOREIGN KEY (study_group_id) REFERENCES study_groups(id)
);

CREATE TABLE IF NOT EXISTS discussion_posts (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(160) NOT NULL,
    content TEXT NOT NULL,
    author_id BIGINT NOT NULL,
    study_group_id BIGINT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_discussion_posts_author FOREIGN KEY (author_id) REFERENCES users(id),
    CONSTRAINT fk_discussion_posts_group FOREIGN KEY (study_group_id) REFERENCES study_groups(id)
);

CREATE TABLE IF NOT EXISTS comments (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    content VARCHAR(2000) NOT NULL,
    author_id BIGINT NOT NULL,
    discussion_post_id BIGINT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_comments_author FOREIGN KEY (author_id) REFERENCES users(id),
    CONSTRAINT fk_comments_post FOREIGN KEY (discussion_post_id) REFERENCES discussion_posts(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS resources (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(1000) NOT NULL,
    uploaded_by_id BIGINT NOT NULL,
    study_group_id BIGINT NOT NULL,
    uploaded_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_resources_uploaded_by FOREIGN KEY (uploaded_by_id) REFERENCES users(id),
    CONSTRAINT fk_resources_group FOREIGN KEY (study_group_id) REFERENCES study_groups(id)
);
