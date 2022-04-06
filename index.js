var express = require('express');
var router = express.Router();
const lightwallet = require("eth-lightwallet");
const fs = require('fs');

// TODO : lightwallet 모듈을 사용하여 랜덤한 니모닉 코드를 얻습니다.
router.post('/newMnemonic', async (req, res) => {
    //mnemonic 변수만들기
    let mnemonic;

    try {
        mnemonic = lightwallet.keystore.generateRandomSeed();
        // 변수에 담아 응답전송
        res.json({ mnemonic });
    } catch (err) {
        console.log(err);
        //에러응답
    }
});


// TODO : 니모닉 코드와 패스워드를 이용해 keystore와 address를 생성합니다.
router.post('/newWallet', async (req, res) => {
    let password = req.body.password;
    let mnemonic = req.body.mnemonic;
    //요청에 포함된 정보들을 각 변수에 할당
    
    try {
        //키스토어 생성
        lightwallet.keystore.createVault(
            {
                //첫번째 인자(options) 에는 password, seedPhrase, hdPathString을 담는다
                password: password,
                seedPhrase: mnemonic,
                hdPathString: "m/0'/0'/0'",
            },

            //두번째 인자(callback)에는 키스토어를 인자로 사용하는 함수를 만든다
            function (err, ks) {
                //eth-lightwallet 모듈의 keyFromPassword 내장함수를 사용
                //첫번째 인자에는 password, 두번째 인자(callback)에는 pwDerivedKey 를 인자로 사용하는 함수사용)
                ks.keyFromPassword(password, function (err, pwDerivedKey) {
                    // 두번째 콜백함수가 실행되면 eth-lightwallet 모듈의
                    // ks.generateNewAddress(pwDerivedKey,[num]을 이용해 새로운 주소생성함수 실행
                    ks.generateNewAddress(pwDerivedKey, 1);

                    //address 변수를 만들고, 문자열로 할당
                    let address = (ks.getAddresses()).toString();
                    //keystore 변수를 만들고 할당
                    let keystore = ks.serialize();

                    res.json({keystore: keystore, address: address});

                    // fs.writeFile('wallet.json', keystore, function (err, data) {
                    //     if (err) {
                    //         res.json({ code: 999, message: "실패" });
                    //     } else {
                    //         res.json({ code: 1, message: "성공" });
                    //     }
                    // });
                });
            }
        );

    }
    // 에러응답
    catch (exception) {
        console.log("newWallet ==>>>>" + exception);
    }
});

module.exports = router;