import path from 'path';
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import 'dotenv/config';
import connectDB from './config/mongo';
import LoginController from './controllers/loginController';
import RegisterController from './controllers/registerController';



const loginController = new LoginController();
const registerController = new RegisterController();

connectDB()

const PROTO_PATH = path.resolve(__dirname, './proto/expert.proto');
const packageDef = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const grpcObject = grpc.loadPackageDefinition(packageDef) as any;

if (
  !grpcObject.expert ||
  !grpcObject.expert.Expert ||
  !grpcObject.expert.Expert.service
) {
  console.error('Failed to load the User service from the proto file.');
  process.exit(1);
}

const server = new grpc.Server();

server.addService(grpcObject.expert.Expert.service, {
  LoginExpert: loginController.loginExpert,
  RegisterExpert: registerController.registerExpert,
  GoogleLoginExpert : loginController.googleLoginExpert,
});

const SERVER_ADDRESS = process.env.GRPC_SERVER_PORT || '50003';
const Domain =
  process.env.NODE_ENV === 'dev'
    ? process.env.DEV_DOMAIN
    : process.env.PRO_DOMAIN_USER;
console.log(Domain);

server.bindAsync(
  `${Domain}:${SERVER_ADDRESS}`,
  grpc.ServerCredentials.createInsecure(),
  (err, port) => {
    if (err) {
      console.error(`Failed to bind server: ${err}`);
      return;
    }
    console.log(`gRPC server running at ${port}`);
  }
);