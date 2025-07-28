import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, ArrowRight, Upload, Check, Download, FileText, Database } from 'lucide-react';

type Screen = 'start' | 'upload-csv' | 'upload-criteria' | 'review-criteria' | 'dashboard';

const PatientDashboard = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('start');
  const [csvUploaded, setCsvUploaded] = useState(false);
  const [criteriaUploaded, setCriteriaUploaded] = useState(false);

  const navigateToScreen = (screen: Screen) => {
    setCurrentScreen(screen);
  };

  // Mock data for the dashboard
  const mockPatients = [
    { id: 'P001', name: 'John Smith', age: 65, diagnosis: 'Hypertension', reason: 'Age > 60, Diagnosis match' },
    { id: 'P002', name: 'Sarah Johnson', age: 72, diagnosis: 'Diabetes', reason: 'Age > 60, Medication: Aspirin' },
    { id: 'P003', name: 'Michael Brown', age: 58, diagnosis: 'Hypertension', reason: 'Diagnosis match, Medication: Aspirin' },
    { id: 'P004', name: 'Emily Davis', age: 67, diagnosis: 'Hypertension', reason: 'Age > 60, Diagnosis match' },
    { id: 'P005', name: 'Robert Wilson', age: 74, diagnosis: 'Diabetes', reason: 'Age > 60, Medication: Aspirin' },
    { id: 'P006', name: 'Lisa Anderson', age: 63, diagnosis: 'Hypertension', reason: 'Age > 60, Diagnosis match' },
    { id: 'P007', name: 'David Miller', age: 69, diagnosis: 'Diabetes', reason: 'Age > 60, Medication: Aspirin' },
  ];

  const mockCriteria = [
    { name: 'Age', value: '> 60', type: 'Number' },
    { name: 'Diagnosis', value: 'Hypertension', type: 'Text' },
    { name: 'Medication', value: 'Aspirin', type: 'Text' },
    { name: 'Last Visit', value: '< 6 months', type: 'Date' },
    { name: 'Blood Pressure', value: '> 140/90', type: 'Number' },
  ];

  const renderScreen = () => {
    switch (currentScreen) {
      case 'start':
        return (
          <div className="min-h-screen bg-gradient-to-br from-background to-secondary flex items-center justify-center p-8">
            <Card className="w-full max-w-2xl shadow-2xl border-0 bg-card/95 backdrop-blur">
              <CardHeader className="text-center pb-8">
                <div className="mx-auto mb-6 w-20 h-20 bg-gradient-to-br from-primary to-primary-hover rounded-2xl flex items-center justify-center">
                  <Database className="w-10 h-10 text-primary-foreground" />
                </div>
                <CardTitle className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary-hover bg-clip-text text-transparent">
                  Patient Filtering Tool
                </CardTitle>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  Upload your data and criteria to identify eligible patients with our advanced filtering system
                </p>
              </CardHeader>
              <CardContent className="text-center">
                <Button 
                  onClick={() => navigateToScreen('upload-csv')}
                  size="lg"
                  className="px-12 py-6 text-lg font-semibold bg-gradient-to-r from-primary to-primary-hover hover:from-primary-hover hover:to-primary shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  Get Started
                  <ArrowRight className="ml-3 w-5 h-5" />
                </Button>
              </CardContent>
            </Card>
          </div>
        );

      case 'upload-csv':
        return (
          <div className="min-h-screen bg-gradient-to-br from-background to-secondary p-8">
            <div className="max-w-4xl mx-auto">
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-foreground mb-2">Step 1: Upload Patient Data</h1>
                <p className="text-muted-foreground">Please upload your patient data as a .CSV file to begin the filtering process.</p>
              </div>
              
              <Card className="shadow-xl border-0">
                <CardContent className="p-12">
                  <div className="text-center">
                    <div className="mx-auto mb-8 w-24 h-24 bg-gradient-to-br from-secondary to-accent rounded-full flex items-center justify-center">
                      <FileText className="w-12 h-12 text-primary" />
                    </div>
                    
                    <div className="mb-8 p-8 border-2 border-dashed border-border rounded-xl bg-accent/30 hover:bg-accent/50 transition-colors cursor-pointer"
                         onClick={() => setCsvUploaded(true)}>
                      <Upload className="mx-auto w-8 h-8 text-muted-foreground mb-4" />
                      <Button variant="outline" size="lg" className="mb-4">
                        Upload CSV File
                      </Button>
                      <p className="text-sm text-muted-foreground">
                        {csvUploaded ? 'patient_data.csv' : 'No file chosen'}
                      </p>
                    </div>

                    <div className="flex justify-between">
                      <Button 
                        variant="outline" 
                        onClick={() => navigateToScreen('start')}
                        className="px-8"
                      >
                        <ArrowLeft className="mr-2 w-4 h-4" />
                        Back
                      </Button>
                      <Button 
                        onClick={() => navigateToScreen('upload-criteria')}
                        disabled={!csvUploaded}
                        className="px-8"
                      >
                        Next
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case 'upload-criteria':
        return (
          <div className="min-h-screen bg-gradient-to-br from-background to-secondary p-8">
            <div className="max-w-4xl mx-auto">
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-foreground mb-2">Step 2: Upload Filtering Criteria</h1>
                <p className="text-muted-foreground">Please upload your filtering criteria as a .TXT file to define patient eligibility.</p>
              </div>
              
              <Card className="shadow-xl border-0">
                <CardContent className="p-12">
                  <div className="text-center">
                    <div className="mx-auto mb-8 w-24 h-24 bg-gradient-to-br from-secondary to-accent rounded-full flex items-center justify-center">
                      <FileText className="w-12 h-12 text-primary" />
                    </div>
                    
                    <div className="mb-8 p-8 border-2 border-dashed border-border rounded-xl bg-accent/30 hover:bg-accent/50 transition-colors cursor-pointer"
                         onClick={() => setCriteriaUploaded(true)}>
                      <Upload className="mx-auto w-8 h-8 text-muted-foreground mb-4" />
                      <Button variant="outline" size="lg" className="mb-4">
                        Upload Criteria File
                      </Button>
                      <p className="text-sm text-muted-foreground">
                        {criteriaUploaded ? 'filtering_criteria.txt' : 'No file chosen'}
                      </p>
                    </div>

                    <div className="flex justify-between">
                      <Button 
                        variant="outline" 
                        onClick={() => navigateToScreen('upload-csv')}
                        className="px-8"
                      >
                        <ArrowLeft className="mr-2 w-4 h-4" />
                        Back
                      </Button>
                      <Button 
                        onClick={() => navigateToScreen('review-criteria')}
                        disabled={!criteriaUploaded}
                        className="px-8"
                      >
                        Next
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case 'review-criteria':
        return (
          <div className="min-h-screen bg-gradient-to-br from-background to-secondary p-8">
            <div className="max-w-6xl mx-auto">
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-foreground mb-2">Step 3: Review Extracted Criteria</h1>
                <p className="text-muted-foreground">Please review the extracted criteria below. Confirm if they are correct.</p>
              </div>
              
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
                          <th className="text-left py-4 px-4 font-semibold">Data Type</th>
                        </tr>
                      </thead>
                      <tbody>
                        {mockCriteria.map((criterion, index) => (
                          <tr key={index} className="border-b border-border/50 hover:bg-accent/30 transition-colors">
                            <td className="py-4 px-4 font-medium">{criterion.name}</td>
                            <td className="py-4 px-4">{criterion.value}</td>
                            <td className="py-4 px-4">
                              <span className="px-3 py-1 bg-secondary rounded-full text-sm font-medium">
                                {criterion.type}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-between">
                <Button 
                  variant="outline" 
                  onClick={() => navigateToScreen('upload-criteria')}
                  className="px-8"
                >
                  <ArrowLeft className="mr-2 w-4 h-4" />
                  Back
                </Button>
                <Button 
                  onClick={() => navigateToScreen('dashboard')}
                  size="lg"
                  className="px-12 bg-success hover:bg-success/90"
                >
                  <Check className="mr-2 w-5 h-5" />
                  CONFIRM CRITERIA
                </Button>
              </div>
            </div>
          </div>
        );

      case 'dashboard':
        return (
          <div className="min-h-screen bg-gradient-to-br from-background to-secondary p-8">
            <div className="max-w-7xl mx-auto">
              <div className="mb-8">
                <h1 className="text-4xl font-bold text-foreground mb-2">Patient Eligibility Dashboard</h1>
                <p className="text-muted-foreground text-lg">Comprehensive overview of patient filtering results</p>
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
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          fill="none"
                          stroke="hsl(var(--success))"
                          strokeWidth="20"
                          strokeDasharray="201.06 251.33"
                          strokeDashoffset="0"
                        />
                        {/* Ineligible slice (20%) */}
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          fill="none"
                          stroke="hsl(var(--warning))"
                          strokeWidth="20"
                          strokeDasharray="50.27 251.33"
                          strokeDashoffset="-201.06"
                        />
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

                {/* Additional metrics */}
                <Card className="shadow-xl border-0">
                  <CardHeader>
                    <CardTitle className="text-xl">Processing Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-accent/30 rounded-lg">
                      <span className="text-sm font-medium">Processing Time</span>
                      <span className="text-sm font-bold">2.3 seconds</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-accent/30 rounded-lg">
                      <span className="text-sm font-medium">Criteria Applied</span>
                      <span className="text-sm font-bold">5 filters</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-accent/30 rounded-lg">
                      <span className="text-sm font-medium">Match Rate</span>
                      <span className="text-sm font-bold">80.0%</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Eligible Patients Table */}
              <Card className="shadow-xl border-0">
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
                          <th className="text-left py-4 px-4 font-semibold">Name</th>
                          <th className="text-left py-4 px-4 font-semibold">Age</th>
                          <th className="text-left py-4 px-4 font-semibold">Diagnosis</th>
                          <th className="text-left py-4 px-4 font-semibold">Eligibility Reason</th>
                        </tr>
                      </thead>
                      <tbody>
                        {mockPatients.map((patient, index) => (
                          <tr key={index} className="border-b border-border/50 hover:bg-accent/30 transition-colors">
                            <td className="py-4 px-4 font-medium">{patient.id}</td>
                            <td className="py-4 px-4">{patient.name}</td>
                            <td className="py-4 px-4">{patient.age}</td>
                            <td className="py-4 px-4">{patient.diagnosis}</td>
                            <td className="py-4 px-4 text-sm text-muted-foreground">{patient.reason}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return <div className="font-sans">{renderScreen()}</div>;
};

export default PatientDashboard;