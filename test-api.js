const fs = require("fs");
const path = require("path");
const FormData = require("form-data");
const axios = require("axios");

/**
 * Test script for TikTok Text Overlay API
 * Demonstrates various API usage patterns
 */

class APITester {
  constructor(baseURL = "http://localhost:3001") {
    this.baseURL = baseURL;
  }

  /**
   * Test health endpoint
   */
  async testHealth() {
    try {
      console.log("🏥 Testing health endpoint...");
      const response = await axios.get(`${this.baseURL}/health`);
      console.log("✅ Health check passed:", response.data);
      return true;
    } catch (error) {
      console.error("❌ Health check failed:", error.message);
      return false;
    }
  }

  /**
   * Test text preview functionality
   */
  async testTextPreview() {
    try {
      console.log("\n👀 Testing text preview...");
      const testTexts = [
        "Skincare products I'd NEVER recommend my clients from a esthetician of 7+ years",
        "Brutally rating viral skincare as a esthetician that has tried it ALL",
        "Skin products I'd NEVER touch again as a esthetician of 6+ years",
      ];

      for (const text of testTexts) {
        const response = await axios.post(`${this.baseURL}/api/preview-text`, {
          text: text,
        });

        if (response.data.success) {
          console.log(`✅ Preview for: "${text.substring(0, 50)}..."`);
          console.log(`   Lines: ${response.data.data.lineCount}`);
          response.data.data.preview.forEach((line) => {
            console.log(
              `   Line ${line.lineNumber}: "${line.text}" (${line.wordCount} words, ${line.characterCount} chars)`
            );
          });
        }
      }
      return true;
    } catch (error) {
      console.error("❌ Text preview failed:", error.message);
      return false;
    }
  }

  /**
   * Test text overlay processing
   */
  async testTextOverlay() {
    try {
      console.log("\n🖼️ Testing text overlay processing...");

      // Check if test image exists
      const testImagePath = path.join(__dirname, "file.png");
      if (!fs.existsSync(testImagePath)) {
        console.error("❌ Test image not found:", testImagePath);
        return false;
      }

      const testCases = [
        {
          text: "Skincare products I'd NEVER recommend my clients from a esthetician of 7+ years",
          position: "bottom",
          fontSize: 65,
        },
        {
          text: "Brutally rating viral skincare as a esthetician that has tried it ALL",
          position: "center",
          fontSize: 60,
        },
        {
          text: "Skin products I'd NEVER touch again as a esthetician of 6+ years",
          position: "top",
          fontSize: 70,
        },
      ];

      for (let i = 0; i < testCases.length; i++) {
        const testCase = testCases[i];
        console.log(
          `\n📝 Test case ${i + 1}: "${testCase.text.substring(0, 50)}..."`
        );

        const formData = new FormData();
        formData.append("avatar", fs.createReadStream(testImagePath));
        formData.append("text", testCase.text);
        formData.append("position", testCase.position);
        formData.append("fontSize", testCase.fontSize.toString());

        const response = await axios.post(
          `${this.baseURL}/api/text-overlay`,
          formData,
          {
            headers: formData.getHeaders(),
          }
        );

        if (response.data.success) {
          console.log(
            `✅ Generated: Base64 image (${response.data.data.imageBase64.length} characters)`
          );
          console.log(`   Position: ${response.data.data.position}`);
          console.log(`   Font Size: ${response.data.data.fontSize}px`);
          console.log(`   Timestamp: ${response.data.data.timestamp}`);
        } else {
          console.error(`❌ Failed to generate overlay for test case ${i + 1}`);
        }
      }
      return true;
    } catch (error) {
      console.error("❌ Text overlay failed:", error.message);
      return false;
    }
  }

  /**
   * Test configuration management
   */
  async testConfiguration() {
    try {
      console.log("\n⚙️ Testing configuration management...");

      const configTests = [
        {
          name: "Update font size",
          config: { fontSize: 80 },
        },
        {
          name: "Update position",
          config: { position: "center" },
        },
        {
          name: "Update multiple settings",
          config: {
            fontSize: 75,
            position: "bottom",
            textColor: "#000000",
            bubbleColor: "#FFFFFF",
          },
        },
      ];

      for (const test of configTests) {
        console.log(`\n🔧 ${test.name}...`);
        const response = await axios.post(
          `${this.baseURL}/api/configure`,
          test.config
        );

        if (response.data.success) {
          console.log(`✅ Configuration updated successfully`);
          console.log(
            `   Current font size: ${response.data.data.currentConfig.fontSize}`
          );
          console.log(
            `   Current position: ${response.data.data.currentConfig.position}`
          );
        } else {
          console.error(`❌ Configuration update failed`);
        }
      }
      return true;
    } catch (error) {
      console.error("❌ Configuration test failed:", error.message);
      return false;
    }
  }

  /**
   * Run all tests
   */
  async runAllTests() {
    console.log("🚀 Starting TikTok Text Overlay API Tests");
    console.log("=".repeat(50));

    const tests = [
      { name: "Health Check", fn: () => this.testHealth() },
      { name: "Text Preview", fn: () => this.testTextPreview() },
      { name: "Text Overlay", fn: () => this.testTextOverlay() },
      { name: "Configuration", fn: () => this.testConfiguration() },
    ];

    const results = [];

    for (const test of tests) {
      console.log(`\n📋 Running ${test.name}...`);
      const result = await test.fn();
      results.push({ name: test.name, success: result });
    }

    // Summary
    console.log("\n" + "=".repeat(50));
    console.log("📊 Test Results Summary:");
    console.log("=".repeat(50));

    results.forEach((result) => {
      const status = result.success ? "✅ PASS" : "❌ FAIL";
      console.log(`${status} ${result.name}`);
    });

    const passedTests = results.filter((r) => r.success).length;
    const totalTests = results.length;

    console.log(`\n🎯 Overall: ${passedTests}/${totalTests} tests passed`);

    if (passedTests === totalTests) {
      console.log("🎉 All tests passed! The API is working correctly.");
    } else {
      console.log(
        "⚠️ Some tests failed. Please check the error messages above."
      );
    }
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  const tester = new APITester();
  tester.runAllTests().catch((error) => {
    console.error("❌ Test runner failed:", error);
    process.exit(1);
  });
}

module.exports = APITester;
