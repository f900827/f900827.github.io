import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js'
import { getFirestore, collection, doc, setDoc, updateDoc, serverTimestamp } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js'

const firebaseConfig = {
    apiKey: "AIzaSyAVc7Yu9ul0mQ-kaYFTSGzCeP2nyH8Q7rk",
    authDomain: "fangyu-315ac.firebaseapp.com",
    projectId: "fangyu-315ac",
    storageBucket: "fangyu-315ac.appspot.com",
    messagingSenderId: "726433214510",
    appId: "1:726433214510:web:2de49df88ae021fa876fbf"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

document.addEventListener('DOMContentLoaded', init);

function init() {
    const startButton = document.getElementById('startButton');
    const startButtonBlock = document.getElementById('startButton_Div');
    const confirmButton = document.getElementById('confirmButton');
    const okButton = document.getElementById('okButton');
    const initBlock = document.getElementById('init');
    const experiment = document.getElementById('experiment');
    const plusSign = document.querySelector('.plus-sign');
    const indicatorVertical = document.getElementById('indicator-vertical');
    const indicatorHorizontal = document.getElementById('indicator-horizontal');
    const textContainer = document.getElementById('text-container');
    const idInputBox = document.getElementById('subjectId');
    const ageInputBox = document.getElementById('age');
    const genderInputBox = document.getElementById('gender');
    const depInputBox = document.getElementById('department');
    const patternInputBox = document.getElementById('pattern');
    const testMode = document.getElementById('test');
    const message = document.getElementById('info');
    const messageBlock = document.getElementById('message');
    // 每個方向最多出現幾次
    const maxPerDirection = 1;
    // 一次實驗總Trial數量 = maxPerDirection * 4
    const maxTrials = maxPerDirection * 4;
    let isExperimentRunning = false;
    let waitClick = true;
    let trialCount = 0;
    let currentPattern = 0;
    let currentDirection = 'none';
    let patternArr, directionArray, startTime, timeoutId, subjectId;
    let [currentComArr, currentDictionArr, currentIndexClickArr, currentRTArr] = [[], [], [], []];

    confirmButton.addEventListener('click', async function () {
        confirmButton.disabled = true;

        // 檢測inputBox是否有空值
        if (!testMode.checked) {
            if (checkInputEmpty()) {
                return
            }
        }

        patternArr = patternInputBox.value.split(',');

        // 如果陣列只包含 't' 和 'm'，則返回 true，否則返回 false
        const isValid = patternArr.every(element => element === 't' || element === 'm');
        if (!isValid) {
            alert('模式輸入錯誤，請檢查');
            confirmButton.disabled = false;
            return
        } else {
            patternArr.push("END");
        }

        directionArray = generateDirectionArray(patternArr.length);
        subjectId = idInputBox.value;

        if (!testMode.checked) {
            await createSubjectDoc(subjectId, ageInputBox.value, genderInputBox.value, depInputBox.value);
        }

        if (patternArr[0] == 't') {
            message.innerText = "實驗即將開始，第一輪實驗請使用：觸控螢幕"
        } else {
            message.innerText = "實驗即將開始，第一輪實驗請使用：滑鼠"
        }
        initBlock.style.display = 'none';
        messageBlock.style.display = 'block';

        //startButtonBlock.style.display = 'flex';
    });

    startButton.addEventListener('click', function () {
        startButton.style.display = 'none';
        experiment.style.display = 'flex';
        showPlusSign();
    });

    okButton.addEventListener('click', function () {
        messageBlock.style.display = 'none';
        experiment.style.display = 'flex';
        showPlusSign();
    });

    plusSign.addEventListener('click', function () {
        hidePlusSign();
        startTrial();
    });

    [indicatorVertical, indicatorHorizontal].forEach(indicator => {
        ['click', 'touchstart'].forEach(eventType => {
            indicator.addEventListener(eventType, function (event) {
                if (isExperimentRunning && event.target.classList.contains('circle') && waitClick) {
                    waitClick = false;
                    const inputType = eventType === 'click' ? 'mouse' : 'touch';
                    handleCircleClick(parseInt(event.target.getAttribute('data-index')), inputType);
                }
            });
        });
    });

    function startTrial() {
        trialCount++;
        resetState();
        isExperimentRunning = true;
        setTimeout(showText, 250);
    }

    function resetState() {
        isExperimentRunning = false;
        textContainer.style.display = 'none';
        indicatorVertical.style.display = 'none';
        indicatorHorizontal.style.display = 'none';
    }

    function showPlusSign() {
        plusSign.style.display = 'block';
    }

    function hidePlusSign() {
        plusSign.style.display = 'none';
    }

    // 產生本次實驗之所有directions
    function generateDirectionArray(times) {
        const directions = ['up', 'down', 'left', 'right'];

        // 初始化包含每個方向6次的陣列
        let directionArray = [];
        // 有幾個pattern就執行幾次
        for (let t = 0; t < times; t++) {
            // 加入maxTrial數量的directions
            for (let i = 0; i < maxPerDirection; i++) {
                directionArray.push(...directions);
            }
        }

        // 使用Fisher-Yates算法洗牌陣列
        for (let i = directionArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [directionArray[i], directionArray[j]] = [directionArray[j], directionArray[i]];
        }

        return directionArray;
    }

    function showText() {
        currentDirection = directionArray.pop()

        // 針對不同direction處理UI顯示
        switch (currentDirection) {
            case 'up':
                indicatorVertical.style.display = 'block';
                textContainer.style.top = '5%';
                textContainer.style.left = '50%';
                break;
            case 'down':
                indicatorVertical.style.display = 'block';
                textContainer.style.top = '95%';
                textContainer.style.left = '50%';
                break;
            case 'left':
                indicatorHorizontal.style.display = 'flex';
                textContainer.style.top = '50%';
                textContainer.style.left = '5%';
                break;
            case 'right':
                indicatorHorizontal.style.display = 'flex';
                textContainer.style.top = '50%';
                textContainer.style.left = '95%';
                break;
            default:
                break;
        }

        textContainer.style.transform = 'translate(-50%, -50%)';
        textContainer.style.display = 'block';

        startTime = Date.now();
        // 兩秒內未進行任何行為則Timeout
        timeoutId = setTimeout(() => {
            handleNoReaction();
        }, 3000);
    }

    function handleNoReaction() {
        if (!isExperimentRunning) return;

        console.log(`Trial ${trialCount}\nDirection: ${currentDirection}. No reaction.`);

        currentComArr.push('N/A');
        currentDictionArr.push(currentDirection);
        currentIndexClickArr.push('N/A');
        currentRTArr.push('N/A');

        textContainer.style.display = 'none';
        indicatorHorizontal.style.display = 'none';
        indicatorVertical.style.display = 'none';

        checkIfExceedMaxTrials()
    }

    function handleCircleClick(index, inputType) {
        if (!isExperimentRunning) return;
        // 若有點擊則取消NoReaction Timeout
        clearTimeout(timeoutId);

        let COM = checkCOM(index);

        // 計算反應時間
        const endTime = Date.now();
        const responseTime = endTime - startTime;

        // 紀錄當次行為資料(DB寫入點)
        console.log(`Trial ${trialCount}\nDirection: ${currentDirection} \nCircle Index: ${index} \nRT: ${responseTime}ms\nInput type: ${inputType}\ncom: ${COM}`);
        currentComArr.push(COM);
        currentDictionArr.push(currentDirection);
        currentIndexClickArr.push(index);
        currentRTArr.push(responseTime);

        // 移動文本到正中間
        textContainer.style.top = '50%';
        textContainer.style.left = '50%';
        textContainer.style.transform = 'translate(-50%, -50%)';

        // 延遲500毫秒後隱藏文本
        setTimeout(() => {
            textContainer.style.display = 'none';
            indicatorHorizontal.style.display = 'none';
            indicatorVertical.style.display = 'none';
            checkIfExceedMaxTrials()
            waitClick = true;
        }, 600);
    }

    // 檢查當前點擊之圓點是否與文章方向一致
    function checkCOM(index) {
        let directionIndexArr = ['up', '', 'down', 'left', '', 'right'];
        if (directionIndexArr[index] == currentDirection) {
            return 1;
        } else {
            return 0;
        }
    }

    // 檢查當前Trial是否到達上限
    function checkIfExceedMaxTrials() {
        if (trialCount < maxTrials) {
            setTimeout(showPlusSign(), 500);
        } else {
            // 檢查下一輪之pattern
            const nextPattern = patternArr[currentPattern + 1];
            switch (nextPattern) {
                case 't':
                    message.innerText = "本次實驗結束，下一輪實驗請使用：觸控螢幕"
                    break;
                case 'm':
                    message.innerText = "本次實驗結束，下一輪實驗請使用：滑鼠"
                    break;
                case 'END':
                    message.innerText = "Experiment completed! \n請通知實驗人員"
                    okButton.style.display = 'none';
                    break;
                default:
                    break;
            }
            if (!testMode.checked) {
                createTrialsDoc(subjectId, currentPattern + 1, patternArr[currentPattern], currentComArr, currentDictionArr, currentIndexClickArr, currentRTArr)
            }
            experiment.style.display = 'none';
            messageBlock.style.display = 'block';

            // 重置資料陣列
            currentComArr = [];
            currentDictionArr = [];
            currentIndexClickArr = [];
            currentRTArr = [];

            // trial數歸零
            trialCount = 0
            // 移動currentPattern指標
            currentPattern++;
        }
    }

    function checkInputEmpty() {
        if (idInputBox.value == '') {
            alert("請輸入受試者編號");
            confirmButton.disabled = false;
            return true
        } else if (ageInputBox.value == '') {
            alert("請輸入年齡");
            confirmButton.disabled = false;
            return true
        } else if (genderInputBox.value == '') {
            alert("請輸入性別");
            confirmButton.disabled = false;
            return true
        } else if (depInputBox.value == '') {
            alert("請輸入科系");
            confirmButton.disabled = false;
            return true
        } else if (patternInputBox.value == '') {
            alert("請輸入實驗模式");
            confirmButton.disabled = false;
            return true
        }
        return false
    }

    async function createSubjectDoc(subjectId, age, gender, department) {
        const subjectDocRef = doc(db, "experiment", subjectId);
        await setDoc(subjectDocRef, {
            age,
            gender,
            department,
        },
            { merge: true },
        );
    }

    async function createTrialsDoc(subjectId, count, pattern, comArr, directionsArr, indexClickedArr, responseTimeArr) {
        const trialDocRef = doc(db, "experiment", subjectId, "trials", String(count + pattern));
        await setDoc(trialDocRef, {
            com: comArr,
            directions: directionsArr,
            indexClicked: indexClickedArr,
            responseTime: responseTimeArr,
            pattern,
            finishedTime: serverTimestamp(),
        },
            { merge: true },
        );
    }
}

