let to;

$(document).ready(function(event){
    const queryString = window.location.search;
    const params = new URLSearchParams(queryString);
    to = params.get('to');

    $('#to_address').text(to);
});

function showVerificationStatus(alertType, message) {
    var content = $(".result-message");
    content.empty();
    content.append($("<div></div>")
    .addClass(`alert alert-${alertType}`)
    .attr("role", "alert")
    .text(message))
}

$("#verification").submit(function(event) {
    event.preventDefault();
    const code = $("#verification_code").val();

    // Twilio functions do not accept multipart/form-data
    const data = new URLSearchParams();
    data.append("to", to);
    data.append("verification_code", code);

    fetch("./check-verify", {
        method: 'POST',
        body: data
    })
    .then(response => response.json())
    .then(json => {
        if (json.success) {
            showVerificationStatus("success", "Verfication succeeded");
            setTimeout(function () {                
                window.location.href = '/success.html';
                $("#verification_code").val("");
            }, 3000);
        } else {
            console.log(json);
            showVerificationStatus("danger", "Invalid verification code");
            console.log('Fail!');
            $("#verification_code").val("");
        }
    })
    .catch(err => {
        console.log(err);
        showVerificationStatus("danger", "Something went wrong!");
        $("#verification_code").val("");
    });
});