const addClasses = (cstr,targObj) => {for (let cls of cstr.split(' ')) {targObj.classList.add(cls)}};
const addAttributes = (alist,targObj) => {for (let at of alist) {targObj.setAttribute(at[0],at[1])}};

function makeRequest(method, url, data) {
    return new Promise(function (resolve, reject) {
        console.log("XHR MakeRequest",data)
        let xhr = new XMLHttpRequest();
        xhr.open(method, url, true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onload = function () {
            if (this.status >= 200 && this.status < 300) {
                resolve(xhr.responseText);
            } else {
                reject({
                    status: this.status,
                    statusText: xhr.statusText
                });
            }
        };
        xhr.onerror = function () {
            reject({
                status: this.status,
                statusText: xhr.statusText
            });
        };
        xhr.send(JSON.stringify(data));
    });
};

const mainThread = () => {
    let forms = document.querySelectorAll('.validate-form');
    Array.prototype.filter.call(forms, function(form) {
        console.log("ADDING FORM VALIDATION EVENTLISTENER")
        form.addEventListener('submit', function(event) {
            if (form.checkValidity() === false) {
                event.preventDefault();
                event.stopPropagation();
            }
            form.classList.add('was-validated');
        }, false);
    });

    console.log("Looking for userSearch")
    // const form = document.getElementById('userSearch');
    // form.addEventListener('submit', async function(event) {
    //     event.preventDefault();
    //     event.stopPropagation();

    //     const sname = document.getElementById('username_textbox').value;
    //     console.log("Getting user ID with: ",sname)
        
    //     const result = await makeRequest("POST", "/rbx/getUserId/", {username: sname});
    //     console.log("XHR RESULT: ", result);
    //     console.dir(result);
    //     const container = document.getElementById('icontainer');
    //     const userID = parseInt(result);
    //     if (userID > 0) {
    //         const p = document.createElement('p')
    //         p.innerText = "UserId: "+result
    //         container.append(p);
            
    //         console.log("Getting inventory with: ",userID)
    //         const inventory = await makeRequest("GET", `/rbx/getInventory/${userID}`);
    //         console.log("XHR RESULT: ", inventory);
    //         console.dir(inventory);
    //         const p2 = document.createElement('p');
    //         p2.innerText = inventory
    //         container.append(p2);
    //     } else {
    //         const p = document.createElement('p');
    //         p.innerText = "Error: "+JSON.parse(result).errorMessage
    //         container.append(p);
    //     }
    // }, false);

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
}
window.addEventListener('load', mainThread(), false);