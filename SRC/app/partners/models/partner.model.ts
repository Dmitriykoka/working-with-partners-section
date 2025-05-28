export interface Partner {
    id: string;
    name: string;
    category: string;
    managerId: string;
    lastContactDate?: Date;
    nextContactDate?: Date;
    contactFrequencyDays: number;
    importance: 'low' | 'medium' | 'high';
    contactMethods: {
      phone?: string;
      email?: string;
      whatsapp?: string;
      telegram?: string;
      other?: string;
    };
    notes?: string;
  }
  
  export interface Contact {
    id: string;
    partnerId: string;
    managerId: string;
    contactDate: Date;
    planned: boolean;
    completed: boolean;
    rescheduled: boolean;
    rescheduleReason?: string;
    contactMethod: string;
    notes?: string;
    importance: 'low' | 'medium' | 'high';
  }
  
  export interface PartnerCategory {
    id: string;
    name: string;
    defaultContactFrequencyDays: number;
    description?: string;
  }
  
  export interface User {
    id: string;
    name: string;
    email: string;
    role: 'manager' | 'teamLeader';
  }