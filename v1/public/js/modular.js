const addClasses = (cstr,targObj) => {for (let cls of cstr.split(' ')) {targObj.classList.add(cls)}};
const addAttributes = (alist,targObj) => {for (let at of alist) {targObj.setAttribute(at[0],at[1])}};

const mainThread = () => {
    var forms = document.querySelectorAll('.validate-form');
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