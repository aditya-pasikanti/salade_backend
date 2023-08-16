const express = require("express");
const cors = require('cors')
const router = express.Router();
const app = express();

app.use(express.json());
app.use(cors())
const User = require("../models/userSchema.js");

//Using Async-Await............
app.post('/booktable', async(req, res) => {
    // console.log("NewsLetter Started");

    //Object Destructuring
    const { name, phone } = req.body;

    //Validation
    if (!name || !phone) {
        return res.status(422).json({ error: "Plz Fill the Property!" });
    }

    try {
        const userExist = await User.findOne({ phone: phone });
        if (userExist) {
            return res.status(422).json({ error: "Phone Number Already Exists" });
        }

        // const user = new User({ name, email });
        const user = new User({ name, phone });

        const userRegister = await user.save();
        // const userRegister = await User.insertOne({ name, phone });

        if (userRegister) {
            res.status(201).json({ message: "User Registered Succesfully!" });
        } else {
            res.status(500).json({ error: "Failed to Register..." });
        }



    } catch (error) {
        console.log(error);
    }
});