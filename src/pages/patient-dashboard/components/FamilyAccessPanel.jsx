import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const FamilyAccessPanel = ({ familyMembers = [], patientName = "Patient" }) => {
  const getRelationshipIcon = (relationship) => {
    switch (relationship.toLowerCase()) {
      case 'parent': case'mother': case'father':
        return 'Users';
      case 'spouse': case'husband': case'wife':
        return 'Heart';
      case 'child': case'son': case'daughter':
        return 'Baby';
      case 'sibling': case'brother': case'sister':
        return 'UserCheck';
      default:
        return 'User';
    }
  };

  const getAccessLevelColor = (level) => {
    switch (level.toLowerCase()) {
      case 'full':
        return 'bg-success/10 text-success';
      case 'limited':
        return 'bg-warning/10 text-warning';
      case 'view only':
        return 'bg-muted text-muted-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="bg-card border border-border rounded-therapeutic p-6 shadow-therapeutic">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-heading font-medium text-lg text-foreground">Family Access</h3>
        <Icon name="Shield" size={20} className="text-primary" />
      </div>

      <div className="mb-4 p-3 bg-primary/5 rounded-therapeutic">
        <div className="flex items-center space-x-2 mb-2">
          <Icon name="Info" size={16} className="text-primary" />
          <span className="font-body text-sm font-medium text-primary">Patient Account</span>
        </div>
        <p className="font-body text-sm text-foreground">{patientName}</p>
        <p className="font-caption text-xs text-muted-foreground">Primary account holder</p>
      </div>

      <div className="space-y-3 mb-6">
        {familyMembers.map((member) => (
          <div key={member.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-therapeutic">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-card rounded-gentle">
                <Icon name={getRelationshipIcon(member.relationship)} size={16} className="text-foreground" />
              </div>
              <div>
                <p className="font-body text-sm font-medium text-foreground">{member.name}</p>
                <p className="font-caption text-xs text-muted-foreground capitalize">{member.relationship}</p>
              </div>
            </div>
            <div className="text-right">
              <div className={`px-2 py-1 rounded-gentle text-xs font-medium ${getAccessLevelColor(member.accessLevel)}`}>
                {member.accessLevel}
              </div>
              <p className="font-caption text-xs text-muted-foreground mt-1">
                {member.lastAccess ? `Last: ${member.lastAccess}` : 'Never accessed'}
              </p>
            </div>
          </div>
        ))}
      </div>

      {familyMembers.length === 0 && (
        <div className="text-center py-6">
          <Icon name="UserPlus" size={32} className="text-muted-foreground mx-auto mb-3" />
          <p className="font-body text-sm text-muted-foreground mb-2">No family members added</p>
          <p className="font-caption text-xs text-muted-foreground">Add family members to share your progress</p>
        </div>
      )}

      <div className="space-y-3">
        <Button
          variant="outline"
          fullWidth
          iconName="UserPlus"
          iconPosition="left"
        >
          Add Family Member
        </Button>
        
        <Link to="/family-settings">
          <Button
            variant="ghost"
            fullWidth
            iconName="Settings"
            iconPosition="left"
          >
            Manage Access
          </Button>
        </Link>
      </div>

      <div className="mt-4 pt-4 border-t border-border">
        <div className="flex items-start space-x-2">
          <Icon name="Lock" size={14} className="text-muted-foreground mt-0.5" />
          <div>
            <p className="font-body text-xs text-muted-foreground">
              Your privacy is protected. Family members can only access information based on their permission level.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FamilyAccessPanel;