document.addEventListener('DOMContentLoaded', init);

function init() {
    const startButton = document.getElementById('startButton');
    const experiment = document.getElementById('experiment');
    const dot = document.querySelector('.dot');
    const pluSign = document.querySelector('.plus-sign');
    const textContainer = document.getElementById('text-container');
    const textContainer2 = document.getElementById('text-container2');
    const resultMessage = document.getElementById('resultMessage');
    let trialCount = 0;
    const maxTrials = 25;
    let isExperimentRunning = false;
    let currentExpType = 1;  // 1: SR相容, 2: SR不相容
    let isNoGoTrial = false;

    // Start experiment 
    document.addEventListener('keydown', function(event) {
        if (event.code === 'Space') {
            event.preventDefault();
            if (!isExperimentRunning) {
                startExperiment();
            }
        }
    });
//
    // Handling arrow keys for input
    document.addEventListener('keydown', function(event) {
        if (event.code === 'ArrowUp' || event.code === 'ArrowDown') {
            event.preventDefault();
            
        }
    });

    // Handling touch input within the experiment area
    experiment.addEventListener('touchstart', function(event) {
        if (isExperimentRunning) {
            handleTouch(event);
        }
    });

    function startExperiment() {
        resetState();
        startButton.style.display = 'none';
        experiment.style.display = 'flex';
        isExperimentRunning = true;
        showPlusSign();
    }

    function showPlusSign() {
        pluSign.style.display = 'block';
        setTimeout(hidePlusSign, 250);
    }

    function hidePlusSign() {
        pluSign.style.display = 'none';
        showDot();
    }

    function showDot() {
        if (trialCount % 5 === 0) {
            dot.style.top = '50%';
            isNoGoTrial = true;
        } else {
            const dotPositionY = Math.random() < 0.5 ? '5%' : '95%';
            dot.style.top = dotPositionY;
            isNoGoTrial = false;
        }
        dot.style.display = 'block';
        const startTime = Date.now();

        setTimeout(() => {
            dot.style.display = 'none';
            showText(startTime, dot.style.top);
        }, 150);
    }

    function showText(startTime, dotPositionY) {
        textContainer.style.top = '10%';
        textContainer.style.display = 'block';
        textContainer2.style.top = '90%';
        textContainer2.style.display = 'block';
        
        let isClickHandled = false;
        let timeoutId;
        
        function handleKeyPress(event) { 
            if (isClickHandled) return;

            if (event.code === 'ArrowUp' || event.code === 'ArrowDown') {
                event.preventDefault();
                isClickHandled = true;

                if (isNoGoTrial) {
                    handleNogoTrialResult(startTime, false);
                } else {
                    const keyDirection = event.code === 'ArrowUp' ? 'Up' : 'Down';
                    handleResult(null, dotPositionY, startTime, 'arrow', keyDirection);
                }
            }
        }

        function onClick(event) {
            if (isClickHandled) return;
            isClickHandled = true;

            if (isNoGoTrial) {
                handleNogoTrialResult(startTime, false);
            } else {
                let clickY = event.clientY - experiment.getBoundingClientRect().top;
                handleResult(clickY, dotPositionY, startTime, 'click');
            }
        }

        function handleTouch(event) {
            if (isNoGoTrial) {
                handleNogoTrialResult(startTime, false);
            } else {
                const clickY = event.touches[0].clientY - experiment.getBoundingClientRect().top;
                handleResult(clickY, dotPositionY, startTime, 'touch');
            }
        }

        function handleResult(clickY, dotPositionY, startTime, inputType, keyDirection = null) {
            const endTime = Date.now();
            const responseTime = endTime - startTime;
            clearTimeout(timeoutId);

            const isCorrect = checkCorrect(clickY, dotPositionY);
            const message = isCorrect ? 'Correct' : 'Incorrect';
            let resultText = '';

            if (inputType === 'arrow') {
                resultText = `${message}\nReaction Time: ${responseTime} ms\nDot Position: Y=${dotPositionY}\nKey Pressed: ${keyDirection}`;
            } else {
                resultText = `${message}\nReaction Time: ${responseTime} ms\nDot Position: Y=${dotPositionY}\nClick Position: Y=${clickY}px`;
            }
            //resultMessage.textContent = resultText;
            console.log(resultText);

            showResultMessage(clickY, inputType);
        }

        function handleNogoTrialResult(startTime, isTimeout) {
            const endTime = Date.now();
            const responseTime = endTime - startTime;
            clearTimeout(timeoutId);

            let resultText = '';
            if (isTimeout) {
                resultText = 'Correct\nNo reaction within 3 seconds';
            } else {
                resultText = `Incorrect\nDot was in the center, should not react.\nReaction Time: ${responseTime} ms`;
            }

            //resultMessage.textContent = resultText;
            console.log(resultText);
            showResultMessage();
        }

        function showResultMessage(clickY, inputType) {
            if (!isNoGoTrial) {
                if (currentExpType === 1) {
                    // 情境1: 点击方向和文字移动方向相同
                    if (clickY < experiment.clientHeight / 2) {
                        textContainer.style.transition = 'top 0.5s';
                        textContainer2.style.transition = 'top 0.5s';
                        textContainer.style.top = '50%';
                        textContainer2.style.top = '150%';
                    } else {
                        textContainer.style.transition = 'top 0.5s';
                        textContainer2.style.transition = 'top 0.5s';
                        textContainer.style.top = '-50%';
                        textContainer2.style.top = '50%';
                    }
                } else {
                    // 情境2: 点击方向和文字移动方向相反
                    if (clickY < experiment.clientHeight / 2) {
                        textContainer.style.transition = 'top 0.5s';
                        textContainer2.style.transition = 'top 0.5s';
                        textContainer.style.top = '-50%';
                        textContainer2.style.top = '50%';
                    } else {
                        textContainer.style.transition = 'top 0.5s';
                        textContainer2.style.transition = 'top 0.5s';
                        textContainer.style.top = '50%';
                        textContainer2.style.top = '150%';
                    }
                }
            }

            setTimeout(() => {
                resultMessage.style.display = 'block';
                textContainer.style.display = 'none';
                textContainer2.style.display = 'none';
            }, 300);
    
            setTimeout(() => {
                resultMessage.style.display = 'none';
                resetExperiment(onClick, handleKeyPress);
            }, 1000);
        }
    
        document.addEventListener('keydown', handleKeyPress);
        experiment.addEventListener('click', onClick);
    
        timeoutId = setTimeout(() => {
            if (!isClickHandled && isNoGoTrial) {
                handleNogoTrialResult(startTime, true);
                textContainer.style.display = 'none';
                textContainer2.style.display = 'none';
            } else if (!isClickHandled) {
                handleNogoTrialResult(startTime, false);
                textContainer.style.display = 'none';
                textContainer2.style.display = 'none';
            }
        }, 1500);
    }
    
    function checkCorrect(clickY, dotPositionY) {
        const isDotAbove = dotPositionY === '5%';
        const isClickAbove = clickY < (experiment.clientHeight / 2);
    
        if (currentExpType === 1) {
            return (isDotAbove && isClickAbove) || (!isDotAbove && !isClickAbove);
        } else {
            return (!isDotAbove && isClickAbove) || (isDotAbove && !isClickAbove);
        }
    }
    
    function resetExperiment(onClick, handleKeyPress) {
        experiment.style.display = 'none';
        textContainer.style.display = 'none';
        textContainer2.style.display = 'none';
        experiment.removeEventListener('click', onClick);
        document.removeEventListener('keydown', handleKeyPress);
        trialCount++;
        isExperimentRunning = false;
        if (trialCount < maxTrials) {
            setTimeout(startExperiment, 500);
        } else {
            alert('Experiment completed');
            window.location.reload();
        }
    }
    
    function resetState() {
        pluSign.style.display = 'none';
        dot.style.display = 'none';
        textContainer.style.display = 'none';
        textContainer2.style.display = 'none';
        resultMessage.style.display = 'none';
    }
}