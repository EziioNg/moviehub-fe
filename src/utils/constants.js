let apiRoot = "";

// môi trường dev
if (process.env.BUILD_MODE === "dev") {
  apiRoot = "http://localhost:8017";
}
// môi trường production
if (process.env.BUILD_MODE === "production") {
  apiRoot = "https://api.movie.eziio.site";
}

export const API_ROOT = apiRoot;
