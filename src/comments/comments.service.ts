import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Comment, CommentDocument } from './schema/comment.schema';
import { CreateCommentInput } from './dto/create-comment.input';
import { UpdateCommentInput } from './dto/update-comment.input';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment.name)
    private commentModel: Model<CommentDocument>,
  ) {}

  create(createCommentInput: CreateCommentInput) {
    const newComment = new this.commentModel(createCommentInput);
    return newComment.save();
  }

  findAll() {
    return this.commentModel.find({}).exec();
  }

  findOne(id: string) {
    return this.commentModel.findOne({ _id: id }).exec();
  }

  update(updateCommentInput: UpdateCommentInput) {
    return this.commentModel
      .findOneAndUpdate({ _id: updateCommentInput.id }, updateCommentInput, {
        upsert: false,
        new: true,
      })
      .exec();
  }

  remove(id: string) {
    return this.commentModel.deleteOne({ _id: id }).exec();
  }
}
