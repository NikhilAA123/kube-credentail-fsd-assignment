module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  // Add this line here too
  transformIgnorePatterns: ["/node_modules/(?!uuid)"],
};
