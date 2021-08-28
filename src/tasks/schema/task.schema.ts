import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';

export type TaskDocument = Task & Document;

@Schema()
export class Task {
  @Prop()
  name: string;

  @Prop()
  status: string;

  @Prop({ type: mongoose.Schema.Types.Decimal128 })
  time: number;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Task' })
  parent?: Task;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
