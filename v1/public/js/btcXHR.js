const setBtcPrice = async () => {
    try {
        const res = await fetch('https://api.cryptonator.com/api/full/btc-usd');
        const data = await res.json();
        console.log("PARSED DATA: "+data.ticker.price)
        const bT = document.querySelector('#btcPrice')
        if (bT) {bT.innerText = parseFloat(data.ticker.price).toFixed(2)}
    } catch {
        console.log("ERROR GETTING BTC PRICE!")
    }
}
setBtcPrice();