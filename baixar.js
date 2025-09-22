document.getElementById('BotaoBaixarPNG').addEventListener('click', function() {
    const canvas = document.getElementById('quadro');
    const link = document.createElement('a');
    link.download = 'Piin.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
});

