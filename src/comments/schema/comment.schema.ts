import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { Task } from '../../tasks/schema/task.schema';

export type CommentDocument = Comment & Document;

@Schema()
export class Comment {
  @Prop()
  content: string;

  @Prop()
  createdOn: Date;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' })
  parent?: Comment;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Task' })
  task: Task;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
