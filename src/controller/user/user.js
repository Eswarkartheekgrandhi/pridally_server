const db = require("../../utils/db_utils");

const registerUser = (req, res) => {    
  db.db(async function (db, client) {
    const collection = db.collection("user");

    await collection.updateOne(
      {
        uuid: req.body.uuid,
      },
      {
        $set: {
          uuid: req.body.uuid,
          email: req.body.email,
          name: req.body.name,
          photoUrl: req.body.photoUrl,
        },
      },
      { upsert: true }
    );
    res.setHeader("Content-Type", "application/json");
    res.end();
    client.close();
  });
};

const versionCheck = (req, res, next) => {
  res.setHeader("Content-Type", "application/json");
  const response = {};
  if (
    req.body.email == null ||
    req.body.version == null ||
    isNaN(parseInt(req.body.version))
  ) {
    res.status(500);
    res.end();
  }
//    else if (parseInt(req.body.version) < 14 /*process.env.VERSION 14*/) {
//     response["isForced"] = true;
//     response["path"] = "update";
//     res.end(JSON.stringify(response));
//   }
   else {
    db.db(async function (db, client) {
      const users = db.collection("user");
      const user = await users.findOne({ email: req.body.email });

      if (user != null && user.isOnboardingComplete) {
        response["path"] = "home";
        res.end(JSON.stringify(response));
      } else {
        response["path"] = "onboarding";
        res.end(JSON.stringify(response));
      }
      client.close();
    });
  }
};

const updateOnboardingPreferences = (req, res, next) => {
  if (req.body.email == null && req.body.data == null) {
    res.status(500);
    res.end();
  } else {
    db.db(async function (db, client) {
      const users = db.collection("user");
      const user = await users.updateOne(
        { email: req.body.email },
        {
          $set: {
            isOnboardingComplete: true,
            onboardingResponses: req.body.data,
          },
        },
        { upsert: true }
      );
      if (user.modifiedCount > 0) {
        res.status(200).end();
      } else {
        res.status(500).end();
      }
      client.close();
    });
  }
};

module.exports = {
  registerUser,
  versionCheck,
  updateOnboardingPreferences,
};
