const mongoose = require("mongoose");
const submissionSchema = new mongoose.Schema({
  _id: String,
  userID: String,
  submissionDate: String,
  language: String,
  status: String
})

const allSubmission = mongoose.model("Submission", submissionSchema);

const insert = async (filename, Language, userID) => {
  const submission = new allSubmission({
    _id: filename,
    userID: userID,
    language: Language,
    submissionDate: new Date(),
    status: "Pending"
  })
  console.log("Data successfuly Added");
  // console.log(submission);
  submission.save();
};

const update = async (filename, callerval) => {
  let Verdict = "Accepted";
  if (callerval === "0")
    Verdict = "Compilation Error";
  allSubmission.updateOne({ _id: filename }, { status: Verdict }, (error) => {
    console.error((error));
  })
  console.log("Data successfully updated");
}

const find = (userID, req, res) => {
  allSubmission.find({ userID: userID }).sort({ submissionDate: -1 }).exec(function(err, userSubmissions) {
    if (err) {
      console.error((err));
    }
    else {
      res.render("status", { userSubmissions: userSubmissions });
    }
  });
};

module.exports = {
  insert, update, find
}
