import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateTaskInput } from './dto/create-task.input';
import { UpdateTaskInput } from './dto/update-task.input';
import { Task, TaskDocument } from './schema/task.schema';
import { STATUS_DRAFT } from './constants/status';
import { UpdateTaskStatusInput } from './dto/update-task-status.input';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Task.name)
    private taskModel: Model<TaskDocument>,
  ) {}

  create(createTaskInput: CreateTaskInput) {
    const newTask = new this.taskModel(createTaskInput);
    newTask.status = STATUS_DRAFT;
    return newTask.save();
  }

  findAll() {
    return this.taskModel.find({}).exec();
  }

  findOne(id: string) {
    return this.taskModel.findOne({ _id: id }).exec();
  }

  update(updateTaskInput: UpdateTaskInput) {
    return this.taskModel
      .findOneAndUpdate({ _id: updateTaskInput.id }, updateTaskInput, {
        upsert: false,
        new: true,
      })
      .exec();
  }

  updateStatus(updateTaskInput: UpdateTaskStatusInput) {
    return this.taskModel
      .findOneAndUpdate({ _id: updateTaskInput.id }, updateTaskInput, {
        upsert: false,
        new: true,
      })
      .exec();
  }

  remove(id: string) {
    return this.taskModel.deleteOne({ _id: id }).exec();
  }
}
