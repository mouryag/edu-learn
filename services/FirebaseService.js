import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where
} from 'firebase/firestore';
import { db } from '../firebaseConfig';

class FirebaseService {
  
  // Get all chats for a specific user
  async getUserChats(userId) {
    try {
      if (!userId) {
        console.log('No userId provided');
        return [];
      }

      const chatsRef = collection(db, 'chats');
      const q = query(
        chatsRef, 
        where('userId', '==', userId),
        orderBy('timestamp', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const chats = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        chats.push({
          id: doc.id,
          ...data,
          timestamp: data.timestamp?.toDate?.()?.toISOString() || new Date().toISOString()
        });
      });
      
      return chats;
    } catch (error) {
      console.error('Error getting user chats:', error);
      return [];
    }
  }

  // Create a new chat
  async createChat(userId, chatData) {
    try {
      const chatsRef = collection(db, 'chats');
      const docRef = await addDoc(chatsRef, {
        ...chatData,
        userId,
        timestamp: serverTimestamp(),
        createdAt: serverTimestamp()
      });
      
      return {
        id: docRef.id,
        ...chatData,
        userId,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error creating chat:', error);
      throw error;
    }
  }

  // Update chat (messages, title, etc.)
  async updateChat(chatId, updateData) {
    try {
      const chatRef = doc(db, 'chats', chatId);
      await updateDoc(chatRef, {
        ...updateData,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating chat:', error);
      throw error;
    }
  }

  // Delete a chat
  async deleteChat(chatId) {
    try {
      const chatRef = doc(db, 'chats', chatId);
      await deleteDoc(chatRef);
    } catch (error) {
      console.error('Error deleting chat:', error);
      throw error;
    }
  }

  // Create dummy conversation data for a user
  async createDummyChats(userId) {
    const dummyChats = [
      {
        title: "Help with Calculus Derivatives",
        starred: false,
        messages: [
          {
            id: Date.now() - 1000000,
            text: "Can you help me understand derivatives in calculus? I'm struggling with the chain rule.",
            sender: 'user',
            timestamp: new Date(Date.now() - 86400000).toISOString()
          },
          {
            id: Date.now() - 999000,
            text: "Of course! I'd be happy to help you understand derivatives and the chain rule. Let's start with the basics:\n\nA derivative represents the rate of change of a function. The chain rule is used when you have a composite function (a function inside another function).\n\nThe chain rule formula is: (f(g(x)))' = f'(g(x)) × g'(x)\n\nWould you like me to walk through a specific example?",
            sender: 'ai',
            timestamp: new Date(Date.now() - 998000).toISOString()
          },
          {
            id: Date.now() - 997000,
            text: "Yes, please! Can you show me how to find the derivative of (3x² + 1)⁵?",
            sender: 'user',
            timestamp: new Date(Date.now() - 996000).toISOString()
          },
          {
            id: Date.now() - 995000,
            text: "Perfect example! Let's solve (3x² + 1)⁵ step by step:\n\n1. Identify the outer function: f(u) = u⁵\n2. Identify the inner function: g(x) = 3x² + 1\n\n3. Find f'(u) = 5u⁴\n4. Find g'(x) = 6x\n\n5. Apply chain rule:\n   f'(g(x)) × g'(x) = 5(3x² + 1)⁴ × 6x = 30x(3x² + 1)⁴\n\nSo the derivative is 30x(3x² + 1)⁴. Does this make sense?",
            sender: 'ai',
            timestamp: new Date(Date.now() - 994000).toISOString()
          }
        ]
      },
      {
        title: "Physics: Understanding Momentum",
        starred: true,
        messages: [
          {
            id: Date.now() - 500000,
            text: "I'm having trouble understanding momentum in physics. What exactly is it?",
            sender: 'user',
            timestamp: new Date(Date.now() - 7200000).toISOString()
          },
          {
            id: Date.now() - 499000,
            text: "Great question! Momentum is a fundamental concept in physics.\n\n**Momentum (p) = mass (m) × velocity (v)**\n\nKey points about momentum:\n• It's a vector quantity (has both magnitude and direction)\n• Units: kg⋅m/s\n• It describes the 'quantity of motion' an object has\n• The more massive an object or the faster it moves, the more momentum it has\n\nExample: A truck moving at 30 mph has much more momentum than a bicycle at the same speed because the truck has much more mass.\n\nWould you like to explore conservation of momentum or see some calculations?",
            sender: 'ai',
            timestamp: new Date(Date.now() - 498000).toISOString()
          }
        ]
      },
      {
        title: "Essay Writing Tips",
        starred: false,
        messages: [
          {
            id: Date.now() - 200000,
            text: "I need to write a 5-paragraph essay about climate change. Can you help me structure it?",
            sender: 'user',
            timestamp: new Date(Date.now() - 3600000).toISOString()
          },
          {
            id: Date.now() - 199000,
            text: "Absolutely! Here's a solid structure for your 5-paragraph essay on climate change:\n\n**Paragraph 1 - Introduction:**\n• Hook (startling fact about climate change)\n• Background information\n• Thesis statement (your main argument)\n\n**Paragraph 2 - Causes:**\n• Greenhouse gases\n• Human activities (fossil fuels, deforestation)\n• Industrial processes\n\n**Paragraph 3 - Effects:**\n• Rising temperatures\n• Sea level rise\n• Extreme weather events\n\n**Paragraph 4 - Solutions:**\n• Renewable energy\n• Policy changes\n• Individual actions\n\n**Paragraph 5 - Conclusion:**\n• Restate thesis\n• Summarize main points\n• Call to action\n\nWould you like me to help you develop any specific paragraph?",
            sender: 'ai',
            timestamp: new Date(Date.now() - 198000).toISOString()
          }
        ]
      }
    ];

    // Create dummy chats in Firebase
    const createdChats = [];
    for (const chatData of dummyChats) {
      try {
        const createdChat = await this.createChat(userId, chatData);
        createdChats.push(createdChat);
      } catch (error) {
        console.error('Error creating dummy chat:', error);
      }
    }
    
    return createdChats;
  }
}

export default new FirebaseService();