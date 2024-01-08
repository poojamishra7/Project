const bcrypt = require('bcrypt');
const { User, JobListing } = require('../models/models');
const jwt = require('jsonwebtoken');
const mongooose = require('mongoose');
const SECRET_KEY = "LANDMARK";
let signup = async (req, res) => {
    const { username, password } = req.body;
    let hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ username, hashedPassword });

    try {
        await newUser.save();
        console.log(newUser); // Logging the newly created user
        res.sendStatus(201);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};

let userLogin = (async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const isValidUser = await bcrypt.compare(password, user.hashedPassword);

        if (isValidUser) {
            const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' });
            return res.json({ token });
        }

        return res.status(401).json({ message: 'Invalid credentials' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

let getJobListings = (async (req, res) => {
    try {
        const jobId = req.params.id;
        const result = await JobListing.find({ joblistId: jobId }).exec();
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

let jobListings = (req, res) => {
    const { title, description, company } = req.body;
    const createdBy = req.body.username;
    const newJobListing = new JobListing({ title, description, company, createdBy });
    try {
        newJobListing.save();
        console.log(newJobListing); // Logging the newly created user
        res.json({ message: 'Job listing created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};

const jobListingsUpdate = async (req, res) => {
    try {
        let id = req.body.id;
        const jobListings_obj = {};
        for (const key in req.body) {
            jobListings_obj[key] = req.body[key] !== undefined ? req.body[key] : "";
        }
        const result = await JobListing.updateOne({ "joblistId": id }, jobListings_obj);
        if (result.modifiedCount > 0 || result.matchedCount>0) {
            res.status(200).json({ message: 'Job listing updated successfully.' });
        } else {
            res.status(404).json({ error: 'Job listing not found.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const jobListingsDelete = async(req,res)=>{
    try{
        let id = req.body.id;
        let result =await JobListing.deleteOne({"joblistId": id});
        if (result.deletedCount > 0) {
            res.status(200).json({ message: 'Job listing deleted successfully.' });
        } else {
            res.status(404).json({ error: 'Job listing not found.' });
        }
    }catch(ex){
        console.error(ex);
        res.status(500).json({ ex: 'Internal Server Error' });
    }
};

module.exports = { userLogin, jobListings, getJobListings, signup ,jobListingsUpdate,jobListingsDelete}