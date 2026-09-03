document.addEventListener('DOMContentLoaded', () => {
    // 1. JSONデータの非同期読み込み & 各セクションのカード自動生成
    const sectorsContainer = document.getElementById('sectors-container');

    if (sectorsContainer) {
        fetch('archive_data.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to load archive data.');
                }
                return response.json();
            })
            .then(data => {
                renderSectors(data);
            })
            .catch(error => {
                console.error('Error loading archive data:', error);
                sectorsContainer.innerHTML = '<p style="color: var(--amber-glow); font-family: var(--font-mono); text-align: center;">[ERROR]: Failed to load sector database.</p>';
            });
    }

    function renderSectors(data) {
        sectorsContainer.innerHTML = '';

        // 各エリアの定義順
        const sectorKeys = [
            { key: 'deep_sector', class: 'sector-deep_sector' },
            { key: 'sleep_corridor', class: 'sector-sleep_corridor' },
            { key: 'flash_memory', class: 'sector-flash_memory' },
            { key: 'lite_vault', class: 'sector-lite_vault' },
            { key: 'freq_lab', class: 'sector-freq_lab' },
            { key: 'glitch_sector', class: 'sector-glitch_sector' }
        ];

        sectorKeys.forEach(sInfo => {
            const sectorData = data[sInfo.key];
            if (!sectorData) return;

            const sectorBlock = document.createElement('div');
            sectorBlock.className = `sector-block ${sInfo.class}`;

            // セクションヘッダー
            const headerDiv = document.createElement('div');
            headerDiv.className = 'sector-header';
            headerDiv.innerHTML = `
                <div class="sector-title-row">
                    <h3 class="sector-title">${sectorData.title}</h3>
                    <span class="sector-subtitle">${sectorData.subtitle}</span>
                </div>
                <p class="sector-desc">${sectorData.desc}</p>
            `;
            sectorBlock.appendChild(headerDiv);

            // カードグリッド
            const cardsGrid = document.createElement('div');
            cardsGrid.className = 'sector-cards-grid';

            sectorData.items.forEach(item => {
                // 埋め込みスクリプト指定がある場合はカード内に動画プレイヤーを表示
                if (item.embed_script) {
                    const embedContainer = document.createElement('div');
                    embedContainer.className = 'archive-card embed-card';

                    let topMeta = '';
                    let bottomDetails = '';

                    if (sInfo.key === 'sleep_corridor') {
                        topMeta = `<div class="card-meta-top">[TYPE]: ${item.type}</div>`;
                        bottomDetails = `
                            <div class="card-details">
                                <span>DURATION: ${item.duration}</span>
                                <span style="color: var(--amber-glow);">[NICONICO PLAYER]</span>
                            </div>
                        `;
                    } else if (sInfo.key === 'flash_memory') {
                        topMeta = `<div class="card-meta-top">[CYCLE: 25/5]</div>`;
                        bottomDetails = `
                            <div class="card-details">
                                <span>GENRE: ${item.genre}</span>
                                <span style="color: var(--cyan-pulse);">[NICONICO PLAYER]</span>
                            </div>
                        `;
                    } else if (sInfo.key === 'glitch_sector') {
                        topMeta = `<div class="card-meta-top" style="color: #EC4899;">${item.status}</div>`;
                        bottomDetails = `
                            <div class="card-details">
                                <span style="color: #EC4899;">${item.warning}</span>
                                <span>[NICONICO PLAYER]</span>
                            </div>
                        `;
                    } else if (sInfo.key === 'lite_vault') {
                        topMeta = `<div class="card-meta-top">[DURATION: ${item.duration}] - [EMBED]</div>`;
                        bottomDetails = `
                            <div class="card-details">
                                <span>${item.type}</span>
                                <span style="color: var(--cyan-pulse);">[NICONICO PLAYER]</span>
                            </div>
                        `;
                    } else {
                        topMeta = `<div class="card-meta-top">[EMBED PLAYER]</div>`;
                        bottomDetails = `
                            <div class="card-details">
                                <span>STATUS: READY</span>
                                <span style="color: var(--cyan-pulse);">[NICONICO PLAYER]</span>
                            </div>
                        `;
                    }

                    const playerBox = document.createElement('div');
                    playerBox.className = 'embed-player-box';

                    // 埋め込み用scriptタグの追加
                    const scriptTag = document.createElement('script');
                    scriptTag.type = 'application/javascript';
                    scriptTag.src = item.embed_script;

                    // noscriptの代替リンク追加
                    const noscriptTag = document.createElement('noscript');
                    noscriptTag.innerHTML = `<a href="${item.url}" target="_blank" rel="noopener noreferrer">${item.title}</a>`;

                    playerBox.appendChild(scriptTag);
                    playerBox.appendChild(noscriptTag);

                    let middleContent = `<h4 class="card-title" style="margin-bottom: 12px;">${item.title}</h4>`;
                    if (sInfo.key === 'flash_memory') {
                        middleContent = `
                            <div class="cycle-badge">${item.cycle}</div>
                            <h4 class="card-title" style="margin-bottom: 12px;">${item.title}</h4>
                        `;
                    }

                    embedContainer.innerHTML = `
                        ${topMeta}
                        ${middleContent}
                    `;
                    embedContainer.appendChild(playerBox);
                    embedContainer.insertAdjacentHTML('beforeend', bottomDetails);

                    cardsGrid.appendChild(embedContainer);
                    return;
                }

                // 通常のリンクカード
                const card = document.createElement('a');
                card.href = item.url;
                card.target = '_blank';
                card.rel = 'noopener noreferrer';
                card.className = 'archive-card';

                // エリア別固有のHTML構造・スペック表記の組み立て
                let topMeta = '';
                let bottomDetails = '';

                if (sInfo.key === 'deep_sector') {
                    topMeta = `<div class="card-meta-top">[CODE]: ${item.code}</div>`;
                    bottomDetails = `<span>DURATION: ${item.duration}</span><span>${item.tracks}</span>`;
                } else if (sInfo.key === 'sleep_corridor') {
                    topMeta = `<div class="card-meta-top">[TYPE]: ${item.type}</div>`;
                    bottomDetails = `<span>DURATION: ${item.duration}</span><span>STATUS: READY</span>`;
                } else if (sInfo.key === 'flash_memory') {
                    topMeta = `<div class="card-meta-top">[CYCLE: 25/5]</div>`;
                    bottomDetails = `<span>GENRE: ${item.genre}</span><span>SYNC OK</span>`;
                } else if (sInfo.key === 'lite_vault') {
                    topMeta = `<div class="card-meta-top">[DURATION: ${item.duration}]</div>`;
                    bottomDetails = `<span>${item.type}</span><span style="color: var(--cyan-pulse);">[FAST LOAD]</span>`;
                } else if (sInfo.key === 'freq_lab') {
                    topMeta = `<div class="card-meta-top"><span class="freq-tag">${item.freq}</span></div>`;
                    bottomDetails = `<span>CLASSIFICATION: ${item.type}</span><span>TUNED</span>`;
                } else if (sInfo.key === 'glitch_sector') {
                    topMeta = `<div class="card-meta-top" style="color: #EC4899;">${item.status}</div>`;
                    bottomDetails = `<span style="color: #EC4899;">${item.warning}</span><span>CORRUPT</span>`;
                }

                // カードの中身
                let middleContent = `<h4 class="card-title">${item.title}</h4>`;
                if (sInfo.key === 'flash_memory') {
                    middleContent = `
                        <div class="cycle-badge">${item.cycle}</div>
                        <h4 class="card-title">${item.title}</h4>
                    `;
                }

                card.innerHTML = `
                    ${topMeta}
                    ${middleContent}
                    <div class="card-details">
                        ${bottomDetails}
                    </div>
                `;

                // ホバー時のイベントログ出力（コンソール）
                card.addEventListener('mouseenter', () => {
                    console.log(`[OBSERVED]: ${item.title} (${sInfo.key})`);
                });

                cardsGrid.appendChild(card);
            });

            sectorBlock.appendChild(cardsGrid);
            sectorsContainer.appendChild(sectorBlock);
        });
    }

    // 2. 外部通信アンテナモーダル制御 (Lit.link)
    const openModalBtn = document.getElementById('open-modal-btn');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const linkModal = document.getElementById('link-modal');

    if (openModalBtn && linkModal && closeModalBtn) {
        openModalBtn.addEventListener('click', () => {
            linkModal.classList.add('active');
        });

        closeModalBtn.addEventListener('click', () => {
            linkModal.classList.remove('active');
        });

        // モーダル背景クリックで閉じる
        linkModal.addEventListener('click', (e) => {
            if (e.target === linkModal) {
                linkModal.classList.remove('active');
            }
        });

        // ESCキーで閉じる
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && linkModal.classList.contains('active')) {
                linkModal.classList.remove('active');
            }
        });
    }

    // 3. タイトルロゴのランダムなフリッカー（ノイズ）演出
    const logo = document.querySelector('.logo');
    if (logo) {
        setInterval(() => {
            if (Math.random() > 0.92) {
                logo.style.opacity = '0.4';
                setTimeout(() => logo.style.opacity = '1', 60);
            }
        }, 1200);
    }
});
