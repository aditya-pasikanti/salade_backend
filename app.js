const express = require('express');
const cors = require('cors');
const twilio = require('twilio');

const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

const app = express();
app.use(express.json());
app.use(cors());


//mongo connection
require('./db/conn.js');

// // Twilio credentials
const accountSid = 'AC1d93099c876ae4eae7b6ecd54418eba4';
const authToken = '929455336cffbcc2c8460c3bbb0b9673';
const client = twilio(accountSid, authToken);
// Twilio Number = +17069899153


const User = require("./models/userSchema.js");


//Using Async-Await............
app.post('/booktable', async(req, res) => {

    //Object Destructuring
    const { name, phone } = req.body;
    const newPhone = phone;
    const num = process.env.num;

    const sms = await client.messages.create({
        body: `\nName: ${name}\nPhone No.: ${newPhone}\nYour Table has been booked...\nThank You, Have A Great Healthy Meal!`,
        from: '+17069899153',
        to: num
    });

    console.log(sms.sid);

    //Validation
    if (!name || !phone) {
        return res.status(422).json({ error: "Plz Fill the Property!" });
    }

    try {
        const userExist = await User.findOne({ phone: phone });
        if (userExist) {
            return res.status(422).json({ error: "Phone Number Already Exists" });
        }

        const user = new User({ name, phone });

        const userRegister = await user.save();

        if (userRegister) {
            res.status(201).json({ message: "User Registered Succesfully!" });
        } else {
            res.status(500).json({ error: "Failed to Register..." });
        }



    } catch (error) {
        console.log(error);
    }
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server is running at ${PORT}`);
})