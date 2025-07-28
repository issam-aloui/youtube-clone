export default function styleFetch(url) {
    return fetch(url)
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