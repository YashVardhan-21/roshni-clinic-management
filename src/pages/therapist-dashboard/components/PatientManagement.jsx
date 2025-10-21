import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const PatientManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedPatient, setSelectedPatient] = useState(null);

  const patients = [
    {
      id: 1,
      name: "Arjun Sharma",
      age: 8,
      condition: "Articulation Disorder",
      therapyType: "Speech Therapy",
      lastSession: "2025-07-14",
      nextSession: "2025-07-16",
      progress: 75,
      status: "active",
      sessionsCompleted: 12,
      totalSessions: 16,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      contact: "+91 98765 43210",
      guardian: "Mrs. Sharma"
    },
    {
      id: 2,
      name: "Priya Patel",
      age: 12,
      condition: "Fine Motor Skills",
      therapyType: "Occupational Therapy",
      lastSession: "2025-07-13",
      nextSession: "2025-07-15",
      progress: 60,
      status: "active",
      sessionsCompleted: 8,
      totalSessions: 15,
      avatar: "https://images.unsplash.com/photo-1494790108755-2616c9c0b8d5?w=100&h=100&fit=crop&crop=face",
      contact: "+91 87654 32109",
      guardian: "Mr. Patel"
    },
    {
      id: 3,
      name: "Rajesh Kumar",
      age: 45,
      condition: "Post-Surgery Rehabilitation",
      therapyType: "Physiotherapy",
      lastSession: "2025-07-12",
      nextSession: "2025-07-15",
      progress: 85,
      status: "active",
      sessionsCompleted: 20,
      totalSessions: 24,
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
      contact: "+91 76543 21098",
      guardian: "Self"
    },
    {
      id: 4,
      name: "Meera Singh",
      age: 6,
      condition: "Language Development",
      therapyType: "Speech Therapy",
      lastSession: "2025-07-11",
      nextSession: "2025-07-17",
      progress: 45,
      status: "active",
      sessionsCompleted: 6,
      totalSessions: 20,
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face",
      contact: "+91 65432 10987",
      guardian: "Mrs. Singh"
    },
    {
      id: 5,
      name: "Vikram Gupta",
      age: 35,
      condition: "Cognitive Rehabilitation",
      therapyType: "Occupational Therapy",
      lastSession: "2025-07-10",
      nextSession: "2025-07-16",
      progress: 70,
      status: "on-hold",
      sessionsCompleted: 14,
      totalSessions: 18,
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
      contact: "+91 54321 09876",
      guardian: "Mrs. Gupta"
    }
  ];

  const filteredPatients = patients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient.condition.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || patient.status === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-success text-success-foreground';
      case 'on-hold': return 'bg-warning text-warning-foreground';
      case 'completed': return 'bg-primary text-primary-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getTherapyIcon = (type) => {
    switch (type) {
      case 'Speech Therapy': return 'MessageCircle';
      case 'Occupational Therapy': return 'Hand';
      case 'Physiotherapy': return 'Activity';
      default: return 'User';
    }
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return 'bg-success';
    if (progress >= 60) return 'bg-primary';
    if (progress >= 40) return 'bg-warning';
    return 'bg-error';
  };

  return (
    <div className="bg-card rounded-therapeutic border border-border shadow-therapeutic">
      <div className="p-6 border-b border-border">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-secondary/10 rounded-therapeutic flex items-center justify-center">
              <Icon name="Users" size={20} className="text-secondary" />
            </div>
            <div>
              <h2 className="font-heading font-semibold text-lg text-foreground">Patient Management</h2>
              <p className="font-caption text-sm text-muted-foreground">
                {filteredPatients.length} of {patients.length} patients
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
            <div className="flex-1 sm:w-64">
              <Input
                type="search"
                placeholder="Search patients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="flex space-x-2">
              <Button
                variant={selectedFilter === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedFilter('all')}
              >
                All
              </Button>
              <Button
                variant={selectedFilter === 'active' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedFilter('active')}
              >
                Active
              </Button>
              <Button
                variant={selectedFilter === 'on-hold' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedFilter('on-hold')}
              >
                On Hold
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredPatients.map((patient) => (
            <div
              key={patient.id}
              className={`p-4 rounded-therapeutic border transition-all duration-200 hover:shadow-therapeutic cursor-pointer ${
                selectedPatient === patient.id 
                  ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50'
              }`}
              onClick={() => setSelectedPatient(
                selectedPatient === patient.id ? null : patient.id
              )}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <img
                    src={patient.avatar}
                    alt={patient.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-body font-medium text-foreground">{patient.name}</h3>
                    <p className="font-caption text-sm text-muted-foreground">Age: {patient.age}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(patient.status)}`}>
                  {patient.status.replace('-', ' ')}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center space-x-2">
                  <Icon name={getTherapyIcon(patient.therapyType)} size={16} className="text-primary" />
                  <span className="font-caption text-sm text-foreground">{patient.therapyType}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Icon name="FileText" size={16} className="text-secondary" />
                  <span className="font-caption text-sm text-foreground">{patient.condition}</span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-caption text-xs text-muted-foreground">Progress</span>
                  <span className="font-mono text-xs text-foreground">{patient.progress}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(patient.progress)}`}
                    style={{ width: `${patient.progress}%` }}
                  />
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="font-caption text-xs text-muted-foreground">
                    {patient.sessionsCompleted}/{patient.totalSessions} sessions
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="font-caption text-muted-foreground">Last Session:</span>
                  <p className="font-mono text-foreground">
                    {new Date(patient.lastSession).toLocaleDateString('en-IN')}
                  </p>
                </div>
                <div>
                  <span className="font-caption text-muted-foreground">Next Session:</span>
                  <p className="font-mono text-foreground">
                    {new Date(patient.nextSession).toLocaleDateString('en-IN')}
                  </p>
                </div>
              </div>

              {/* Expanded details */}
              {selectedPatient === patient.id && (
                <div className="mt-4 pt-4 border-t border-border animate-gentle-fade">
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="font-caption text-muted-foreground">Contact:</span>
                        <p className="font-mono text-foreground">{patient.contact}</p>
                      </div>
                      <div>
                        <span className="font-caption text-muted-foreground">Guardian:</span>
                        <p className="font-body text-foreground">{patient.guardian}</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-col space-y-2">
                      <Button variant="outline" size="sm" iconName="FileText" className="justify-start">
                        View History
                      </Button>
                      <Button variant="outline" size="sm" iconName="Calendar" className="justify-start">
                        Schedule Session
                      </Button>
                      <Button variant="outline" size="sm" iconName="MessageSquare" className="justify-start">
                        Send Message
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredPatients.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="Search" size={24} className="text-muted-foreground" />
            </div>
            <h3 className="font-heading font-medium text-foreground mb-2">No patients found</h3>
            <p className="font-caption text-sm text-muted-foreground">
              Try adjusting your search terms or filters.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientManagement;