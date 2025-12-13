export interface policy {
    id: number;
    name: string;
    type: string;
    description: string;
    effectiveDate: string;
    ruleDefinition: {
        percentage: number
        fixedAmount: number;
        thresholdAmount: number;
    };
    createdAt: string;
    updatedAt: string;
    applicability: string;
    status: string;
}