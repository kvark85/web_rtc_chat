const ICE_config= {
    'iceServers': [
        {'url': 'stun:stun.l.google.com:19302'},
        {
            'url': 'turn:192.158.29.39:3478?transport=udp',
            'credential': 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
            'username': '28224511:1379330808'
        },
        {
            'url': 'turn:192.158.29.39:3478?transport=tcp',
            'credential': 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
            'username': '28224511:1379330808'
        }
    ]
}
const GEO_LOC_URL = "https://raw.githubusercontent.com/pradt2/always-online-stun/master/geoip_cache.txt";
const IPV4_URL = "https://raw.githubusercontent.com/pradt2/always-online-stun/master/valid_ipv4s.txt";
const GEO_USER_URL = "https://geolocation-db.com/json/";
const geoLocs = await(await fetch(GEO_LOC_URL)).json();
const { latitude, longitude } = await(await fetch(GEO_USER_URL)).json();
const closestAddr = (await(await fetch(IPV4_URL)).text()).trim().split('\n')
    .map(addr => {
        const [stunLat, stunLon] = geoLocs[addr.split(':')[0]];
        const dist = ((latitude - stunLat) ** 2 + (longitude - stunLon) ** 2 ) ** .5;
        return [addr, dist];
    }).reduce(([addrA, distA], [addrB, distB]) => distA <= distB ? [addrA, distA] : [addrB, distB])[0];
console.log('closestAddr', closestAddr); // prints the IP:PORT of the closest STUN server
const peerConnection = new RTCPeerConnection(ICE_config);
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

const setInfoText = (text) => {
    const infoText = document.getElementById('info-text');
    infoText.innerHTML = text
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
        setInfoText('Enjoy secure conversation')
        await receiveOfferAndCreateAnswer({
            chatKey: data.chatKey,
            offer: data.offer,
            offerIceCandidates: data.offerIceCandidates,
        })
    } else {
        setInfoText('Wait for friend')
        await createOfferAndSend(data.chatKey)
    }
});
socket.on("sent-answer-to-initiator", async ({answer, answerIceCandidates}) => {
    setInfoText('Enjoy secure conversation')
    receiveAndApplyAnswer({answer, answerIceCandidates})
});

socket.on("reconnect", async () => {
    const chatKey = document.getElementById("key-input").value;
    socket.emit("get-offer-by-key", {chatKey});
});

socket.on("chat-with-chosen-key-exist", async () => {
    setInfoText('Chat with chosen chat key already exist. Please, try another chat key.')
});

const receiveOfferAndCreateAnswer = async({chatKey, offer, offerIceCandidates}) => {
    console.log('b; answer =', JSON.stringify({chatKey, offer}, undefined, 2))
    await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);
    addIceCandidates(offerIceCandidates)
    await new Promise((resolve) => setTimeout(resolve, TIMEOUT));
    socket.emit("sent-answer-to-server", {
        chatKey, answer,
        answerIceCandidates: iceCandidates
    });
}

const createOfferAndSend = async(chatKey) => {
    console.log('a; chatKey =', chatKey)
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
    await new Promise((resolve) => setTimeout(resolve, TIMEOUT));
    socket.emit("sent-offer-to-server", {chatKey, offer, offerIceCandidates: iceCandidates});
}

const receiveAndApplyAnswer = async({answer, answerIceCandidates}) => {
    console.log('c; answer =', JSON.stringify(answer, undefined, 2))
    const remoteDesc = new RTCSessionDescription(answer);
    await peerConnection.setRemoteDescription(remoteDesc);
    addIceCandidates(answerIceCandidates)
}



