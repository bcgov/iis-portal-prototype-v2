
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { CheckCircle, User, Shield, Settings, Globe, Pencil, Users, Smartphone, CreditCard, HelpCircle } from "lucide-react";
import { WizardData } from "../IntegrationWizard";

interface ReviewStepProps {
  data: WizardData;
  onEditStep?: (step: number) => void;
}

// Attribute packages for display
const ATTRIBUTE_PACKAGES = {
  name: {
    label: 'Name',
    description: 'Given name, Family name, Display name'
  },
  sendInformation: {
    label: 'Send Information',
    description: 'Name, Mailing address, Email address'
  },
  ageVerification: {
    label: 'Age Verification',
    description: 'Name, Mailing address, Email address, Date of birth'
  }
};

// All available attributes for mapping
const ALL_ATTRIBUTES = [
  { value: 'display_name', label: 'Name' },
  { value: 'given_name', label: 'Given Name' },
  { value: 'given_names', label: 'Given Names' },
  { value: 'family_name', label: 'Surname' },
  { value: 'birthdate', label: 'Date of Birth' },
  { value: 'age', label: 'Age' },
  { value: 'age_19_or_over', label: 'Age 19 Or Over' },
  { value: 'gender', label: 'Sex' },
  { value: 'email', label: 'Email Address' },
  { value: 'street_address', label: 'Street Address' },
  { value: 'locality', label: 'City/Town' },
  { value: 'region', label: 'State Or Province' },
  { value: 'postal_code', label: 'Postal Code' },
  { value: 'country', label: 'Country' },
  { value: 'address', label: 'Address (all address lines)' },
  { value: 'sub', label: 'User Identifier' },
  { value: 'identity_assurance_level', label: 'Identity Assurance Level' },
  { value: 'identity_assurance_level1', label: 'Identity Assurance Level 1' },
  { value: 'identity_assurance_level2', label: 'Identity Assurance Level 2' },
  { value: 'identity_assurance_level3', label: 'Identity Assurance Level 3' },
  { value: 'identification_level', label: 'Identification Level' },
  { value: 'user_type', label: 'User Type' },
  { value: 'transaction_identifier', label: 'Transaction Identifier' },
  { value: 'transaction_type', label: 'Transaction Type' },
  { value: 'client_id', label: 'Relying Party Identifier' },
  { value: 'sector_identifier_uri', label: 'Privacy Zone Identifier' },
  { value: 'authentication_zone_identifier', label: 'Authentication Zone Identifier' },
  { value: 'authoritative_party_identifier', label: 'Authoritative Party Identifier' },
  { value: 'authoritative_party_name', label: 'Authoritative Party Name' }
];

const ReviewStep = ({ data, onEditStep }: ReviewStepProps) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-2xl font-semibold text-foreground">Review and submit integration</h3>
        <p className="text-muted-foreground">Review your configuration below and submit to complete the setup</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2 text-base">
                <User className="h-5 w-5 text-primary" />
                <span>Project Information</span>
              </CardTitle>
              {onEditStep && (
                <Button variant="ghost" size="sm" onClick={() => onEditStep(0)}>
                  <Pencil className="h-4 w-4 mr-1" />
                  Edit
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="border rounded-lg p-3">
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium">Product Name:</span> {data.projectInfo.productName}
                </div>
                <div>
                  <span className="font-medium">Ministry:</span> {data.projectInfo.ministry}
                </div>
                {data.projectInfo.privacyZone && (
                  <div>
                    <span className="font-medium">Privacy Zone:</span> {data.projectInfo.privacyZone}
                  </div>
                )}
                <div>
                  <span className="font-medium">User Types:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {data.projectInfo.userTypes.map((userType) => (
                      <Badge key={userType} variant="outline">{userType}</Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="font-medium">Product Owner:</span> {data.projectInfo.productOwnerName} ({data.projectInfo.productOwnerEmail})
                </div>
                <div>
                  <span className="font-medium">Technical Lead:</span> {data.projectInfo.technicalLeadName} ({data.projectInfo.technicalLeadEmail})
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2 text-base">
                <Shield className="h-5 w-5 text-primary" />
                <span>Technical Requirements</span>
              </CardTitle>
              {onEditStep && (
                <Button variant="ghost" size="sm" onClick={() => onEditStep(1)}>
                  <Pencil className="h-4 w-4 mr-1" />
                  Edit
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="border rounded-lg p-3">
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium">Client Protocol:</span>{' '}
                  {data.requirements.clientProtocol === 'oidc' ? 'OpenID Connect' : data.requirements.clientProtocol === 'saml' ? 'SAML' : data.requirements.clientProtocol}
                </div>
                <div>
                  <span className="font-medium">Use Case:</span>{' '}
                  {data.requirements.useCase === 'browser-login' ? 'Browser Login' : 
                   data.requirements.useCase === 'service-principal' ? 'Service Account' :
                   data.requirements.useCase === 'browser-and-service' ? 'Browser Login and Service Account' : 
                   data.requirements.useCase}
                </div>
                <div>
                  <span className="font-medium">Client Type:</span>{' '}
                  {data.requirements.clientType === 'confidential' ? 'Confidential Client' : 
                   data.requirements.clientType === 'public' ? 'Public Client' : 
                   data.requirements.clientType}
                </div>
                <div>
                  <span className="font-medium">Data Classification:</span> {data.requirements.dataClassification}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2 text-base">
                <Globe className="h-5 w-5 text-primary" />
                <span>Recommended Solutions</span>
              </CardTitle>
              {onEditStep && (
                <Button variant="ghost" size="sm" onClick={() => onEditStep(2)}>
                  <Pencil className="h-4 w-4 mr-1" />
                  Edit
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {(() => {
              // Separate logic for handling coupled credentials
              const dataClassification = data.requirements.dataClassification || "";
              const hasBCResidents = data.projectInfo.userTypes.includes("BC residents");
              const hasCanadianResidents = data.projectInfo.userTypes.includes("Canadian residents");
              const hasCoupledCredentials = hasBCResidents &&
                (dataClassification === "protected-a" || dataClassification === "protected-b" || dataClassification === "protected-c");

              // Group other user types normally
              const otherUserTypes = data.projectInfo.userTypes.filter(
                type => type !== "BC residents" && type !== "Canadian residents"
              );

              const providerGroups: Record<string, string[]> = {};

              otherUserTypes.forEach((userType) => {
                let provider = "";
                switch (userType) {
                  case "International users":
                    provider = "BCeID Basic";
                    break;
                  case "Individuals representing businesses or organizations":
                    provider = "BCeID Business";
                    break;
                  case "Government employees":
                    provider = dataClassification === "protected-b" || dataClassification === "protected-c" ? "IDIR + MFA" : "IDIR";
                    break;
                  case "Government contractors":
                    provider = dataClassification === "protected-b" || dataClassification === "protected-c" ? "IDIR + MFA" : "IDIR";
                    break;
                  case "Broader public service employees (with IDIR access)":
                    provider = dataClassification === "protected-b" || dataClassification === "protected-c" ? "IDIR + MFA" : "IDIR";
                    break;
                  default:
                    provider = "To be determined";
                }

                if (!providerGroups[provider]) {
                  providerGroups[provider] = [];
                }
                providerGroups[provider].push(userType);
              });

              // Build a consistent structure for all user types
              const userTypeGroups: Record<string, { provider: string; icon?: any; badge?: string; tooltip?: string }[]> = {};

              data.projectInfo.userTypes.forEach((userType) => {
                if (!userTypeGroups[userType]) {
                  userTypeGroups[userType] = [];
                }

                switch (userType) {
                  case "BC residents":
                    if (dataClassification === "public") {
                      userTypeGroups[userType].push({ provider: "BCeID Basic" });
                    } else if (dataClassification === "protected-a" || dataClassification === "protected-b" || dataClassification === "protected-c") {
                      userTypeGroups[userType].push({
                        provider: "Person Credential",
                        icon: Smartphone,
                        tooltip: "Modern smartphone sign-in - most users will prefer this method."
                      });
                      userTypeGroups[userType].push({
                        provider: "BC Services Card",
                        icon: CreditCard,
                        tooltip: "Available for users who prefer physical cards or need accessibility options."
                      });
                    } else {
                      userTypeGroups[userType].push({ provider: "BC Services Card" });
                    }
                    break;
                  case "Canadian residents":
                    if (dataClassification === "public" || dataClassification === "protected-a") {
                      userTypeGroups[userType].push({ provider: "BCeID Basic" });
                    } else {
                      userTypeGroups[userType].push({ provider: "BC Services Card" });
                    }
                    break;
                  case "International users":
                    userTypeGroups[userType].push({ provider: "BCeID Basic" });
                    break;
                  case "Individuals representing businesses or organizations":
                    userTypeGroups[userType].push({ provider: "BCeID Business" });
                    break;
                  case "Government employees":
                    if (dataClassification === "protected-b" || dataClassification === "protected-c") {
                      userTypeGroups[userType].push({ provider: "IDIR + MFA" });
                    } else {
                      userTypeGroups[userType].push({ provider: "IDIR" });
                    }
                    break;
                  case "Government contractors":
                    if (dataClassification === "protected-b" || dataClassification === "protected-c") {
                      userTypeGroups[userType].push({ provider: "IDIR + MFA" });
                    } else {
                      userTypeGroups[userType].push({ provider: "IDIR" });
                    }
                    break;
                  case "Broader public service employees (with IDIR access)":
                    if (dataClassification === "protected-b" || dataClassification === "protected-c") {
                      userTypeGroups[userType].push({ provider: "IDIR + MFA" });
                    } else {
                      userTypeGroups[userType].push({ provider: "IDIR" });
                    }
                    break;
                }
              });

              return (
                <>
                  {Object.entries(userTypeGroups).map(([userType, providers]) => (
                    <div key={userType} className="border rounded-lg p-3">
                      <div className="font-medium mb-2">{userType}</div>
                      <div className="ml-4 space-y-2">
                        {providers.map((item, idx) => {
                          const Icon = item.icon;
                          const isLast = idx === providers.length - 1;

                          return (
                            <div key={idx} className={!isLast ? "pb-2 border-b border-border" : ""}>
                              <div className="flex items-center gap-2">
                                {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
                                <div className="font-medium text-sm">{item.provider}</div>
                                {item.tooltip && (
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <HelpCircle className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                                      </TooltipTrigger>
                                      <TooltipContent className="max-w-xs">
                                        <p className="text-sm">{item.tooltip}</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </>
              );
            })()}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2 text-base">
                <Settings className="h-5 w-5 text-primary" />
                <span>Configuration</span>
              </CardTitle>
              {onEditStep && (
                <Button variant="ghost" size="sm" onClick={() => onEditStep(3)}>
                  <Pencil className="h-4 w-4 mr-1" />
                  Edit
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {(() => {
              // Check if we have coupled credentials
              const dataClassification = data.requirements.dataClassification || "";
              const hasBCResidents = data.projectInfo.userTypes.includes("BC residents");
              const hasCoupledCredentials = hasBCResidents &&
                (dataClassification === "protected-a" || dataClassification === "protected-b" || dataClassification === "protected-c");

              const selectedEnvironments = [
                data.configuration.development && 'Development',
                data.configuration.test && 'Test',
                data.configuration.production && 'Production'
              ].filter(Boolean).join(', ');

              // Check which IDPs were recommended
              const recommendedIDPs = data.solution.components || [];
              const hasBCSC = recommendedIDPs.some(c => c.toLowerCase().includes('bc services card') || c.toLowerCase().includes('bcsc'));
              const hasPersonCredential = recommendedIDPs.some(c => c.toLowerCase().includes('person credential'));

              // Single configuration display for all cases
              return (
                <>
                  <div className="border rounded-lg p-3">
                    <h4 className="font-medium mb-2">{data.projectInfo.productName || 'Product'}</h4>
                    <div className="space-y-1 text-sm">
                      <div>
                        <span className="font-medium">Environments:</span> {selectedEnvironments}
                      </div>
                      {data.configuration.development && (
                        <div>
                          <span className="font-medium">Dev App:</span> {data.configuration.developmentConfig?.applicationName}
                        </div>
                      )}
                      {data.configuration.test && (
                        <div>
                          <span className="font-medium">Test App:</span> {data.configuration.testConfig?.applicationName}
                        </div>
                      )}
                      {data.configuration.production && (
                        <div>
                          <span className="font-medium">Prod App:</span> {data.configuration.productionConfig?.applicationName}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Attribute Selection Display */}
                  {(hasBCSC || hasPersonCredential) && (
                    <>
                      <Separator className="my-3" />
                      <div className="border rounded-lg p-3">
                        <h4 className="font-medium mb-2">
                          {hasPersonCredential ? "BC Services Card & Person Credential" : "BC Services Card"}
                        </h4>
                        <div className="space-y-2 text-sm">
                          {data.configuration.attributePackage && !data.configuration.selectedCustomAttributes?.length && (
                            // Scenario 1: Package only
                            <>
                              <div>
                                <span className="font-medium">Attribute Package:</span>{' '}
                                {ATTRIBUTE_PACKAGES[data.configuration.attributePackage as keyof typeof ATTRIBUTE_PACKAGES]?.label}
                              </div>
                              <div className="text-muted-foreground">
                                Included attributes: {ATTRIBUTE_PACKAGES[data.configuration.attributePackage as keyof typeof ATTRIBUTE_PACKAGES]?.description}
                              </div>
                            </>
                          )}

                          {!data.configuration.attributePackage && data.configuration.selectedCustomAttributes && data.configuration.selectedCustomAttributes.length > 0 && (
                            // Scenario 2: Custom attributes only
                            <>
                              <div className="font-medium mb-1">Custom Attributes Selected:</div>
                              <ul className="list-disc list-inside space-y-0.5 text-muted-foreground">
                                {data.configuration.selectedCustomAttributes.slice(0, 7).map((attrValue) => {
                                  const attr = ALL_ATTRIBUTES.find(a => a.value === attrValue);
                                  return (
                                    <li key={attrValue}>{attr?.label || attrValue}</li>
                                  );
                                })}
                                {data.configuration.selectedCustomAttributes.length > 7 && (
                                  <li className="text-xs">and {data.configuration.selectedCustomAttributes.length - 7} more...</li>
                                )}
                              </ul>
                            </>
                          )}

                          {data.configuration.attributePackage && data.configuration.selectedCustomAttributes && data.configuration.selectedCustomAttributes.length > 0 && (
                            // Scenario 3: Both package and custom attributes
                            <>
                              <div>
                                <span className="font-medium">Base Package:</span>{' '}
                                {ATTRIBUTE_PACKAGES[data.configuration.attributePackage as keyof typeof ATTRIBUTE_PACKAGES]?.label}
                              </div>
                              <div className="font-medium mt-2">Additional Attributes:</div>
                              <ul className="list-disc list-inside space-y-0.5 text-muted-foreground">
                                {data.configuration.selectedCustomAttributes.slice(0, 5).map((attrValue) => {
                                  const attr = ALL_ATTRIBUTES.find(a => a.value === attrValue);
                                  return (
                                    <li key={attrValue}>{attr?.label || attrValue}</li>
                                  );
                                })}
                                {data.configuration.selectedCustomAttributes.length > 5 && (
                                  <li className="text-xs">and {data.configuration.selectedCustomAttributes.length - 5} more...</li>
                                )}
                              </ul>
                            </>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </>
              );
            })()}
          </CardContent>
        </Card>
      </div>

      <Separator />

      <Card className="border-accent/20 bg-accent/5">
        <CardHeader>
          <CardTitle className="text-primary">Next Steps</CardTitle>
          <CardDescription>
            After submission, you'll receive implementation documentation and credentials
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>Integration request will be processed automatically</span>
            </li>
            <li className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>Development credentials will be generated</span>
            </li>
            <li className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>Implementation guide will be emailed to technical contact</span>
            </li>
            <li className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>Testing environment will be provisioned within 24 hours</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReviewStep;
