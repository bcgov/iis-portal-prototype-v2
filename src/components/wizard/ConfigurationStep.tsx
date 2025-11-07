
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, ChevronDown, Info, Save, Check, AlertTriangle, Smartphone, CreditCard, HelpCircle, X } from "lucide-react";
import { WizardData } from "../IntegrationWizard";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface EnvironmentConfig {
  applicationName: string;
  redirectUris: string;
  additionalNotes: string;
  goLiveDate?: Date;
  businessApprovalContact?: string;
}

interface ConfigurationData {
  development: boolean;
  test: boolean;
  production: boolean;
  developmentConfig: EnvironmentConfig;
  testConfig: EnvironmentConfig;
  productionConfig: EnvironmentConfig;
  lastSaved?: Date;
}

interface ConfigurationStepProps {
  data: WizardData;
  onUpdate: (data: Partial<ConfigurationData>) => void;
  onUpdateRequirements?: (data: { requiredAttributes: string[] }) => void;
}

// Attribute packages
const ATTRIBUTE_PACKAGES = {
  name: {
    id: 'name',
    label: 'Name',
    description: 'Includes: Given name, family name, display name',
    attributes: ['display_name', 'given_name', 'family_name']
  },
  sendInformation: {
    id: 'sendInformation',
    label: 'Send Information',
    description: 'Includes: Name, mailing address, and email address',
    attributes: ['display_name', 'given_name', 'family_name', 'email', 'street_address', 'locality', 'region', 'postal_code', 'country']
  },
  ageVerification: {
    id: 'ageVerification',
    label: 'Age Verification',
    description: 'Includes: Send information package plus date of birth',
    attributes: ['display_name', 'given_name', 'family_name', 'email', 'street_address', 'locality', 'region', 'postal_code', 'country', 'birthdate']
  }
};

// All available BC Services Card attributes
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

const ConfigurationStep = ({ data, onUpdate, onUpdateRequirements }: ConfigurationStepProps) => {
  // Initialize attribute state from data
  const [bceidOpen, setBceidOpen] = useState(false);
  const [customAttributesOpen, setCustomAttributesOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<string>('name');
  const [customAttributes, setCustomAttributes] = useState<string[]>([]);
  const [multiSelectOpen, setMultiSelectOpen] = useState(false);

  // Determine which IDPs were recommended
  const recommendedIDPs = data.solution.components || [];
  const hasBCSC = recommendedIDPs.some(c => c.toLowerCase().includes('bc services card') || c.toLowerCase().includes('bcsc'));
  const hasPersonCredential = recommendedIDPs.some(c => c.toLowerCase().includes('person credential'));
  const hasBCeID = recommendedIDPs.some(c => c.toLowerCase().includes('bceid'));
  const hasAnyIDP = hasBCSC || hasPersonCredential || hasBCeID;

  const [configData, setConfigData] = useState<ConfigurationData>(() => {
    const initialData: ConfigurationData = {
      development: true, // Pre-check development as default
      test: false,
      production: false,
      developmentConfig: {
        applicationName: `${data.projectInfo.productName || 'Product'} - Dev`,
        redirectUris: 'http://localhost:3000/auth/callback\nhttp://localhost:8080/auth/callback',
        additionalNotes: ''
      },
      testConfig: {
        applicationName: `${data.projectInfo.productName || 'Product'} - Test`,
        redirectUris: 'https://test.example.com/auth/callback',
        additionalNotes: ''
      },
      productionConfig: {
        applicationName: data.projectInfo.productName || 'Product',
        redirectUris: 'https://example.com/auth/callback',
        additionalNotes: '',
        businessApprovalContact: ''
      }
    };
    
    return initialData;
  });

  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Handle package selection
  const handlePackageChange = (packageId: string) => {
    setSelectedPackage(packageId);
    setCustomAttributes([]); // Clear custom attributes when selecting a package

    // Update requirements with package attributes
    if (onUpdateRequirements) {
      const pkg = ATTRIBUTE_PACKAGES[packageId as keyof typeof ATTRIBUTE_PACKAGES];
      if (pkg) {
        const attributeLabels = pkg.attributes.map(attr => {
          const attrObj = ALL_ATTRIBUTES.find(a => a.value === attr);
          return attrObj ? attrObj.label : attr;
        });
        onUpdateRequirements({ requiredAttributes: attributeLabels });
      }
    }

    // Persist to configuration data
    onUpdate({
      attributePackage: packageId,
      selectedCustomAttributes: []
    });
  };

  // Handle custom attribute toggle
  const handleCustomAttributeToggle = (attributeValue: string) => {
    setCustomAttributes(prev => {
      const newCustomAttrs = prev.includes(attributeValue)
        ? prev.filter(attr => attr !== attributeValue)
        : [...prev, attributeValue];

      // Update requirements with custom attributes
      if (onUpdateRequirements) {
        const attributeLabels = newCustomAttrs.map(attr => {
          const attrObj = ALL_ATTRIBUTES.find(a => a.value === attr);
          return attrObj ? attrObj.label : attr;
        });
        onUpdateRequirements({ requiredAttributes: attributeLabels });
      }

      // Persist to configuration data
      onUpdate({
        attributePackage: '',
        selectedCustomAttributes: newCustomAttrs
      });

      return newCustomAttrs;
    });
  };

  // Auto-save functionality
  useEffect(() => {
    const timer = setTimeout(() => {
      onUpdate(configData);
      setLastSaved(new Date());
    }, 1000);

    return () => clearTimeout(timer);
  }, [configData, onUpdate]);

  const updateEnvironment = (environment: 'development' | 'test' | 'production', enabled: boolean) => {
    setConfigData(prev => ({
      ...prev,
      [environment]: enabled
    }));
  };

  const updateEnvironmentConfig = (environment: 'development' | 'test' | 'production', field: keyof EnvironmentConfig, value: string | Date) => {
    const configKey = `${environment}Config` as const;
    setConfigData(prev => ({
      ...prev,
      [configKey]: {
        ...prev[configKey],
        [field]: value
      }
    }));
  };

  const environments = [
    { key: 'development', label: 'Development', description: 'For initial integration and testing' },
    { key: 'test', label: 'Test', description: 'For user acceptance testing and staging' },
    { key: 'production', label: 'Production', description: 'For live service delivery (requires additional approval)' }
  ] as const;

  return (
    <div className="space-y-8">
      {/* Configure Attributes Section */}
      <div className="space-y-6">
        <div className="space-y-2">
          <h3 className="text-xl font-semibold">Configure Attributes</h3>
          <p className="text-muted-foreground">
            Based on your selected identity providers, configure which user attributes your application needs
          </p>
        </div>

        {hasAnyIDP ? (
          <div className="space-y-4">
            {/* BC Services Card (or combined with Person Credential) */}
            {hasBCSC && (
              <Card className="border-2">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                      <CreditCard className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-lg">
                        {hasPersonCredential ? "BC Services Card & Person Credential" : "BC Services Card"}
                      </CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Explanatory text when both are present */}
                  {hasPersonCredential && (
                    <p className="text-sm text-muted-foreground">
                      Person Credential and BC Services Card share the same user attributes. Configure which attributes your application needs below.
                    </p>
                  )}

                  {/* Package Selection */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-base font-medium">Select Attribute Package</Label>
                      <p className="text-sm text-muted-foreground">
                        Choose the attribute package that best fits your application's needs. Most applications use one of these standard packages.
                      </p>
                    </div>

                    <RadioGroup value={selectedPackage} onValueChange={handlePackageChange} className="space-y-3">
                      {Object.values(ATTRIBUTE_PACKAGES).map((pkg) => (
                        <div key={pkg.id} className="flex items-start space-x-3 space-y-0">
                          <RadioGroupItem value={pkg.id} id={pkg.id} className="mt-1" />
                          <div className="flex-1">
                            <Label htmlFor={pkg.id} className="font-medium cursor-pointer">
                              {pkg.label}
                            </Label>
                            <p className="text-sm text-muted-foreground">{pkg.description}</p>
                          </div>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>

                  {/* Info box */}
                  <Alert className="border-l-4 border-l-blue-500 bg-blue-50 dark:bg-blue-950/20">
                    <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    <AlertDescription className="text-sm text-blue-900 dark:text-blue-100">
                      Selected attributes will require production approval. Timeline may vary based on complexity.
                    </AlertDescription>
                  </Alert>

                  {/* Custom Attributes Section */}
                  <Collapsible open={customAttributesOpen} onOpenChange={setCustomAttributesOpen}>
                    <CollapsibleTrigger className="flex items-center gap-2 text-sm font-medium text-primary hover:underline">
                      <ChevronDown className={`h-4 w-4 transition-transform ${customAttributesOpen ? 'rotate-180' : ''}`} />
                      Need specific attributes?
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-4">
                      <div className="space-y-3">
                        <p className="text-sm text-muted-foreground">
                          Select individual attributes for custom configuration
                        </p>

                        {/* Multi-select dropdown */}
                        <Popover open={multiSelectOpen} onOpenChange={setMultiSelectOpen}>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full justify-between"
                            >
                              <span className="text-sm">
                                {customAttributes.length > 0
                                  ? `${customAttributes.length} attribute${customAttributes.length > 1 ? 's' : ''} selected`
                                  : 'Select attributes...'}
                              </span>
                              <ChevronDown className="h-4 w-4 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-[400px] p-0" align="start">
                            <div className="max-h-[300px] overflow-y-auto">
                              <div className="sticky top-0 bg-background border-b p-2 flex gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="flex-1"
                                  onClick={() => {
                                    const allAttrValues = ALL_ATTRIBUTES.map(a => a.value);
                                    setCustomAttributes(allAttrValues);
                                    setSelectedPackage('');
                                    if (onUpdateRequirements) {
                                      onUpdateRequirements({ requiredAttributes: ALL_ATTRIBUTES.map(a => a.label) });
                                    }
                                    onUpdate({
                                      attributePackage: '',
                                      selectedCustomAttributes: allAttrValues
                                    });
                                  }}
                                >
                                  Select All
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="flex-1"
                                  onClick={() => {
                                    setCustomAttributes([]);
                                    if (onUpdateRequirements) {
                                      onUpdateRequirements({ requiredAttributes: [] });
                                    }
                                    onUpdate({
                                      attributePackage: '',
                                      selectedCustomAttributes: []
                                    });
                                  }}
                                >
                                  Clear All
                                </Button>
                              </div>
                              <div className="p-2 space-y-1">
                                {ALL_ATTRIBUTES.map((attr) => (
                                  <div
                                    key={attr.value}
                                    className="flex items-center space-x-2 p-2 rounded hover:bg-accent cursor-pointer"
                                    onClick={() => {
                                      handleCustomAttributeToggle(attr.value);
                                      setSelectedPackage(''); // Clear package selection when using custom
                                    }}
                                  >
                                    <Checkbox
                                      checked={customAttributes.includes(attr.value)}
                                      onCheckedChange={() => {
                                        handleCustomAttributeToggle(attr.value);
                                        setSelectedPackage(''); // Clear package selection when using custom
                                      }}
                                    />
                                    <Label className="flex-1 cursor-pointer text-sm">{attr.label}</Label>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </PopoverContent>
                        </Popover>

                        {customAttributes.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {customAttributes.map((attrValue) => {
                              const attr = ALL_ATTRIBUTES.find(a => a.value === attrValue);
                              return (
                                <Badge key={attrValue} variant="secondary" className="gap-1">
                                  {attr?.label}
                                  <X
                                    className="h-3 w-3 cursor-pointer"
                                    onClick={() => handleCustomAttributeToggle(attrValue)}
                                  />
                                </Badge>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                </CardContent>
              </Card>
            )}

            {/* Basic BCeID */}
            {hasBCeID && (
              <Card className="border-2">
                <Collapsible open={bceidOpen} onOpenChange={setBceidOpen}>
                  <CardHeader className="pb-3">
                    <CollapsibleTrigger className="flex items-center justify-between w-full group">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                          <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                        </div>
                        <CardTitle className="text-lg">Basic BCeID</CardTitle>
                      </div>
                      <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform ${bceidOpen ? 'rotate-180' : ''}`} />
                    </CollapsibleTrigger>
                  </CardHeader>
                  <CollapsibleContent>
                    <CardContent className="space-y-4">
                      {/* Fixed attribute */}
                      <div className="flex items-start gap-3">
                        <Checkbox checked disabled className="mt-1" />
                        <div className="flex-1">
                          <div className="font-medium">Basic identity only</div>
                          <div className="text-sm text-muted-foreground">
                            → Username, Email (if provided by user)
                          </div>
                        </div>
                      </div>

                      {/* Info box */}
                      <Alert className="border-l-4 border-l-blue-500 bg-blue-50 dark:bg-blue-950/20">
                        <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        <AlertDescription className="text-sm text-blue-900 dark:text-blue-100">
                          BCeID Basic has limited attribute support. Your application must collect any additional required data directly from users.
                        </AlertDescription>
                      </Alert>
                    </CardContent>
                  </CollapsibleContent>
                </Collapsible>
              </Card>
            )}
          </div>
        ) : (
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              No attribute configuration needed. Your selected identity providers use fixed attribute sets.
            </AlertDescription>
          </Alert>
        )}
      </div>

      {/* Environment Configuration Section */}
      <div className="space-y-6">
        <div className="space-y-2">
          <h3 className="text-xl font-semibold">Environment Selection</h3>
          <p className="text-muted-foreground">
            Configure access for each environment where users will authenticate
          </p>
        </div>

        {/* Show identity providers that will be configured */}
        <div className="flex flex-wrap gap-2">
          {data.solution.components.map((provider) => (
            <span key={provider} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
              {provider}
            </span>
          ))}
        </div>
      </div>

      {/* Environment Matrix - Single table for all IDPs */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Environment Selection</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium">Product</th>
                  <th className="text-center py-3 px-4 font-medium">Development</th>
                  <th className="text-center py-3 px-4 font-medium">Test</th>
                  <th className="text-center py-3 px-4 font-medium">Production</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b hover:bg-muted/50">
                  <td className="py-4 px-4 font-medium">{data.projectInfo.productName || 'Product'}</td>
                  {environments.map(({ key }) => (
                    <td key={key} className="py-4 px-4 text-center">
                      <Checkbox
                        checked={configData[key] || false}
                        onCheckedChange={(checked) => updateEnvironment(key, !!checked)}
                      />
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Configuration Details */}
      <div className="space-y-4">
        {environments.map(({ key, label, description }) => {
          const isEnabled = configData[key];
          const configKey = `${key}Config` as const;
          const config = configData[configKey];
          
          if (!isEnabled) return null;

          return (
            <Card key={key}>
              <Collapsible defaultOpen>
                <CollapsibleTrigger className="w-full">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="text-left">
                        <CardTitle className="text-base">
                          {data.projectInfo.productName || 'Product'} - {label} Environment
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">{description}</p>
                      </div>
                      <ChevronDown className="h-4 w-4" />
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Application Name</Label>
                      <Input
                        value={config?.applicationName || ''}
                        onChange={(e) => updateEnvironmentConfig(key, 'applicationName', e.target.value)}
                        placeholder={`${data.projectInfo.productName || 'Product'} - ${label}`}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Redirect URIs</Label>
                      <Textarea
                        value={config?.redirectUris || ''}
                        onChange={(e) => updateEnvironmentConfig(key, 'redirectUris', e.target.value)}
                        placeholder={
                          key === 'development' 
                            ? 'http://localhost:3000/auth/callback\nhttp://localhost:8080/auth/callback'
                            : key === 'test'
                            ? 'https://test.example.com/auth/callback'
                            : 'https://example.com/auth/callback'
                        }
                        rows={3}
                        className="font-mono text-sm"
                      />
                      <p className="text-xs text-muted-foreground">
                        {key === 'development' && 'Use localhost URLs for local development'}
                        {key === 'test' && 'Use staging/test environment URLs'}
                        {key === 'production' && 'Use live production URLs'}
                      </p>
                    </div>

                    {key === 'production' && (
                      <>
                        <div className="space-y-2">
                          <Label>Go-live Date <span className="text-sm text-muted-foreground">(optional)</span></Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full justify-start text-left font-normal",
                                  !config?.goLiveDate && "text-muted-foreground"
                                )}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {config?.goLiveDate ? format(config.goLiveDate, "PPP") : "Select date"}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={config?.goLiveDate}
                                onSelect={(date) => date && updateEnvironmentConfig(key, 'goLiveDate', date)}
                                className={cn("p-3 pointer-events-auto")}
                              />
                            </PopoverContent>
                          </Popover>
                        </div>

                        <div className="space-y-2">
                          <Label>Business Approval Contact</Label>
                          <Input
                            value={config?.businessApprovalContact || ''}
                            onChange={(e) => updateEnvironmentConfig(key, 'businessApprovalContact', e.target.value)}
                            placeholder="Name and email of business approver"
                            required
                          />
                        </div>

                        {(() => {
                          // Check if BC Services Card, Person Credential, or BCeID are in recommended solutions
                          const hasBCServicesOrBCeIDOrPersonCredential = data.solution.components.some(
                            provider => provider === "BC Services Card" || provider === "Person Credential" || provider.includes("BCeID")
                          );

                          if (!hasBCServicesOrBCeIDOrPersonCredential) return null;

                          return (
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                              <div className="flex items-start space-x-2">
                                <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                                <div>
                                  <p className="text-sm font-medium text-blue-900">Production Environment Notice</p>
                                  <p className="text-sm text-blue-700 mt-1">
                                    BC Services Card, Person Credential, and BCeID production environments require additional approvals. Our team will guide you through this approval process.
                                  </p>
                                </div>
                              </div>
                            </div>
                          );
                        })()}
                      </>
                    )}

                    <div className="space-y-2">
                      <Label>Additional Notes <span className="text-sm text-muted-foreground">(optional)</span></Label>
                      <Textarea
                        value={config?.additionalNotes || ''}
                        onChange={(e) => updateEnvironmentConfig(key, 'additionalNotes', e.target.value)}
                        placeholder="Any additional requirements or notes..."
                        rows={2}
                      />
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>
          );
        })}
      </div>

      {/* Help Section */}
      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle className="text-base flex items-center space-x-2">
            <Info className="h-4 w-4" />
            <span>Environment Guidelines</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div>
              <h4 className="font-medium text-green-700">Development</h4>
              <p className="text-muted-foreground">For initial integration and testing with localhost URLs</p>
            </div>
            <div>
              <h4 className="font-medium text-yellow-700">Test</h4>
              <p className="text-muted-foreground">For user acceptance testing and staging environments</p>
            </div>
            <div>
              <h4 className="font-medium text-red-700">Production</h4>
              <p className="text-muted-foreground">For live service delivery - requires business approval</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Auto-save Status */}
      {lastSaved && (
        <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
          <Save className="h-4 w-4" />
          <span>Last saved at {format(lastSaved, 'HH:mm:ss')}</span>
        </div>
      )}
    </div>
  );
};

export default ConfigurationStep;
