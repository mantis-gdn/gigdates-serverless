// main.js

// Function to load content into a container
async function loadComponent(id, filePath) {
    try {
        const response = await fetch(filePath);
        if (!response.ok) {
            throw new Error(`Failed to fetch ${filePath}`);
        }
        const content = await response.text();
        document.getElementById(id).innerHTML = content;
    } catch (error) {
        console.error(`Error loading component: ${filePath}`, error);
    }
}

// Load Header and Footer
document.addEventListener('DOMContentLoaded', () => {
    loadComponent('header', '/includes/header.html');
    loadComponent('footer', '/includes/footer.html');
});
