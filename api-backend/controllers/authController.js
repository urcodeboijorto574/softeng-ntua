const User = require('./../models/userModel');

exports.createUser = async (req, res) => {
    const newUser = await User.create({
        username: req.params.username,
        password: req.params.password,
        role: req.params.usermod
        
    })
}