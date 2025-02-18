const mongoose = require("mongoose");
const bcrypt = require('bcrypt');

const peopleSchema = mongoose.Schema(
    {
      username: {    
        type: String,
        required: false,
        trim: true,
      },  // regular signup
      googleId: { 
        type: String, 
        unique: true, 
        sparse: true }, // Google sign-up
      email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true
      },
     
      password: {
        type: String,
        required: true,
      },
      
      verificationCode: String, // Add this field
      verificationCodeExpires: Date,
      role: {
        type: String,
        enum: ["admin", "user"],
        default: "user",
      },
    },
    {
      timestamps: true,
    }
  );
  peopleSchema.pre("save",async function (next) {
    if (!this.googleId && !this.password) {
      return next(new Error("Either Google ID or Password is required"));
    }
    // Hash the password if it's being modified or is new
  if (this.isModified("password") || this.isNew) {
    try {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
      next();
    } catch (error) {
      next(error);
    }
  } else {
    next();
  }
  });
  
  const People = mongoose.model("People", peopleSchema);

module.exports = People;
  