import { testConn } from '../../../test-utils/testConn';
import { Connection } from 'typeorm';
import { graphqlCall } from '../../../test-utils/graphqlCall';

let conn: Connection;

beforeAll(async () => {
  conn = await testConn();
});

afterAll(async () => {
  await conn.close()
});

const registerMutation = `
mutation Register($data: RegisterInput!){
  register(data: $data){
    id
    firstName
    lastName
    email
    name
  }
}
`;

describe('Register resolver', () => {
  it('Create user', async () => {
    console.log(JSON.stringify(await graphqlCall({
      source: registerMutation,
      variableValues: {
        data: {
          firstName: "hakuna",
          lastName: "matata",
          email: "hakuna@matata.com",
          password: "asd"
        }
      }
    })))
  })
})