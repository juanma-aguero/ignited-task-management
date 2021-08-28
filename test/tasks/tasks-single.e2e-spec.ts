import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import {
  closeInMongodConnection,
  rootMongooseTestModule,
} from '../utils/mongooseTestModule';
import { GraphQLModule } from '@nestjs/graphql';
import { TasksModule } from '../../dist/tasks/tasks.module';

describe('Single Task Cases - TasksResolver (e2e)', () => {
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

  it('query tasks', () => {
    return request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `{
          tasks {
            id, 
            name
          }
        }`,
      })
      .expect(200)
      .expect(({ body }) => {
        expect(body.data.tasks.length).toBe(1);
      });
  });

  it('get one task', () => {
    const getTaskQuery = `{
            task(id: "${taskId}"){
              id,
              name
            }
          }`;
    return request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: getTaskQuery,
      })
      .expect(200)
      .expect(({ body }) => {
        expect(body.data.task.id).toBe(taskId);
      });
  });

  afterAll(async () => {
    await closeInMongodConnection();
  });
});
