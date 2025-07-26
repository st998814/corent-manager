
import jwt from 'jsonwebtoken';

import dotenv from 'dotenv';
dotenv.config();

import { saveInviteToDB, updateInviteStatus } from '../services/inviteService.js';
import { sendInvitationSms } from '../services/smsService.js';

export const sendInvitation = async (req, res) => {
  try {
    const { name, phone } = req.body;
    
    if (!name || !phone) {
      return res.status(400).json({ message: "姓名和電話號碼為必填項目" });
    }

    // 簡單的電話號碼格式驗證
    const phoneRegex = /^[+]?[\d\s\-()]{8,15}$/;
    if (!phoneRegex.test(phone.trim())) {
      return res.status(400).json({ message: "請輸入有效的電話號碼格式" });
    }
    
    const inviteToken = jwt.sign({ phone: phone.trim() }, process.env.JWT_SECRET, { expiresIn: "7d" });

    // 寫入資料庫 (Pending 狀態)
    await saveInviteToDB({ name, phone: phone.trim(), status: "Pending", inviteToken });

    // 發送簡訊邀請
    const smsResult = await sendInvitationSms(phone.trim(), name, inviteToken);
    
    if (smsResult.success) {
      const response = { 
        message: "邀請已成功發送", 
        inviteToken,
        smsSent: true,
        provider: smsResult.provider
      };
      
      // 如果是模擬簡訊，添加模擬消息
      if (smsResult.provider === 'mock' && smsResult.mockMessage) {
        response.mockMessage = smsResult.mockMessage;
        response.message = "邀請已發送 (使用模擬簡訊服務)";
      }
      
      res.json(response);
    } else {
      res.status(500).json({ 
        message: "邀請已保存但簡訊發送失敗", 
        inviteToken,
        smsSent: false,
        error: smsResult.error
      });
    }
  } catch (error) {
    console.error("發送邀請時發生錯誤:", error);
    res.status(500).json({ message: "發送邀請時發生錯誤" });
  }
};


export const acceptInvitation = async (req, res) => {
  try {
    const { token } = req.body;
    
    if (!token) {
      return res.status(400).json({ message: "邀請令牌為必填項目" });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const phone = decoded.phone;

    await updateInviteStatus(phone, "Accepted");
    res.json({ message: "邀請已成功接受" });
  } catch (error) {
    console.error("接受邀請時發生錯誤:", error);
    res.status(400).json({ message: "無效或已過期的邀請令牌" });
  }
};





