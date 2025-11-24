import BCHeader from "@/components/BCHeader";
import IntegrationWizard from "@/components/IntegrationWizard";
import { useParams } from "react-router-dom";
import { Breadcrumbs } from "@/components/Breadcrumbs";

const EditIntegration = () => {
  const { id } = useParams();

  // Load integration data from localStorage
  const loadExistingData = () => {
    const storedIntegrations = JSON.parse(localStorage.getItem('iis-integrations') || '[]');
    const submittedIntegration = storedIntegrations.find((int: any) => int.id === id);

    if (submittedIntegration) {
      // Return the actual wizard data structure
      return {
        projectInfo: submittedIntegration.projectInfo,
        requirements: submittedIntegration.requirements,
        solution: submittedIntegration.solution,
        configuration: submittedIntegration.configuration
      };
    }

    // Fallback to mock data if not found
    return {
      projectInfo: {
        productName: "Citizen Services Portal",
        productDescription: "A comprehensive portal for citizens to access government services",
        ministry: "Citizens' Services",
        userCategory: "external",
        userTypes: ["BC residents", "Canadian residents"],
        privacyZone: "Citizens' Services (Citizen)",
        productOwnerName: "Jane Smith",
        productOwnerEmail: "jane.smith@gov.bc.ca",
        technicalLeadName: "John Doe",
        technicalLeadEmail: "john.doe@gov.bc.ca",
        description: "A comprehensive portal for citizens to access government services",
        sponsor: "Jane Smith",
        technicalContact: "John Doe",
        timeline: "Q2 2024",
        environments: ["Development", "Test", "Production"]
      },
      requirements: {
        clientProtocol: "oidc",
        useCase: "browser-login",
        clientType: "confidential",
        dataClassification: "protected-b",
        requiredAttributes: ["Basic identity"],
        customAttributes: "",
        environments: ["Development", "Test", "Production"],
        additionalRequirements: "",
        primaryPurpose: "Public service access",
        userBase: ["Citizens"],
        dataSensitivity: "Protected B",
        specialRequirements: [],
        assuranceLevel: "2"
      },
      solution: {
        recommended: "BC Services Card + Single Companion Credential",
        components: ["BC Services Card", "Single Companion Credential"],
        reasoning: "Based on your requirements for BC residents and Protected B data classification"
      },
      configuration: {
        development: true,
        test: true,
        production: true,
        developmentConfig: {
          applicationName: "Citizen Services Portal - Dev",
          redirectUris: "https://dev.example.com/callback",
          additionalNotes: ""
        },
        testConfig: {
          applicationName: "Citizen Services Portal - Test",
          redirectUris: "https://test.example.com/callback",
          additionalNotes: ""
        },
        productionConfig: {
          applicationName: "Citizen Services Portal - Prod",
          redirectUris: "https://example.com/callback",
          additionalNotes: "",
          goLiveDate: new Date("2024-06-15"),
          businessApprovalContact: "jane.smith@gov.bc.ca"
        }
      }
    };
  };

  const existingData = loadExistingData();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <BCHeader />
      <main className="container mx-auto px-4 py-8">
        <Breadcrumbs
          items={[
            { label: 'Dashboard', path: '/client' },
            { label: existingData.projectInfo.productName, path: `/client/integrations/${id}` },
            { label: 'Edit' }
          ]}
        />
        <IntegrationWizard isEditMode={true} initialData={existingData} integrationId={id} initialStep={4} />
      </main>
    </div>
  );
};

export default EditIntegration;
