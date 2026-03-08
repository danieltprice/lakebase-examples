"use strict";

const path = require("node:path");
const fastifyEnv = require("@fastify/env");
const AutoLoad = require("@fastify/autoload");
const { getPoolConfig } = require("./lib/lakebase");

const options = {};

module.exports = async function (fastify, opts) {
  await fastify.register(fastifyEnv, {
    dotenv: {
      path: [".env", ".env.production", ".env.local"],
    },
    schema: {
      type: "object",
      required: ["LAKEBASE_HOST", "DATABRICKS_CLIENT_ID"],
      properties: {
        LAKEBASE_HOST: { type: "string" },
        DATABRICKS_CLIENT_ID: { type: "string" },
      },
    },
  });

  fastify.register(require("@fastify/postgres"), getPoolConfig());

  fastify.register(AutoLoad, {
    dir: path.join(__dirname, "plugins"),
    options: Object.assign({}, opts),
  });

  fastify.register(AutoLoad, {
    dir: path.join(__dirname, "routes"),
    options: Object.assign({}, opts),
  });
};

module.exports.options = options;
