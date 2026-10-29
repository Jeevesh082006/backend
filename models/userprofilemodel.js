const mongoose = require('mongoose');
const userProfileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true  
    },
    age: {type:Number, trim:true},
    dob: {type:Date, trim:true},
    bio: {type:String, trim:true},
},
{
    timestamps: true
});
module.exports = mongoose.model('UserProfile', userProfileSchema);