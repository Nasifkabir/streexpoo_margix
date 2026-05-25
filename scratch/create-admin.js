const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGODB_URI = "mongodb://margix_admin:Fj0bSc229FIUBIAB@ac-7gnz5qa-shard-00-00.4qimgil.mongodb.net:27017,ac-7gnz5qa-shard-00-01.4qimgil.mongodb.net:27017,ac-7gnz5qa-shard-00-02.4qimgil.mongodb.net:27017/?authSource=admin&tls=true";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },
  role: { type: String, enum: ["ADMIN", "STAFF", "CUSTOMER"], default: "CUSTOMER" },
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model("User", UserSchema);

async function createAdmin() {
  await mongoose.connect(MONGODB_URI);
  const email = "admin@example.com";
  const password = "adminpassword";
  
  const existing = await User.findOne({ email });
  if (existing) {
    console.log("Admin already exists");
    process.exit(0);
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  await User.create({
    name: "Test Admin",
    email,
    password: hashedPassword,
    role: "ADMIN"
  });

  console.log("Admin created: admin@example.com / adminpassword");
  process.exit(0);
}

createAdmin();
