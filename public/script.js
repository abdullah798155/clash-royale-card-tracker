
    let currentCards = [];

    let Globalstate = {};


    // Toggle between views
    document.getElementById('statsBtn').addEventListener('click', () => {
      setActiveView('stats');
    });
    document.getElementById('levelsBtn').addEventListener('click', () => {
      setActiveView('levels');
    });

    document.getElementById('cardsBtn').addEventListener('click', () => {
      setActiveView('cards');
    });
    document.getElementById('greyBtn').addEventListener('click', () => {
      setActiveView('grey');
    });

    function setActiveView(view) {
      const statsBtn = document.getElementById('statsBtn');
      const cardsBtn = document.getElementById('cardsBtn');
      const levelsBtn = document.getElementById('levelsBtn'); // Your new button
      const greyBtn = document.getElementById('greyBtn'); // Your new button
      const statsView = document.getElementById('statisticsView');
      const cardsView = document.getElementById('cardsView');
      const levelsView = document.getElementById('levelsView'); // New container
      const greyView = document.getElementById('greyView'); // New container


      // First, reset all buttons and hide all views
      [statsBtn, cardsBtn, levelsBtn, greyBtn].forEach(b => b.classList.remove('active'));
      [statsView, cardsView, levelsView, greyView].forEach(v => v.classList.add('hidden'));

      // Activate the selected view + button
      if (view === 'stats') {
        statsBtn.classList.add('active');
        statsView.classList.remove('hidden');
      } else if (view === 'cards') {
        cardsBtn.classList.add('active');
        cardsView.classList.remove('hidden');
      } else if (view === 'levels') {
        levelsBtn.classList.add('active');
        levelsView.classList.remove('hidden');
      } else if (view === 'grey') {
        greyBtn.classList.add('active');
        greyView.classList.remove('hidden');
      }
    }


    // Modal functionality
    const modal = document.getElementById('cardModal');
    const closeBtn = document.querySelector('.close');

    closeBtn.addEventListener('click', () => {
      modal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.style.display = 'none';
      }
    });

    function showModal(title, cards) {
      document.getElementById('modalTitle').textContent = title;
      document.getElementById('modalCards').innerHTML = displayCardsInModal(cards);
      modal.style.display = 'block';
    }

    function displayCardsInModal(cards) {
      return cards.map(card => {
        const isMaxed = card.level === 15;
        const rarity = (card.type || '').toLowerCase();
        const rarityOrder = ['common', 'rare', 'epic', 'legendary', 'champion'];

        cards.sort((a, b) => {
          return rarityOrder.indexOf(a.type) - rarityOrder.indexOf(b.type);
        });


        return `
          <div class="card ${isMaxed ? 'maxed' : ''} ${card.type}">
            <div class="card-name">${card.name}</div>
            <img src='${card.img}' style='height:160px;width:120px;'>
            <div class="card-detail"><strong>Rarity:</strong> ${card.type}</div>
            <div class="card-detail"><strong>Level:</strong> ${card.level}</div>
            <div class="card-detail">
              <strong>Count:</strong> 
              ${isMaxed ?
            '<span class="maxed-badge">MAXED</span>' :
            (card.level === 14 ? '0/50k Elite cards' : card.count)
          }
            </div>
          </div>
        `;
      }).join('');
    }

    // Fetch cards
    document.getElementById('fetchBtn').addEventListener('click', async () => {
      const tag = document.getElementById('playerTag').value.trim();
      if (!tag) {
        showError('Please enter a player tag.');
        return;
      }

      showLoading();

      try {
        const response = await fetch(`/api/playercards/${tag}`);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const data = await response.json();
        currentCards = data.cards || [];

        if (currentCards.length === 0) {
          showError('No cards found for this player.');
          return;
        }

        displayStatistics(currentCards);
        displayCards(currentCards);
        displayLevels(currentCards);
        displayGrey(currentCards);

      } catch (error) {
        showError('Error fetching data: ' + error.message);
      }
    });

    function showLoading() {
      document.getElementById('statisticsView').innerHTML = '<div class="loading">🔄 Loading card data...</div>';
      document.getElementById('cardsView').innerHTML = '<div class="loading">🔄 Loading cards...</div>';
    }

    function showError(message) {
      const errorHtml = `<div class="error">${message}</div>`;
      document.getElementById('statisticsView').innerHTML = errorHtml;
      document.getElementById('cardsView').innerHTML = errorHtml;
      //   document.getElementById('levelsView').innerHTML = errorHtml;
    }

    function filterCards(cards, filterType, filterValue = null) {
      return cards.filter(card => {
        const isMaxed = card.level === 15;
        const rarity = (card.type || '').toLowerCase();

        switch (filterType) {
          case 'total':
            return true;
          case 'maxed':
            return isMaxed;
          case 'notMaxed':
            return !isMaxed;
          case 'rarity':
            return rarity.includes(filterValue.toLowerCase());
          case 'rarityMaxed':
            return rarity.includes(filterValue.toLowerCase()) && isMaxed;
          case 'rarityNotMaxed':
            return rarity.includes(filterValue.toLowerCase()) && !isMaxed;
          case 'level':
            return card.level === filterValue;
          default:
            return true;
        }
      });
    }
    let levelHtml = '';

    function displayStatistics(cards) {
      const stats = calculateStats(cards);
      Globalstate = stats;
      var playername = cards[0].playername
      var trophies = cards[0].trophies
      var bestTrophies = cards[0].bestTrophies
      var clan = cards[0].clan
      var wins = cards[0].wins
      var losses = cards[0].losses
      var tcw = cards[0].tcw
      



      const statsHtml = `
        <h3>Playername : ${playername}</h3>
        <h3>Clan : ${clan}</h3>
        <h3>Trophies : ${trophies}</h3>
        <h3>Best trophies : ${bestTrophies}</h3>
        <h3>Wins: ${wins}</h3>
        <h3>losses: ${losses}</h3>
        <h3>Three crown wins: ${tcw}</h3>
        ${wins > losses 
    ? `<h3>
         You lost ${(losses / wins).toFixed(2)} matches for every win<br>
         Win rate: ${((wins / (wins + losses)) * 100).toFixed(1)}%<br>
         Loss rate: ${((losses / (wins + losses)) * 100).toFixed(1)}%<br>
         Three crown win rate: ${((tcw / wins) * 100).toFixed(1)}%
       </h3>` 
    : wins < losses 
    ? `<h3>
         You won ${(wins / losses).toFixed(2)} matches for every loss<br>
         Win rate: ${((wins / (wins + losses)) * 100).toFixed(1)}%<br>
         Loss rate: ${((losses / (wins + losses)) * 100).toFixed(1)}%<br>
         Three crown win rate: ${((tcw / wins) * 100).toFixed(1)}%
       </h3>` 
    : `<h3>
         Wins and losses are equal<br>
         Win rate: 50%<br>
         Loss rate: 50%<br>
         Three crown win rate: ${((tcw / wins) * 100).toFixed(1)}%
       </h3>`}


        <div class="stats-grid">
          <div class="stat-card">
            <button class="info-btn" onclick="showFilteredCards('total', null, 'All Cards (${stats.totalCards})')">i</button>
            <div class="stat-number">${stats.totalCards}</div>
            <div class="stat-label">Total Cards</div>
          </div>
          <div class="stat-card">
            <button class="info-btn" onclick="showFilteredCards('maxed', null, 'Maxed Cards (${stats.maxedCards})')">i</button>
            <div class="stat-number">${stats.maxedCards}</div>
            <div class="stat-label">Maxed Cards</div>
          </div>
          <div class="stat-card">
            <button class="info-btn" onclick="showFilteredCards('notMaxed', null, 'Not Maxed Cards (${stats.notMaxedCards})')">i</button>
            <div class="stat-number">${stats.notMaxedCards}</div>
            <div class="stat-label">Not Maxed</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">${Math.round(stats.maxedPercentage)}%</div>
            <div class="stat-label">Level 15 Completion Rate</div>
          </div>
        </div>

        <h3 style="margin-bottom: 15px; color: #333;">📈 Cards by Rarity</h3>
        <div class="rarity-stats">
          <div class="rarity-card common">
            <button class="info-btn" onclick="showFilteredCards('rarity', 'common', 'Common Cards (${stats.byRarity.common.total})')">i</button>
            <div style="font-size: 1.5rem;">${stats.byRarity.common.total}</div>
            <div>Common Cards</div>
            <div style="font-size: 0.9rem; opacity: 0.9;">
              <span onclick="showFilteredCards('rarityMaxed', 'common', 'Maxed Common Cards (${stats.byRarity.common.maxed})')" style="cursor: pointer; text-decoration: underline;">${stats.byRarity.common.maxed} maxed</span>
            </div>
          </div>
          <div class="rarity-card rare">
            <button class="info-btn" onclick="showFilteredCards('rarity', 'rare', 'Rare Cards (${stats.byRarity.rare.total})')">i</button>
            <div style="font-size: 1.5rem;">${stats.byRarity.rare.total}</div>
            <div>Rare Cards</div>
            <div style="font-size: 0.9rem; opacity: 0.9;">
              <span onclick="showFilteredCards('rarityMaxed', 'rare', 'Maxed Rare Cards (${stats.byRarity.rare.maxed})')" style="cursor: pointer; text-decoration: underline;">${stats.byRarity.rare.maxed} maxed</span>
            </div>
          </div>
          <div class="rarity-card epic">
            <button class="info-btn" onclick="showFilteredCards('rarity', 'epic', 'Epic Cards (${stats.byRarity.epic.total})')">i</button>
            <div style="font-size: 1.5rem;">${stats.byRarity.epic.total}</div>
            <div>Epic Cards</div>
            <div style="font-size: 0.9rem; opacity: 0.9;">
              <span onclick="showFilteredCards('rarityMaxed', 'epic', 'Maxed Epic Cards (${stats.byRarity.epic.maxed})')" style="cursor: pointer; text-decoration: underline;">${stats.byRarity.epic.maxed} maxed</span>
            </div>
          </div>
          <div class="rarity-card legendary">
            <button class="info-btn" onclick="showFilteredCards('rarity', 'legendary', 'Legendary Cards (${stats.byRarity.legendary.total})')">i</button>
            <div style="font-size: 1.5rem;">${stats.byRarity.legendary.total}</div>
            <div>Legendary Cards</div>
            <div style="font-size: 0.9rem; opacity: 0.9;">
              <span onclick="showFilteredCards('rarityMaxed', 'legendary', 'Maxed Legendary Cards (${stats.byRarity.legendary.maxed})')" style="cursor: pointer; text-decoration: underline;">${stats.byRarity.legendary.maxed} maxed</span>
            </div>
          </div>
          <div class="rarity-card champion">
            <button class="info-btn" onclick="showFilteredCards('rarity', 'champion', 'Champion Cards (${stats.byRarity.champion.total})')">i</button>
            <div style="font-size: 1.5rem;">${stats.byRarity.champion.total}</div>
            <div>Champion Cards</div>
            <div style="font-size: 0.9rem; opacity: 0.9;">
              <span onclick="showFilteredCards('rarityMaxed', 'champion', 'Maxed Champion Cards (${stats.byRarity.champion.maxed})')" style="cursor: pointer; text-decoration: underline;">${stats.byRarity.champion.maxed} maxed</span>
            </div>
          </div>
        </div>

        <h3 style="margin: 30px 0 15px; color: #333;">🎯 Cards Yet to be Maxed</h3>
        <div class="rarity-stats">
          ${stats.byRarity.common.notMaxed > 0 ? `
            <div class="rarity-card common">
              <button class="info-btn" onclick="showFilteredCards('rarityNotMaxed', 'common', 'Common Cards Not Maxed (${stats.byRarity.common.notMaxed})')">i</button>
              <div style="font-size: 1.5rem;">${stats.byRarity.common.notMaxed}</div>
              <div>Common Not Maxed</div>
            </div>
          ` : ''}
          ${stats.byRarity.rare.notMaxed > 0 ? `
            <div class="rarity-card rare">
              <button class="info-btn" onclick="showFilteredCards('rarityNotMaxed', 'rare', 'Rare Cards Not Maxed (${stats.byRarity.rare.notMaxed})')">i</button>
              <div style="font-size: 1.5rem;">${stats.byRarity.rare.notMaxed}</div>
              <div>Rare Not Maxed</div>
            </div>
          ` : ''}
          ${stats.byRarity.epic.notMaxed > 0 ? `
            <div class="rarity-card epic">
              <button class="info-btn" onclick="showFilteredCards('rarityNotMaxed', 'epic', 'Epic Cards Not Maxed (${stats.byRarity.epic.notMaxed})')">i</button>
              <div style="font-size: 1.5rem;">${stats.byRarity.epic.notMaxed}</div>
              <div>Epic Not Maxed</div>
            </div>
          ` : ''}
          ${stats.byRarity.legendary.notMaxed > 0 ? `
            <div class="rarity-card legendary">
              <button class="info-btn" onclick="showFilteredCards('rarityNotMaxed', 'legendary', 'Legendary Cards Not Maxed (${stats.byRarity.legendary.notMaxed})')">i</button>
              <div style="font-size: 1.5rem;">${stats.byRarity.legendary.notMaxed}</div>
              <div>Legendary Not Maxed</div>
            </div>
          ` : ''}
          ${stats.byRarity.champion.notMaxed > 0 ? `
            <div class="rarity-card champion">
              <button class="info-btn" onclick="showFilteredCards('rarityNotMaxed', 'champion', 'Champion Cards Not Maxed (${stats.byRarity.champion.notMaxed})')">i</button>
              <div style="font-size: 1.5rem;">${stats.byRarity.champion.notMaxed}</div>
              <div>Champion Not Maxed</div>
            </div>
          ` : ''}
        </div>
      `;
      levelHtml = ` <div class="stats-grid">`;
      for (let i = 1; i <= 15; i++) {
        levelHtml += `   <div class="stat-card">
                 <button class="info-btn" onclick="showFilteredCards('level', ${i}, 'Cards at ${i}')">i</button>
                <h4>Level ${i}</h4>
            <div class="stat-number">${((stats.levels[i] * 100) / stats.totalCards).toFixed(2)}
%</div>

            <div class="stat-label">${stats.levels[i]}/${stats.totalCards}</div>
          </div>`
      }
      levelHtml += `</div>`

      document.getElementById('statisticsView').innerHTML = statsHtml;
    }

    function showFilteredCards(filterType, filterValue, title) {
      const filteredCards = filterCards(currentCards, filterType, filterValue);
      showModal(title, filteredCards);
    }

    // Make function global for onclick handlers
    window.showFilteredCards = showFilteredCards;

    function calculateStats(cards) {
      const stats = {
        totalCards: cards.length,
        maxedCards: 0,
        notMaxedCards: 0,
        maxedPercentage: 0,
        levels: [],
        byRarity: {
          common: { total: 0, maxed: 0, notMaxed: 0 },
          rare: { total: 0, maxed: 0, notMaxed: 0 },
          epic: { total: 0, maxed: 0, notMaxed: 0 },
          legendary: { total: 0, maxed: 0, notMaxed: 0 },
          champion: { total: 0, maxed: 0, notMaxed: 0 }
        }
      };
      stats.levels = Array(16).fill(0);
      cards.forEach(card => {
        const isMaxed = card.level === 15;
        stats.levels[card.level]++;
        const rarity = (card.type || '').toLowerCase();

        if (isMaxed) {
          stats.maxedCards++;
        } else {
          stats.notMaxedCards++;
        }

        // Count by rarity
        if (rarity.includes('common')) {
          stats.byRarity.common.total++;
          if (isMaxed) stats.byRarity.common.maxed++;
          else stats.byRarity.common.notMaxed++;
        } else if (rarity.includes('rare')) {
          stats.byRarity.rare.total++;
          if (isMaxed) stats.byRarity.rare.maxed++;
          else stats.byRarity.rare.notMaxed++;
        } else if (rarity.includes('epic')) {
          stats.byRarity.epic.total++;
          if (isMaxed) stats.byRarity.epic.maxed++;
          else stats.byRarity.epic.notMaxed++;
        } else if (rarity.includes('legendary')) {
          stats.byRarity.legendary.total++;
          if (isMaxed) stats.byRarity.legendary.maxed++;
          else stats.byRarity.legendary.notMaxed++;
        } else if (rarity.includes('champion')) {
          stats.byRarity.champion.total++;
          if (isMaxed) stats.byRarity.champion.maxed++;
          else stats.byRarity.champion.notMaxed++;
        }
      });
      console.log("level array: ", stats.levels)
      stats.maxedPercentage = stats.totalCards > 0 ? (stats.maxedCards / stats.totalCards) * 100 : 0;

      return stats;
    }


    function displayCards(cards) {
      const cardsHtml = cards.map(card => {
        const isMaxed = card.level === 15;
        const rarity = (card.type || '').toLowerCase();
        const rarityOrder = ['common', 'rare', 'epic', 'legendary', 'champion'];

        cards.sort((a, b) => {
          return rarityOrder.indexOf(a.type) - rarityOrder.indexOf(b.type);
        });

        return `
          <div class="card ${isMaxed ? 'maxed' : ''} ${card.type}">
            <div class="card-name">${card.name}</div>
            <img src='${card.img}' style='height:160px;width:120px;'>
            <div class="card-detail"><strong>Rarity:</strong> ${card.type}</div>
            <div class="card-detail"><strong>Level:</strong> ${card.level}</div>
            <div class="card-detail">
              <strong>Count:</strong> 
              ${isMaxed ?
            '<span class="maxed-badge">MAXED</span>' :
            (card.level === 14 ? '0/50k Elite cards' : card.count)
          }
            </div>
          </div>
        `;
      }).join('');


      document.getElementById('cardsView').innerHTML = `
        <div class="cards-grid">
          ${cardsHtml}
        </div>
      `;

    }

    function displayLevels(cards) {
      let levelEle = document.getElementById('levelsView');
      levelEle.innerHTML = levelHtml;
    }

    function getSum(level, type) {
      if (type === 'common') var array = [0, 1, 2, 4, 10, 20, 50, 100, 200, 400, 800, 1000, 1500, 3000, 5000];

      if (type === 'rare') var array = [0, -1, -1, 1, 2, 4, 10, 20, 50, 100, 200, 400, 500, 750, 1250];

      if (type === 'epic') var array = [0, -1, -1, -1, -1, -1, 1, 2, 4, 10, 20, 40, 50, 100, 200];

      if (type === 'legendary') var array = [0, -1, -1, -1, -1, -1, -1, -1, -1, 1, 2, 4, 6, 10, 20];

      if (type === 'champion') var array = [0, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 1, 2, 8, 20];
      let sum = 0;
      for (let i = level + 1; i < 15; i++) sum += array[i];
      return sum;
    }


    function displayGrey(cards) {

      var maxoutsum = 0;
      var eliteCards = 0;
      const common = [0, 1, 2, 4, 10, 20, 50, 100, 200, 400, 800, 1000, 1500, 3000, 5000];

      const rare = [0, -1, -1, 1, 2, 4, 10, 20, 50, 100, 200, 400, 500, 750, 1250];

      const epic = [0, -1, -1, -1, -1, -1, 1, 2, 4, 10, 20, 40, 50, 100, 200];

      const legendary = [0, -1, -1, -1, -1, -1, -1, -1, -1, 1, 2, 4, 6, 10, 20];

      const champion = [0, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 1, 2, 8, 20];

      const eliteMultiplier={
        "common":1,
        "rare":5,
        "epic":20,
        "legendary":1500,
        "champion":4000
      }
      // let GreyEle = document.getElementById('greyView');
      // GreyEle.innerHTML = 'heh vm';
      const rarityOrder = ['common', 'rare', 'epic', 'legendary', 'champion'];

      cards.sort((a, b) => {
        return rarityOrder.indexOf(a.type) - rarityOrder.indexOf(b.type);
      });

      let greyCommon = 0, greyRare = 0, greyEpic = 0, greyLegend = 0, greyChamp = 0;
      const cardsHtml = cards.map(card => {
        const isMaxed = card.level === 15;
        let isgrey = false;
        if (card.level == 14 || card.level == 15) {
          switch (card.type) {
            case 'common':
              greyCommon++;
              break;
            case 'rare':
              greyRare++;
              break;
            case 'epic':
              greyEpic++;
              break;
            case 'legendary':
              greyLegend++;
              break;
            case 'champion':
              greyChamp++;
              break;
          }

          isgrey = true;
        }
        else if (card.type === 'common') {
          if (card.count >= getSum(card.level, card.type)) { isgrey = true; greyCommon++; }
        }
        else if (card.type === 'rare') {
          if (card.count >= getSum(card.level, card.type)) { isgrey = true; greyRare++; }
        }
        else if (card.type === 'epic') {
          if (card.count >= getSum(card.level, card.type)) { isgrey = true; greyEpic++; }
        }
        else if (card.type === 'legendary') {
          if (card.count >= getSum(card.level, card.type)) { isgrey = true; greyLegend++; }
        }
        else if (card.type === 'champion') {
          if (card.count >= getSum(card.level, card.type)) { isgrey = true; greyChamp++; }
        }

        if (!isgrey) maxoutsum += getSum(card.level, card.type) - card.count;
        if(isgrey && card.level<14) eliteCards+=(card.count-getSum(card.level, card.type)) * eliteMultiplier[card.type]

        return `
       <div class="card ${isgrey ? 'greyed' : ''} ${card.type}">
        <div class="card-name">${card.name}</div>
        <img src='${card.img}' style='height:160px;width:120px;'>
        <div class="card-detail"><strong>Rarity:</strong> ${card.type}</div>
        <div class="card-detail"><strong>Level:</strong> ${card.level}</div>
        <div class="card-detail">
          <strong>Count:</strong> 
          ${isMaxed ?
            '<span class="maxed-badge">MAXED</span>' :
            (card.level === 14 ? '0/50k Elite cards' : card.count)
          }
          </div>
        ${!isgrey ? `<div class="card-detail"><strong>Required:</strong> ${getSum(card.level, card.type) - card.count} to grey out [*${getSum(card.level, card.type)}]</div>` : `You get Elite wild cards: ${(card.count-getSum(card.level, card.type)) * eliteMultiplier[card.type]} <br> Max grey out criterion : ${getSum(card.level, card.type)} <br> Left over cards: ${card.count-getSum(card.level, card.type)} * ${eliteMultiplier[card.type]}(EliteMultiplier)`}
        </div>
          `;
      }).join('');


      console.log("greylegend", greyLegend)
      document.getElementById('greyView').innerHTML = `
      <h2>${maxoutsum} cards required to get all cards to max</h2>
      <h3>Total cards converted to elite wild cards : ${eliteCards}</h3>
        <h3>Total greyed out = ${greyCommon + greyRare + greyLegend + greyEpic + greyChamp}/${Globalstate.totalCards}</h3>
        <h3>Common : ${greyCommon}/${Globalstate.byRarity.common.total} [Left : ${Globalstate.byRarity.common.total - greyCommon}]</h3>
        <h3>Rare : ${greyRare}/${Globalstate.byRarity.rare.total} [Left : ${Globalstate.byRarity.rare.total - greyRare}]</h3>
        <h3>Epic : ${greyEpic}/${Globalstate.byRarity.epic.total} [Left : ${Globalstate.byRarity.epic.total - greyEpic}]</h3>
        <h3>Legendary : ${greyLegend}/${Globalstate.byRarity.legendary.total} [Left : ${Globalstate.byRarity.legendary.total - greyLegend}]</h3>
        <h3>Champions : ${greyChamp}/${Globalstate.byRarity.champion.total} [Left : ${Globalstate.byRarity.champion.total - greyChamp}]</h3>
        <div class="cards-grid">
          ${cardsHtml}
        </div>
      `;

    }
  