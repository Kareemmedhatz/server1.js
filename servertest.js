const express = require('express');
const mongoose = require('mongoose');
const app = express();

app.use(express.json()); 


mongoose.connect('mongodb://127.0.0.1:27017/sec1')
    .then(() => console.log("DB now is connected:)"))
    .catch((err) => console.log(err));

// Student Schema
const studentSchema = new mongoose.Schema({
    name: String,
    age: Number,
    level: String,
    address: String,
});

// Doctor Schema
const doctorSchema = new mongoose.Schema({
    name: String,
    age: Number,
    phone: String,
});

// Models
const Student = mongoose.model('students', studentSchema);
const Doctor = mongoose.model('doctors', doctorSchema);

// ====== >>> Routes <<< ======

// === >>> Students Routes <<< ===

// Add Student (hardcoded)
app.post('/add-student-hardcoded', async (req, res) => {
    try {
        const student = new Student({
            name: "kareem",
            age: 20,
            level: "2nd year",
            address: "ismailia"
        });
        await student.save();
        res.send('student added successfully:)');
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Add Student 
app.post('/add-student', async (req, res) => {
    try {
        const student = new Student(req.body);
        await student.save();
        res.send('Student added successfully:)');
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Update Student Name
app.put('/update-student-name', async (req, res) => {
    const oldName = req.query.oldName;
    const newName = req.query.newName;

    try {
        const student = await Student.findOne({ name: oldName });
        if (!student) {
            res.send('Student not found :(');
        } else {
            student.name = newName;
            await student.save();
            res.send('Student name updated:)');
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Get all Students
app.get('/students', async (req, res) => {
    try {
        const students = await Student.find();
        res.json(students);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Delete Student
app.delete('/delete-student', async (req, res) => {
    try {
        const { name } = req.query;
        const deleted = await Student.findOneAndDelete({ name });
        if (!deleted) return res.send("Student not found");
        res.send('Student deleted successfully:)');
    } catch (error) {
        res.status(500).send(error.message);
    }
});


// === >>> Doctors Routes <<< ===

// Add Doctor 
app.post('/add-doctor-query', async (req, res) => {
    try {
        const { name, age, phone } = req.query;
        const doctor = new Doctor({ name, age, phone });
        await doctor.save();
        res.send('Doctor added from query successfully:)');
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Get all Doctors
app.get('/doctors', async (req, res) => {
    try {
        const doctors = await Doctor.find();
        res.json(doctors);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Update Doctor Name 
app.put('/update-doctor-name', async (req, res) => {
    try {
        const { oldName, newName } = req.query;
        const updated = await Doctor.findOneAndUpdate(
            { name: oldName },
            { name: newName },
            { new: true }
        );
        if (!updated) return res.send("Doctor not found");
        res.send(`Doctor name updated to ${updated.name}`);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Delete Doctor
app.delete('/delete-doctor', async (req, res) => {
    try {
        const { name } = req.query;
        const deleted = await Doctor.findOneAndDelete({ name });
        if (!deleted) return res.send("Doctor not found");
        res.send('Doctor deleted successfully');
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// ===  >>> Fetch both Students and Doctors << ===
app.get('/all', async (req, res) => {
    try {
        const students = await Student.find();
        const doctors = await Doctor.find();
        res.json({ students, doctors });
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Start Server
app.listen(3000, () => {
    console.log('server now is opened:)');
});







//POST http://localhost:3000/add-student-hardcoded
//POST http://localhost:3000/add-student
//PUT http://localhost:3000/update-student-name?oldName=kareem&newName=Ali
// GET http://localhost:3000/students
//DELETE http://localhost:3000/delete-student?name=Ali
