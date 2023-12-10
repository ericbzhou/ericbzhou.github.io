// ==================== //
// General Information //
// ==================== //
function generateInformation(information) {
    const prefix = `
    <div class="information">
        <h1>General Information</h1>
    `;
    const content = information.map((item) => `
        <p><span class="information-title">${item.title}</span><span class="information-content">${item.content}</span></p>
    `).join("");
    const suffix = `
    </div>
    `;
    return prefix + content + suffix;
}

// ==================== //
// Research Interests //
// ==================== //
function generateResearchInterests(research_interests) {

}