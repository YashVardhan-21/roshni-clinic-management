import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';

const SessionDocumentation = () => {
  const [selectedTemplate, setSelectedTemplate] = useState('speech-therapy');
  const [sessionData, setSessionData] = useState({
    patientName: '',
    sessionDate: new Date().toISOString().split('T')[0],
    sessionType: 'individual',
    duration: '45',
    objectives: [],
    activities: [],
    observations: '',
    progress: '',
    homework: '',
    nextSessionPlan: ''
  });

  const templates = [
    {
      id: 'speech-therapy',
      name: 'Speech Therapy',
      icon: 'MessageCircle',
      objectives: [
        'Improve articulation of target sounds',
        'Increase vocabulary comprehension',
        'Enhance fluency and rhythm',
        'Develop phonological awareness'
      ],
      activities: [
        'Articulation drills',
        'Vocabulary exercises',
        'Reading comprehension',
        'Pronunciation practice',
        'Conversation therapy'
      ]
    },
    {
      id: 'occupational-therapy',
      name: 'Occupational Therapy',
      icon: 'Hand',
      objectives: [
        'Improve fine motor skills',
        'Enhance hand-eye coordination',
        'Develop daily living skills',
        'Increase cognitive function'
      ],
      activities: [
        'Fine motor exercises',
        'Handwriting practice',
        'Cognitive tasks',
        'Sensory integration',
        'Daily living simulations'
      ]
    },
    {
      id: 'physiotherapy',
      name: 'Physiotherapy',
      icon: 'Activity',
      objectives: [
        'Improve range of motion',
        'Strengthen muscle groups',
        'Enhance balance and coordination',
        'Reduce pain and inflammation'
      ],
      activities: [
        'Stretching exercises',
        'Strength training',
        'Balance activities',
        'Mobility exercises',
        'Pain management techniques'
      ]
    }
  ];

  const currentTemplate = templates.find(t => t.id === selectedTemplate);

  const handleObjectiveChange = (objective, checked) => {
    setSessionData(prev => ({
      ...prev,
      objectives: checked 
        ? [...prev.objectives, objective]
        : prev.objectives.filter(obj => obj !== objective)
    }));
  };

  const handleActivityChange = (activity, checked) => {
    setSessionData(prev => ({
      ...prev,
      activities: checked 
        ? [...prev.activities, activity]
        : prev.activities.filter(act => act !== activity)
    }));
  };

  const handleSaveSession = () => {
    console.log('Saving session:', sessionData);
    // Here you would typically save to your backend
    alert('Session documentation saved successfully!');
  };

  const recentSessions = [
    {
      id: 1,
      patient: "Arjun Sharma",
      date: "2025-07-14",
      type: "Speech Therapy",
      duration: "45 min",
      status: "completed"
    },
    {
      id: 2,
      patient: "Priya Patel",
      date: "2025-07-13",
      type: "Occupational Therapy",
      duration: "45 min",
      status: "completed"
    },
    {
      id: 3,
      patient: "Rajesh Kumar",
      date: "2025-07-12",
      type: "Physiotherapy",
      duration: "45 min",
      status: "completed"
    }
  ];

  return (
    <div className="bg-card rounded-therapeutic border border-border shadow-therapeutic">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-accent/10 rounded-therapeutic flex items-center justify-center">
              <Icon name="FileText" size={20} className="text-accent" />
            </div>
            <div>
              <h2 className="font-heading font-semibold text-lg text-foreground">Session Documentation</h2>
              <p className="font-caption text-sm text-muted-foreground">
                Document therapy sessions and track progress
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" iconName="History">
              Recent Sessions
            </Button>
            <Button variant="outline" size="sm" iconName="Download">
              Export
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Template Selection */}
          <div className="lg:col-span-1">
            <h3 className="font-heading font-medium text-foreground mb-4">Select Template</h3>
            <div className="space-y-2">
              {templates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => setSelectedTemplate(template.id)}
                  className={`w-full p-3 rounded-therapeutic border text-left transition-all duration-200 ${
                    selectedTemplate === template.id
                      ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon name={template.icon} size={20} className="text-primary" />
                    <span className="font-body font-medium text-foreground">{template.name}</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Recent Sessions */}
            <div className="mt-8">
              <h3 className="font-heading font-medium text-foreground mb-4">Recent Sessions</h3>
              <div className="space-y-2">
                {recentSessions.map((session) => (
                  <div
                    key={session.id}
                    className="p-3 rounded-therapeutic border border-border hover:border-primary/50 transition-colors duration-200 cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-body font-medium text-sm text-foreground">{session.patient}</p>
                        <p className="font-caption text-xs text-muted-foreground">{session.type}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-mono text-xs text-foreground">
                          {new Date(session.date).toLocaleDateString('en-IN')}
                        </p>
                        <p className="font-caption text-xs text-muted-foreground">{session.duration}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Documentation Form */}
          <div className="lg:col-span-2">
            <div className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Patient Name"
                  type="text"
                  value={sessionData.patientName}
                  onChange={(e) => setSessionData(prev => ({ ...prev, patientName: e.target.value }))}
                  placeholder="Enter patient name"
                  required
                />
                <Input
                  label="Session Date"
                  type="date"
                  value={sessionData.sessionDate}
                  onChange={(e) => setSessionData(prev => ({ ...prev, sessionDate: e.target.value }))}
                  required
                />
                <div>
                  <label className="block font-body font-medium text-sm text-foreground mb-2">
                    Session Type
                  </label>
                  <div className="flex space-x-4">
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="sessionType"
                        value="individual"
                        checked={sessionData.sessionType === 'individual'}
                        onChange={(e) => setSessionData(prev => ({ ...prev, sessionType: e.target.value }))}
                        className="text-primary"
                      />
                      <span className="font-caption text-sm text-foreground">Individual</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="sessionType"
                        value="group"
                        checked={sessionData.sessionType === 'group'}
                        onChange={(e) => setSessionData(prev => ({ ...prev, sessionType: e.target.value }))}
                        className="text-primary"
                      />
                      <span className="font-caption text-sm text-foreground">Group</span>
                    </label>
                  </div>
                </div>
                <Input
                  label="Duration (minutes)"
                  type="number"
                  value={sessionData.duration}
                  onChange={(e) => setSessionData(prev => ({ ...prev, duration: e.target.value }))}
                  placeholder="45"
                  min="15"
                  max="120"
                />
              </div>

              {/* Session Objectives */}
              <div>
                <h4 className="font-heading font-medium text-foreground mb-3">Session Objectives</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {currentTemplate?.objectives.map((objective) => (
                    <Checkbox
                      key={objective}
                      label={objective}
                      checked={sessionData.objectives.includes(objective)}
                      onChange={(e) => handleObjectiveChange(objective, e.target.checked)}
                    />
                  ))}
                </div>
              </div>

              {/* Activities Performed */}
              <div>
                <h4 className="font-heading font-medium text-foreground mb-3">Activities Performed</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {currentTemplate?.activities.map((activity) => (
                    <Checkbox
                      key={activity}
                      label={activity}
                      checked={sessionData.activities.includes(activity)}
                      onChange={(e) => handleActivityChange(activity, e.target.checked)}
                    />
                  ))}
                </div>
              </div>

              {/* Text Areas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-body font-medium text-sm text-foreground mb-2">
                    Observations
                  </label>
                  <textarea
                    value={sessionData.observations}
                    onChange={(e) => setSessionData(prev => ({ ...prev, observations: e.target.value }))}
                    placeholder="Patient's response, behavior, and performance during session..."
                    className="w-full h-24 p-3 border border-border rounded-therapeutic resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block font-body font-medium text-sm text-foreground mb-2">
                    Progress Notes
                  </label>
                  <textarea
                    value={sessionData.progress}
                    onChange={(e) => setSessionData(prev => ({ ...prev, progress: e.target.value }))}
                    placeholder="Progress made towards goals, improvements noted..."
                    className="w-full h-24 p-3 border border-border rounded-therapeutic resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block font-body font-medium text-sm text-foreground mb-2">
                    Homework/Home Program
                  </label>
                  <textarea
                    value={sessionData.homework}
                    onChange={(e) => setSessionData(prev => ({ ...prev, homework: e.target.value }))}
                    placeholder="Exercises and activities for home practice..."
                    className="w-full h-24 p-3 border border-border rounded-therapeutic resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block font-body font-medium text-sm text-foreground mb-2">
                    Next Session Plan
                  </label>
                  <textarea
                    value={sessionData.nextSessionPlan}
                    onChange={(e) => setSessionData(prev => ({ ...prev, nextSessionPlan: e.target.value }))}
                    placeholder="Plans and goals for the next session..."
                    className="w-full h-24 p-3 border border-border rounded-therapeutic resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 pt-4 border-t border-border">
                <Button variant="default" onClick={handleSaveSession} iconName="Save" className="flex-1 sm:flex-none">
                  Save Session
                </Button>
                <Button variant="outline" iconName="Send" className="flex-1 sm:flex-none">
                  Send to Patient
                </Button>
                <Button variant="outline" iconName="Printer" className="flex-1 sm:flex-none">
                  Print Report
                </Button>
                <Button variant="ghost" iconName="RotateCcw" className="flex-1 sm:flex-none">
                  Clear Form
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionDocumentation;