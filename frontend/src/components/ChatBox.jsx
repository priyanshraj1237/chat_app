import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '../AuthContext';
import { useSocket } from '../SocketContext';

const ChatBox = ({ selectedUser }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { socket, connected, joinRoom, sendMessage: socketSendMessage } = useSocket();
  const messagesEndRef = useRef(null);
  const [optimisticMessages, setOptimisticMessages] = useState([]);

  useEffect(() => {
    if (selectedUser && socket) {
      // Create a unique room ID for the conversation
      const roomId = [user._id, selectedUser._id].sort().join('-');
      joinRoom(roomId);

      // Listen for incoming messages
      socket.on('receive_message', (message) => {
        setMessages(prev => [...prev, message]);
      });

      // Cleanup socket listener when component unmounts or user changes
      return () => {
        socket.off('receive_message');
      };
    }
  }, [selectedUser, socket, user._id]);

  useEffect(() => {
    if (selectedUser) {
      fetchMessages();
    }
  }, [selectedUser]);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:3001/api/conversation/p1/${selectedUser._id}`, {
        withCredentials: true
      });
      
      if (response.data.sucess) {
        // The messages are in response.data.data.messages after population
        const conversationData = response.data.data;
        setMessages(conversationData.messages || []);
      }
    } catch (err) {
      console.error('Error fetching messages:', err);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUser) return;

    // Create optimistic message
    const optimisticMessage = {
      _id: Date.now().toString(),
      senderId: user._id,
      reciverId: selectedUser._id,
      message: newMessage,
      createdAt: new Date(),
      isOptimistic: true
    };

    // Add optimistic message to UI
    setMessages(prev => [...prev, optimisticMessage]);
    setOptimisticMessages(prev => [...prev, optimisticMessage._id]);
    setNewMessage('');

    try {
      // Emit socket event
      socketSendMessage({
        senderId: user._id,
        receiverId: selectedUser._id,
        message: newMessage
      });
    } catch (err) {
      console.error('Error sending message:', err);
      // Remove optimistic message if failed
      setMessages(prev => prev.filter(msg => msg._id !== optimisticMessage._id));
      setOptimisticMessages(prev => prev.filter(id => id !== optimisticMessage._id));
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (!selectedUser) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">Select a user to start chatting</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-screen">
      {/* Chat Header */}
      <div className="p-4 border-b border-gray-300 bg-white">
        <div className="flex items-center space-x-3">
          <img
            src={selectedUser.profilephoto}
            alt={selectedUser.username}
            className="w-10 h-10 rounded-full"
          />
          <div>
            <h2 className="font-semibold">{selectedUser.fullname}</h2>
            <p className="text-sm text-gray-500">@{selectedUser.username}</p>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {loading ? (
          <div className="text-center">Loading messages...</div>
        ) : (
          messages.map((message) => (
            <div
              key={message._id}
              className={`flex ${
                message.senderId === user._id ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[70%] p-3 rounded-lg ${
                  message.senderId === user._id
                    ? 'bg-blue-500 text-white'
                    : 'bg-white border border-gray-300'
                }`}
              >
                <p>{message.message}</p>
                <p className="text-xs mt-1 opacity-75">
                  {new Date(message.createdAt).toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <form onSubmit={sendMessage} className="p-4 border-t border-gray-300 bg-white">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatBox;
