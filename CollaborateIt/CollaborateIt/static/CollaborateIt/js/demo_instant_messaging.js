$(document).ready(function() {
    console.log("instant messaging code");
    connect();

    //instant messaging code
    //
    var selfEasyrtcid = "";

    function addToConversation(who, msgType, content) {
        // Escape html special characters, then add linefeeds.
        content = content.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        content = content.replace(/\n/g, '<br />');
        document.getElementById('conversation').innerHTML +=
            "<b>" + who + ":</b>&nbsp;" + content + "<br />";
    }


    function connect() {
        easyrtc.setSocketUrl(":8080"); // as in: 
        //        /home/nirmit/Collaborate-It/CollaborateIt/CollaborateIt/static/CollaborateIt/js/easyrtc.js:
        // 8270:                self.webSocket = io.connect(serverPath, connectionOptions);
        // 8273:                     throw "io.connect failed";

        // its correct
        easyrtc.setPeerListener(addToConversation);
        easyrtc.setRoomOccupantListener(convertListToButtons);
        easyrtc.connect("easyrtc.instantMessaging", loginSuccess, loginFailure);
    }


    function convertListToButtons(roomName, occupants, isPrimary) {
        var otherClientDiv = document.getElementById('otherClients');
        while (otherClientDiv.hasChildNodes()) {
            otherClientDiv.removeChild(otherClientDiv.lastChild);
        }

        for (var easyrtcid in occupants) {

            var clickEvent = function(easyrtcid) {
                console.log("button clicked");
                return function() {
                    console.log("send to" + easyrtcid);
                    sendStuffWS(easyrtcid);
                };
            }
            console.log(easyrtcid)
            var button = document.createElement('button');
            button.className = "btn btn-primary";
            button.onclick = clickEvent(easyrtcid);
            var label = document.createTextNode("Send to " + easyrtc.idToName(easyrtcid));
            button.appendChild(label);
            otherClientDiv.innerHTML += "<br><br>";

            otherClientDiv.appendChild(button);
        }
        if (!otherClientDiv.hasChildNodes()) {
            otherClientDiv.innerHTML = "<em>Nobody else logged in to talk to...</em>";
        }
    }


    function sendStuffWS(otherEasyrtcid) {
        console.log("inside sendStuffWS");
        var text = document.getElementById('sendMessageText').value;
        console.log("text: " + text);
        if (text.replace(/\s/g, "").length === 0) { // Don't send just whitespace
            return;
        }

        console.log("before sending");
        easyrtc.sendDataWS(otherEasyrtcid, "message", text);
        console.log("after sending");
        addToConversation("Me", "message", text);
        document.getElementById('sendMessageText').value = "";
    }


    function loginSuccess(easyrtcid) {
        selfEasyrtcid = easyrtcid;
        document.getElementById("iam").innerHTML = "You: " + "<b>" + easyrtcid + "</b>";
    }


    function loginFailure(errorCode, message) {
        easyrtc.showError(errorCode, message);
    }
});
