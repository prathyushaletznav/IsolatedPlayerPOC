function identifyDomChanges() {
    var observer = new MutationObserver(function (mutations) {
        console.info("**dom change occured");
        addAllBadges();
    });
    var config = {
        subtree: true,
        attributes: true,
        childList: true,
        characterData: true
    };
    observer.observe(window.top.document, config);
}

var flows = [{
        id: 1,
        steps: [{
                stepId: 1,
                title: "flow1step1",
                desc: "This is flow1step1",
                elem: {
                    selector: "#ppm_header_product",
                    iframePath: "",
                    position: {
                        top: "",
                        left: "",
                        width: ""
                    },
                    elNode: null,
                    identified: false
                }
            },
            {
                stepId: 2,
                title: "flow1step2",
                desc: "This is flow1step2",
                elem: {
                    selector: "#ppm_header_user",
                    iframePath: "",
                    position: {
                        top: "",
                        left: "",
                        width: ""
                    },
                    elNode: null,
                    identified: false
                }
            },
            {
                stepId: 3,
                title: "flow1step3",
                desc: "This is flow1step3",
                elem: {
                    selector: "#ppm_nav_app",
                    iframePath: "",
                    position: {
                        top: "",
                        left: "",
                        width: ""
                    },
                    elNode: null,
                    identified: false
                }
            }
        ]
    },
    {
        id: 2,
        steps: [{
                stepId: 4,
                title: "flow2step1",
                desc: "This is flow2step1",
                elem: {
                    selector: 'input[name="name"]',
                    iframePath: "",
                    position: {
                        top: "",
                        left: "",
                        width: ""
                    },
                    elNode: null,
                    identified: false
                }
            },
            {
                stepId: 5,
                title: "flow2step2",
                desc: "This is flow2step2",
                elem: {
                    selector: 'textarea[name="description"]',
                    iframePath: "",
                    position: {
                        top: "",
                        left: "",
                        width: ""
                    },
                    elNode: null,
                    identified: false
                }
            },
            {
                stepId: 6,
                title: "flow2step3",
                desc: "This is flow2step3",
                elem: {
                    selector: ".ppm_button",
                    iframePath: "",
                    position: {
                        top: "",
                        left: "",
                        width: ""
                    },
                    elNode: null,
                    identified: false
                }
            }
        ]
    },
    {
        id: 3,
        steps: [{
                stepId: 7,
                title: "iframeflow3step1",
                desc: "This is frameflow3step1",
                elem: {
                    selector: '.workflow-title',
                    iframePath: "http://111.93.27.187:8889/ppmreports/flow.html?_flowId=homeFlow",
                    position: {
                        top: "",
                        left: "",
                        width: ""
                    },
                    elNode: null,
                    identified: false
                }
            },
            {
                stepId: 8,
                title: "frameflow3step2",
                desc: "This is frameflow3step2",
                elem: {
                    selector: '#display > div > div > div.body > div > div.homeMain > ul > li:nth-child(3) > div.workflow-container > h2',
                    iframePath: "http://111.93.27.187:8889/ppmreports/flow.html?_flowId=homeFlow",
                    position: {
                        top: "",
                        left: "",
                        width: ""
                    },
                    elNode: null,
                    identified: false
                }
            },
            {
                stepId: 9,
                title: "frameflow3step3",
                desc: "This is frameflow3step3",
                elem: {
                    selector: '#display > div > div > div.body > div > div.homeMain > ul > li:nth-child(5) > div.workflow-container > h2',
                    iframePath: "http://111.93.27.187:8889/ppmreports/flow.html?_flowId=homeFlow",
                    position: {
                        top: "",
                        left: "",
                        width: ""
                    },
                    elNode: null,
                    identified: false
                }
            }
        ]
    }
];

var badges = [{
        id: 1,
        elem: "#ppm_header_product",
        hoverMessage: "This is tooltip 1"
    },
    {
        id: 2,
        elem: "#ppm_header_user",
        hoverMessage: "This is tooltip 2"
    }
];
var currIdx = 0;
var currentFlowId;
var popper;
var tetherAttached = null;

function playFlow(flowId) {
    currIdx = 0;
    currentFlowId = flowId;
    displayStep(currIdx);
}

function updateStep(stepData) {
    // if(popper) {
    //     popper.destroy();
    // }
    if(tetherAttached) {
    tetherAttached.destroy();
    tetherAttached = null;
    }
    if (stepData.elem.identified) {
        var balloonElem = window.top.document.querySelector('.letznav-balloon-step');
        balloonElem.style.display = "block";
        balloonElem.style.left = stepData.elem.position.left + stepData.elem.position.width + 10 + 'px';
        balloonElem.style.top = stepData.elem.position.top + 'px';

        var balloonHeading = window.top.document.querySelector('.letznav-step-heading');
        balloonHeading.innerText = stepData.title;

        var balloonDesc = window.top.document.querySelector('.letznav-step-description');
        balloonDesc.innerText = stepData.desc;
        
        // popper = new Popper(stepData.elem.elNode, balloonElem, {
        //     placement: 'right'
        // });
        console.info('element', balloonElem);
        console.info('**target', stepData.elem.elNode);
        var letznavElementsData = window.top['letznav-elements-data'];
        var targetEl = letznavElementsData.find(data => data.id === stepData.stepId);
        if (targetEl && targetEl.elementNode) {
            tetherAttached = new Tether({
                element: balloonElem,
                target: targetEl && targetEl.elementNode,
                attachment: 'top left',
                targetAttachment: 'top right'
            });
            currIdx = currIdx + 1;
        }
    }
}

function displayStep(idx) {
    var flowData = flows.find(flow => flow.id === currentFlowId);
    var stepData = flowData && flowData.steps[idx];
    if (stepData) {
        toPost = {
            type: "letznav_get_element_data",
            element: stepData,
            elementType: 'flow-step'

        };
        sendMessageToAllIFrames(toPost);
    } else {
        var balloonElem = window.top.document.querySelector('.letznav-balloon-step');
        balloonElem.style.display = 'none';
    }
}

function attachBadge(
    id,
    message,
    sourceElemLeft,
    sourceElemTop,
    sourceElemWidth
) {
    var badgeNode = document.createElement("div");
    badgeNode.setAttribute("class", "letznav-badge");
    badgeNode.setAttribute("id", `letznav-badge-added-${id}`);
    badgeNode.setAttribute(
        "style",
        `left: ${sourceElemLeft + sourceElemWidth}px; top: ${sourceElemTop}px`
    );
    badgeNode.innerHTML = `
    <div class="letznav-badge-icon">  &nbsp; </div>
    <p class="letznav-badge-hover-message"> ${message} </p>
    `;
    window.top.document.body.appendChild(badgeNode);
}

function addAllBadges() {
    if (badges) {
        badges.forEach(badge => {
            var elemToAttach = window.top.document.querySelector(badge.elem);
            if (
                elemToAttach &&
                !window.top.document.querySelector(`#letznav-badge-added-${badge.id}`)
            ) {
                var elemRect = elemToAttach.getBoundingClientRect();
                attachBadge(
                    badge.id,
                    badge.hoverMessage,
                    elemRect.left,
                    elemRect.top,
                    elemRect.width
                );
            }
        });
    }
    // for (var badge of badges) {
    // var elemToAttach = window.top.document.querySelector(badge.elem);
    // if (elemToAttach && !window.top.document.querySelector('letznav-badge-added-id')) {
    //     var elemRect = elemToAttach.getBoundingClientRect();
    //     attachBadge(badge.id, badge.hoverMessage, elemRect.left, elemRect.top, elemRect.width);
    // }
    // }
}

function addListeners() {
    var balloonNextBtn = window.top.document.querySelector(
        ".letznav-balloon-next-btn"
    );
    if (balloonNextBtn) {
        balloonNextBtn.addEventListener("click", () => {
            onNextClick();
        });
    }
}

function onNextClick() {
    displayStep(currIdx);
}

identifyDomChanges();
addListeners();
// setTimeout(function () {
//     addAllBadges();
// }, 1000);
// if (window.top.document.readyState === "complete") {

// }

function getWindows() {
    var result = [];
    var stack = [window.top];
    while (stack && stack.length > 0) {
        var popWindow = stack.pop();
        if (popWindow) {
            result.push(popWindow);
            var popWindowFrames = popWindow.document.getElementsByTagName('iframe');
            if (popWindowFrames && popWindowFrames.length) {
                for (let i = 0; i < popWindowFrames.length; i++) {
                    if (popWindowFrames[i].contentWindow) {
                        stack.push(popWindowFrames[i].contentWindow);
                    }
                }
            }
        }
    }
    return result;
}

function sendMessageToAllIFrames(toPost) {
    var iframeWindows = getWindows();
    // var iframeElems = window.top.document.getElementsByTagName("iframe");
    // for (i = 0; i < iframeElems.length; i++) {
    //     if (iframeElems[i].contentWindow) {
    //         iframeWindows.push(iframeElems[i].contentWindow);
    //     }
    // }
    window.top.postMessage(toPost, "*");
    if (iframeWindows.length > 0) {
        for (let i = iframeWindows.length - 1; i >= 0; i--) {
            // tslint:disable-line:prefer-for-of
            try {
                if (iframeWindows[i] && iframeWindows[i].postMessage) {
                    //to-do: restrict posting to letznav iframe
                    iframeWindows[i].postMessage(toPost, "*");
                }
            } catch (err) {
                console.warn("Error posting message to iframe: ", err);
            }
        }
    }
}

function receiveForMessage() {
    window.addEventListener("message", request => {
        if (request.data.type === "letznav_updated_element_data") {
            var elemType = request.data.elementType;
            if (elemType === 'flow-step') {
                updateStep(request.data.element);
            }
        }
    });
}

receiveForMessage();
window.isletznavplayerframe = true;