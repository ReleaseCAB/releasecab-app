module.exports = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://web:8000/api/:path*/",
      },
      {
        source: "/release/api/:path*",
        destination: "http://web:8000/api/:path*/",
      },
      {
        source: "/blackout/api/:path*",
        destination: "http://web:8000/api/:path*/",
      },
      {
        source: "/user/api/:path*",
        destination: "http://web:8000/api/:path*/",
      },
      {
        source: "/team/api/:path*",
        destination: "http://web:8000/api/:path*/",
      },
      {
        source: "/role/api/:path*",
        destination: "http://web:8000/api/:path*/",
      },
      {
        source: "/release-type/api/:path*",
        destination: "http://web:8000/api/:path*/",
      },
      {
        source: "/release-stage/api/:path*",
        destination: "http://web:8000/api/:path*/",
      },
      {
        source: "/release-env/api/:path*",
        destination: "http://web:8000/api/:path*/",
      },
      {
        source: "/inbox/api/:path*",
        destination: "http://web:8000/api/:path*/",
      },
      {
        source: "/manage/api/:path*",
        destination: "http://web:8000/api/:path*/",
      },
    ];
  },
};
