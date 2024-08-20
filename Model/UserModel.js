import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// Define the schema for User
const userSchema = new mongoose.Schema({
    FirstName: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3,
        maxlength: 30,
        immutable: true // Username should not change after creation
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate: {
            validator: function (value) {
                return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value);
            },
            message: "Please provide a valid email address"
        },
        immutable: true // Email should not change after creation
    },
    password: {
        type: String,
        required: true,
        minlength: 8
    },
    LastName: {
        type: String,
        required: true,
        trim: true
    },
    profileImage: {
        type: String,
        default: 'https://w7.pngwing.com/pngs/81/570/png-transparent-profile-logo-computer-icons-user-user-blue-heroes-logo-thumbnail.png'
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

// Method to match user-entered password with the hashed password in the database
userSchema.methods.matchPassword = async function(enteredPassword) {
    return bcrypt.compare(enteredPassword, this.password);
};

// Middleware to hash password before saving the user
userSchema.pre('save', async function(next) {
    // If the password is not modified, move to the next middleware
    if (!this.isModified('password')) {
        return next();
    }

    // Generate a salt with 14 rounds for enhanced security
    const salt = await bcrypt.genSalt(14);
    // Hash the password using bcrypt and store it
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Additional method to secure the user account creation
userSchema.pre('save', function(next) {
    // Convert email and username to lowercase to avoid duplicates due to case sensitivity
    this.email = this.email.toLowerCase();
    this.username = this.username.toLowerCase();
    next();
});

// Index email and username for quicker access and enhanced security
userSchema.index({ email: 1 });
userSchema.index({ username: 1 });

const User = mongoose.model('User', userSchema);

export default User;
