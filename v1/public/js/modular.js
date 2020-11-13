const addClasses = (cstr,targObj) => {for (let cls of cstr.split(' ')) {targObj.classList.add(cls)}};
const addAttributes = (alist,targObj) => {for (let at of alist) {targObj.setAttribute(at[0],at[1])}};
const makeRandRGB = () => {
    let rnd = () => {return Math.floor(Math.random() * 255)};
    return `rgb(${rnd()},${rnd()},${rnd()})`;
};
const insertElements = function(child,parent,classList) {
    newP2.append(newHR);
};
const createAlert = async (message,color) =>{
    const alertU = document.createElement('div');
    addClasses("alert fade show mt-5 p-2 text-center",alertU);
    alertU.setAttribute("role","alert");
    alertU.setAttribute("id",color);

    const alertMsg = document.createElement('strong');
    alertMsg.append(message);
    alertU.append(alertMsg);

    const alertBtn = document.createElement('button');
    addClasses("btn-close",alertBtn);
    addAttributes([["data-dismiss","alert"],["aria-label","close"],["type","button"]],alertBtn);
    alertU.append(alertBtn);

    const alertBTX = document.createElement('span');
    alertBTX.setAttribute("aria-hidden","true");
    alertBtn.append(alertBTX);

    document.querySelector('#overMessages').append(alertU);
    await new Promise((a, _) => setTimeout(() => {
        (new bootstrap.Alert(document.querySelector('.alert'))).close();
        a(true);
    }, 2000))
    return (false)
};
const mainThread = () => {
    var forms = document.querySelectorAll('.validate-form');
    var validation = Array.prototype.filter.call(forms, function(form) {
        console.log("ADDING FORM VALIDATION EVENTLISTENER")
        form.addEventListener('submit', function(event) {
            if (form.checkValidity() === false) {
                event.preventDefault();
                event.stopPropagation();
            }
            form.classList.add('was-validated');
        }, false);
    });

    if (window.location.href.includes("post")) {
        const pfrm = document.querySelector('#postForm ');
        if (pfrm) {
            console.log("Post button located, setting event handlers.")
            const pbtn = document.querySelector('#postForm button');
            let deb = false;
            pfrm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const mbox = document.querySelector(".msgbox");
                const message = mbox.value;
                if (deb) {return};
                deb = true;
                pbtn.toggleAttribute("disabled");
                if (!message.trim()) {
                    createAlert ("You must type a message!!!","inner-messageR").then((e)=>{
                        deb = e;
                        pbtn.toggleAttribute("disabled");
                    });
                    return 
                }

                //createPost("Name",message);
                let post = {username: "Abel", comment: message};
                await axios.post("/post",{ post });
                createAlert("Message posted!","inner-messageG").then((e)=>{
                    deb = e;
                    pbtn.toggleAttribute("disabled");
                    window.location.reload(false); 
                });
                mbox.value = "";
            });
        } else {
            console.log("No POST button located.")
        };
        const cfrm = document.querySelector('#commentForm');
        if (cfrm) {
            console.log("Comment button located, setting event handlers.")
            const cbtn = document.querySelector('#commentForm button');
            let deb = false;
            cfrm.addEventListener('submit',async (e) => {
                e.preventDefault();
                const mbox = document.querySelector(".msgbox");
                const message = mbox.value;
                if (deb) {return};
                deb = true;
                cbtn.toggleAttribute("disabled");
                if (!message.trim()) {
                    createAlert ("You must type a message!!!","inner-messageR").then((e)=>{
                        deb = e;
                        cbtn.toggleAttribute("disabled");
                    });
                    return 
                }

                //createPost("Name",message);
                console.log("IS THIS THE FOOKIN CFRM VALUE? "+cbtn.name)
                let comment = {username: "Abel", comment: message};
                const res = await axios.post(cfrm.name,{comment});
                createAlert("Message posted!","inner-messageG").then((e)=>{
                    deb = e;
                    cbtn.toggleAttribute("disabled");
                    window.location.reload(false); 
                });
                mbox.value = "";
            });
        } else {
            console.log("No Comment button located.")
        };
    };

    const cbtn = document.querySelector('#cancelBtn ');
    if (cbtn) {
        console.log("cancelBtn located, setting event handlers.")
        cbtn.addEventListener('clicked',function (e) {
            console.log("CLICKED!!!!!!!!!!!!!!!")
            e.preventDefault;
            e.stopPropagation;
        });
    } else {
        console.log("No cancelBtn located.")
    };
    if (window.location.href.includes("show")) {
        const sfrm = document.querySelector("#showForm");
        if (sfrm) {
            console.log("Search show button located, setting event handlers.")
            let deb = false;
            const sbtn = document.querySelector('#showForm button');
            sfrm.addEventListener('submit',async (e) => {
                e.preventDefault();
                const mbox = document.querySelector(".msgbox");
                if (deb) {return};
                deb = true;
                sbtn.toggleAttribute("disabled");
                if (!mbox.value.trim()) {
                    createAlert ("You must type a message!!!","inner-messageR").then((e)=>{deb=e;sbtn.toggleAttribute("disabled");});
                    return 
                };
                
                try {
                    const config = { params: { q: mbox.value} };
                    const res = await axios.get("http://api.tvmaze.com/search/shows",config);
                    const psCont = document.querySelector('#searchCont');

                    while (psCont.firstChild) {psCont.removeChild(psCont.firstChild)}
                    for (let result of res.data) {
                        const newDV1 = document.createElement('div');
                        addClasses("col-10 row m-0 p-4 mb-3 border rounded",newDV1);

                        const anc = document.createElement('a');
                        anc.setAttribute("href",result.show.url);
                        let img = result.show.image;
                        if (img) {
                            img = document.createElement('IMG');
                            img.src = result.show.image.medium;
                            addClasses("border m-0 p-0 rounded",img);
                        } else {
                            img = document.createElement('h2');
                            img.innerText = "NO IMAGE";
                            addClasses("border rounded bg-light",img);
                        };
                        addClasses("col-3 m-0 p-0 row justify-content-center align-items-center text-center",anc);
                        anc.append(img);
                        newDV1.append(anc);

                        const newUL = document.createElement('ul');
                        addClasses("list-group col-9 m-0 p-2 pl-4",newUL);
                        newDV1.append(newUL);

                        const sdata = [`<h2>Name</h2> ${result.show.name}`];
                        if (result.show.network) {sdata.push(`<h2>Network</h2> ${result.show.network.name}`)};
                        if (result.show.rating.average) {sdata.push(`<h2>Rating</h2> ${result.show.rating.average} / 10`)};
                        if (result.show.summary) {sdata.push(`<h2>Summary</h2> ${result.show.summary}`)};
                        for (let data of sdata) {
                            const nLI = document.createElement('li');
                            nLI.innerHTML = data;
                            addClasses("list-group-item my-1",nLI);
                            newUL.append(nLI);
                        };


                        psCont.append(newDV1);
                    };
                    sbtn.toggleAttribute("disabled");
                    deb = false;
                    mbox.value = "";
                } catch {
                    createAlert ("Error getting search results! try again.","inner-messageR").then((e)=>{deb=e;sbtn.toggleAttribute("disabled");mbox.value = "";});
                };
            });
        } else {
            console.log("No search show button located.")
        };
    };

    let btn = document.querySelector("#obtn");
    if (btn) {
        console.log("Found button, adding event handlers.")
        btn.addEventListener('click',function() {
            let coont = document.querySelector(".mcontent h1");
            coont.style.color = makeRandRGB();
            coont.innerText = "CAKED!";
        });
        btn.addEventListener('mouseenter',() => {console.log('menter')});
    } else {
        console.log("Could not find orders button!")
    }

    let ps = document.querySelectorAll("p");
    for (let p of ps) {
        p.addEventListener('click', () => {p.style.color = makeRandRGB();})
    }
}
window.addEventListener('load', mainThread(), false);