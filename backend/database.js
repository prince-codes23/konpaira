const mongoose = require("mongoose");
const date = require('date-and-time');
const submissionSchema = new mongoose.Schema({
  _id: String,
  userID: String,
  code : String,
  submissionDate: String,
  language: String,
  status: String
})

const allSubmission = mongoose.model("Submission", submissionSchema);

const insert = async (filename, Language, userID,inputFile) => {
  const now = new Date();
  const submission = new allSubmission({
    _id: filename,
    userID: userID,
    code: inputFile,
    language: Language,
    submissionDate: date.format(now,'YYYY/MM/DD HH:mm:ss'),
    status: "Pending"
  })
  submission.save();
};

const update = async (filename, callerval) => {
  let Verdict = "Accepted";
  if (callerval === "0")
    Verdict = "Compilation Error";
  allSubmission.updateOne({ _id: filename }, { status: Verdict }, (error) => {
    console.error((error));
  })
}

const find = (userID, req, res) => {
  allSubmission.find({ userID: userID }).sort({ submissionDate: -1 }).exec(function(err, userSubmissions) {
    if (err) {
      console.error((err));
    }
    else {
      res.render("status", {userID: userID, userSubmissions: userSubmissions });
    }
  });
};

const findData = (filename,res) => {
  allSubmission.findById(filename,(err,doc) => {
    if (err) {
      console.log(err);
    } else {
      res.send(doc.code);
    }
  })
}
module.exports = {
  insert, update, find,findData
}
