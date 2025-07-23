
import jwt from 'jsonwebtoken';

import dotenv from 'dotenv';
dotenv.config();


export const sendInvitation = async (req, res) => {
  const { name, email } = req.body;
  const inviteToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "7d" });

  // 寫入資料庫 (Pending 狀態)
  await saveInviteToDB({ name, email, status: "Pending", inviteToken });

  // 發送 Email（附 deep link）
  sendEmail(
    email,
    "房屋群組邀請",
    `您被邀請加入群組。點擊此處接受邀請: https://yourapp.com/invite?token=${inviteToken}`
  );

  res.json({ message: "Invite sent", inviteToken });
};


export const acceptInvitation = async (req, res) => {
  const { token } = req.body;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const email = decoded.email;

    await updateInviteStatus(email, "Accepted");
    res.json({ message: "Invite accepted" });
  } catch {
    res.status(400).json({ message: "Invalid or expired token" });
  }
};





