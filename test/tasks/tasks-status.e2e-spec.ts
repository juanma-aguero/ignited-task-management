import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import {
  closeInMongodConnection,
  rootMongooseTestModule,
} from '../utils/mongooseTestModule';
import { GraphQLModule } from '@nestjs/graphql';
import { TasksModule } from '../../dist/tasks/tasks.module';
import { STATUS_DRAFT, STATUS_TODO } from '../../dist/tasks/constants/status';

describe('Task Status Cases - TasksResolver (e2e)', () => {
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
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  let taskId = null;
  it('create task', () => {
    return request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `mutation {
          createTask (createTaskInput: {
            name: "Task 1"
          }){
           id,
           name,
           status 
          }
        } 
        `,
      })
      .expect(200)
      .expect(({ body }) => {
        taskId = body.data.createTask.id;
        expect(body.data.createTask.status).toBe(STATUS_DRAFT);
      });
  });

  it('change status', () => {
    return request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `mutation {
          updateTaskStatus (updateTasksStatusInput: {
            id: "${taskId}"
            status: "${STATUS_TODO}"
          }){
           id,
           name,
           status 
          }
        } 
        `,
      })
      .expect(200);
  });

  it('get same task', () => {
    const getTaskQuery = `{
            task(id: "${taskId}"){
              id,
              name,
              status
            }
          }`;
    return request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: getTaskQuery,
      })
      .expect(200)
      .expect(({ body }) => {
        expect(body.data.task.status).toBe(STATUS_TODO);
      });
  });

  afterAll(async () => {
    await closeInMongodConnection();
  });
});
