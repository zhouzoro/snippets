function uploadFile(updateProgressFunc) {
    var tempImgInput = $('<input>').attr({
        'type': 'file',
        'class': 'temp-input'
    }).css({
        'display': 'none',
        'position': 'absolute'
    }).change(function() {

        if (this.files && this.files[0]) {
            function updateProg(oEvent) {
                var pct = Math.ceil(100 * oEvent.loaded / oEvent.total);
                var height = 100 - pct;
            };
            var updateProgress = updateProgressFunc ? updateProgressFunc : updateProg;
            var fileUploadReq = new XMLHttpRequest();
            fileUploadReq.withCredentials = false;
            fileUploadReq.open('POST', '/files');

            fileUploadReq.onload = function() {
                var json = JSON.parse(fileUploadReq.responseText);
                console.log(json.location);
                $('.temp-input').remove();
            };
            fileUploadReq.upload.addEventListener("progress", updateProgress, false);
            var formData = new FormData();
            formData.append('file', this.files[0], this.files[0].name);
            fileUploadReq.send(formData);
        }
    });
    $('body').append(tempImgInput);
    tempImgInput.click();
}