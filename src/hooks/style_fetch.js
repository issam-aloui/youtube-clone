export default function styleFetch(url) {
  // Handle base path for GitHub Pages deployment
  const basePath = import.meta.env.BASE_URL || "/";
  const fullUrl = url.startsWith("/") ? `${basePath.slice(0, -1)}${url}` : url;

  return fetch(fullUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.text();
    })
    .catch((error) => {
      console.error("Error fetching styles");
      return "";
    });
}
