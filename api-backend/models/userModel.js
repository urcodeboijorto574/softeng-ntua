const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: [true, 'User name taken! Please provide a new name'],
        required: [true, 'Please provide a name'],
        maxlength: [20, 'A name must have at most 20 characters']
    },
    role: {
        type: String,
        enum: {
            values: ['user', 'admin'],
            message: ['Role must be "user" or "admin"']
        }
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: [8, 'A password must have at leas 8 characters']
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;