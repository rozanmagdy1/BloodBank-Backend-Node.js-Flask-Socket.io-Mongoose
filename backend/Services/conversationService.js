const Conversation = require('../Model/Conversations');
class ConversationService {

    async newConversation(senderId, receiverId) {
        try {
            const saved_conversation = await new Conversation({members : [senderId,receiverId],});
            await saved_conversation.save();
            return "success";
        }catch (e) {
            return null;
        }
    }

    async getConversationOfUser(userId) {
        try {
            return await Conversation.find({members: {$in : [userId]}});
        }catch (e) {
            return null;
        }
    }

    async getConversationOfTwoUsers(firstUserId, secondUserId) {
        try {
            if(firstUserId === secondUserId){
                return 'same user'
            }
            let conversation = await Conversation.findOne({
                members: { $all: [firstUserId, secondUserId] },
            })
            if(!conversation){

                return 'no conversation';
            }else{
                return conversation;
            }
        } catch (err) {
            return null;
        }
    }
}
module.exports = {
    ConversationService
}