export class LicenseInfo{
    apiToken: string;
    authToken: string;
    cdl_license: string;
    
}
export class License{
    id: number;
    license_class: string;
    license_desc_english: any;
    license_desc_malay: any;
    license_image: string;
    minimum_age: number;
    checked: boolean;
}