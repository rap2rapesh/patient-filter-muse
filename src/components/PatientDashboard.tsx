import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ArrowLeft, ArrowRight, Upload, Check, Download, FileText, Database } from 'lucide-react';
import ageHistogram from '@/assets/age_histogram.png';
import bmiHistogram from '@/assets/bmi_histogram.png';
import diagnosisBarChart from '@/assets/diagnosis_bar_chart.png';
import hba1cHistogram from '@/assets/hba1c_histogram.png';
import liverAltAstHistogram from '@/assets/liver_alt_ast_histogram.png';
type Screen = 'start' | 'upload-csv' | 'upload-criteria' | 'review-criteria' | 'dashboard' | 'feature-distribution';

interface CriteriaData {
  [key: string]: {
    Min?: number;
    Max?: number;
  } | string;
}

const PatientDashboard = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('upload-csv');
  const [csvUploaded, setCsvUploaded] = useState(false);
  const [criteriaUploaded, setCriteriaUploaded] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  // Original criteria data
  const originalCriteria: CriteriaData = {
    "Age": { "Min": 40.0, "Max": 75.0 },
    "Diagnosis": "Hypertension",
    "BMI": { "Min": 28.0, "Max": 35.0 },
    "HbA1c": { "Min": 6.5, "Max": 8.5 },
    "Liver_Function_ALT_AST": { "Max": 40.0 }
  };
  
  const [editedCriteria, setEditedCriteria] = useState<CriteriaData>(originalCriteria);
  
  const navigateToScreen = (screen: Screen) => {
    setCurrentScreen(screen);
    if (screen === 'review-criteria') {
      setShowWarning(false);
      setIsEditing(false);
    }
  };

  const formatCriteriaValue = (criterion: string, data: any): string => {
    if (typeof data === 'string') {
      return data;
    }
    const parts = [];
    if (data.Min !== undefined) parts.push(`Min: ${data.Min}`);
    if (data.Max !== undefined) parts.push(`Max: ${data.Max}`);
    return parts.join(', ');
  };

  const updateCriteriaValue = (criterionName: string, field: 'Min' | 'Max' | 'value', value: string) => {
    setEditedCriteria(prev => {
      const newCriteria = { ...prev };
      if (field === 'value') {
        newCriteria[criterionName] = value;
      } else {
        // Allow any string input including partial decimals and empty strings
        newCriteria[criterionName] = {
          ...(typeof newCriteria[criterionName] === 'object' ? newCriteria[criterionName] as any : {}),
          [field]: value
        };
      }
      return newCriteria;
    });
  };

  const handleInputBlur = (criterionName: string, field: 'Min' | 'Max', value: string) => {
    // Convert empty string to 0 only on blur (when user finishes editing)
    if (value === '') {
      updateCriteriaValue(criterionName, field, '0');
    }
  };

  const checkIfCriteriaChanged = (): boolean => {
    return JSON.stringify(originalCriteria) !== JSON.stringify(editedCriteria);
  };

  const handleConfirmCriteria = () => {
    if (checkIfCriteriaChanged()) {
      setShowWarning(true);
      setIsEditing(false);
    } else {
      navigateToScreen('dashboard');
    }
  };

  const handleBackToEditing = () => {
    setIsEditing(true);
    setShowWarning(false);
  };

  // Mock data for the dashboard
  const mockPatients = [{
    id: 'P001',
    name: 'John Smith',
    age: 65,
    diagnosis: 'Hypertension',
    gender: 'M'
  }, {
    id: 'P002',
    name: 'Sarah Johnson',
    age: 72,
    diagnosis: 'Diabetes',
    gender: 'F'
  }, {
    id: 'P003',
    name: 'Michael Brown',
    age: 58,
    diagnosis: 'Hypertension',
    gender: 'M'
  }, {
    id: 'P004',
    name: 'Emily Davis',
    age: 67,
    diagnosis: 'Hypertension',
    gender: 'F'
  }, {
    id: 'P005',
    name: 'Robert Wilson',
    age: 74,
    diagnosis: 'Diabetes',
    gender: 'M'
  }, {
    id: 'P006',
    name: 'Lisa Anderson',
    age: 63,
    diagnosis: 'Hypertension',
    gender: 'F'
  }, {
    id: 'P007',
    name: 'David Miller',
    age: 69,
    diagnosis: 'Diabetes',
    gender: 'M'
  }];

  const mockCriteria = [{
    name: 'Age',
    value: 'Min: 40.0, Max: 75.0'
  }, {
    name: 'Diagnosis',
    value: 'Hypertension'
  }, {
    name: 'BMI',
    value: 'Min: 28.0, Max: 35.0'
  }, {
    name: 'HbA1c',
    value: 'Min: 6.5, Max: 8.5'
  }, {
    name: 'Liver_Function_ALT_AST',
    value: 'Max: 40.0'
  }];

  const mockFailureData = [
    { condition: 'BMI <= 35', count: 200 },
    { condition: 'Liver_Function_ALT_AST < 40', count: 30 },
    { condition: 'Age > 75', count: 25 },
    { condition: 'HbA1c > 8.5', count: 15 },
    { condition: 'BMI < 28', count: 10 },
  ];

  const mockTerminalCases = [
    { patientId: 'P13', failedCount: 4, criteriaFailed: 'BMI <= 35, Age > 75, HbA1c > 8.5, Liver_Function_ALT_AST < 40' },
    { patientId: 'P15', failedCount: 4, criteriaFailed: 'BMI <= 35, BMI < 28, HbA1c > 8.5, Liver_Function_ALT_AST < 40' },
    { patientId: 'P16', failedCount: 3, criteriaFailed: 'BMI <= 35, Age > 75, HbA1c > 8.5' },
    { patientId: 'P22', failedCount: 3, criteriaFailed: 'Age > 75, Liver_Function_ALT_AST < 40, BMI < 28' },
    { patientId: 'P08', failedCount: 2, criteriaFailed: 'BMI <= 35, HbA1c > 8.5' },
  ];

  const getFailureRowColor = (count: number) => {
    if (count >= 150) return 'bg-red-50 border-red-200 text-red-900';
    if (count >= 100) return 'bg-red-100 border-red-300 text-red-800';
    if (count >= 50) return 'bg-orange-50 border-orange-200 text-orange-900';
    if (count >= 20) return 'bg-yellow-50 border-yellow-200 text-yellow-900';
    return 'bg-green-50 border-green-200 text-green-900';
  };
  const renderScreen = () => {
    switch (currentScreen) {
      case 'upload-csv':
        return <div className="min-h-screen bg-gradient-to-br from-background to-secondary p-8">
            <div className="max-w-4xl mx-auto">
              <div className="mb-8">
                <h1 className="text-xl font-bold text-foreground mb-2">Upload Patient Data</h1>
                <p className="text-muted-foreground">Please upload your patient data as a .CSV file to begin the filtering process.</p>
              </div>
              
              <Card className="shadow-xl border-0">
                <CardContent className="p-12">
                  <div className="text-center">
                    <div className="mx-auto mb-8 w-24 h-24 bg-gradient-to-br from-secondary to-accent rounded-full flex items-center justify-center">
                      <FileText className="w-12 h-12 text-primary" />
                    </div>
                    
                    <div className="mb-8 p-8 border-2 border-dashed border-border rounded-xl bg-accent/30 hover:bg-accent/50 transition-colors cursor-pointer" onClick={() => setCsvUploaded(true)}>
                      <Upload className="mx-auto w-8 h-8 text-muted-foreground mb-4" />
                      <Button variant="outline" size="lg" className="mb-4">
                        Upload CSV File
                      </Button>
                      <p className="text-sm text-muted-foreground">
                        {csvUploaded ? 'patient_data.csv' : 'No file chosen'}
                      </p>
                    </div>

                    <div className="flex justify-end">
                      <Button onClick={() => navigateToScreen('upload-criteria')} disabled={!csvUploaded} className="px-8">
                        Next
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>;
      case 'upload-criteria':
        return <div className="min-h-screen bg-gradient-to-br from-background to-secondary p-8">
            <div className="max-w-4xl mx-auto">
              <div className="mb-8">
                <h1 className="text-xl font-bold text-foreground mb-2">Upload Protocol Document</h1>
                <p className="text-muted-foreground">Please upload your protocol document as a .pdf file.</p>
              </div>
              
              <Card className="shadow-xl border-0">
                <CardContent className="p-12">
                  <div className="text-center">
                    <div className="mx-auto mb-8 w-24 h-24 bg-gradient-to-br from-secondary to-accent rounded-full flex items-center justify-center">
                      <FileText className="w-12 h-12 text-primary" />
                    </div>
                    
                    <div className="mb-8 p-8 border-2 border-dashed border-border rounded-xl bg-accent/30 hover:bg-accent/50 transition-colors cursor-pointer" onClick={() => setCriteriaUploaded(true)}>
                      <Upload className="mx-auto w-8 h-8 text-muted-foreground mb-4" />
                      <Button variant="outline" size="lg" className="mb-4">
                        Upload Protocol Document
                      </Button>
                      <p className="text-sm text-muted-foreground">
                        {criteriaUploaded ? 'protocol document.pdf' : 'No file chosen'}
                      </p>
                    </div>

                    <div className="flex justify-between">
                      <Button variant="outline" onClick={() => navigateToScreen('upload-csv')} className="px-8">
                        <ArrowLeft className="mr-2 w-4 h-4" />
                        Back to Upload Patient Data
                      </Button>
                      <Button onClick={() => navigateToScreen('review-criteria')} disabled={!criteriaUploaded} className="px-8">
                        Next
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>;
      case 'review-criteria':
        return <div className="min-h-screen bg-gradient-to-br from-background to-secondary p-8">
            <div className="max-w-6xl mx-auto">
              <div className="mb-8">
                <h1 className="text-xl font-bold text-foreground mb-2">Review Extracted Criteria</h1>
                <p className="text-muted-foreground">Please review the extracted criteria below. Confirm if they are correct.</p>
                <p className="text-muted-foreground mt-4">
                  <strong>AI transforms plain-language criteria from the protocol document into structured numerical constraints:</strong><br />
                  <strong>Example: "BMI between 28 and 35" which means that BMI value must fall within the range [28, 35] which means Minimum value - 28, Maximum value - 35.</strong>
                </p>
              </div>
              
              {!showWarning && (
                <Card className="shadow-xl border-0 mb-8">
                  <CardHeader>
                    <CardTitle className="text-xl">Extracted Filtering Criteria</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-border">
                            <th className="text-left py-4 px-4 font-semibold">Criterion Name</th>
                            <th className="text-left py-4 px-4 font-semibold">Expected Value</th>
                          </tr>
                        </thead>
                        <tbody>
                          {Object.entries(editedCriteria).map(([criterionName, criterionData], index) => (
                            <tr key={index} className="border-b border-border/50 hover:bg-accent/30 transition-colors">
                              <td className="py-4 px-4 font-medium">{criterionName}</td>
                              <td className="py-4 px-4">
                                {typeof criterionData === 'string' ? (
                                  <Input
                                    value={criterionData}
                                    onChange={(e) => updateCriteriaValue(criterionName, 'value', e.target.value)}
                                    className="w-full"
                                  />
                                ) : (
                                  <div className="flex items-center space-x-2">
                                     {(criterionData.Min !== undefined || (typeof criterionData === 'object' && 'Min' in criterionData)) && (
                                       <>
                                         <span>Min:</span>
                                         <Input
                                           type="text"
                                           value={criterionData.Min ?? ''}
                                           onChange={(e) => updateCriteriaValue(criterionName, 'Min', e.target.value)}
                                           onBlur={(e) => handleInputBlur(criterionName, 'Min', e.target.value)}
                                           className="w-20"
                                         />
                                       </>
                                     )}
                                     {(criterionData.Max !== undefined || (typeof criterionData === 'object' && 'Max' in criterionData)) && (
                                       <>
                                         <span>Max:</span>
                                         <Input
                                           type="text"
                                           value={criterionData.Max ?? ''}
                                           onChange={(e) => updateCriteriaValue(criterionName, 'Max', e.target.value)}
                                           onBlur={(e) => handleInputBlur(criterionName, 'Max', e.target.value)}
                                           className="w-20"
                                         />
                                       </>
                                     )}
                                  </div>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              )}

              {showWarning && (
                <Card className="shadow-xl border-0 mb-8 border-destructive">
                  <CardContent className="p-8">
                    <div className="text-center mb-6">
                      <p className="text-lg font-semibold text-destructive mb-4">
                        The edited values do not match the criteria text file
                      </p>
                    </div>
                    
                    <div className="mt-6">
                      <h3 className="text-lg font-semibold mb-4">Criteria Comparison</h3>
                      <div className="overflow-x-auto">
                        <table className="w-full border border-border rounded-lg">
                          <thead>
                            <tr className="border-b border-border bg-accent/50">
                              <th className="text-left py-3 px-4 font-semibold">Criterion Name</th>
                              <th className="text-left py-3 px-4 font-semibold">Original Criteria Expected Value</th>
                              <th className="text-left py-3 px-4 font-semibold">Edited Criteria Expected Value</th>
                            </tr>
                          </thead>
                          <tbody>
                            {Object.entries(originalCriteria).map(([criterionName, originalData], index) => {
                              const editedData = editedCriteria[criterionName];
                              
                              // Check for changes and get only changed parts
                              const getChangedParts = () => {
                                if (typeof originalData === 'string') {
                                  if (originalData !== editedData) {
                                    return {
                                      original: originalData,
                                      edited: editedData as string
                                    };
                                  }
                                  return null;
                                }
                                
                                const changes: { original: string[], edited: string[] } = { original: [], edited: [] };
                                let hasChanges = false;
                                
                                if (originalData.Min !== undefined && editedData && typeof editedData === 'object') {
                                  if (originalData.Min !== (editedData as any).Min) {
                                    changes.original.push(`Min: ${originalData.Min}`);
                                    changes.edited.push(`Min: ${(editedData as any).Min}`);
                                    hasChanges = true;
                                  }
                                }
                                
                                if (originalData.Max !== undefined && editedData && typeof editedData === 'object') {
                                  if (originalData.Max !== (editedData as any).Max) {
                                    changes.original.push(`Max: ${originalData.Max}`);
                                    changes.edited.push(`Max: ${(editedData as any).Max}`);
                                    hasChanges = true;
                                  }
                                }
                                
                                return hasChanges ? {
                                  original: changes.original.join(', '),
                                  edited: changes.edited.join(', ')
                                } : null;
                              };
                              
                              const changedParts = getChangedParts();
                              
                              return changedParts ? (
                                <tr key={index} className="border-b border-border/50 bg-destructive/10">
                                  <td className="py-3 px-4 font-medium">{criterionName}</td>
                                  <td className="py-3 px-4">{changedParts.original}</td>
                                  <td className="py-3 px-4 text-destructive font-medium">{changedParts.edited}</td>
                                </tr>
                              ) : null;
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="flex justify-between items-center">
                <div>
                  {showWarning && (
                    <Button variant="outline" onClick={handleBackToEditing} className="px-8">
                      <ArrowLeft className="mr-2 w-4 h-4" />
                      BACK TO EDITING CRITERIA
                    </Button>
                  )}
                  {!showWarning && (
                    <Button variant="outline" onClick={() => navigateToScreen('upload-criteria')} className="px-8">
                      <ArrowLeft className="mr-2 w-4 h-4" />
                      Back to Upload Protocol Document
                    </Button>
                  )}
                </div>
                
                <div className="flex space-x-4">
                  {showWarning && (
                    <>
                      <Button onClick={() => navigateToScreen('dashboard')} size="lg" className="px-8 bg-destructive hover:bg-destructive/90">
                        Proceed with UPDATED criteria
                      </Button>
                      <Button onClick={() => { setEditedCriteria(originalCriteria); navigateToScreen('dashboard'); }} size="lg" className="px-8 bg-success hover:bg-success/90">
                        Proceed with ORIGINAL criteria
                      </Button>
                    </>
                  )}
                  {!showWarning && (
                    <Button onClick={handleConfirmCriteria} size="lg" className="px-12 bg-success hover:bg-success/90">
                      <Check className="mr-2 w-5 h-5" />
                      CONFIRM CRITERIA
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>;
      case 'dashboard':
        return <div className="min-h-screen bg-gradient-to-br from-background to-secondary p-8">
            <div className="max-w-7xl mx-auto">
              <div className="mb-8">
                <h1 className="text-xl font-bold text-foreground mb-2">Patient Eligibility Dashboard</h1>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                {/* KPIs Section */}
                <Card className="shadow-xl border-0">
                  <CardHeader>
                    <CardTitle className="text-xl">Summary KPIs</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="text-center p-4 bg-accent/30 rounded-xl">
                      <p className="text-sm text-muted-foreground mb-1">Total Patients</p>
                      <p className="text-3xl font-bold text-foreground">1,500</p>
                    </div>
                    <div className="text-center p-4 bg-success/10 rounded-xl border border-success/20">
                      <p className="text-sm text-muted-foreground mb-1">Eligible Patients</p>
                      <p className="text-3xl font-bold text-success">1,200</p>
                    </div>
                    <div className="text-center p-4 bg-warning/10 rounded-xl border border-warning/20">
                      <p className="text-sm text-muted-foreground mb-1">Ineligible Patients</p>
                      <p className="text-3xl font-bold text-warning">300</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Pie Chart Section */}
                <Card className="shadow-xl border-0">
                  <CardHeader>
                    <CardTitle className="text-xl">Eligibility Distribution</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col items-center">
                    <div className="relative w-48 h-48 mb-6">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                        {/* Eligible slice (80%) */}
                        <circle cx="50" cy="50" r="40" fill="none" stroke="hsl(var(--success))" strokeWidth="20" strokeDasharray="201.06 251.33" strokeDashoffset="0" />
                        {/* Ineligible slice (20%) */}
                        <circle cx="50" cy="50" r="40" fill="none" stroke="hsl(var(--warning))" strokeWidth="20" strokeDasharray="50.27 251.33" strokeDashoffset="-201.06" />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <p className="text-2xl font-bold">80%</p>
                          <p className="text-sm text-muted-foreground">Eligible</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-center space-x-6">
                      <div className="flex items-center">
                        <div className="w-4 h-4 bg-success rounded mr-2"></div>
                        <span className="text-sm">Eligible (80%)</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-4 h-4 bg-warning rounded mr-2"></div>
                        <span className="text-sm">Ineligible (20%)</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Failure Summary Preview */}
                <Card className="shadow-xl border-0">
                  <CardHeader>
                    <CardTitle className="text-xl">Failure Summary Preview</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-accent/30 rounded-lg mb-4">
                      <span className="text-sm font-medium">Most Failed Condition</span>
                      <span className="text-sm font-bold">BMI ≤ 35</span>
                    </div>
                    
                    {/* Bar chart for failed conditions */}
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-muted-foreground mb-3">Failed Conditions Distribution</h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground w-24">BMI ≤ 35</span>
                          <div className="flex-1 mx-2">
                            <div className="h-4 bg-red-500 rounded" style={{width: '100%'}}></div>
                          </div>
                          <span className="text-xs font-medium w-8">200</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground w-24">Liver ALT</span>
                          <div className="flex-1 mx-2">
                            <div className="h-4 bg-orange-500 rounded" style={{width: '15%'}}></div>
                          </div>
                          <span className="text-xs font-medium w-8">30</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground w-24">Age &gt; 75</span>
                          <div className="flex-1 mx-2">
                            <div className="h-4 bg-orange-400 rounded" style={{width: '12.5%'}}></div>
                          </div>
                          <span className="text-xs font-medium w-8">25</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground w-24">HbA1c</span>
                          <div className="flex-1 mx-2">
                            <div className="h-4 bg-yellow-500 rounded" style={{width: '7.5%'}}></div>
                          </div>
                          <span className="text-xs font-medium w-8">15</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Eligible Patients Table */}
              <Card className="shadow-xl border-0 mb-8">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-xl">Eligible Patients Details</CardTitle>
                  <Button className="bg-success hover:bg-success/90">
                    <Download className="mr-2 w-4 h-4" />
                    Download eligible.csv
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto max-h-96 overflow-y-auto">
                    <table className="w-full">
                      <thead className="sticky top-0 bg-background">
                        <tr className="border-b border-border">
                          <th className="text-left py-4 px-4 font-semibold">Patient ID</th>
                          <th className="text-left py-4 px-4 font-semibold">Gender</th>
                          <th className="text-left py-4 px-4 font-semibold">Age</th>
                          <th className="text-left py-4 px-4 font-semibold">Diagnosis</th>
                        </tr>
                      </thead>
                      <tbody>
                        {mockPatients.map((patient, index) => <tr key={index} className="border-b border-border/50 hover:bg-accent/30 transition-colors">
                            <td className="py-4 px-4 font-medium">{patient.id}</td>
                            <td className="py-4 px-4">{patient.gender}</td>
                            <td className="py-4 px-4">{patient.age}</td>
                            <td className="py-4 px-4">{patient.diagnosis}</td>
                          </tr>)}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              {/* Failure Summary Section */}
              <Card className="shadow-xl border-0 mb-8">
                <CardHeader>
                  <CardTitle className="text-2xl">Failure Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-8">
                  {/* Criteria Failure Distribution */}
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Criteria failure distribution</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-border">
                            <th className="text-left py-4 px-4 font-semibold">Condition Failed</th>
                            <th className="text-left py-4 px-4 font-semibold">Count of patients</th>
                          </tr>
                        </thead>
                        <tbody>
                          {mockFailureData.map((failure, index) => (
                            <tr key={index} className={`border border-solid transition-colors ${getFailureRowColor(failure.count)}`}>
                              <td className="py-4 px-4 font-medium">{failure.condition}</td>
                              <td className="py-4 px-4 font-bold">{failure.count}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Terminal Cases */}
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Terminal Cases: Failed Conditions</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-border">
                            <th className="text-left py-4 px-4 font-semibold">Patient ID</th>
                            <th className="text-left py-4 px-4 font-semibold">Count of criteria failed</th>
                            <th className="text-left py-4 px-4 font-semibold">Criteria Failed</th>
                          </tr>
                        </thead>
                        <tbody>
                          {mockTerminalCases.map((terminalCase, index) => (
                            <tr key={index} className="border-b border-border/50 hover:bg-accent/30 transition-colors">
                              <td className="py-4 px-4 font-medium">{terminalCase.patientId}</td>
                              <td className="py-4 px-4 font-bold">{terminalCase.failedCount}</td>
                              <td className="py-4 px-4">
                                <div className="flex flex-wrap gap-2">
                                  {terminalCase.criteriaFailed.split(', ').map((criterion, idx) => (
                                    <div 
                                      key={idx}
                                      className="px-3 py-1 bg-muted/50 border border-muted-foreground/20 rounded-full text-sm font-medium"
                                    >
                                      {criterion}
                                    </div>
                                  ))}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Download Button */}
                  <div className="pt-4">
                    <Button className="bg-destructive hover:bg-destructive/90">
                      <Download className="mr-2 w-4 h-4" />
                      Download failures.csv
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Next button to Feature Distribution */}
              <div className="flex justify-end mt-8">
                <Button onClick={() => navigateToScreen('feature-distribution')} size="lg" className="px-8">
                  Next
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>;
      case 'feature-distribution':
        return <div className="min-h-screen bg-gradient-to-br from-background to-secondary p-8">
            <div className="max-w-7xl mx-auto">
              <div className="mb-8">
                <h1 className="text-xl font-bold text-foreground mb-2">Feature Distribution for Criteria</h1>
              </div>

              {/* Explanation Section */}
              <Card className="shadow-xl border-0 mb-8">
                <CardContent className="p-6">
                  <div className="space-y-4 text-foreground">
                    <p>
                      <strong>1) Histogram chart: Feature(units) on the X-axis and Number of patients(count) on the Y-axis.</strong><br />
                      <strong>NOTE: The 'Diagnosis Distribution' chart is a bar chart consisting of feature values that follow the inclusion criteria and the values that follow the exclusion criteria.</strong>
                    </p>
                    <p>
                      <strong>2) Two ranges:</strong><br />
                      <strong>2.1) Inclusion range: The specific range of values that a feature's measurement must fall within so that the patient is included as defined in the protocol document.</strong><br />
                      <strong>2.2) Exclusion range: The specific range of values that a feature's measurement must fall within so that the patient is excluded as defined in the protocol document.</strong>
                    </p>
                    <p>
                      <strong>3) Color Key:</strong><br />
                      <strong>3.1) Inclusion range: Green color</strong><br />
                      <strong>3.2) Exclusion range: Red color</strong>
                    </p>
                    <p>
                      <strong>4) Bins: Each bin represents a specific range of a feature's values and includes the count of patients that fall within that range.</strong>
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Distribution Charts */}
              <div className="space-y-8 mb-8">
                {/* Age Distribution */}
                <Card className="shadow-xl border-0">
                  <CardHeader>
                    <CardTitle className="text-xl text-center">Age Distribution for Criteria</CardTitle>
                  </CardHeader>
                  <CardContent className="flex justify-center">
                    <div className="w-3/4">
                      <img src={ageHistogram} alt="Age Distribution" className="w-full h-auto" />
                    </div>
                  </CardContent>
                </Card>

                {/* BMI Distribution */}
                <Card className="shadow-xl border-0">
                  <CardHeader>
                    <CardTitle className="text-xl text-center">BMI Distribution for Criteria</CardTitle>
                  </CardHeader>
                  <CardContent className="flex justify-center">
                    <div className="w-3/4">
                      <img src={bmiHistogram} alt="BMI Distribution" className="w-full h-auto" />
                    </div>
                  </CardContent>
                </Card>

                {/* Diagnosis Distribution */}
                <Card className="shadow-xl border-0">
                  <CardHeader>
                    <CardTitle className="text-xl text-center">Diagnosis Distribution for Criteria</CardTitle>
                  </CardHeader>
                  <CardContent className="flex justify-center">
                    <div className="w-3/4">
                      <img src={diagnosisBarChart} alt="Diagnosis Distribution" className="w-full h-auto" />
                    </div>
                  </CardContent>
                </Card>

                {/* HbA1c Distribution */}
                <Card className="shadow-xl border-0">
                  <CardHeader>
                    <CardTitle className="text-xl text-center">HbA1c Distribution for Criteria</CardTitle>
                  </CardHeader>
                  <CardContent className="flex justify-center">
                    <div className="w-3/4">
                      <img src={hba1cHistogram} alt="HbA1c Distribution" className="w-full h-auto" />
                    </div>
                  </CardContent>
                </Card>

                {/* Liver ALT/AST Distribution */}
                <Card className="shadow-xl border-0">
                  <CardHeader>
                    <CardTitle className="text-xl text-center">Liver ALT/AST Distribution for Criteria</CardTitle>
                  </CardHeader>
                  <CardContent className="flex justify-center">
                    <div className="w-3/4">
                      <img src={liverAltAstHistogram} alt="Liver ALT/AST Distribution" className="w-full h-auto" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Back button */}
              <div className="flex justify-start">
                <Button variant="outline" onClick={() => navigateToScreen('dashboard')} className="px-8 bg-blue-600 hover:bg-blue-700 text-white">
                  <ArrowLeft className="mr-2 w-4 h-4" />
                  Back
                </Button>
              </div>
            </div>
          </div>;
      default:
        return null;
    }
  };
  return <div className="font-sans">{renderScreen()}</div>;
};
export default PatientDashboard;