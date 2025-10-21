import React from 'react';
import Icon from '../../../components/AppIcon';
import Select from '../../../components/ui/Select';

const LanguageToggle = ({ selectedLanguage, onLanguageChange }) => {
  const languageOptions = [
    { value: 'english', label: 'English' },
    { value: 'hindi', label: 'हिंदी' },
    { value: 'regional', label: 'Regional' }
  ];

  return (
    <div className="flex items-center space-x-2">
      <Icon name="Globe" size={16} className="text-muted-foreground" />
      <Select
        options={languageOptions}
        value={selectedLanguage}
        onChange={onLanguageChange}
        className="min-w-[120px]"
      />
    </div>
  );
};

export default LanguageToggle;