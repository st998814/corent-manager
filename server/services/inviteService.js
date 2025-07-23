import InviteModel from '../models/inviteModel.js'; 

export const saveInviteToDB = async (inviteData) => {
  try {
    const newInvite = new InviteModel(inviteData);
    return await newInvite.save();
  } catch (error) {
    console.error("Error saving invitation:", error);
    throw error;
  }
};

