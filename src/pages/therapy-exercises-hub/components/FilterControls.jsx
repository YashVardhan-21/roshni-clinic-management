import React from 'react';
import Icon from '../../../components/AppIcon';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';

const FilterControls = ({ filters, onFilterChange, onResetFilters }) => {
  const difficultyOptions = [
    { value: 'all', label: 'All Levels' },
    { value: 'Beginner', label: 'Beginner' },
    { value: 'Intermediate', label: 'Intermediate' },
    { value: 'Advanced', label: 'Advanced' }
  ];

  const durationOptions = [
    { value: 'all', label: 'Any Duration' },
    { value: '0-5', label: '0-5 minutes' },
    { value: '5-10', label: '5-10 minutes' },
    { value: '10-15', label: '10-15 minutes' },
    { value: '15+', label: '15+ minutes' }
  ];

  const sortOptions = [
    { value: 'recommended', label: 'Recommended' },
    { value: 'difficulty', label: 'Difficulty' },
    { value: 'duration', label: 'Duration' },
    { value: 'progress', label: 'Progress' },
    { value: 'popular', label: 'Most Popular' }
  ];

  const hasActiveFilters = filters.difficulty !== 'all' || filters.duration !== 'all' || filters.sort !== 'recommended';

  return (
    <div className="bg-card border border-border rounded-therapeutic p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-heading font-medium text-foreground flex items-center space-x-2">
          <Icon name="Filter" size={18} />
          <span>Filter & Sort</span>
        </h3>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onResetFilters}
            iconName="X"
            iconPosition="left"
            className="text-muted-foreground hover:text-foreground"
          >
            Clear All
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Select
          label="Difficulty Level"
          options={difficultyOptions}
          value={filters.difficulty}
          onChange={(value) => onFilterChange('difficulty', value)}
          className="w-full"
        />

        <Select
          label="Duration"
          options={durationOptions}
          value={filters.duration}
          onChange={(value) => onFilterChange('duration', value)}
          className="w-full"
        />

        <Select
          label="Sort By"
          options={sortOptions}
          value={filters.sort}
          onChange={(value) => onFilterChange('sort', value)}
          className="w-full"
        />
      </div>

      {/* Quick Filter Buttons */}
      <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-border">
        <span className="text-sm text-muted-foreground font-medium">Quick filters:</span>
        <Button
          variant="outline"
          size="xs"
          onClick={() => onFilterChange('difficulty', 'Beginner')}
          className={filters.difficulty === 'Beginner' ? 'bg-primary text-primary-foreground' : ''}
        >
          Beginner
        </Button>
        <Button
          variant="outline"
          size="xs"
          onClick={() => onFilterChange('duration', '0-5')}
          className={filters.duration === '0-5' ? 'bg-primary text-primary-foreground' : ''}
        >
          Quick (5 min)
        </Button>
        <Button
          variant="outline"
          size="xs"
          onClick={() => onFilterChange('sort', 'popular')}
          className={filters.sort === 'popular' ? 'bg-primary text-primary-foreground' : ''}
        >
          Popular
        </Button>
      </div>
    </div>
  );
};

export default FilterControls;