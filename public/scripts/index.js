const GEO_LOC_URL = "https://raw.githubusercontent.com/pradt2/always-online-stun/master/geoip_cache.txt";
const IPV4_URL = "https://raw.githubusercontent.com/pradt2/always-online-stun/master/valid_ipv4s.txt";
const GEO_USER_URL = "https://geolocation-db.com/json/";

const getLocation = async () => {
    const geoLocs = await(await fetch(GEO_LOC_URL)).json();
    const { latitude, longitude } = await(await fetch(GEO_USER_URL)).json();
    const closestAddr = (await(await fetch(IPV4_URL)).text()).trim().split('\n')
        .map(addr => {
            const [stunLat, stunLon] = geoLocs[addr.split(':')[0]];
            const dist = ((latitude - stunLat) ** 2 + (longitude - stunLon) ** 2 ) ** .5;
            return [addr, dist];
        }).reduce(([addrA, distA], [addrB, distB]) => distA <= distB ? [addrA, distA] : [addrB, distB])[0];
    console.log('closestAddr', closestAddr); // prints the IP:PORT of the closest STUN server
    return closestAddr
}

getLocation().then((closestAddr) => {
    const ICE_config= {
        'iceServers': [
            {'url': `stun:${closestAddr}`},
            {'url': 'stunt:stun.signalwire.com:3478'},
            {'url': 'stunt:stun.comrex.com:3478'},
            {'url': 'stunt:stun.labs.net:3478'},
            {'url': 'stunt:stun.streamnow.ch:3478'},
            {'url': 'stunt:stun.nfon.net:3478'},
            {'url': 'stunt:stun.megatel.si:3478'},
            {'url': 'stunt:stun.junet.se:3478'},
            {'url': 'stunt:stun.stadtwerke-eutin.de:3478'},
            {'url': 'stunt:stun.ppdi.com:3478'},
            {'url': 'stunt:stun.syncthing.net:3478'},
            {'url': 'stunt:stun.bearstech.com:3478'},
            {'url': 'stunt:stun.flashdance.cx:3478'},
            {'url': 'stunt:stun.zadarma.com:3478'},
            {'url': 'stunt:stun.voipbuster.com:3478'},
            {'url': 'stunt:stun.studio-link.de:3478'},
            {'url': 'stunt:stun.grazertrinkwasseringefahr.at:3478'},
            {'url': 'stunt:stun.gigaset.net:3478'},
            {'url': 'stunt:stun.siedle.com:3478'},
            {'url': 'stunt:stun.myspeciality.com:3478'},
            {'url': 'stunt:stun.medvc.eu:3478'},
            {'url': 'stunt:stun.sipglobalphone.com:3478'},
            {'url': 'stunt:stun.cablenet-as.net:3478'},
            {'url': 'stunt:stun.voippro.com:3478'},
            {'url': 'stunt:stun.sippeer.dk:3478'},
            {'url': 'stunt:stun.jabber.dk:3478'},
            {'url': 'stunt:stun.actionvoip.com:3478'},
            {'url': 'stunt:stun.voip.blackberry.com:3478'},
            {'url': 'stunt:stun.thebrassgroup.it:3478'},
            {'url': 'stunt:stun.tng.de:3478'},
            {'url': 'stunt:stun.tel.lu:3478'},
            {'url': 'stunt:stun.l.google.com:19302'},
            {'url': 'stunt:stun.dunyatelekom.com:3478'},
            {'url': 'stunt:stun.bitburger.de:3478'},
            {'url': 'stunt:stun.voipzoom.com:3478'},
            {'url': 'stunt:stun.siptraffic.com:3478'},
            {'url': 'stunt:stun.voipconnect.com:3478'},
            {'url': 'stunt:stun.avigora.fr:3478'},
            {'url': 'stunt:stun.internetcalls.com:3478'},
            {'url': 'stunt:stun.deepfinesse.com:3478'},
            {'url': 'stunt:stun.heeds.eu:3478'},
            {'url': 'stunt:stun.usfamily.net:3478'},
            {'url': 'stunt:stun.sonetel.com:3478'},
            {'url': 'stunt:stun.vo.lu:3478'},
            {'url': 'stunt:stun.mixvoip.com:3478'},
            {'url': 'stunt:stun.nanocosmos.de:3478'},
            {'url': 'stunt:stun.ringostat.com:3478'},
            {'url': 'stunt:stun.bethesda.net:3478'},
            {'url': 'stunt:stun.voipfibre.com:3478'},
            {'url': 'stunt:stun.ru-brides.com:3478'},
            {'url': 'stunt:stun.gntel.nl:3478'},
            {'url': 'stunt:stun.localphone.com:3478'},
            {'url': 'stunt:stun.qcol.net:3478'},
            {'url': 'stunt:stun.marcelproust.it:3478'},
            {'url': 'stunt:stun.vavadating.com:3478'},
            {'url': 'stunt:stun.voip.eutelia.it:3478'},
            {'url': 'stunt:stun.acquageraci.it:3478'},
            {'url': 'stunt:stun.fbsbx.com:3478'},
            {'url': 'stunt:stun.splicecom.com:3478'},
            {'url': 'stunt:stun.bandyer.com:3478'},
            {'url': 'stunt:stun.irishvoip.com:3478'},
            {'url': 'stunt:stun.voip.aebc.com:3478'},
            {'url': 'stunt:stun.freecall.com:3478'},
            {'url': 'stunt:stun.geonet.ro:3478'},
            {'url': 'stunt:stun.telbo.com:3478'},
            {'url': 'stunt:stun.counterpath.com:3478'},
            {'url': 'stunt:stun.allflac.com:3478'},
            {'url': 'stunt:stun.nexxtmobile.de:3478'},
            {'url': 'stunt:stun.waterpolopalermo.it:3478'},
            {'url': 'stunt:stun.1-voip.com:3478'},
            {'url': 'stunt:stun.leucotron.com.br:3478'},
            {'url': 'stunt:stun.schulinformatik.at:3478'},
            {'url': 'stunt:stun.levigo.de:3478'},
            {'url': 'stunt:stun.goldfish.ie:3478'},
            {'url': 'stunt:stun2.l.google.com:19302'},
            {'url': 'stunt:stun.yesdates.com:3478'},
            {'url': 'stunt:stun.vadacom.co.nz:3478'},
            {'url': 'stunt:stun.meowsbox.com:3478'},
            {'url': 'stunt:stun.3wayint.com:3478'},
            {'url': 'stunt:stun.voipgrid.nl:3478'},
            {'url': 'stunt:stun.poivy.com:3478'},
            {'url': 'stunt:stun.smartvoip.com:3478'},
            {'url': 'stunt:stun.var6.cn:3478'},
            {'url': 'stunt:stun.solnet.ch:3478'},
            {'url': 'stunt:stun.studio71.it:3478'},
            {'url': 'stunt:stun.nexphone.ch:3478'},
            {'url': 'stunt:stun.voipcheap.co.uk:3478'},
            {'url': 'stunt:stun.fmo.de:3478'},
            {'url': 'stunt:stun.geesthacht.de:3478'},
            {'url': 'stunt:stun.rynga.com:3478'},
            {'url': 'stunt:stun.diallog.com:3478'},
            {'url': 'stunt:stun.lowratevoip.com:3478'},
            {'url': 'stunt:stun.ipshka.com:3478'},
            {'url': 'stunt:stun.technosens.fr:3478'},
            {'url': 'stunt:stun.nonoh.net:3478'},
            {'url': 'stunt:stun.voys.nl:3478'},
            {'url': 'stunt:stun.webcalldirect.com:3478'},
            {'url': 'stunt:stun.lebendigefluesse.at:3478'},
            {'url': 'stunt:stun.netgsm.com.tr:3478'},
            {'url': 'stunt:stun.peethultra.be:3478'},
            {'url': 'stunt:stun.healthtap.com:3478'},
            {'url': 'stunt:stun.plexicomm.net:3478'},
            {'url': 'stunt:stun.voipstreet.com:3478'},
            {'url': 'stunt:stun.framasoft.org:3478'},
            {'url': 'stunt:stun.voipvoice.it:3478'},
            {'url': 'stunt:stun.thinkrosystem.com:3478'},
            {'url': 'stunt:stun.imafex.sk:3478'},
            {'url': 'stunt:stun.mywatson.it:3478'},
            {'url': 'stunt:stun.siptrunk.com:3478'},
            {'url': 'stunt:stun.leonde.org:3478'},
            {'url': 'stunt:stun.optdyn.com:3478'},
            {'url': 'stunt:stun.business-isp.nl:3478'},
            {'url': 'stunt:stun.myvoiptraffic.com:3478'},
            {'url': 'stunt:stun.intervoip.com:3478'},
            {'url': 'stunt:stun.ladridiricette.it:3478'},
            {'url': 'stunt:stun.hide.me:3478'},
            {'url': 'stunt:stun.jowisoftware.de:3478'},
            {'url': 'stunt:stun.threema.ch:3478'},
            {'url': 'stunt:stun.jabbim.cz:3478'},
            {'url': 'stunt:stun.aa.net.uk:3478'},
            {'url': 'stunt:stun.gmx.de:3478'},
            {'url': 'stunt:stun.fitauto.ru:3478'},
            {'url': 'stunt:stun.wemag.com:3478'},
            {'url': 'stunt:stun.kotter.net:3478'},
            {'url': 'stunt:stun.skydrone.aero:3478'},
            {'url': 'stunt:stun.srce.hr:3478'},
            {'url': 'stunt:stun.cibercloud.com.br:3478'},
            {'url': 'stunt:stun.cope.es:3478'},
            {'url': 'stunt:stun.lovense.com:3478'},
            {'url': 'stunt:stun.baltmannsweiler.de:3478'},
            {'url': 'stunt:stun.12voip.com:3478'},
            {'url': 'stunt:stun.rockenstein.de:3478'},
            {'url': 'stunt:stun.nextcloud.com:443'},
            {'url': 'stunt:stun.totalcom.info:3478'},
            {'url': 'stunt:stun.telnyx.com:3478'},
            {'url': 'stunt:stun.freevoipdeal.com:3478'},
            {'url': 'stunt:stun.axialys.net:3478'},
            {'url': 'stunt:stun4.l.google.com:19302'},
            {'url': 'stunt:stun.oncloud7.ch:3478'},
            {'url': 'stunt:stun.gmx.net:3478'},
            {'url': 'stunt:stun.sonetel.net:3478'},
            {'url': 'stunt:stun.voicetech.se:3478'},
            {'url': 'stunt:stun.siplogin.de:3478'},
            {'url': 'stunt:stun.officinabit.com:3478'},
            {'url': 'stunt:stun.peeters.com:3478'},
            {'url': 'stunt:stun.linuxtrent.it:3478'},
            {
                'url': 'turn:192.158.29.39:3478?transport=tcp',
                'credential': 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
                'username': '28224511:1379330808'
            }
        ]
    }
    console.log(ICE_config)

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
})


