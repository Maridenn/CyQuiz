CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(10) DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS quizzes (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
  time_limit INTEGER DEFAULT 60,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS questions (
  id SERIAL PRIMARY KEY,
  quiz_id INTEGER REFERENCES quizzes(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  option_a VARCHAR(255) NOT NULL,
  option_b VARCHAR(255) NOT NULL,
  option_c VARCHAR(255) NOT NULL,
  option_d VARCHAR(255) NOT NULL,
  correct_answer CHAR(1) NOT NULL CHECK (correct_answer IN ('a','b','c','d')),
  points INTEGER DEFAULT 10,
  order_num INTEGER DEFAULT 0,
  explanation TEXT,           -- shown to user when they answer wrong
  study_link VARCHAR(500)     -- optional URL for further reading
);

CREATE TABLE IF NOT EXISTS attempts (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  quiz_id INTEGER REFERENCES quizzes(id) ON DELETE CASCADE,
  score INTEGER DEFAULT 0,
  total_questions INTEGER DEFAULT 0,
  correct_answers INTEGER DEFAULT 0,
  time_taken INTEGER DEFAULT 0,
  completed_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS attempt_answers (
  id SERIAL PRIMARY KEY,
  attempt_id INTEGER REFERENCES attempts(id) ON DELETE CASCADE,
  question_id INTEGER REFERENCES questions(id) ON DELETE CASCADE,
  selected_answer CHAR(1) CHECK (selected_answer IN ('a','b','c','d')),
  is_correct BOOLEAN DEFAULT false
);

INSERT INTO users (username, email, password, role)
VALUES ('admin', 'admin@gmail.com', '$2b$10$wgUcBo0I.htk7g4dq045ROfRjIGh6e2MGpa3dXI7AWVaQCXt1GgNG', 'admin')
ON CONFLICT DO NOTHING;
