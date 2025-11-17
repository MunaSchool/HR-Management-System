import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { DocumentType } from '../enums/document-type.enum';
import { DocumentStatus } from '../enums/document-status.enum';

export type EmployeeDocumentFileDocument =
  HydratedDocument<EmployeeDocumentFile>;

@Schema({ timestamps: true })
export class EmployeeDocumentFile {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true,
  })
  employee: mongoose.Types.ObjectId;

  @Prop({
    type: String,
    enum: DocumentType,
    required: true,
  })
  type: DocumentType;

  @Prop({ required: true })
  fileUrl: string;

  @Prop()
  description?: string;

  @Prop({
    type: String,
    enum: DocumentStatus,
    default: DocumentStatus.PENDING,
  })
  status: DocumentStatus;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Employee' })
  verifiedBy?: mongoose.Types.ObjectId;

  @Prop({ type: Date })
  verifiedAt?: Date;
}

export const EmployeeDocumentSchema =
  SchemaFactory.createForClass(EmployeeDocumentFile);
