import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const ExercisePrescription = () => {
  const [selectedPatient, setSelectedPatient] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [prescribedExercises, setPrescribedExercises] = useState([]);

  const patients = [
    { value: '1', label: 'Arjun Sharma - Speech Therapy' },
    { value: '2', label: 'Priya Patel - Occupational Therapy' },
    { value: '3', label: 'Rajesh Kumar - Physiotherapy' },
    { value: '4', label: 'Meera Singh - Speech Therapy' },
    { value: '5', label: 'Vikram Gupta - Occupational Therapy' }
  ];

  const exerciseCategories = [
    { value: 'speech', label: 'Speech Therapy' },
    { value: 'occupational', label: 'Occupational Therapy' },
    { value: 'physiotherapy', label: 'Physiotherapy' }
  ];

  const exerciseLibrary = {
    speech: [
      {
        id: 1,
        name: "Articulation Practice",
        description: "Practice specific sound production with visual and auditory cues",
        difficulty: "Beginner",
        duration: "10-15 minutes",
        frequency: "Daily",
        instructions: "Repeat target sounds 10 times each, focusing on tongue placement and lip position."
      },
      {
        id: 2,
        name: "Vocabulary Building",
        description: "Interactive word learning with picture associations",
        difficulty: "Intermediate",
        duration: "15-20 minutes",
        frequency: "3 times per week",
        instructions: "Learn 5 new words daily using picture cards and repetition exercises."
      },
      {
        id: 3,
        name: "Fluency Exercises",
        description: "Breathing and rhythm exercises to improve speech flow",
        difficulty: "Advanced",
        duration: "20-25 minutes",
        frequency: "Daily",
        instructions: "Practice controlled breathing while speaking at a steady pace."
      }
    ],
    occupational: [
      {
        id: 4,
        name: "Fine Motor Skills",
        description: "Hand and finger exercises to improve dexterity",
        difficulty: "Beginner",
        duration: "15-20 minutes",
        frequency: "Daily",
        instructions: "Use tweezers to pick up small objects and place them in containers."
      },
      {
        id: 5,
        name: "Handwriting Practice",
        description: "Letter formation and writing exercises",
        difficulty: "Intermediate",
        duration: "20-25 minutes",
        frequency: "Daily",
        instructions: "Practice writing letters and words with proper grip and posture."
      },
      {
        id: 6,
        name: "Cognitive Tasks",
        description: "Memory and problem-solving exercises",
        difficulty: "Advanced",
        duration: "25-30 minutes",
        frequency: "3 times per week",
        instructions: "Complete puzzles and memory games to enhance cognitive function."
      }
    ],
    physiotherapy: [
      {
        id: 7,
        name: "Range of Motion",
        description: "Joint mobility and flexibility exercises",
        difficulty: "Beginner",
        duration: "15-20 minutes",
        frequency: "Daily",
        instructions: "Gentle stretching exercises for affected joints, hold for 30 seconds each."
      },
      {
        id: 8,
        name: "Strength Training",
        description: "Muscle strengthening exercises with resistance",
        difficulty: "Intermediate",
        duration: "20-30 minutes",
        frequency: "3 times per week",
        instructions: "Use resistance bands or light weights for targeted muscle groups."
      },
      {
        id: 9,
        name: "Balance Activities",
        description: "Stability and coordination exercises",
        difficulty: "Advanced",
        duration: "15-25 minutes",
        frequency: "Daily",
        instructions: "Practice standing on one foot and walking in straight lines."
      }
    ]
  };

  const currentExercises = selectedCategory ? exerciseLibrary[selectedCategory] || [] : [];

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-success text-success-foreground';
      case 'Intermediate': return 'bg-warning text-warning-foreground';
      case 'Advanced': return 'bg-error text-error-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const addExercise = (exercise) => {
    const newExercise = {
      ...exercise,
      id: Date.now(),
      customDuration: exercise.duration,
      customFrequency: exercise.frequency,
      customInstructions: exercise.instructions,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    };
    setPrescribedExercises(prev => [...prev, newExercise]);
  };

  const removeExercise = (exerciseId) => {
    setPrescribedExercises(prev => prev.filter(ex => ex.id !== exerciseId));
  };

  const updateExercise = (exerciseId, field, value) => {
    setPrescribedExercises(prev => 
      prev.map(ex => ex.id === exerciseId ? { ...ex, [field]: value } : ex)
    );
  };

  const savePrescription = () => {
    if (!selectedPatient || prescribedExercises.length === 0) {
      alert('Please select a patient and add at least one exercise.');
      return;
    }
    console.log('Saving prescription:', { selectedPatient, prescribedExercises });
    alert('Exercise prescription saved successfully!');
  };

  return (
    <div className="bg-card rounded-therapeutic border border-border shadow-therapeutic">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/10 rounded-therapeutic flex items-center justify-center">
              <Icon name="Clipboard" size={20} className="text-primary" />
            </div>
            <div>
              <h2 className="font-heading font-semibold text-lg text-foreground">Exercise Prescription</h2>
              <p className="font-caption text-sm text-muted-foreground">
                Assign therapeutic exercises to patients
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" iconName="History">
              Previous Prescriptions
            </Button>
            <Button variant="outline" size="sm" iconName="Download">
              Export
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Exercise Library */}
          <div>
            <h3 className="font-heading font-medium text-foreground mb-4">Exercise Library</h3>
            
            <div className="space-y-4">
              <Select
                label="Select Category"
                options={exerciseCategories}
                value={selectedCategory}
                onChange={setSelectedCategory}
                placeholder="Choose therapy type"
              />

              {currentExercises.length > 0 && (
                <div className="space-y-3">
                  {currentExercises.map((exercise) => (
                    <div
                      key={exercise.id}
                      className="p-4 rounded-therapeutic border border-border hover:border-primary/50 transition-colors duration-200"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-body font-medium text-foreground">{exercise.name}</h4>
                          <p className="font-caption text-sm text-muted-foreground">{exercise.description}</p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => addExercise(exercise)}
                          iconName="Plus"
                        >
                          Add
                        </Button>
                      </div>
                      
                      <div className="flex items-center space-x-4 text-xs">
                        <span className={`px-2 py-1 rounded-full font-medium ${getDifficultyColor(exercise.difficulty)}`}>
                          {exercise.difficulty}
                        </span>
                        <div className="flex items-center space-x-1">
                          <Icon name="Clock" size={12} className="text-muted-foreground" />
                          <span className="text-muted-foreground">{exercise.duration}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Icon name="Repeat" size={12} className="text-muted-foreground" />
                          <span className="text-muted-foreground">{exercise.frequency}</span>
                        </div>
                      </div>
                      
                      <div className="mt-2">
                        <p className="font-caption text-xs text-muted-foreground">{exercise.instructions}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {selectedCategory && currentExercises.length === 0 && (
                <div className="text-center py-8">
                  <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
                    <Icon name="Search" size={20} className="text-muted-foreground" />
                  </div>
                  <p className="font-caption text-sm text-muted-foreground">
                    No exercises found for this category
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Prescription Builder */}
          <div>
            <h3 className="font-heading font-medium text-foreground mb-4">Build Prescription</h3>
            
            <div className="space-y-4">
              <Select
                label="Select Patient"
                options={patients}
                value={selectedPatient}
                onChange={setSelectedPatient}
                placeholder="Choose patient"
                searchable
              />

              {prescribedExercises.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-body font-medium text-foreground">Prescribed Exercises</h4>
                  {prescribedExercises.map((exercise) => (
                    <div
                      key={exercise.id}
                      className="p-4 rounded-therapeutic border border-primary/20 bg-primary/5"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <h5 className="font-body font-medium text-foreground">{exercise.name}</h5>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeExercise(exercise.id)}
                          iconName="X"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3 mb-3">
                        <Input
                          label="Duration"
                          type="text"
                          value={exercise.customDuration}
                          onChange={(e) => updateExercise(exercise.id, 'customDuration', e.target.value)}
                          placeholder="15-20 minutes"
                        />
                        <Input
                          label="Frequency"
                          type="text"
                          value={exercise.customFrequency}
                          onChange={(e) => updateExercise(exercise.id, 'customFrequency', e.target.value)}
                          placeholder="Daily"
                        />
                        <Input
                          label="Start Date"
                          type="date"
                          value={exercise.startDate}
                          onChange={(e) => updateExercise(exercise.id, 'startDate', e.target.value)}
                        />
                        <Input
                          label="End Date"
                          type="date"
                          value={exercise.endDate}
                          onChange={(e) => updateExercise(exercise.id, 'endDate', e.target.value)}
                        />
                      </div>

                      <div>
                        <label className="block font-body font-medium text-sm text-foreground mb-2">
                          Custom Instructions
                        </label>
                        <textarea
                          value={exercise.customInstructions}
                          onChange={(e) => updateExercise(exercise.id, 'customInstructions', e.target.value)}
                          placeholder="Add specific instructions for this patient..."
                          className="w-full h-20 p-3 border border-border rounded-therapeutic resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {prescribedExercises.length === 0 && (
                <div className="text-center py-8 border-2 border-dashed border-border rounded-therapeutic">
                  <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
                    <Icon name="Plus" size={20} className="text-muted-foreground" />
                  </div>
                  <p className="font-caption text-sm text-muted-foreground">
                    Add exercises from the library to build a prescription
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 pt-4 border-t border-border">
                <Button
                  variant="default"
                  onClick={savePrescription}
                  iconName="Save"
                  className="flex-1 sm:flex-none"
                  disabled={!selectedPatient || prescribedExercises.length === 0}
                >
                  Save Prescription
                </Button>
                <Button variant="outline" iconName="Send" className="flex-1 sm:flex-none">
                  Send to Patient
                </Button>
                <Button variant="outline" iconName="Printer" className="flex-1 sm:flex-none">
                  Print
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExercisePrescription;