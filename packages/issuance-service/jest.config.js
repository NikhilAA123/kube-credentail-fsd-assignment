module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  // Add the line below
  transformIgnorePatterns: ["/node_modules/(?!uuid)"],
};
