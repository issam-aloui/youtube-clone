export default async function data_fetch(path) {
  try {
    // Handle base path for GitHub Pages deployment
    const basePath = import.meta.env.BASE_URL || "/";
    const fullPath = path.startsWith("/")
      ? `${basePath.slice(0, -1)}${path}`
      : path;

    const response = await fetch(fullPath);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data:", error); // basic logging nothing serious
    return null; // or handle the error as needed
  }
}
