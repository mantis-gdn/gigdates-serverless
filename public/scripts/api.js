// api.js
const API_URL = "/.netlify/functions/gigdates";

export const fetchData = async (dataset, id = null) => {
    try {
        const url = id ? `${API_URL}?dataset=${dataset}&id=${id}` : `${API_URL}?dataset=${dataset}`;
        const response = await fetch(url);
        if (!response.ok) throw new Error("Error fetching data: " + response.statusText);
        return await response.json();
    } catch (error) {
        console.error("Error fetching data:", error);
        throw error;
    }
};

export const saveData = async (dataset, data, isUpdate = false) => {
    try {
        const method = isUpdate ? "PUT" : "POST";
        const response = await fetch(`${API_URL}?dataset=${dataset}`, {
            method,
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error("Error saving data: " + response.statusText);
        return await response.json();
    } catch (error) {
        console.error("Error saving data:", error);
        throw error;
    }
};

export const deleteData = async (dataset, id) => {
    try {
        const response = await fetch(`${API_URL}?dataset=${dataset}&id=${id}`, {
            method: "DELETE",
        });
        if (!response.ok) throw new Error("Error deleting data: " + response.statusText);
        return await response.json();
    } catch (error) {
        console.error("Error deleting data:", error);
        throw error;
    }
};
