import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const DetailedReports = ({ reportsData }) => {
  const [selectedReport, setSelectedReport] = useState('assessment');
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');

  const reportTypes = [
    { id: 'assessment', label: 'Assessment Reports', icon: 'FileText' },
    { id: 'progress', label: 'Progress Summary', icon: 'TrendingUp' },
    { id: 'comparison', label: 'Before/After', icon: 'GitCompare' },
    { id: 'recommendations', label: 'Recommendations', icon: 'Lightbulb' }
  ];

  const periods = [
    { id: 'weekly', label: 'Weekly' },
    { id: 'monthly', label: 'Monthly' },
    { id: 'quarterly', label: 'Quarterly' },
    { id: 'yearly', label: 'Yearly' }
  ];

  const getScoreColor = (score, maxScore = 100) => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 80) return 'text-success';
    if (percentage >= 60) return 'text-warning';
    return 'text-error';
  };

  const getScoreBgColor = (score, maxScore = 100) => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 80) return 'bg-success';
    if (percentage >= 60) return 'bg-warning';
    return 'bg-error';
  };

  const renderAssessmentReport = () => (
    <div className="space-y-6">
      {reportsData.assessmentReports.map((report) => (
        <div key={report.id} className="bg-card border border-border rounded-therapeutic p-6 shadow-therapeutic">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-heading font-semibold text-lg text-foreground">{report.title}</h3>
              <p className="font-body text-sm text-muted-foreground">
                Conducted by Dr. {report.therapist} • {report.date}
              </p>
            </div>
            <Button variant="outline" size="sm" iconName="Download" iconPosition="left">
              Download PDF
            </Button>
          </div>

          {/* Assessment Scores */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {report.scores.map((score) => (
              <div key={score.category} className="bg-muted/50 rounded-therapeutic p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-body text-sm text-foreground">{score.category}</span>
                  <span className={`font-mono font-semibold ${getScoreColor(score.current, score.maximum)}`}>
                    {score.current}/{score.maximum}
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2 mb-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${getScoreBgColor(score.current, score.maximum)}`}
                    style={{ width: `${(score.current / score.maximum) * 100}%` }}
                  />
                </div>
                <div className="flex items-center space-x-1">
                  <Icon 
                    name={score.trend === 'up' ? 'TrendingUp' : score.trend === 'down' ? 'TrendingDown' : 'Minus'} 
                    size={12} 
                    className={
                      score.trend === 'up' ? 'text-success' :
                      score.trend === 'down' ? 'text-error' : 'text-muted-foreground'
                    }
                  />
                  <span className="font-caption text-xs text-muted-foreground">
                    {score.change > 0 ? '+' : ''}{score.change} from last assessment
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Key Findings */}
          <div className="mb-6">
            <h4 className="font-heading font-medium text-foreground mb-3">Key Findings</h4>
            <div className="bg-muted/30 rounded-therapeutic p-4">
              <p className="font-body text-sm text-foreground leading-relaxed">{report.keyFindings}</p>
            </div>
          </div>

          {/* Strengths and Areas for Improvement */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-heading font-medium text-foreground mb-3 flex items-center space-x-2">
                <Icon name="CheckCircle" size={16} className="text-success" />
                <span>Strengths</span>
              </h4>
              <ul className="space-y-2">
                {report.strengths.map((strength, index) => (
                  <li key={index} className="font-body text-sm text-foreground flex items-start space-x-2">
                    <Icon name="Plus" size={12} className="text-success mt-1 flex-shrink-0" />
                    <span>{strength}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="font-heading font-medium text-foreground mb-3 flex items-center space-x-2">
                <Icon name="AlertCircle" size={16} className="text-warning" />
                <span>Areas for Improvement</span>
              </h4>
              <ul className="space-y-2">
                {report.improvements.map((improvement, index) => (
                  <li key={index} className="font-body text-sm text-foreground flex items-start space-x-2">
                    <Icon name="ArrowRight" size={12} className="text-warning mt-1 flex-shrink-0" />
                    <span>{improvement}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderProgressSummary = () => (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-therapeutic p-6 shadow-therapeutic">
        <h3 className="font-heading font-semibold text-lg text-foreground mb-4">Progress Summary</h3>
        
        {/* Overall Progress */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="font-body text-foreground">Overall Progress</span>
            <span className="font-mono font-semibold text-primary text-lg">
              {reportsData.progressSummary.overallProgress}%
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-3">
            <div 
              className="h-3 rounded-full bg-primary transition-all duration-300"
              style={{ width: `${reportsData.progressSummary.overallProgress}%` }}
            />
          </div>
        </div>

        {/* Progress by Category */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reportsData.progressSummary.categories.map((category) => (
            <div key={category.name} className="space-y-3">
              <h4 className="font-heading font-medium text-foreground">{category.name}</h4>
              {category.skills.map((skill) => (
                <div key={skill.name}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-body text-sm text-foreground">{skill.name}</span>
                    <span className="font-mono text-sm text-foreground">{skill.progress}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${getScoreBgColor(skill.progress)}`}
                      style={{ width: `${skill.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderComparisonReport = () => (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-therapeutic p-6 shadow-therapeutic">
        <h3 className="font-heading font-semibold text-lg text-foreground mb-4">Before/After Comparison</h3>
        
        <div className="space-y-6">
          {reportsData.comparisonData.map((comparison) => (
            <div key={comparison.skill} className="border border-border rounded-therapeutic p-4">
              <h4 className="font-heading font-medium text-foreground mb-4">{comparison.skill}</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Before */}
                <div>
                  <div className="flex items-center space-x-2 mb-3">
                    <Icon name="Calendar" size={16} className="text-muted-foreground" />
                    <span className="font-body text-sm text-muted-foreground">Before ({comparison.beforeDate})</span>
                  </div>
                  <div className="space-y-2">
                    {comparison.beforeMetrics.map((metric) => (
                      <div key={metric.name} className="flex items-center justify-between">
                        <span className="font-body text-sm text-foreground">{metric.name}</span>
                        <span className="font-mono text-sm text-error">{metric.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* After */}
                <div>
                  <div className="flex items-center space-x-2 mb-3">
                    <Icon name="Calendar" size={16} className="text-muted-foreground" />
                    <span className="font-body text-sm text-muted-foreground">After ({comparison.afterDate})</span>
                  </div>
                  <div className="space-y-2">
                    {comparison.afterMetrics.map((metric) => (
                      <div key={metric.name} className="flex items-center justify-between">
                        <span className="font-body text-sm text-foreground">{metric.name}</span>
                        <span className="font-mono text-sm text-success">{metric.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Improvement Summary */}
              <div className="mt-4 p-3 bg-success/10 rounded-therapeutic">
                <div className="flex items-center space-x-2 mb-2">
                  <Icon name="TrendingUp" size={16} className="text-success" />
                  <span className="font-body font-medium text-success">Improvement Summary</span>
                </div>
                <p className="font-body text-sm text-foreground">{comparison.improvementSummary}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderRecommendations = () => (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-therapeutic p-6 shadow-therapeutic">
        <h3 className="font-heading font-semibold text-lg text-foreground mb-4">Therapist Recommendations</h3>
        
        <div className="space-y-6">
          {reportsData.recommendations.map((category) => (
            <div key={category.category}>
              <h4 className="font-heading font-medium text-foreground mb-3 flex items-center space-x-2">
                <Icon name={category.icon} size={16} className="text-primary" />
                <span>{category.category}</span>
              </h4>
              
              <div className="space-y-3">
                {category.items.map((item) => (
                  <div key={item.id} className="bg-muted/30 rounded-therapeutic p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h5 className="font-body font-medium text-foreground">{item.title}</h5>
                      <span className={`font-caption text-xs px-2 py-1 rounded-full ${
                        item.priority === 'high' ? 'bg-error/10 text-error' :
                        item.priority === 'medium' ? 'bg-warning/10 text-warning' : 'bg-success/10 text-success'
                      }`}>
                        {item.priority.toUpperCase()}
                      </span>
                    </div>
                    <p className="font-body text-sm text-foreground mb-3">{item.description}</p>
                    
                    {item.actionItems && (
                      <div>
                        <span className="font-body text-sm font-medium text-foreground">Action Items:</span>
                        <ul className="mt-1 space-y-1">
                          {item.actionItems.map((action, index) => (
                            <li key={index} className="font-body text-sm text-foreground flex items-start space-x-2">
                              <Icon name="ArrowRight" size={12} className="text-primary mt-1 flex-shrink-0" />
                              <span>{action}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderReportContent = () => {
    switch (selectedReport) {
      case 'assessment':
        return renderAssessmentReport();
      case 'progress':
        return renderProgressSummary();
      case 'comparison':
        return renderComparisonReport();
      case 'recommendations':
        return renderRecommendations();
      default:
        return renderAssessmentReport();
    }
  };

  return (
    <div className="space-y-6">
      {/* Report Controls */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between space-y-4 lg:space-y-0">
        <div className="flex flex-wrap gap-2">
          {reportTypes.map((report) => (
            <Button
              key={report.id}
              variant={selectedReport === report.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedReport(report.id)}
              iconName={report.icon}
              iconPosition="left"
              iconSize={16}
            >
              {report.label}
            </Button>
          ))}
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Icon name="Calendar" size={16} className="text-muted-foreground" />
            <div className="flex rounded-therapeutic border border-border overflow-hidden">
              {periods.map((period) => (
                <button
                  key={period.id}
                  onClick={() => setSelectedPeriod(period.id)}
                  className={`px-3 py-1 text-xs font-body transition-colors duration-150 ${
                    selectedPeriod === period.id
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-card text-foreground hover:bg-muted'
                  }`}
                >
                  {period.label}
                </button>
              ))}
            </div>
          </div>
          
          <Button variant="outline" size="sm" iconName="Share" iconPosition="left">
            Share Report
          </Button>
        </div>
      </div>

      {/* Report Content */}
      {renderReportContent()}
    </div>
  );
};

export default DetailedReports;