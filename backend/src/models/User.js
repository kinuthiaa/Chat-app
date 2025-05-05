import mongoose from "mongoose";
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    /* form fields and data input */
    fullName: {type: String, required: true},
    Email: {type:String, unique: true, required: true},
    Password: {type: String, required: true, minlength: 6},
    Bio: {type: String, default: ""},
    ProfilePic: {type: String, default: ""},
    NativeLanguage: {type: String, default: ""},
    LearningLanguage: {type: String, default: ""},
    Location: {type: String, default: ""},
    isOnboarded: {type: Boolean, default: false},
    friends: [
        {
            type: mongoose.Schema.Types.ObjectId, 
            ref: "User",
        }
    ],
},{timestamps:true});

//pass hashing thru making prehooks
userSchema.pre("save", async function(next) {
    if(!this.isModified("Password")) return next();
    try{
        const salt = await bcrypt.genSalt(10);
        this.Password = await bcrypt.hash(this.Password, salt);
        next()
    }catch(error){next(error);}
});

userSchema.methods.matchPassword = async function (enteredPassword) {
    const isPassCorrect =  await bcrypt.compare(enteredPassword, this.Password);
    return isPassCorrect;
    
}

const User = mongoose.model("User", userSchema);

export default User;