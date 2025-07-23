import mongoose from 'mongoose';

const inviteSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  status: { type: String, default: 'pending' }, // pending, accepted, rejected
  createdAt: { type: Date, default: Date.now }
});

const InviteModel = mongoose.model('Invite', inviteSchema);

export default InviteModel;