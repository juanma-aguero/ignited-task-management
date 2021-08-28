import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateTaskInput {
  @Field(() => String, { description: 'Task Name' })
  name: string;

  @Field(() => String, { description: 'Task parent', nullable: true })
  parent?: string;
}
