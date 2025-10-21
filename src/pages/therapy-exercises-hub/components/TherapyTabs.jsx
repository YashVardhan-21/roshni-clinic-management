import React from 'react';
import Icon from '../../../components/AppIcon';

const TherapyTabs = ({ activeTab, onTabChange, tabs }) => {
  return (
    <div className="bg-card border border-border rounded-therapeutic p-1 mb-6">
      <div className="flex space-x-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-gentle font-body font-medium text-sm transition-all duration-200 touch-target ${
              activeTab === tab.id
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
          >
            <Icon name={tab.icon} size={18} />
            <span className="hidden sm:inline">{tab.label}</span>
            <span className="sm:hidden">{tab.shortLabel}</span>
            {tab.count > 0 && (
              <span className={`px-2 py-0.5 rounded-full text-xs font-mono ${
                activeTab === tab.id
                  ? 'bg-primary-foreground/20 text-primary-foreground'
                  : 'bg-muted text-muted-foreground'
              }`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TherapyTabs;