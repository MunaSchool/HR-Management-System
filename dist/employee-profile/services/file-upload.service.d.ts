export declare class FileUploadService {
    private readonly uploadPath;
    private readonly maxFileSize;
    private readonly allowedMimeTypes;
    constructor();
    saveFile(file: Express.Multer.File, employeeId: string): Promise<string>;
    getFile(filename: string): Promise<Buffer>;
    deleteFile(filename: string): Promise<void>;
}
