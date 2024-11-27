const target = "http://localhost:8080";

const PROXY_CONFIG = [
  {
    context: [
      "/posts/api",
      "/user/api",
      "/tags/api",
      "/comments/api",
      "/postImages",
      "/avatars"
    ],
    target,
    secure: false,
    changeOrigin: true,
  }
];

module.exports = PROXY_CONFIG;
