const configuration = {'iceServers': [{'urls': 'stun:stun.l.google.com:19302'}]}
const peerConnection = new RTCPeerConnection(configuration);
const socket = io.connect("/");

const iceCandidates = []

const TIMEOUT = 500

peerConnection.ontrack = function ({ streams: [stream] }) {
    const remoteVideo = document.getElementById("remote-video");
    if (remoteVideo) {
        remoteVideo.srcObject = stream;
    }
};

const addIceCandidates = (iceCandidates) => {
    iceCandidates.forEach((candidate) => {
        peerConnection.addIceCandidate(new RTCIceCandidate(JSON.parse(candidate)))
    })
}


async function getMedia() {
    let stream = null;

    try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        const localVideo = document.getElementById("local-video");
        if (localVideo) {
            localVideo.srcObject = stream;
        }

        stream
            .getTracks()
            .forEach((track) => peerConnection.addTrack(track, stream));
    } catch(err) {
        alert(err);
    }
}

getMedia()

peerConnection.onicecandidate = function(event) {
    if (event.candidate) {
        iceCandidates.push(JSON.stringify(event.candidate))
    }
};

document.getElementById("send-key").addEventListener("click", () => {
    const chatKey = document.getElementById("key-input").value;
    socket.emit("get-offer-by-key", {chatKey});
});

socket.on("offer-by-key-answer", async (data) => {
    if(data.offer) {
        await receiveOfferAndCreateAnswer({
            chatKey: data.chatKey,
            offer: data.offer,
            iceCandidates: data.iceCandidates,
        })
    } else {
        await createOfferAndSend(data.chatKey)
    }
});
socket.on("sent-answer-to-initiator", async ({answer, iceCandidates}) => {
    receiveAndApplyAnswer({answer, iceCandidates})
});

const receiveOfferAndCreateAnswer = async({chatKey, offer, iceCandidates: remoteIceCandidates}) => {
    await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);
    addIceCandidates(remoteIceCandidates)
    await new Promise((resolve) => setTimeout(resolve, TIMEOUT));
    socket.emit("sent-answer-to-server", {chatKey, answer, iceCandidates});
}

const createOfferAndSend = async(chatKey) => {
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
    await new Promise((resolve) => setTimeout(resolve, TIMEOUT));
    socket.emit("sent-offer-to-server", {chatKey, offer, iceCandidates});
}

const receiveAndApplyAnswer = async({answer, iceCandidates}) => {
    const remoteDesc = new RTCSessionDescription(answer);
    await peerConnection.setRemoteDescription(remoteDesc);
    addIceCandidates(iceCandidates)
}



