import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const CommunicationHub = () => {
  const [activeTab, setActiveTab] = useState('messages');
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [newMessage, setNewMessage] = useState('');

  const conversations = [
    {
      id: 1,
      name: "Mrs. Sharma",
      relation: "Mother of Arjun",
      lastMessage: "Thank you for the progress report. Arjun is doing much better at home.",
      timestamp: new Date(Date.now() - 300000),
      unread: 2,
      avatar: "https://images.unsplash.com/photo-1494790108755-2616c9c0b8d5?w=100&h=100&fit=crop&crop=face",
      status: "online"
    },
    {
      id: 2,
      name: "Mr. Patel",
      relation: "Father of Priya",
      lastMessage: "Can we reschedule tomorrow\'s appointment?",
      timestamp: new Date(Date.now() - 1800000),
      unread: 1,
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
      status: "offline"
    },
    {
      id: 3,
      name: "Rajesh Kumar",
      relation: "Patient",
      lastMessage: "The exercises are helping. Should I continue the same routine?",
      timestamp: new Date(Date.now() - 3600000),
      unread: 0,
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
      status: "online"
    },
    {
      id: 4,
      name: "Mrs. Singh",
      relation: "Mother of Meera",
      lastMessage: "Meera enjoyed today\'s session. She\'s been practicing at home.",
      timestamp: new Date(Date.now() - 7200000),
      unread: 0,
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face",
      status: "offline"
    }
  ];

  const messages = [
    {
      id: 1,
      sender: "Mrs. Sharma",
      content: "Hello Dr. Patel, I wanted to update you on Arjun's progress at home.",
      timestamp: new Date(Date.now() - 1800000),
      isTherapist: false
    },
    {
      id: 2,
      sender: "You",
      content: "That\'s wonderful to hear! Please tell me more about what you\'ve observed.",
      timestamp: new Date(Date.now() - 1500000),
      isTherapist: true
    },
    {
      id: 3,
      sender: "Mrs. Sharma",
      content: "He's been practicing the 'R' sounds we worked on, and I can see improvement in his pronunciation. He's also more confident when speaking.",
      timestamp: new Date(Date.now() - 1200000),
      isTherapist: false
    },
    {
      id: 4,
      sender: "You",
      content: "Excellent! Consistency at home makes a huge difference. Keep up the great work. I'll prepare some new exercises for our next session.",
      timestamp: new Date(Date.now() - 900000),
      isTherapist: true
    },
    {
      id: 5,
      sender: "Mrs. Sharma",
      content: "Thank you for the progress report. Arjun is doing much better at home.",
      timestamp: new Date(Date.now() - 300000),
      isTherapist: false
    }
  ];

  const notifications = [
    {
      id: 1,
      type: "appointment",
      title: "Appointment Reminder Sent",
      message: "Reminder sent to Arjun Sharma for tomorrow\'s 4:30 PM session",
      timestamp: new Date(Date.now() - 600000),
      icon: "Calendar"
    },
    {
      id: 2,
      type: "progress",
      title: "Progress Report Shared",
      message: "Monthly progress report sent to Priya Patel\'s family",
      timestamp: new Date(Date.now() - 1800000),
      icon: "FileText"
    },
    {
      id: 3,
      type: "exercise",
      title: "Exercise Completion",
      message: "Rajesh Kumar completed today\'s physiotherapy exercises",
      timestamp: new Date(Date.now() - 3600000),
      icon: "CheckCircle"
    }
  ];

  const selectedConv = conversations.find(c => c.id === selectedConversation);

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    
    console.log('Sending message:', newMessage);
    setNewMessage('');
    // Here you would typically send the message to your backend
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-IN', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatDate = (date) => {
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      return `${Math.floor(diffInHours * 60)}m ago`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else {
      return date.toLocaleDateString('en-IN');
    }
  };

  return (
    <div className="bg-card rounded-therapeutic border border-border shadow-therapeutic">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-secondary/10 rounded-therapeutic flex items-center justify-center">
              <Icon name="MessageSquare" size={20} className="text-secondary" />
            </div>
            <div>
              <h2 className="font-heading font-semibold text-lg text-foreground">Communication Hub</h2>
              <p className="font-caption text-sm text-muted-foreground">
                Secure messaging with patients and families
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" iconName="Settings">
              Settings
            </Button>
            <Button variant="outline" size="sm" iconName="Archive">
              Archive
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mt-4">
          <button
            onClick={() => setActiveTab('messages')}
            className={`px-4 py-2 rounded-therapeutic font-body text-sm transition-colors duration-200 ${
              activeTab === 'messages' ?'bg-primary text-primary-foreground' :'text-foreground hover:bg-muted'
            }`}
          >
            Messages
          </button>
          <button
            onClick={() => setActiveTab('notifications')}
            className={`px-4 py-2 rounded-therapeutic font-body text-sm transition-colors duration-200 ${
              activeTab === 'notifications'
                ? 'bg-primary text-primary-foreground' :'text-foreground hover:bg-muted'
            }`}
          >
            Notifications
          </button>
        </div>
      </div>

      <div className="p-6">
        {activeTab === 'messages' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-96">
            {/* Conversations List */}
            <div className="lg:col-span-1 border-r border-border pr-6">
              <div className="mb-4">
                <Input
                  type="search"
                  placeholder="Search conversations..."
                  className="w-full"
                />
              </div>
              
              <div className="space-y-2 overflow-y-auto h-80">
                {conversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    onClick={() => setSelectedConversation(conversation.id)}
                    className={`p-3 rounded-therapeutic cursor-pointer transition-colors duration-200 ${
                      selectedConversation === conversation.id
                        ? 'bg-primary/10 border border-primary/20' :'hover:bg-muted border border-transparent'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="relative">
                        <img
                          src={conversation.avatar}
                          alt={conversation.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-card ${
                          conversation.status === 'online' ? 'bg-success' : 'bg-muted'
                        }`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="font-body font-medium text-sm text-foreground truncate">
                            {conversation.name}
                          </h4>
                          <span className="font-caption text-xs text-muted-foreground">
                            {formatDate(conversation.timestamp)}
                          </span>
                        </div>
                        <p className="font-caption text-xs text-muted-foreground mb-1">
                          {conversation.relation}
                        </p>
                        <p className="font-caption text-xs text-muted-foreground truncate">
                          {conversation.lastMessage}
                        </p>
                        {conversation.unread > 0 && (
                          <div className="flex justify-end mt-1">
                            <span className="bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                              {conversation.unread}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Chat Area */}
            <div className="lg:col-span-2">
              {selectedConv ? (
                <div className="flex flex-col h-full">
                  {/* Chat Header */}
                  <div className="flex items-center justify-between p-4 border-b border-border">
                    <div className="flex items-center space-x-3">
                      <img
                        src={selectedConv.avatar}
                        alt={selectedConv.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <h3 className="font-body font-medium text-foreground">{selectedConv.name}</h3>
                        <p className="font-caption text-xs text-muted-foreground">{selectedConv.relation}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm" iconName="Phone" />
                      <Button variant="ghost" size="sm" iconName="Video" />
                      <Button variant="ghost" size="sm" iconName="MoreVertical" />
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.isTherapist ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-therapeutic ${
                            message.isTherapist
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted text-foreground'
                          }`}
                        >
                          <p className="font-caption text-sm">{message.content}</p>
                          <p className={`font-caption text-xs mt-1 ${
                            message.isTherapist ? 'text-primary-foreground/70' : 'text-muted-foreground'
                          }`}>
                            {formatTime(message.timestamp)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Message Input */}
                  <div className="p-4 border-t border-border">
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm" iconName="Paperclip" />
                      <Input
                        type="text"
                        placeholder="Type your message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                        className="flex-1"
                      />
                      <Button
                        variant="default"
                        size="sm"
                        onClick={sendMessage}
                        iconName="Send"
                        disabled={!newMessage.trim()}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon name="MessageSquare" size={24} className="text-muted-foreground" />
                    </div>
                    <h3 className="font-heading font-medium text-foreground mb-2">Select a conversation</h3>
                    <p className="font-caption text-sm text-muted-foreground">
                      Choose a conversation from the list to start messaging
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className="p-4 rounded-therapeutic border border-border hover:border-primary/50 transition-colors duration-200"
              >
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-therapeutic flex items-center justify-center">
                    <Icon name={notification.icon} size={20} className="text-primary" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-body font-medium text-foreground">{notification.title}</h4>
                    <p className="font-caption text-sm text-muted-foreground mt-1">{notification.message}</p>
                    <p className="font-caption text-xs text-muted-foreground mt-2">
                      {formatDate(notification.timestamp)}
                    </p>
                  </div>
                  <Button variant="ghost" size="sm" iconName="X" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CommunicationHub;