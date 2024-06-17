const mongoose = require('mongoose');
const validator = require('validator');

const jobSchema = new mongoose.Schema({
  section: String,
  role_title: String,
  candidates: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Candidate' }],
});
const Job = mongoose.model('Job', jobSchema);

module.exports = Job;
