export declare class CreateEmployeeDto {
    employeeNumber: string;
    firstName: string;
    lastName: string;
    workEmail: string;
    nationalId: string;
    dateOfHire: string;
    department?: string;
    jobTitle?: string;
    directManagerId?: string;
    password?: string;
    roles?: string[];
    permissions?: string[];
}
