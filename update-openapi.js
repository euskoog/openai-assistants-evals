const fs = require("fs");
const path = require("path");
const axios = require("axios");

// This script fetches the OpenAPI JSON from the server and updates the operation IDs to allow for cleaner client generation
// get environment variables
require("dotenv").config();

async function fetchOpenApiJson() {
  try {
    // get base url from environment variables
    const baseUrl = process.env.API_URL;
    if (!baseUrl) {
      console.error("API_URL environment variable is not set");
      process.exit(1);
    }

    const openApiUrl = `${baseUrl}/api/v1/core/openapi.json`;
    console.log("Fetching OpenAPI spec from: ", openApiUrl);
    const response = await axios.get(openApiUrl);
    console.log("Successfully fetched OpenAPI spec");
    return response.data;
  } catch (error) {
    console.error("Error fetching OpenAPI JSON:", error);
    process.exit(1);
  }
}

function removeTagsFromOperationIds(openApiContent) {
  for (const pathData of Object.values(openApiContent.paths)) {
    for (const operation of Object.values(pathData)) {
      const tag = operation.tags[0];
      const operationId = operation.operationId;
      const toRemove = `${tag}-`;
      const newOperationId = operationId.replace(toRemove, "");
      operation.operationId = newOperationId;
    }
  }
}

async function main() {
  const openApiContent = await fetchOpenApiJson();
  removeTagsFromOperationIds(openApiContent);

  const outputPath = path.join(__dirname, "openapi.json");
  fs.writeFileSync(outputPath, JSON.stringify(openApiContent, null, 2));

  console.log(
    "OpenAPI JSON with updated operation IDs has been saved to",
    outputPath
  );
}

main();
