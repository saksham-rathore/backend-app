import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
const Schema = mongoose.Schema;

const userschema = new Schema({ password: { type: String } });

userschema.pre("save", async function (next){
    if(!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next()
});

const User = mongoose.model("TestModel", userschema);

async function run() {
    try {
        const u = new User({ password: "abc" });
        await u.validate();
        await u.save();
        console.log("Saved successfully");
    } catch(err) {
        console.error("Error:", err);
    }
}
run();
