export declare class AddressDto {
    city?: string;
    streetAddress?: string;
    country?: string;
}
export declare class UpdateContactInfoDto {
    mobilePhone?: string;
    homePhone?: string;
    personalEmail?: string;
    address?: AddressDto;
}
