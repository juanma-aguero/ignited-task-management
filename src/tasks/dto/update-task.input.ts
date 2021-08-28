import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UpdateTaskInput {
  @Field(() => String)
  id: string;

  @Field(() => String, { description: 'Task Name' })
  name: string;
}
