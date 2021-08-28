import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import {
  closeInMongodConnection,
  rootMongooseTestModule,
} from '../utils/mongooseTestModule';
import { GraphQLModule } from '@nestjs/graphql';
import { TasksModule } from '../../dist/tasks/tasks.module';

describe('Parent Task Cases - TasksResolver (e2e)', () => {
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

  let firstTaskId = null;
  it('create task', () => {
    return request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `mutation {
          createTask (createTaskInput: {
            name: "Task 2"
          }){
           id,
           name 
          }
        } 
        `,
      })
      .expect(200)
      .expect(({ body }) => {
        firstTaskId = body.data.createTask.id;
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

  it('create a nested task', () => {
    return request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `mutation {
          createTask (createTaskInput: {
            name: "Task 2",
            parent: "${firstTaskId}"
          }){
           id,
           name,
           parent 
          }
        } 
        `,
      })
      .expect(200)
      .expect(({ body }) => {
        expect(body.data.createTask.parent).toBe(firstTaskId);
      });
  });

  afterAll(async () => {
    await closeInMongodConnection();
  });
});
