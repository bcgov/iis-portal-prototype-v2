
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import ProjectInfoIntakeForm from "./wizard/ProjectInfoIntakeForm";
import TechnicalRequirementsForm from "./wizard/TechnicalRequirementsForm";
import SolutionStep from "./wizard/SolutionStep";

import ConfigurationStep from "./wizard/ConfigurationStep";
import ReviewStep from "./wizard/ReviewStep";
import InternalOnlyOffRamp from "./wizard/InternalOnlyOffRamp";

export interface WizardData {
  projectInfo: {
    productName: string;
    productDescription: string;
    ministry: string;
    userCategory: string;
    userTypes: string[];
    privacyZone?: string;
    productOwnerName: string;
    productOwnerEmail: string;
    technicalLeadName: string;
    technicalLeadEmail: string;
    // Legacy fields for compatibility with other steps
    description: string;
    sponsor: string;
    technicalContact: string;
    timeline: string;
    environments: string[];
  };
  requirements: {
    clientProtocol: string;
    useCase: string;
    clientType: string;
    dataClassification: string;
    requiredAttributes: string[];
    customAttributes: string;
    environments: string[];
    additionalRequirements: string;
    // Legacy fields for compatibility with other steps
    primaryPurpose: string;
    userBase: string[];
    dataSensitivity: string;
    specialRequirements: string[];
    assuranceLevel: string; // Keep for compatibility
  };
  solution: {
    recommended: string;
    components: string[];
    reasoning: string;
  };
  configuration: {
    development: boolean;
    test: boolean;
    production: boolean;
    developmentConfig: {
      applicationName: string;
      redirectUris: string;
      additionalNotes: string;
    };
    testConfig: {
      applicationName: string;
      redirectUris: string;
      additionalNotes: string;
    };
    productionConfig: {
      applicationName: string;
      redirectUris: string;
      additionalNotes: string;
      goLiveDate?: Date;
      businessApprovalContact?: string;
    };
    lastSaved?: Date;
  };
}

interface IntegrationWizardProps {
  isEditMode?: boolean;
  initialData?: WizardData;
  integrationId?: string;
  initialStep?: number;
}

const IntegrationWizard = ({ isEditMode = false, initialData, integrationId, initialStep = 0 }: IntegrationWizardProps = {}) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [data, setData] = useState<WizardData>(initialData || {
    projectInfo: {
      productName: "",
      productDescription: "",
      ministry: "",
      userCategory: "",
      userTypes: [],
      productOwnerName: "",
      productOwnerEmail: "",
      technicalLeadName: "",
      technicalLeadEmail: "",
      // Legacy fields for compatibility
      description: "",
      sponsor: "",
      technicalContact: "",
      timeline: "",
      environments: []
    },
    requirements: {
      clientProtocol: "",
      useCase: "",
      clientType: "",
      dataClassification: "",
      requiredAttributes: [],
      customAttributes: "",
      environments: [],
      additionalRequirements: "",
      // Legacy fields for compatibility
      primaryPurpose: "",
      userBase: [],
      dataSensitivity: "",
      specialRequirements: [],
      assuranceLevel: "" // Keep for compatibility
    },
    solution: {
      recommended: "",
      components: [],
      reasoning: ""
    },
    configuration: {
      development: true,
      test: false,
      production: false,
      developmentConfig: {
        applicationName: "",
        redirectUris: "",
        additionalNotes: ""
      },
      testConfig: {
        applicationName: "",
        redirectUris: "",
        additionalNotes: ""
      },
      productionConfig: {
        applicationName: "",
        redirectUris: "",
        additionalNotes: ""
      },
      lastSaved: undefined
    }
  });

  const steps = [
    {
      title: "Project Information",
      description: "Service details and team information"
    },
    {
      title: "Requirements",
      description: "Define your identity needs"
    },
    {
      title: "Solution",
      description: "Review our recommendation"
    },
    {
      title: "Configuration",
      description: "Attributes and environment setup"
    },
    {
      title: "Review",
      description: "Confirm and submit"
    }
  ];

  // Warn user about unsaved changes before leaving
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  const getProgressValue = () => {
    return (currentStep / (steps.length - 1)) * 100;
  };

  const updateData = (section: keyof WizardData, updates: any) => {
    setData(prev => ({
      ...prev,
      [section]: { ...prev[section], ...updates }
    }));
    setHasUnsavedChanges(true);
  };

  const nextStep = () => {
    // Check if user selected "Internal Only" and redirect to off-ramp
    if (currentStep === 0 && data.projectInfo.userCategory === "internal") {
      setCurrentStep(5); // Jump to off-ramp step
      return;
    }
    
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return data.projectInfo.productName && 
               data.projectInfo.productDescription && 
               data.projectInfo.ministry && 
               data.projectInfo.userCategory &&
               data.projectInfo.userTypes.length > 0 && 
               data.projectInfo.productOwnerName && 
               data.projectInfo.productOwnerEmail && 
               data.projectInfo.technicalLeadName && 
               data.projectInfo.technicalLeadEmail;
      case 1:
        return data.requirements.clientProtocol && data.requirements.useCase && data.requirements.clientType && data.requirements.dataClassification;
      case 2:
        return data.solution.recommended;
      case 3:
        // For configuration step, we need at least one environment selected
        return data.configuration.development || data.configuration.test || data.configuration.production;
      case 4:
        return true;
      default:
        return true;
    }
  };

  const handleSubmit = () => {
    console.log(isEditMode ? "Integration updated:" : "Integration submitted:", data);
    setHasUnsavedChanges(false);
    
    toast({
      title: isEditMode ? "Changes saved" : "Integration submitted",
      description: isEditMode 
        ? "Your integration has been updated successfully." 
        : "Your integration request has been submitted for review.",
    });
    
    navigate('/client');
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <ProjectInfoIntakeForm
            data={data.projectInfo}
            onUpdate={(updates) => updateData('projectInfo', updates)}
            onNext={nextStep}
            onSaveAndClose={() => navigate('/client')}
            currentStep={currentStep + 1}
            totalSteps={steps.length}
            progressValue={getProgressValue()}
            steps={steps}
          />
        );
      case 1:
        return (
          <TechnicalRequirementsForm
            data={data.requirements}
            onUpdate={(updates) => updateData('requirements', updates)}
            onNext={nextStep}
            onBack={prevStep}
            onSaveAndClose={() => navigate('/client')}
            currentStep={currentStep + 1}
            totalSteps={steps.length}
            progressValue={getProgressValue()}
            steps={steps}
            userCategory={data.projectInfo.userCategory}
            userTypes={data.projectInfo.userTypes}
          />
        );
      case 2:
        return (
          <SolutionStep
            data={data}
            onUpdate={(updates) => updateData('solution', updates)}
          />
        );
      case 3:
        return (
          <ConfigurationStep
            data={data}
            onUpdate={(updates) => updateData('configuration', updates)}
            onUpdateRequirements={(updates) => updateData('requirements', updates)}
          />
        );
      case 4:
        return (
          <ReviewStep data={data} onEditStep={setCurrentStep} />
        );
      case 5:
        return (
          <InternalOnlyOffRamp
            data={data.projectInfo}
            onBack={() => setCurrentStep(0)}
            onSubmit={handleSubmit}
            progressValue={100}
            currentStep={5}
            totalSteps={5}
          />
        );
      default:
        return null;
    }
  };

  // For steps 0, 1, and 5 (off-ramp), render the forms directly without the card wrapper
  if (currentStep === 0 || currentStep === 1 || currentStep === 5) {
    return renderStep();
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="bc-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">
                {isEditMode ? "Edit Integration" : "New Integration"}
              </CardTitle>
              <CardDescription>
                Step {currentStep + 1} of {steps.length}: {steps[currentStep].description}
              </CardDescription>
            </div>
            <Button variant="outline" onClick={() => navigate('/client')}>
              Cancel
            </Button>
          </div>
          <div className="mt-6">
            <Progress value={getProgressValue()} className="w-full" />
            <div className="flex justify-between mt-4">
              {steps.map((step, index) => (
                <div key={index} className="flex flex-col items-center">
                  <button
                    onClick={() => setCurrentStep(index)}
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium mb-2 transition-colors ${
                      index < currentStep
                        ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                        : index === currentStep
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }`}
                  >
                    {index + 1}
                  </button>
                  <div
                    className={`text-xs text-center max-w-20 ${
                      index <= currentStep ? 'text-primary font-medium' : 'text-muted-foreground'
                    }`}
                  >
                    {step.title}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-8">
          {renderStep()}
        </CardContent>
        <div className="flex justify-between p-6 border-t">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 0}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>
          
          {currentStep === steps.length - 1 ? (
            <Button onClick={handleSubmit} className="bg-primary hover:bg-primary/90">
              {isEditMode ? "Save Changes" : "Submit Integration"}
            </Button>
          ) : (
            <Button
              onClick={nextStep}
              disabled={!canProceed()}
              className="bg-primary hover:bg-primary/90"
            >
              Next
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
};

export default IntegrationWizard;
