import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateCommentInput {
  @Field(() => String, { description: 'Comment content' })
  content: string;

  @Field(() => String, { description: 'Id of the commented task' })
  task: string;

  @Field(() => String, { description: 'Comment parent', nullable: true })
  parent?: string;
}
