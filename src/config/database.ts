import { connect } from "mongoose";
import { exit } from "node:process";

import environment from "./environment";

const connectDatabase = async () => {
  if (!environment.mongoURI) exit(1);

  await connect(environment.mongoURI);
};

export default connectDatabase;
