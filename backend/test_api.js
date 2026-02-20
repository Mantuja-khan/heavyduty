const fetch = require('node-fetch'); // Needs node-fetch installed or use built-in fetch in newer node

const testAPI = async () => {
    try {
        console.log("Fetching products...");
        const resProducts = await fetch('http://localhost:5000/api/products');
        if (resProducts.ok) {
            const products = await resProducts.json();
            console.log(`Products API OK. Count: ${products.length}`);
        } else {
            console.log(`Products API Failed: ${resProducts.status} ${resProducts.statusText}`);
        }

        console.log("Fetching blogs...");
        const resBlogs = await fetch('http://localhost:5000/api/blogs');
        if (resBlogs.ok) {
            const blogs = await resBlogs.json();
            console.log(`Blogs API OK. Count: ${blogs.length}`);
        } else {
            console.log(`Blogs API Failed: ${resBlogs.status} ${resBlogs.statusText}`);
        }

    } catch (err) {
        console.error("API Test Error:", err);
    }
};

// Wait for server to start
setTimeout(testAPI, 3000);
