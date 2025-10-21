import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const QuickActions = () => {
  const [emergencyModalOpen, setEmergencyModalOpen] = useState(false);

  const quickActionItems = [
    {
      id: 1,
      title: "Emergency Contacts",
      description: "Access patient emergency information",
      icon: "Phone",
      color: "bg-error/10 text-error",
      action: () => setEmergencyModalOpen(true)
    },
    {
      id: 2,
      title: "New Patient Intake",
      description: "Register a new patient",
      icon: "UserPlus",
      color: "bg-primary/10 text-primary",
      action: () => console.log('New patient intake')
    },
    {
      id: 3,
      title: "Schedule Appointment",
      description: "Book a new appointment",
      icon: "CalendarPlus",
      color: "bg-secondary/10 text-secondary",
      action: () => console.log('Schedule appointment')
    },
    {
      id: 4,
      title: "Clinic Protocols",
      description: "View treatment protocols",
      icon: "FileText",
      color: "bg-accent/10 text-accent",
      action: () => console.log('View protocols')
    },
    {
      id: 5,
      title: "Referral Management",
      description: "Manage patient referrals",
      icon: "Share",
      color: "bg-warning/10 text-warning",
      action: () => console.log('Manage referrals')
    },
    {
      id: 6,
      title: "Equipment Status",
      description: "Check therapy equipment",
      icon: "Settings",
      color: "bg-success/10 text-success",
      action: () => console.log('Equipment status')
    }
  ];

  const emergencyContacts = [
    {
      name: "Arjun Sharma",
      guardian: "Mrs. Sharma",
      phone: "+91 98765 43210",
      emergency: "+91 87654 32109",
      condition: "Severe Articulation Disorder",
      medications: "None",
      allergies: "Peanuts"
    },
    {
      name: "Priya Patel",
      guardian: "Mr. Patel",
      phone: "+91 87654 32109",
      emergency: "+91 76543 21098",
      condition: "Sensory Processing Disorder",
      medications: "Ritalin 10mg",
      allergies: "Latex"
    },
    {
      name: "Rajesh Kumar",
      guardian: "Self",
      phone: "+91 76543 21098",
      emergency: "+91 65432 10987",
      condition: "Post-Stroke Rehabilitation",
      medications: "Aspirin, Lisinopril",
      allergies: "Sulfa drugs"
    }
  ];

  const recentActivities = [
    {
      id: 1,
      action: "Session completed",
      patient: "Arjun Sharma",
      time: "2 hours ago",
      icon: "CheckCircle",
      color: "text-success"
    },
    {
      id: 2,
      action: "Progress report sent",
      patient: "Priya Patel",
      time: "4 hours ago",
      icon: "Send",
      color: "text-primary"
    },
    {
      id: 3,
      action: "Appointment scheduled",
      patient: "Rajesh Kumar",
      time: "6 hours ago",
      icon: "Calendar",
      color: "text-secondary"
    },
    {
      id: 4,
      action: "Exercise prescribed",
      patient: "Meera Singh",
      time: "8 hours ago",
      icon: "Activity",
      color: "text-accent"
    }
  ];

  return (
    <>
      <div className="bg-card rounded-therapeutic border border-border shadow-therapeutic">
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-success/10 rounded-therapeutic flex items-center justify-center">
                <Icon name="Zap" size={20} className="text-success" />
              </div>
              <div>
                <h2 className="font-heading font-semibold text-lg text-foreground">Quick Actions</h2>
                <p className="font-caption text-sm text-muted-foreground">
                  Frequently used tools and shortcuts
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm" iconName="Settings">
              Customize
            </Button>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {quickActionItems.map((item) => (
              <button
                key={item.id}
                onClick={item.action}
                className="p-4 rounded-therapeutic border border-border hover:border-primary/50 transition-all duration-200 hover:shadow-therapeutic text-left group"
              >
                <div className="flex items-start space-x-3">
                  <div className={`w-12 h-12 rounded-therapeutic flex items-center justify-center ${item.color} group-hover:scale-110 transition-transform duration-200`}>
                    <Icon name={item.icon} size={20} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-body font-medium text-foreground group-hover:text-primary transition-colors duration-200">
                      {item.title}
                    </h3>
                    <p className="font-caption text-sm text-muted-foreground mt-1">
                      {item.description}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Recent Activities */}
          <div>
            <h3 className="font-heading font-medium text-foreground mb-4">Recent Activities</h3>
            <div className="space-y-3">
              {recentActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center space-x-3 p-3 rounded-therapeutic hover:bg-muted/50 transition-colors duration-200"
                >
                  <div className="w-8 h-8 bg-muted rounded-therapeutic flex items-center justify-center">
                    <Icon name={activity.icon} size={16} className={activity.color} />
                  </div>
                  <div className="flex-1">
                    <p className="font-body text-sm text-foreground">
                      <span className="font-medium">{activity.action}</span> for {activity.patient}
                    </p>
                    <p className="font-caption text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                  <Button variant="ghost" size="sm" iconName="ExternalLink" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Emergency Modal */}
      {emergencyModalOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 z-1100"
            onClick={() => setEmergencyModalOpen(false)}
          />
          <div className="fixed inset-0 flex items-center justify-center z-1200 p-4">
            <div className="bg-card rounded-therapeutic border border-border shadow-therapeutic-lg max-w-4xl w-full max-h-[80vh] overflow-hidden">
              <div className="p-6 border-b border-border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-error/10 rounded-therapeutic flex items-center justify-center">
                      <Icon name="AlertTriangle" size={20} className="text-error" />
                    </div>
                    <div>
                      <h2 className="font-heading font-semibold text-lg text-foreground">Emergency Contacts</h2>
                      <p className="font-caption text-sm text-muted-foreground">
                        Critical patient information for emergencies
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEmergencyModalOpen(false)}
                    iconName="X"
                  />
                </div>
              </div>

              <div className="p-6 overflow-y-auto max-h-[60vh]">
                <div className="space-y-4">
                  {emergencyContacts.map((contact, index) => (
                    <div
                      key={index}
                      className="p-4 rounded-therapeutic border border-error/20 bg-error/5"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h3 className="font-body font-semibold text-foreground mb-2">{contact.name}</h3>
                          <div className="space-y-1 text-sm">
                            <div className="flex items-center space-x-2">
                              <Icon name="User" size={14} className="text-muted-foreground" />
                              <span className="font-caption text-muted-foreground">Guardian:</span>
                              <span className="font-body text-foreground">{contact.guardian}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Icon name="Phone" size={14} className="text-muted-foreground" />
                              <span className="font-caption text-muted-foreground">Primary:</span>
                              <a href={`tel:${contact.phone}`} className="font-mono text-primary hover:underline">
                                {contact.phone}
                              </a>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Icon name="PhoneCall" size={14} className="text-error" />
                              <span className="font-caption text-muted-foreground">Emergency:</span>
                              <a href={`tel:${contact.emergency}`} className="font-mono text-error hover:underline font-medium">
                                {contact.emergency}
                              </a>
                            </div>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-body font-medium text-foreground mb-2">Medical Information</h4>
                          <div className="space-y-1 text-sm">
                            <div>
                              <span className="font-caption text-muted-foreground">Condition:</span>
                              <p className="font-body text-foreground">{contact.condition}</p>
                            </div>
                            <div>
                              <span className="font-caption text-muted-foreground">Medications:</span>
                              <p className="font-body text-foreground">{contact.medications}</p>
                            </div>
                            <div>
                              <span className="font-caption text-muted-foreground">Allergies:</span>
                              <p className="font-body text-error font-medium">{contact.allergies}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-6 border-t border-border">
                <div className="flex items-center justify-between">
                  <p className="font-caption text-sm text-muted-foreground">
                    For medical emergencies, call 102 (Ambulance) or 108 (Emergency Services)
                  </p>
                  <div className="flex space-x-2">
                    <Button variant="outline" iconName="Printer">
                      Print
                    </Button>
                    <Button variant="default" onClick={() => setEmergencyModalOpen(false)}>
                      Close
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default QuickActions;