import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const AnalyticsDashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedMetric, setSelectedMetric] = useState('sessions');

  const periodOptions = [
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'quarter', label: 'This Quarter' },
    { value: 'year', label: 'This Year' }
  ];

  const metricOptions = [
    { value: 'sessions', label: 'Sessions Completed' },
    { value: 'patients', label: 'Active Patients' },
    { value: 'progress', label: 'Patient Progress' },
    { value: 'revenue', label: 'Revenue Generated' }
  ];

  // Mock data for charts
  const sessionData = [
    { name: 'Mon', sessions: 8, patients: 6 },
    { name: 'Tue', sessions: 12, patients: 9 },
    { name: 'Wed', sessions: 10, patients: 8 },
    { name: 'Thu', sessions: 15, patients: 11 },
    { name: 'Fri', sessions: 13, patients: 10 },
    { name: 'Sat', sessions: 6, patients: 5 },
    { name: 'Sun', sessions: 4, patients: 3 }
  ];

  const progressData = [
    { month: 'Jan', improvement: 65 },
    { month: 'Feb', improvement: 72 },
    { month: 'Mar', improvement: 68 },
    { month: 'Apr', improvement: 78 },
    { month: 'May', improvement: 82 },
    { month: 'Jun', improvement: 85 },
    { month: 'Jul', improvement: 88 }
  ];

  const therapyTypeData = [
    { name: 'Speech Therapy', value: 45, color: '#2D7D7D' },
    { name: 'Occupational Therapy', value: 30, color: '#7BA05B' },
    { name: 'Physiotherapy', value: 25, color: '#E8A87C' }
  ];

  const outcomeMetrics = [
    {
      title: "Total Sessions",
      value: "156",
      change: "+12%",
      trend: "up",
      icon: "Calendar",
      color: "text-primary"
    },
    {
      title: "Active Patients",
      value: "42",
      change: "+8%",
      trend: "up",
      icon: "Users",
      color: "text-secondary"
    },
    {
      title: "Avg. Progress Rate",
      value: "85%",
      change: "+5%",
      trend: "up",
      icon: "TrendingUp",
      color: "text-success"
    },
    {
      title: "Patient Satisfaction",
      value: "4.8/5",
      change: "+0.2",
      trend: "up",
      icon: "Star",
      color: "text-warning"
    }
  ];

  const recentAchievements = [
    {
      patient: "Arjun Sharma",
      achievement: "Completed articulation milestone",
      date: "2025-07-14",
      type: "Speech Therapy",
      icon: "Award"
    },
    {
      patient: "Priya Patel",
      achievement: "Improved handwriting score by 40%",
      date: "2025-07-13",
      type: "Occupational Therapy",
      icon: "Target"
    },
    {
      patient: "Rajesh Kumar",
      achievement: "Achieved 90% range of motion",
      date: "2025-07-12",
      type: "Physiotherapy",
      icon: "Activity"
    }
  ];

  const getTrendIcon = (trend) => {
    return trend === 'up' ? 'TrendingUp' : 'TrendingDown';
  };

  const getTrendColor = (trend) => {
    return trend === 'up' ? 'text-success' : 'text-error';
  };

  return (
    <div className="bg-card rounded-therapeutic border border-border shadow-therapeutic">
      <div className="p-6 border-b border-border">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-warning/10 rounded-therapeutic flex items-center justify-center">
              <Icon name="BarChart3" size={20} className="text-warning" />
            </div>
            <div>
              <h2 className="font-heading font-semibold text-lg text-foreground">Analytics Dashboard</h2>
              <p className="font-caption text-sm text-muted-foreground">
                Patient outcomes and performance metrics
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
            <Select
              options={periodOptions}
              value={selectedPeriod}
              onChange={setSelectedPeriod}
              className="w-full sm:w-auto"
            />
            <Select
              options={metricOptions}
              value={selectedMetric}
              onChange={setSelectedMetric}
              className="w-full sm:w-auto"
            />
            <Button variant="outline" size="sm" iconName="Download">
              Export Report
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {outcomeMetrics.map((metric, index) => (
            <div
              key={index}
              className="p-4 rounded-therapeutic border border-border hover:border-primary/50 transition-colors duration-200"
            >
              <div className="flex items-center justify-between mb-2">
                <div className={`w-10 h-10 rounded-therapeutic flex items-center justify-center ${
                  metric.color === 'text-primary' ? 'bg-primary/10' :
                  metric.color === 'text-secondary' ? 'bg-secondary/10' :
                  metric.color === 'text-success'? 'bg-success/10' : 'bg-warning/10'
                }`}>
                  <Icon name={metric.icon} size={20} className={metric.color} />
                </div>
                <div className={`flex items-center space-x-1 ${getTrendColor(metric.trend)}`}>
                  <Icon name={getTrendIcon(metric.trend)} size={16} />
                  <span className="font-mono text-sm">{metric.change}</span>
                </div>
              </div>
              <h3 className="font-heading font-semibold text-2xl text-foreground mb-1">{metric.value}</h3>
              <p className="font-caption text-sm text-muted-foreground">{metric.title}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Sessions Chart */}
          <div className="p-4 rounded-therapeutic border border-border">
            <h3 className="font-heading font-medium text-foreground mb-4">Weekly Sessions Overview</h3>
            <div className="w-full h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sessionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5F0F0" />
                  <XAxis dataKey="name" stroke="#5A6B6B" fontSize={12} />
                  <YAxis stroke="#5A6B6B" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#FFFFFF', 
                      border: '1px solid #E5F0F0',
                      borderRadius: '8px'
                    }} 
                  />
                  <Bar dataKey="sessions" fill="#2D7D7D" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Progress Trend */}
          <div className="p-4 rounded-therapeutic border border-border">
            <h3 className="font-heading font-medium text-foreground mb-4">Patient Progress Trend</h3>
            <div className="w-full h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={progressData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5F0F0" />
                  <XAxis dataKey="month" stroke="#5A6B6B" fontSize={12} />
                  <YAxis stroke="#5A6B6B" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#FFFFFF', 
                      border: '1px solid #E5F0F0',
                      borderRadius: '8px'
                    }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="improvement" 
                    stroke="#7BA05B" 
                    strokeWidth={3}
                    dot={{ fill: '#7BA05B', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Therapy Distribution */}
          <div className="p-4 rounded-therapeutic border border-border">
            <h3 className="font-heading font-medium text-foreground mb-4">Therapy Type Distribution</h3>
            <div className="w-full h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={therapyTypeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {therapyTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2 mt-4">
              {therapyTypeData.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="font-caption text-sm text-foreground">{item.name}</span>
                  </div>
                  <span className="font-mono text-sm text-muted-foreground">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Achievements */}
          <div className="lg:col-span-2 p-4 rounded-therapeutic border border-border">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading font-medium text-foreground">Recent Patient Achievements</h3>
              <Button variant="outline" size="sm" iconName="ExternalLink">
                View All
              </Button>
            </div>
            <div className="space-y-3">
              {recentAchievements.map((achievement, index) => (
                <div
                  key={index}
                  className="p-3 rounded-therapeutic bg-muted/50 hover:bg-muted transition-colors duration-200"
                >
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-success/10 rounded-therapeutic flex items-center justify-center">
                      <Icon name={achievement.icon} size={16} className="text-success" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-body font-medium text-sm text-foreground">
                          {achievement.patient}
                        </h4>
                        <span className="font-caption text-xs text-muted-foreground">
                          {new Date(achievement.date).toLocaleDateString('en-IN')}
                        </span>
                      </div>
                      <p className="font-caption text-sm text-muted-foreground mt-1">
                        {achievement.achievement}
                      </p>
                      <span className="inline-block px-2 py-1 bg-primary/10 text-primary text-xs rounded-full mt-2">
                        {achievement.type}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;