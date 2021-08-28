import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UpdateCommentInput {
  @Field(() => String)
  id: string;

  @Field(() => String, { description: 'Comment content' })
  content: string;
}
