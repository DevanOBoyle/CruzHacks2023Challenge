const Joi = require('joi');
const express = require('express');
const app = express();

app.use(express.json());

const applicants = [];

// Validation Schema
function validateApplicant(applicant) {
    const schema = Joi.object({
        name: Joi.string().min(1).max(60).required(),
        gender: Joi.string().valid('He/Him', 'She/Her', 'other').required(),
        other_gender: Joi.string().min(1).max(30).when('gender', { is: 'other', then: Joi.required()}),
        email: Joi.string().min(1).max(30).required(),
        age: Joi.alternatives().try(Joi.number(), Joi.string()).required(),
        application_type: Joi.valid('Hacker', 'Judge').required(),
        from_ucsc: Joi.valid('Yes', 'No').when('application_type', {is: 'Hacker', then: Joi.required()}),
        other_school: Joi.string().when('from_ucsc', {is: 'No', then: Joi.required()}),
        company: Joi.string().min(1).max(50).when('application_type', {is: 'Judge', then: Joi.required()})
    }).without('from_ucsc', ['company']).without('company', ['from_ucsc', 'other_school']);

    return schema.validate(applicant);
}

// Validation Schema for Patch Requests
function validateApplicantOptional(applicant) {
    const schema = Joi.object({
        name: Joi.string().min(1).max(60),
        gender: Joi.string().valid('He/Him', 'She/Her', 'other'),
        other_gender: Joi.string().min(1).max(30).when('gender', { is: 'other', then: Joi.required()}),
        age: Joi.alternatives().try(Joi.number(), Joi.string()),
        application_type: Joi.valid('Hacker', 'Judge'),
        from_ucsc: Joi.valid('Yes', 'No').when('application_type', {is: 'Hacker', then: Joi.required()}),
        other_school: Joi.string().when('from_ucsc', {is: 'No', then: Joi.required()}),
        company: Joi.string().min(1).max(50).when('application_type', {is: 'Judge', then: Joi.required()})
    }).without('from_ucsc', ['company']).without('company', ['from_ucsc', 'other_school']);

    return schema.validate(applicant);
}

// GET Request
app.get('/api/applicants/:id/', (req, res) => {
    const applicant = applicants.find(c => c.id === parseInt(req.params.id) || c.email === req.params.id);
    if (!applicant) {
        res.status(404).send('The applicant with the given ID/email was not found');
        return;
    }
    res.send(applicant);
});

//POST Request
app.post('/api/applicants/', (req, res) => {
    const prev_applicant = applicants.find(c => c.email === req.body.email);
    if (prev_applicant) {
        res.status(404).send('Email already exists in the database.');
        return;
    }

    const result = validateApplicant(req.body);
    console.log(result);

    if (result.error) {
        res.status(400).send(result.error.details[0].message);
        return;
    }
    const applicant = {
        id: applicants.length + 1,
        name: req.body.name,
        gender: req.body.gender,
        other_gender: req.body.other_gender,
        email: req.body.email,
        age: req.body.age,
        application_type: req.body.application_type,
        from_ucsc: req.body.from_ucsc,
        other_school: req.body.other_school,
        company: req.body.company
    };
    applicants.push(applicant);
    res.send(applicant);
});

//PATCH request
app.patch('/api/applicants/:email', (req, res) => {
    const applicant = applicants.find(c => c.email === req.params.email);
    if (!applicant) {
        res.status(404).send('The applicant with the given email was not found');
        return;
    }
    if (req.body.email) {
        res.send('Cannot change email.');
        return;
    }
    if (req.body.application_type) {
        res.send('Cannot change application type.');
        return;
    }
    
    const result = validateApplicantOptional(req.body);
    if (result.error) {
        res.status(400).send(result.error.details[0].message);
        return;
    }
    if (req.body.name) {
        applicant.name = req.body.name;
    }
    if (req.body.gender) {
        applicant.gender = req.body.gender;
    }
    if (req.body.other_gender) {
        applicant.other_gender = req.body.other_gender;
    }
    if (req.body.age) {
        applicant.age = req.body.age;
    }
    if (req.body.from_ucsc) {
        applicant.from_ucsc = req.body.from_ucsc;
    }
    if (req.body.other_school) {
        applicant.other_school = req.body.other_school;
    }
    if (req.body.company) {
        applicant.company = req.body.comapny;
    }
    res.send(applicant);
});

//DELETE Request
app.delete('/api/applicants/:id', (req, res) => {
    const applicant = applicants.find(c => c.id === parseInt(req.params.id) || c.email === req.params.id);
    if (!applicant) {
        res.status(404).send('The applicant with the given ID/email was not found');
        return;
    }
    const index = applicants.indexOf(applicant);
    applicants.splice(index, 1);

    res.send(applicant);
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));