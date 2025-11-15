import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

import { RatingScaleItem } from './rating-scale-item.schema';
import { CriteriaItem } from './criteria-item.schema';
import { PerformanceTemplateType } from '../enum/performance-template-type.enum';

export type PerformanceTemplateDocument =
  HydratedDocument<PerformanceTemplate>;

@Schema({ timestamps: true })
export class PerformanceTemplate {
  @Prop({ required: true, unique: true })
  code: string;

  @Prop({ required: true })
  name: string;

  @Prop({
    type: String,
    enum: PerformanceTemplateType,
    required: true,
  })
  type: PerformanceTemplateType;

  @Prop({ type: [RatingScaleItem], default: [] })
  ratingScale: RatingScaleItem[];

  @Prop({ type: [CriteriaItem], default: [] })
  criteria: CriteriaItem[];
}

export const PerformanceTemplateSchema =
  SchemaFactory.createForClass(PerformanceTemplate);
