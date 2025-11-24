// Centralized mock data for the IIS Portal Prototype

export interface Integration {
  id: string;
  requestId: string;
  name: string;
  status: 'completed' | 'draft' | 'in-review' | 'approved' | 'rejected';
  environments: string[];
  identityServices: string[];
  lastActivity: string;
  monthlyUsers: string;
  ministry?: string;
  productOwner?: {
    name: string;
    email: string;
  };
  technicalLead?: {
    name: string;
    email: string;
  };
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export const initialIntegrations: Integration[] = [
  {
    id: "1",
    requestId: "00006124",
    name: "Citizen Services Portal",
    status: "completed",
    environments: ["Production", "Test"],
    identityServices: ["BC Services Card", "Single Companion Credential", "BCeID"],
    lastActivity: "2 hours ago",
    monthlyUsers: "12.5K",
    ministry: "Citizens' Services",
    productOwner: {
      name: "Sarah Chen",
      email: "sarah.chen@gov.bc.ca"
    },
    technicalLead: {
      name: "James Wilson",
      email: "james.wilson@gov.bc.ca"
    },
    description: "Public-facing portal for accessing government services",
    createdAt: "2024-09-15",
    updatedAt: "2024-10-30"
  },
  {
    id: "2",
    requestId: "00006125",
    name: "Internal HR System",
    status: "draft",
    environments: ["Development"],
    identityServices: ["IDIR"],
    lastActivity: "1 day ago",
    monthlyUsers: "0",
    ministry: "Finance",
    productOwner: {
      name: "Michael Rodriguez",
      email: "michael.rodriguez@gov.bc.ca"
    },
    technicalLead: {
      name: "Emily Thompson",
      email: "emily.thompson@gov.bc.ca"
    },
    description: "Internal human resources management system",
    createdAt: "2024-10-25",
    updatedAt: "2024-10-29"
  },
  {
    id: "3",
    requestId: "00006126",
    name: "Public Inquiry System",
    status: "in-review",
    environments: [],
    identityServices: ["BC Services Card"],
    lastActivity: "3 days ago",
    monthlyUsers: "0",
    ministry: "Health",
    productOwner: {
      name: "Patricia Lee",
      email: "patricia.lee@gov.bc.ca"
    },
    technicalLead: {
      name: "David Kumar",
      email: "david.kumar@gov.bc.ca"
    },
    description: "System for public health inquiries and information requests",
    createdAt: "2024-10-20",
    updatedAt: "2024-10-27"
  },
  {
    id: "4",
    requestId: "00006127",
    name: "Education Portal",
    status: "completed",
    environments: ["Production", "Development", "Test"],
    identityServices: ["BC Services Card", "BCeID", "IDIR"],
    lastActivity: "5 hours ago",
    monthlyUsers: "8.2K",
    ministry: "Education and Child Care",
    productOwner: {
      name: "Robert Martinez",
      email: "robert.martinez@gov.bc.ca"
    },
    technicalLead: {
      name: "Linda Park",
      email: "linda.park@gov.bc.ca"
    },
    description: "Educational resources and student information portal",
    createdAt: "2024-08-10",
    updatedAt: "2024-10-30"
  },
  {
    id: "5",
    requestId: "00006128",
    name: "License Application System",
    status: "in-review",
    environments: ["Test"],
    identityServices: ["BC Services Card"],
    lastActivity: "2 days ago",
    monthlyUsers: "0",
    ministry: "Transportation and Infrastructure",
    productOwner: {
      name: "Jennifer Brown",
      email: "jennifer.brown@gov.bc.ca"
    },
    technicalLead: {
      name: "Thomas Anderson",
      email: "thomas.anderson@gov.bc.ca"
    },
    description: "Online licensing application and renewal system",
    createdAt: "2024-10-18",
    updatedAt: "2024-10-28"
  }
];

export interface ActivityLog {
  id: string;
  action: string;
  service?: string;
  integrationId?: string;
  time: string;
  type: 'update' | 'create' | 'approval' | 'rejection' | 'system';
  status?: string;
  user?: string;
}

export const initialActivityLogs: ActivityLog[] = [
  {
    id: "1",
    action: "Integration 00006124 updated configuration",
    integrationId: "1",
    time: "2 hours ago",
    type: "update",
    user: "James Wilson"
  },
  {
    id: "2",
    action: "New authentication method added to project Internal HR System",
    integrationId: "2",
    time: "1 day ago",
    type: "create",
    user: "Emily Thompson"
  },
  {
    id: "3",
    action: "Production approval granted for project Citizen Services Portal",
    integrationId: "1",
    time: "3 days ago",
    type: "approval",
    status: "approved",
    user: "Admin"
  },
  {
    id: "4",
    action: "New integration request",
    service: "Health Portal System",
    time: "2 hours ago",
    type: "create",
    status: "pending"
  },
  {
    id: "5",
    action: "Integration approved",
    service: "Education Services",
    time: "4 hours ago",
    type: "approval",
    status: "approved"
  },
  {
    id: "6",
    action: "System maintenance completed",
    service: "BC Services Card Provider",
    time: "1 day ago",
    type: "system",
    status: "completed"
  }
];

export interface Ministry {
  value: string;
  label: string;
}

export const ministries: Ministry[] = [
  { value: "ag", label: "Agriculture and Food" },
  { value: "ag-lands", label: "Attorney General and Responsible for Housing" },
  { value: "citizens", label: "Citizens' Services" },
  { value: "education", label: "Education and Child Care" },
  { value: "emcr", label: "Emergency Management and Climate Readiness" },
  { value: "energy", label: "Energy, Mines and Low Carbon Innovation" },
  { value: "env", label: "Environment and Climate Change Strategy" },
  { value: "finance", label: "Finance" },
  { value: "forests", label: "Forests" },
  { value: "health", label: "Health" },
  { value: "irr", label: "Indigenous Relations and Reconciliation" },
  { value: "lbr", label: "Labour" },
  { value: "muni", label: "Municipal Affairs" },
  { value: "psfs", label: "Post-Secondary Education and Future Skills" },
  { value: "pssg", label: "Public Safety and Solicitor General" },
  { value: "sdpr", label: "Social Development and Poverty Reduction" },
  { value: "tourism", label: "Tourism, Arts, Culture and Sport" },
  { value: "tran", label: "Transportation and Infrastructure" },
  { value: "water", label: "Water, Land and Resource Stewardship" }
];

// System statistics
export const systemStats = {
  activeIntegrations: 147,
  pendingApprovals: 8,
  totalUsers: 2300000,
  systemHealth: 99.9
};

// Storage keys
export const STORAGE_KEYS = {
  INTEGRATIONS: 'iis-integrations',
  ACTIVITY_LOGS: 'iis-activity-logs',
  WIZARD_DRAFT: 'iis-wizard-draft',
  DEMO_MODE: 'iis-demo-mode'
} as const;
