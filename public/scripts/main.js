// public/scripts/main.js
import { fetchData, saveData, deleteData } from "./api.js";

document.addEventListener("DOMContentLoaded", () => {
    const dataset = document.body.dataset.dataset;
    const list = document.getElementById("data-list");

    const loadData = async () => {
        try {
            const data = await fetchData(dataset);
            list.innerHTML = "";
            data.forEach((item) => {
                const li = document.createElement("li");
                li.textContent = JSON.stringify(item);
                list.appendChild(li);
            });
        } catch (error) {
            console.error(error);
        }
    };

    document.getElementById("add-btn").addEventListener("click", async () => {
        const data = JSON.parse(document.getElementById("data-input").value);
        await saveData(dataset, data);
        loadData();
    });

    document.getElementById("delete-btn").addEventListener("click", async () => {
        const id = document.getElementById("delete-input").value;
        await deleteData(dataset, id);
        loadData();
    });

    loadData();
});
