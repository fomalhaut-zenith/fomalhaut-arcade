document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.game-card');
    
    // カードホバー時の微細な演出
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            // ここで音を鳴らしたり、さらに複雑なアニメーションを追加可能
            console.log('Game selected: ' + card.querySelector('.game-title').textContent);
        });
    });

    // タイトルロゴのランダムなフリッカー（ノイズ）
    const logo = document.querySelector('.logo');
    setInterval(() => {
        if (Math.random() > 0.95) {
            logo.style.opacity = '0.5';
            setTimeout(() => logo.style.opacity = '1', 50);
        }
    }, 100);
});
