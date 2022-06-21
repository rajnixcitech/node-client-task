const imgInput = document.querySelector('#change');
const inpuTColor = document.querySelector('#colorHex')

if (!window.EyeDropper) {
    alert("Your browser does not support this feature")
}

const eyeDropper = new EyeDropper()
const pickerBtn = document.querySelector('.open-picker')




pickerBtn.addEventListener('click', function () {
    eyeDropper.open()
        .then(res => {
            inpuTColor.value = res.sRGBHex
        })
        .catch(err => {
            console.log("User canceled the selection.");
        })
})