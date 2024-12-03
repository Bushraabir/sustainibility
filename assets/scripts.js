// Example for a simple interactive element: Carbon Footprint Calculator
function calculateFootprint() {
    const energyUsage = document.getElementById('energy-usage').value;
    const footprint = energyUsage * 0.85; // Example calculation
    document.getElementById('footprint-result').innerText = `Your carbon footprint: ${footprint} tons of CO2 per year.`;
}
