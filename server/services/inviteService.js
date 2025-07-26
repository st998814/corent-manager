// 暫時使用內存存儲，實際應用中應使用數據庫
let invites = [];
let inviteIdCounter = 1;

export const saveInviteToDB = async (inviteData) => {
  try {
    const newInvite = {
      id: inviteIdCounter++,
      ...inviteData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    invites.push(newInvite);
    console.log(`✅ 邀請已保存: ${inviteData.name} (${inviteData.phone})`);
    return newInvite;
  } catch (error) {
    console.error("Error saving invitation:", error);
    throw error;
  }
};

export const updateInviteStatus = async (phone, status) => {
  try {
    const inviteIndex = invites.findIndex(invite => invite.phone === phone);
    
    if (inviteIndex === -1) {
      throw new Error('找不到對應的邀請');
    }
    
    invites[inviteIndex].status = status;
    invites[inviteIndex].updatedAt = new Date();
    
    console.log(`✅ 邀請狀態已更新: ${phone} -> ${status}`);
    return invites[inviteIndex];
  } catch (error) {
    console.error("Error updating invite status:", error);
    throw error;
  }
};

export const getAllInvites = () => {
  return invites;
};

