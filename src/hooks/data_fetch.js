export default async function data_fetch(path)
{
    try
    {
        const response = await fetch(path);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    }
    catch (error)
    {
        console.error("Error fetching data:", error); // basic logging nothing serious
        return null; // or handle the error as needed
    }
}