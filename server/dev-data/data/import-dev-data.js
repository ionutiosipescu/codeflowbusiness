const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Candidate = require('./../../models/candidateModel');
const User = require('./../../models/userModel');
const Interview = require('./../../models/interviewModel');
const Challenge = require('./../../models/challengeModel');
const Comment = require('./../../models/commentModel');
const Reply = require('./../../models/replyModel');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log('DB connection successful!'));

// READ JSON FILE
const candidates = JSON.parse(
  fs.readFileSync(`${__dirname}/candidates.json`, 'utf-8'),
);
const interviews = JSON.parse(
  fs.readFileSync(`${__dirname}/interviews.json`, 'utf-8'),
);
const challenges = JSON.parse(
  fs.readFileSync(`${__dirname}/challenges.json`, 'utf-8'),
);
// const comments = JSON.parse(
//   fs.readFileSync(`${__dirname}/comments.json`, 'utf-8'),
// );
// const replies = JSON.parse(
//   fs.readFileSync(`${__dirname}/replies.json`, 'utf-8'),
// );
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));

// IMPORT DATA INTO DB
const importData = async () => {
  try {
    await User.create(users, { validateBeforeSave: false });
    await Candidate.create(candidates);
    await Interview.create(interviews);
    await Challenge.create(challenges);
    // await Comment.create(comments);
    // await Reply.create(replies);
    console.log('Data successfully loaded!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

// DELETE ALL DATA FROM DB
const deleteData = async () => {
  try {
    await User.deleteMany();
    await Candidate.deleteMany();
    await Interview.deleteMany();
    await Challenge.deleteMany();
    // await Comment.deleteMany();
    // await Reply.deleteMany();
    console.log('Data successfully deleted!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
