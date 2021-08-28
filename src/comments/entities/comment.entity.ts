import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Comment {
  @Field(() => String, { description: 'Comment Id', name: 'id' })
  _id: string;

  @Field(() => String, { description: 'Comment content' })
  content: string;

  @Field(() => String, { description: 'Comment Task Id' })
  task: string;

  @Field(() => String, { description: 'Comment parent', nullable: true })
  parent?: string;
}
