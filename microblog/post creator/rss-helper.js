// Function to get current date in RSS format
function getRSSDate() {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    const now = new Date();
    const dayName = days[now.getUTCDay()];
    const monthName = months[now.getUTCMonth()];
    const day = String(now.getUTCDate()).padStart(2, '0');
    const year = now.getUTCFullYear();
    const time = now.toTimeString().split(' ')[0];
    
    return `${dayName}, ${day} ${monthName} ${year} ${time} GMT`;
}

// Function to generate a new XML item
function generateXMLItem(title, description = '', imageUrl = '') {
    const date = getRSSDate();
    const guid = Date.now(); // Uses timestamp as guid
    
    let descriptionContent = description;
    if (imageUrl) {
        descriptionContent += `<![CDATA[<img src="${imageUrl}" alt="Post image">]]>`;
    }
    
    return `    <item>
        <title>${title}</title>
        <description>${descriptionContent}</description>
        <pubDate>${date}</pubDate>
        <guid>${guid}</guid>
    </item>`;
}

// Example usage:
// const newPost = generateXMLItem(
//     "My New Post", 
//     "This is the content", 
//     "path/to/image.jpg"
// );
// console.log(newPost);