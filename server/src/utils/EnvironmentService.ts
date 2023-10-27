import * as dotenv from "dotenv";
import * as path from "path";
import * as fs from "fs";

const PROD_PATH: string = path.join(__dirname, "..", "..", ".prod.env");

export class EnvironmentService {
  private isProduction: boolean;

  constructor(isProduction: boolean) {
    console.info(">>> Loading Environment Variables.");
    if (isProduction) {
      this.isProductionEnvironmentExisting();
    }
    this.isProduction = !!isProduction;
    this.loadEnvironmentVariables();
  }

  private isProductionEnvironmentExisting(): void {
    if (!fs.existsSync(PROD_PATH)) {
      console.error(`Production environment file is missing, cannot initiated production start.
        Check if file is existing at: ${PROD_PATH}`);
      process.exit(0);
    }
  }

  private loadEnvironmentVariables(): void {
    dotenv.config(this.isProduction ? { path: PROD_PATH } : {});
    console.success(">>> Environment Variables loaded.");
  }
}
