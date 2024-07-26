document.addEventListener('DOMContentLoaded', init);

function init() {
    const startButton = document.getElementById('startButton');
    const experiment = document.getElementById('experiment');
    const pluSign = document.querySelector('.plus-sign');
    const textContainer = document.getElementById('text-container');
    const textContainer2 = document.getElementById('text-container2');
    const resultMessage = document.getElementById('resultMessage');
    let trialCount = 0;
    const maxTrials = 50;
    let isExperimentRunning = false;
    let currentExpType = 1;  
    let noGoTrial = false;
//// 1: SR相容(Red: ContentDown[按上方], Blue: ContentUp[按下方])
//2: SR不相容(Red: ContentUp, Blue: ContentDown)
    
    console.log("Initializing experiment...");

    // Start experiment 
    document.addEventListener('keydown', function(event) {
        if (event.code === 'Space') {
            event.preventDefault();
            if (!isExperimentRunning) {
                startExperiment();
            }
        }
    });

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
        console.log("Experiment started");
        resetState();
        startButton.style.display = 'none';
        experiment.style.display = 'flex';
        isExperimentRunning = true;
        showPlusSign();
    }

    function showPlusSign() {
        pluSign.style.display = 'block';
        setTimeout(hidePlusSign, 500);
    }

    function hidePlusSign() {
        pluSign.style.display = 'none';
        start();
    }

    function start() {
        const startTime = Date.now();
        showText(startTime);
    }

    function showText(startTime) {
        textContainer.style.top = '10%';
        textContainer.style.display = 'block';
        textContainer2.style.top = '90%';
        textContainer2.style.display = 'block';

        let color;
        if (trialCount % 5 === 0) {
            color = 'black'; // Central flow
            noGoTrial = true;
        } else if (Math.random() < 0.5) {
            color = 'red'; // Simulate dot appearing at the top
            noGoTrial = false;
        } else {
            color = 'blue'; // Simulate dot appearing at the bottom
            noGoTrial = false;
        }

        textContainer.style.color = color;
        textContainer.style.display = 'block';
        textContainer2.style.color = color;
        textContainer2.style.display = 'block';

        let isClickHandled = false;
        let timeoutId;

        function handleKeyPress(event) {
            if (isClickHandled) return;

            if (event.code === 'ArrowUp' || event.code === 'ArrowDown') {
                event.preventDefault();
                isClickHandled = true;

                if (noGoTrial) {
                    handleNoGoTrialResult(startTime, false); // should not have a reaction
                } else {
                    const arrowKey = event.code;
                    handleResult(startTime, 'keyboard', arrowKey);
                }
            }
        }

        function onClick(event) {
            if (isClickHandled) return;
            isClickHandled = true;

            if (noGoTrial) {
                handleNoGoTrialResult(startTime, false); // Central trial should not have a reaction
            } else {
                let clickY = event.clientY - experiment.getBoundingClientRect().top;
                handleResult(startTime, 'click', clickY);
            }
        }

        function handleTouch(event) {
            if (isClickHandled) return;
            isClickHandled = true;

            if (noGoTrial) {
                handleNoGoTrialResult(startTime, false); // Central trial should not have a reaction
            } else {
                const clickY = event.touches[0].clientY - experiment.getBoundingClientRect().top;
                handleResult(startTime, 'touch', clickY);
            }
        }

        function handleResult(startTime, inputType, input) {
            const endTime = Date.now();
            const responseTime = endTime - startTime;
            clearTimeout(timeoutId);

            let isCorrect;
            let message;

            if (inputType === 'keyboard') {
                isCorrect = checkCorrect(input, textContainer.style.color);
                message = isCorrect ? 'Correct' : 'Incorrect';
                resultMessage.textContent = `${message}\nReaction Time: ${responseTime} ms\nKey Pressed: ${input}`;
            } else {
                isCorrect = checkCorrect(input, textContainer.style.color);
                message = isCorrect ? 'Correct' : 'Incorrect';
                resultMessage.textContent = `${message}\nReaction Time: ${responseTime} ms\nClick Position: Y=${input}px`;
            }

            showResultMessage(input, inputType);
        }

        function handleNoGoTrialResult(startTime, isTimeout) {
            const endTime = Date.now();
            const responseTime = endTime - startTime;
            clearTimeout(timeoutId);

            let message = 'Incorrect';
            if (isTimeout) {
                message = 'Correct\nNo reaction within 3 seconds';
            } else {
                message = `Incorrect\nShould not react.`;
            }

            resultMessage.textContent = message;
            showResultMessage();
        }

        function showResultMessage(input, inputType) {
            if (!noGoTrial) {  // Only show text scroll effect in non-central trials
                if (currentExpType === 1) {
                    // Scenario 1: Click direction and text move in the same direction
                    if (inputType === 'keyboard') {
                        if (input === 'ArrowUp') {
                            textContainer.style.transition = 'top 0.5s';
                            textContainer2.style.transition = 'top 0.4s';
                            textContainer.style.top = '50%';
                            textContainer2.style.top = '150%';
                        } else if (input === 'ArrowDown') {
                            textContainer.style.transition = 'top 0.5s';
                            textContainer2.style.transition = 'top 0.5s';
                            textContainer.style.top = '-50%';
                            textContainer2.style.top = '50%';
                        }
                    } else {
                        if (input < experiment.clientHeight / 2) {
                            textContainer.style.transition = 'top 0.5s';
                            textContainer2.style.transition = 'top 0.4s';
                            textContainer.style.top = '50%';
                            textContainer2.style.top = '150%';
                        } else {
                            textContainer.style.transition = 'top 0.5s';
                            textContainer2.style.transition = 'top 0.5s';
                            textContainer.style.top = '-50%';
                            textContainer2.style.top = '50%';
                        }
                    }
                } else {
                    // Scenario 2: Click direction and text move in opposite directions
                    if (inputType === 'keyboard') {
                        if (input === 'ArrowUp') {
                            textContainer.style.transition = 'top 0.5s';
                            textContainer2.style.transition = 'top 0.4s';
                            textContainer.style.top = '-50%';
                            textContainer2.style.top = '50%';
                        } else if (input === 'ArrowDown') {
                            textContainer.style.transition = 'top 0.5s';
                            textContainer2.style.transition = 'top 0.5s';
                            textContainer.style.top = '50%';
                            textContainer2.style.top = '150%';
                        }
                    } else {
                        if (input < experiment.clientHeight / 2) {
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
            if (!isClickHandled && noGoTrial) {
                handleNoGoTrialResult(startTime, true);
                textContainer.style.display = 'none';
                textContainer2.style.display = 'none';
                
            } else if (!isClickHandled) {
                handleNoGoTrialResult(startTime, false);
                textContainer.style.display = 'none';
                textContainer2.style.display = 'none';
            }
        }, 1500);
    }

    function checkCorrect(input, color) {
        const isClickAbove = typeof input !== 'string' && input < (experiment.clientHeight / 2);
    
        if (currentExpType === 1) {
            if (typeof input === 'string') {
                return (color === 'red' && input === 'ArrowUp') || (color === 'blue' && input === 'ArrowDown');
            } else {
                return (color === 'red' && isClickAbove) || (color === 'blue' && !isClickAbove);
            }
        } else {
            if (typeof input === 'string') {
                return (color === 'red' && input === 'ArrowDown') || (color === 'blue' && input === 'ArrowUp');
            } else {
                return (color === 'red' && !isClickAbove) || (color === 'blue' && isClickAbove);
            }
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
            startButton.style.display = 'block';
        }
    }
    
    function resetState() {
        pluSign.style.display = 'none';
        textContainer.style.display = 'none';
        textContainer2.style.display = 'none';
    }
}
