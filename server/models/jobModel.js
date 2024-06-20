const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  section: {
    type: String,
    required: [true, 'Please provide a section'],
  },
  role_title: {
    type: String,
    required: [true, 'Please provide a role title'],
  },
  candidates: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Candidate' }],
});
const Job = mongoose.model('Job', jobSchema);

module.exports = Job;
