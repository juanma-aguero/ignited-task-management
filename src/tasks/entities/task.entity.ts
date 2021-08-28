import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Task {
  @Field(() => String, { description: 'Task Id', name: 'id' })
  _id: string;

  @Field(() => String, { description: 'Task Name' })
  name: string;

  @Field(() => String, { description: 'Task Status', nullable: true })
  status?: string;

  @Field(() => String, { description: 'Task parent', nullable: true })
  parent?: string;
}
