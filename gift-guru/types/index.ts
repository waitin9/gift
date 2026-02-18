export interface GiftFormData {
    target: string;
    relationSpecific: string;
    budget: number;
    interests: string;
    taboos: string;
  }
  
  export type RelationType = 'Partner' | 'Friend' | 'Family' | 'Colleague' | 'Other';