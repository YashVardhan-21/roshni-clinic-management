import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ProgressCharts = ({ chartData }) => {
  const [selectedChart, setSelectedChart] = useState('progress');
  const [timeRange, setTimeRange] = useState('3months');

  const chartTypes = [
    { id: 'progress', label: 'Progress Trends', icon: 'TrendingUp' },
    { id: 'sessions', label: 'Session Activity', icon: 'BarChart3' },
    { id: 'exercises', label: 'Exercise Performance', icon: 'Activity' },
    { id: 'goals', label: 'Goal Achievement', icon: 'Target' }
  ];

  const timeRanges = [
    { id: '1month', label: '1 Month' },
    { id: '3months', label: '3 Months' },
    { id: '6months', label: '6 Months' },
    { id: '1year', label: '1 Year' }
  ];

  const COLORS = ['#2D7D7D', '#7BA05B', '#E8A87C', '#E57373'];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-popover border border-border rounded-therapeutic p-3 shadow-therapeutic-lg">
          <p className="font-body text-sm text-foreground mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="font-caption text-xs" style={{ color: entry.color }}>
              {entry.name}: {entry.value}
              {entry.name.includes('Score') || entry.name.includes('Rate') ? '%' : ''}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const renderChart = () => {
    switch (selectedChart) {
      case 'progress':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData.progressTrends}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5F0F0" />
              <XAxis 
                dataKey="date" 
                stroke="#5A6B6B"
                fontSize={12}
                tickLine={false}
              />
              <YAxis 
                stroke="#5A6B6B"
                fontSize={12}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="overallScore" 
                stroke="#2D7D7D" 
                strokeWidth={3}
                dot={{ fill: '#2D7D7D', strokeWidth: 2, r: 4 }}
                name="Overall Score"
              />
              <Line 
                type="monotone" 
                dataKey="speechScore" 
                stroke="#7BA05B" 
                strokeWidth={2}
                dot={{ fill: '#7BA05B', strokeWidth: 2, r: 3 }}
                name="Speech Score"
              />
              <Line 
                type="monotone" 
                dataKey="motorScore" 
                stroke="#E8A87C" 
                strokeWidth={2}
                dot={{ fill: '#E8A87C', strokeWidth: 2, r: 3 }}
                name="Motor Score"
              />
            </LineChart>
          </ResponsiveContainer>
        );

      case 'sessions':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData.sessionActivity}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5F0F0" />
              <XAxis 
                dataKey="week" 
                stroke="#5A6B6B"
                fontSize={12}
                tickLine={false}
              />
              <YAxis 
                stroke="#5A6B6B"
                fontSize={12}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="completed" fill="#2D7D7D" name="Completed Sessions" radius={[4, 4, 0, 0]} />
              <Bar dataKey="scheduled" fill="#E5F0F0" name="Scheduled Sessions" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        );

      case 'exercises':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData.exercisePerformance}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5F0F0" />
              <XAxis 
                dataKey="date" 
                stroke="#5A6B6B"
                fontSize={12}
                tickLine={false}
              />
              <YAxis 
                stroke="#5A6B6B"
                fontSize={12}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="accuracy" 
                stroke="#7BA05B" 
                strokeWidth={3}
                dot={{ fill: '#7BA05B', strokeWidth: 2, r: 4 }}
                name="Accuracy Rate"
              />
              <Line 
                type="monotone" 
                dataKey="completionTime" 
                stroke="#E8A87C" 
                strokeWidth={2}
                dot={{ fill: '#E8A87C', strokeWidth: 2, r: 3 }}
                name="Completion Time"
              />
            </LineChart>
          </ResponsiveContainer>
        );

      case 'goals':
        return (
          <div className="flex flex-col lg:flex-row items-center justify-center space-y-4 lg:space-y-0 lg:space-x-8">
            <ResponsiveContainer width="100%" height={300} className="lg:w-1/2">
              <PieChart>
                <Pie
                  data={chartData.goalAchievement}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {chartData.goalAchievement.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            
            <div className="space-y-3 lg:w-1/2">
              {chartData.goalAchievement.map((goal, index) => (
                <div key={goal.name} className="flex items-center space-x-3">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <div className="flex-1">
                    <div className="font-body text-sm text-foreground">{goal.name}</div>
                    <div className="font-caption text-xs text-muted-foreground">{goal.value}% Complete</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Chart Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
        <div className="flex flex-wrap gap-2">
          {chartTypes.map((chart) => (
            <Button
              key={chart.id}
              variant={selectedChart === chart.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedChart(chart.id)}
              iconName={chart.icon}
              iconPosition="left"
              iconSize={16}
            >
              {chart.label}
            </Button>
          ))}
        </div>
        
        <div className="flex items-center space-x-2">
          <Icon name="Calendar" size={16} className="text-muted-foreground" />
          <div className="flex rounded-therapeutic border border-border overflow-hidden">
            {timeRanges.map((range) => (
              <button
                key={range.id}
                onClick={() => setTimeRange(range.id)}
                className={`px-3 py-1 text-xs font-body transition-colors duration-150 ${
                  timeRange === range.id
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-card text-foreground hover:bg-muted'
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chart Container */}
      <div className="bg-card border border-border rounded-therapeutic p-6 shadow-therapeutic">
        <div className="mb-4">
          <h3 className="font-heading font-semibold text-lg text-foreground mb-2">
            {chartTypes.find(c => c.id === selectedChart)?.label}
          </h3>
          <p className="font-body text-sm text-muted-foreground">
            Showing data for the last {timeRanges.find(r => r.id === timeRange)?.label.toLowerCase()}
          </p>
        </div>
        
        <div className="w-full">
          {renderChart()}
        </div>
      </div>

      {/* Chart Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-card border border-border rounded-therapeutic p-4 shadow-therapeutic">
          <div className="flex items-center space-x-2 mb-3">
            <Icon name="TrendingUp" size={16} className="text-success" />
            <h4 className="font-heading font-medium text-sm text-foreground">Key Improvements</h4>
          </div>
          <ul className="space-y-2">
            <li className="font-body text-sm text-foreground">• Speech clarity improved by 15%</li>
            <li className="font-body text-sm text-foreground">• Exercise completion rate up 22%</li>
            <li className="font-body text-sm text-foreground">• Session attendance increased to 95%</li>
          </ul>
        </div>
        
        <div className="bg-card border border-border rounded-therapeutic p-4 shadow-therapeutic">
          <div className="flex items-center space-x-2 mb-3">
            <Icon name="Target" size={16} className="text-primary" />
            <h4 className="font-heading font-medium text-sm text-foreground">Focus Areas</h4>
          </div>
          <ul className="space-y-2">
            <li className="font-body text-sm text-foreground">• Articulation exercises need more practice</li>
            <li className="font-body text-sm text-foreground">• Fine motor skills showing steady progress</li>
            <li className="font-body text-sm text-foreground">• Vocabulary building on track</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProgressCharts;