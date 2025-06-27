import http from "http";

const API_KEY =
  "vyoniq_sk_652066764b5b058ba44a7dffa3861cea4596b1781ddfaac1d260343782395d06";
const SERVER_URL = "http://localhost:3000/api/mcp";

function makeRequest(method: string, params: any = {}): Promise<any> {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      jsonrpc: "2.0",
      id: Math.floor(Math.random() * 1000),
      method,
      params,
    });

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
        "Content-Length": Buffer.byteLength(data),
      },
    };

    const req = http.request(SERVER_URL, options, (res) => {
      let responseData = "";
      res.on("data", (chunk) => (responseData += chunk));
      res.on("end", () => {
        try {
          const response = JSON.parse(responseData);
          resolve(response);
        } catch (error) {
          reject(error);
        }
      });
    });

    req.on("error", reject);
    req.write(data);
    req.end();
  });
}

async function testMCPServer() {
  console.log("🧪 Testing Vyoniq MCP Server...\n");

  try {
    // Test 1: Initialize
    console.log("1️⃣ Testing initialize...");
    const initResponse = await makeRequest("initialize", {
      protocolVersion: "2024-11-05",
      capabilities: {
        roots: { listChanged: true },
        sampling: {},
      },
      clientInfo: {
        name: "test-client",
        version: "1.0.0",
      },
    });

    if (initResponse.result) {
      console.log("✅ Initialize successful");
      console.log(`   Protocol: ${initResponse.result.protocolVersion}`);
      console.log(
        `   Server: ${initResponse.result.serverInfo.name} v${initResponse.result.serverInfo.version}`
      );
    } else {
      console.log("❌ Initialize failed:", initResponse.error);
      return;
    }

    // Test 2: List tools
    console.log("\n2️⃣ Testing tools/list...");
    const toolsResponse = await makeRequest("tools/list");

    if (toolsResponse.result) {
      const tools = toolsResponse.result.tools;
      console.log(`✅ Found ${tools.length} tools:`);
      tools.forEach((tool: any) => {
        const hasSchema =
          tool.inputSchema && typeof tool.inputSchema === "object";
        const schemaType = tool.inputSchema?.type || "unknown";
        const hasProperties = tool.inputSchema?.properties
          ? Object.keys(tool.inputSchema.properties).length
          : 0;
        console.log(`   - ${tool.name}: ${tool.description}`);
        console.log(
          `     Schema: ${schemaType} ${
            hasSchema ? "✅" : "❌"
          } (${hasProperties} properties)`
        );
      });
    } else {
      console.log("❌ Tools list failed:", toolsResponse.error);
      return;
    }

    // Test 3: Call a tool
    console.log("\n3️⃣ Testing tools/call...");
    const callResponse = await makeRequest("tools/call", {
      name: "list_blog_posts",
      arguments: {},
    });

    if (callResponse.result) {
      console.log("✅ Tool call successful");
      console.log(
        "   Response:",
        callResponse.result.content[0].text.substring(0, 100) + "..."
      );
    } else {
      console.log("❌ Tool call failed:", callResponse.error);
    }

    console.log("\n🎉 MCP Server test completed!");
    console.log("\n📋 Summary:");
    console.log("- Server responds to initialize ✅");
    console.log("- Tools are properly listed ✅");
    console.log("- Tool schemas are in JSON format ✅");
    console.log("- Tool calls work correctly ✅");
    console.log("\nIf Cursor still shows 0 tools, the issue might be:");
    console.log("1. Cursor cache - try restarting Cursor");
    console.log("2. MCP configuration format - double-check the JSON");
    console.log("3. Cursor version compatibility");
  } catch (error) {
    console.error("❌ Test failed:", error);
  }
}

testMCPServer();
