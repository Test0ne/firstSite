let gameThread = function() {
    const p1Btn = document.querySelector("#plr1");
    const p2Btn = document.querySelector("#plr2");
    const rBtn = document.querySelector("#reset");
    const p1SS = document.querySelector("#p1Score");
    const p2SS = document.querySelector("#p2Score");
    const winningScore = document.querySelector('#playTo');
    let deb = false;
    
    let winScore = 3;
    let p1Score = 0;
    let p2Score = 0;
    function reset() {
        p2Score = 0;
        p1Score = 0;
        p1SS.innerText = p1Score;
        p2SS.innerText = p2Score;
    }
    function winDisplay(num) {
        p1Btn.toggleAttribute("disabled");
        p2Btn.toggleAttribute("disabled");
        rBtn.toggleAttribute("disabled");

        const newDV3 = document.createElement('div');
        addClasses("alert alert-success fade show mt-5 p-2",newDV3);
        const newh2 = document.createElement('h2');
        newh2.append(`Next game starting in 3 seconds...`);
        newh2.classList.add('h2ToModify');
        newDV3.append(newh2);
        document.querySelector(".mcontent").append(newDV3);

        let tPass = 0;
        let waitForNewG = setInterval(() => {
            tPass++;
            document.querySelector(".mcontent div h2").innerText = `Next game starting in ${(3 - tPass)} seconds...`;
            if (tPass >= 3) {
                newDV3.remove();reset();
                p1Btn.toggleAttribute("disabled");
                p2Btn.toggleAttribute("disabled");
                rBtn.toggleAttribute("disabled");
                deb = false;
                clearInterval(waitForNewG);
            };
        }, 950);
    }

    p1Btn.addEventListener('click',() => {
        if (deb) {return};
        deb = true;

        p1Score++;
        p1SS.innerText = p1Score;
        if (p1Score >= winScore) {winDisplay(1)} else {setTimeout(() => {deb=false},500)};
    });

    p2Btn.addEventListener('click',() => {
        if (deb) {return};
        deb = true;

        p2Score++;
        p2SS.innerText = p2Score;
        if (p2Score >= winScore) {winDisplay(2)} else {setTimeout(() => {deb=false},500)};
    });

    rBtn.addEventListener('click',() => {
        reset();
    });

    winningScore.addEventListener('change', function () {
        winScore = parseInt(this.value);
        reset();
    });
}
setTimeout(()=>{gameThread()},500);