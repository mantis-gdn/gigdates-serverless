// gigdates.js
const fs = require("fs");
const path = require("path");

// Adjusted path for the data folder
const dataPath = path.resolve(__dirname, "../../data");

const dataFiles = {
    bands: path.join(dataPath, "bands.js"),
    events: path.join(dataPath, "events.js"),
    venues: path.join(dataPath, "venues.js"),
};

const loadData = (dataset) => {
    try {
        const filePath = dataFiles[dataset];
        if (!fs.existsSync(filePath)) throw new Error(`File not found: ${filePath}`);
        const rawData = require(filePath);
        return rawData[dataset] || [];
    } catch (error) {
        console.error("Error loading data:", error.message);
        return null;
    }
};

const saveData = (dataset, items) => {
    try {
        const filePath = dataFiles[dataset];
        const exportContent = `module.exports = { ${dataset}: ${JSON.stringify(items, null, 2)} };`;
        fs.writeFileSync(filePath, exportContent, "utf-8");
    } catch (error) {
        console.error("Error saving data:", error.message);
    }
};

exports.handler = async (event) => {
    const { httpMethod, queryStringParameters, body } = event;
    const dataset = queryStringParameters.dataset;
    const id = queryStringParameters.id;

    if (!dataset || !dataFiles[dataset]) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: "Invalid dataset parameter." }),
        };
    }

    let items = loadData(dataset);

    if (!items) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Failed to load data." }),
        };
    }

    try {
        switch (httpMethod) {
            case "GET": {
                if (id) {
                    const item = items.find((i) => i.id.toString() === id.toString());
                    if (!item) {
                        return {
                            statusCode: 404,
                            body: JSON.stringify({ error: "Item not found." }),
                        };
                    }
                    return {
                        statusCode: 200,
                        body: JSON.stringify(item),
                    };
                }
                return {
                    statusCode: 200,
                    body: JSON.stringify(items),
                };
            }

            case "POST": {
                const newItem = JSON.parse(body);
                items.push(newItem);
                saveData(dataset, items);
                return {
                    statusCode: 201,
                    body: JSON.stringify(newItem),
                };
            }

            case "PUT": {
                const updatedItem = JSON.parse(body);
                const index = items.findIndex((i) => i.id.toString() === updatedItem.id.toString());
                if (index === -1) {
                    return {
                        statusCode: 404,
                        body: JSON.stringify({ error: "Item not found." }),
                    };
                }
                items[index] = updatedItem;
                saveData(dataset, items);
                return {
                    statusCode: 200,
                    body: JSON.stringify(updatedItem),
                };
            }            

            case "DELETE": {
                const index = items.findIndex((i) => i.id.toString() === id.toString());
                if (index === -1) {
                    return {
                        statusCode: 404,
                        body: JSON.stringify({ error: "Item not found." }),
                    };
                }
                const deletedItem = items.splice(index, 1);
                saveData(dataset, items);
                return {
                    statusCode: 200,
                    body: JSON.stringify(deletedItem[0]),
                };
            }

            default:
                return {
                    statusCode: 405,
                    body: JSON.stringify({ error: "Method not allowed." }),
                };
        }
    } catch (error) {
        console.error("Error handling request:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message }),
        };
    }
};