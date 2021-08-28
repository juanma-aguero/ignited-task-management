import { Field, InputType, PartialType } from '@nestjs/graphql';
import { UpdateTaskInput } from './update-task.input';

@InputType()
export class UpdateTaskStatusInput extends PartialType(UpdateTaskInput) {
  @Field(() => String, { description: 'Task Status' })
  status: string;
}
