export class CreateLeaveTypeDto {
  code: string;
  name: string;
  category: string;          // ObjectId as string
  needsDocument?: boolean;
  deductedFromBalance?: boolean;
}
