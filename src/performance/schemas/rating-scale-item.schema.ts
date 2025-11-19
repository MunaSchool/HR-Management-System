import { Prop, Schema } from '@nestjs/mongoose';

@Schema({ _id: false })
export class RatingScaleItem {
  @Prop({ required: true })
  label: string;

  @Prop({ required: true })
  value: number;
}
