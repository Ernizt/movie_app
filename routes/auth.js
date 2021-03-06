const router = require("express").Router();
const User = require('../models/User');
const CryptoJS = require('crypto-js');
const jwt = require('jsonwebtoken');
router.post("/register", async (req, res) => {

    const user = await User.findOne({ email: req.body.email });
    if(user != null ) {
        res.status(401).json("This mail exists");
    }
    else {
        try {
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: CryptoJS.AES.encrypt(req.body.password, process.env.SECRET_KEY).toString()
        });



            const user = await newUser.save();
           const accessToken = jwt.sign(
                { id: user._id, isAdmin: user.isAdmin, username:user.username, email:user.email, password:req.body.password },
                process.env.SECRET_KEY,
                { expiresIn: "30d" }
            );
            res.status(200).json(accessToken);
        } catch (err) {
            res.status(501).json(err);
        }
    }

});

//LOGIN
router.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if(user == null ) {
            res.status(401).json("Wrong password or username!");
        }
      else  {


        const bytes = CryptoJS.AES.decrypt(user.password, process.env.SECRET_KEY);
        const originalPassword = bytes.toString(CryptoJS.enc.Utf8);

        if(originalPassword !== req.body.password){
              res.status(401).json("Wrong password or username!");
              console.log("OriginalPassword")
          }
          else  {

             const accessToken = jwt.sign(
                { id: user._id,
                     isAdmin: user.isAdmin,
                     username:user.username,
                     email:user.email,
                     password:originalPassword},
                      process.env.SECRET_KEY,
                { expiresIn: "30d" }
            );
            res.status(200).json(accessToken);
                       }
        }
    } catch (err) {
        res.status(500).json(err);
    }
});
module.exports = router;