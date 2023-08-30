import { CodegenConfig } from "@graphql-codegen/cli";
import * as process from "process";
const dotenv = require('dotenv')
dotenv.config()
dotenv.config({ path: '.env.local', override: true })

const GQLGEN_SCHEMA_ADMINX = process.env.GQLGEN_SCHEMA_ADMINX ?? "",
  ICE_DEV_TOKEN = process.env.ICE_DEV_TOKEN ?? '',
  ICE_DEV_TID = process.env.ICE_DEV_TID ?? ''

/**
 * 生成.graphql的配置
 */
const schemaAstConfig: CodegenConfig = {
  generates: {
    // adminx 项目
    'script/generated/adminx.graphql': {
      plugins: ['schema-ast'],
      config: {
        includeDirectives: true,
      },
      schema: {
        [GQLGEN_SCHEMA_ADMINX]: {
          headers: {
            "Authorization": `Bearer ${ICE_DEV_TOKEN}`,
            "X-Tenant-ID": `${ICE_DEV_TID}`,
          }
        },
      }
    }
  }
}


/**
 * 开发使用的生成配置
 */
const config: CodegenConfig = {
  generates: {
    // adminx 项目
    "src/generated/adminx/": {
      preset: 'client',
      presetConfig: {
        gqlTagName: 'gql',
      },
      schema: "script/generated/adminx.graphql",
      documents: "src/services/adminx/**/*.ts",
    }
  },
  ignoreNoDocuments: true,
}


export default process.argv.includes('--schema-ast') ? schemaAstConfig : config
