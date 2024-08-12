document.addEventListener('DOMContentLoaded', init);

function init() {
    const startButton = document.getElementById('startButton');
    const experiment = document.getElementById('experiment');
    const plusSign = document.querySelector('.plus-sign');
    const indicatorVertical = document.getElementById('indicator-vertical');
    const indicatorHorizontal = document.getElementById('indicator-horizontal');
    const textContainer = document.getElementById('text-container');
    const maxTrials = 24;
    let isExperimentRunning = false;
    let trialCount = 0;
    let startTime, timeoutId;
    let directionArray = generateDirectionArray();
    let currentDirection = 'none';
    let waitClick = true;
    let waitPlusClick = true;

    startButton.addEventListener('click', function() {
        startButton.style.display = 'none';
        experiment.style.display = 'flex';
        showPlusSign();
    });

    plusSign.addEventListener('click', function() {
        hidePlusSign();
        startTrial();
    });

    [indicatorVertical, indicatorHorizontal].forEach(indicator => {
        ['click', 'touchstart'].forEach(eventType => {
            indicator.addEventListener(eventType, function(event) {
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
    function generateDirectionArray() {
        const directions = ['up', 'down', 'left', 'right'];
        const maxPerDirection = 6;
    
        // 初始化包含每個方向6次的陣列
        let directionArray = [];
        for (let i = 0; i < maxPerDirection; i++) {
            directionArray.push(...directions);
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
                textContainer.style.transform = 'translate(-50%, -50%)';
                break;
            case 'down':
                indicatorVertical.style.display = 'block';
                textContainer.style.top = '95%';
                textContainer.style.left = '50%';
                textContainer.style.transform = 'translate(-50%, -50%)';
                break;
            case 'left':
                indicatorHorizontal.style.display = 'flex';
                textContainer.style.top = '50%';
                textContainer.style.left = '5%';
                textContainer.style.transform = 'translate(-50%, -50%)';
                break;
            case 'right':
                indicatorHorizontal.style.display = 'flex';
                textContainer.style.top = '50%';
                textContainer.style.left = '95%';
                textContainer.style.transform = 'translate(-50%, -50%)';
                break;
            default:
                break;
        }

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
        console.log(`Trial ${trialCount}\nDirection: ${currentDirection} COM: ${COM}\nResponse time: ${responseTime}ms\nCircle Index: ${index} Input type: ${inputType}`);

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
        }, 500);
    }
    
    function handlePlusClick() {
        waitPlusClick = false;
    }

    // 檢查當前點擊之圓點是否與文章方向一致
    function checkCOM(index){
        let directionIndexArr = ['up', '', 'down', 'left', '', 'right'];
        if(directionIndexArr[index] == currentDirection){
            return 1;
        }else{
            return 0;
        }
    }
     
    // 檢查當前Trial是否到達上限
    function checkIfExceedMaxTrials(){
        if (trialCount < maxTrials) {
            setTimeout(showPlusSign(), 500);
        } else {
            resetState();
            alert('Experiment completed \n請通知實驗人員');
            //重整頁面
            //window.location.reload();
        }
    }
}