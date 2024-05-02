window.onload = function () {
    const canvas = document.getElementById('map');
    const ctx = canvas.getContext('2d');

    const gridSizeX = 6; // Number of vertical grid lines
    const gridSizeY = 4; // Number of horizontal grid lines

    const cellWidth = canvas.width / gridSizeX;
    const cellHeight = canvas.height / gridSizeY;

    // Draw grid lines
    ctx.beginPath();
    for (let i = 0; i <= gridSizeX; i++) {
        const x = i * cellWidth;
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
    }
    for (let j = 0; j <= gridSizeY; j++) {
        const y = j * cellHeight;
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
    }
    ctx.strokeStyle = '#aaa';
    ctx.stroke();

    // Add players (dummy data for demonstration)
    const players = [
        { x: 1, y: 1 },
        { x: 3, y: 2 }
        // Add more players as needed
    ];

    players.forEach(player => {
        const x = player.x * cellWidth - 10; // Adjust for player size
        const y = player.y * cellHeight - 10; // Adjust for player size
        ctx.beginPath();
        ctx.arc(x, y, 10, 0, Math.PI * 2); // Player radius is set to 10
        ctx.fillStyle = 'red';
        ctx.fill();
    });
};