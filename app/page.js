"use client"
import { useEffect } from "react";

export default function Home() {

  useEffect(() => {
    // dynamically load your script.js file
    const script = document.createElement("script");
    script.src = "/script.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // cleanup if needed
      document.body.removeChild(script);
    };
  }, []); // run only once when page loads


  return (
   <>
   <div className="container">
    <div className="header">
      <h1>⚔️ Clash Royale Card Tracker</h1>
      <p>Analyze your card collection with detailed statistics</p>
    </div>

    <div className="input-section">
      <div className="input-group">
        <input type="text" id="playerTag" placeholder="Enter player tag (e.g. J8GV8VLU9)"/>
        <button className="fetch-btn" id="fetchBtn">Fetch Cards</button>
      </div>
    </div>

    <div className="toggle-buttons">
      <button className="toggle-btn active" id="statsBtn">📊 Statistics</button>
      <button className="toggle-btn " id="levelsBtn">Levels</button>
      <button className="toggle-btn" id="cardsBtn">🃏 All Cards</button>
      <button className="toggle-btn" id="greyBtn">Greyed out</button>
    </div>

    <div className="content-section">

      <div id="statisticsView">
        <div className="loading">Enter a player tag and click "Fetch Cards" to see statistics</div>
      </div>


      <div id="cardsView" className="hidden">
        <div className="loading">Enter a player tag and click "Fetch Cards" to see cards</div>
      </div>
      <div id="levelsView" className="hidden">
        <div className="loading">Enter player tag</div>
      </div>
      <div id="greyView" className="hidden">
        <div className="loading">Enter player tag</div>
      </div>
    </div>
  </div>


  <div id="cardModal" className="modal">
    <div className="modal-content">
      <div className="modal-header">
        <h2 id="modalTitle">Cards</h2>
        <button className="close">&times;</button>
      </div>
      <div className="modal-body">
        <div id="modalCards" className="cards-grid"></div>
      </div>
    </div>
  </div>
  
   </>
  );
}
