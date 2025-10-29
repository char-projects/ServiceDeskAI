Register:

curl -X POST http://localhost:4000/api/auth/register \
-H "Content-Type: application/json" \
-d '{"name":"Alice","email":"a@ex.com","password":"pass123"}'


Login to get token:

curl -X POST http://localhost:4000/api/auth/login \
-H "Content-Type: application/json" \
-d '{"email":"a@ex.com","password":"pass123"}'
# response: { "token": "ey..." }


Create ticket with image (use curl -F):

curl -X POST http://localhost:4000/api/tickets \
-H "Authorization: Bearer <TOKEN>" \
-F "title=Printer broken" \
-F "description=Paper jam and error code 123" \
-F "office=Malaga HQ" \
-F "media=@./screenshot.jpg"


List tickets:

curl -X GET http://localhost:4000/api/tickets -H "Authorization: Bearer <TOKEN>"




Seed script to create an admin user:

backend/scripts/seed.js

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../src/models/User');

const MONGO = process.env.MONGO_URI || 'mongodb://localhost:27017/servicedesk';
const run = async () => {
await mongoose.connect(MONGO, { useNewUrlParser: true, useUnifiedTopology: true });
const email = 'admin@example.com';
const exists = await User.findOne({ email });
if (exists) {
console.log('Admin exists');
process.exit(0);
}
const hashed = await bcrypt.hash('adminpass', 10);
await User.create({ name: 'Admin', email, password: hashed, role: 'admin' });
console.log('Admin created:', email, 'password: adminpass');
process.exit(0);
};

run().catch(err => { console.error(err); process.exit(1); });


Run it locally with:

node backend/scripts/seed.js