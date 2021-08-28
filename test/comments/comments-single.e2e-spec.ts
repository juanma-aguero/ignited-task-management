import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import {
  closeInMongodConnection,
  rootMongooseTestModule,
} from '../utils/mongooseTestModule';
import { GraphQLModule } from '@nestjs/graphql';
import { CommentsModule } from '../../dist/comments/comments.module';
import { TasksModule } from '../../dist/tasks/tasks.module';

describe('Single Comment Cases - CommentsResolver (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        GraphQLModule.forRoot({
          autoSchemaFile: process.cwd() + 'src/schema.gql',
          cors: true,
        }),
        rootMongooseTestModule(),
        TasksModule,
        CommentsModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  let commentId = null;
  let taskId = null;
  it('create task', () => {
    return request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `mutation {
          createTask (createTaskInput: {
            name: "Task 5"
          }){
           id,
           name 
          }
        } 
        `,
      })
      .expect(200)
      .expect(({ body }) => {
        taskId = body.data.createTask.id;
      });
  });

  it('create comment', () => {
    return request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `mutation {
          createComment (createCommentInput: {
            content: "Comment on task 1",
            task: "${taskId}"
          }){
           id,
           content,
           task 
          }
        } 
        `,
      })
      .expect(200)
      .expect(({ body }) => {
        commentId = body.data.createComment.id;
      });
  });

  it('query comments', () => {
    return request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `{
          comments {
            id, 
            task
          }
        }`,
      })
      .expect(200)
      .expect(({ body }) => {
        expect(body.data.comments.length).toBe(1);
      });
  });

  it('get one comment', () => {
    const getCommentQuery = `{
            comment(id: "${commentId}"){
              id,
              content,
              task
            }
          }`;
    return request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: getCommentQuery,
      })
      .expect(200)
      .expect(({ body }) => {
        expect(body.data.comment.id).toBe(commentId);
      });
  });

  afterAll(async () => {
    await closeInMongodConnection();
  });
});
