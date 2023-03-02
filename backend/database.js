const mongoose = require("mongoose");
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
  const submission = new allSubmission({
    _id: filename,
    userID: userID,
    code: inputFile,
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
