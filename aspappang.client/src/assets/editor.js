var editor = new Quill('#descriptionInput');
editor.root.style.padding = "0px";

//DescriptionInput
descriptionInput = document.querySelector("#descriptionInput");

descriptionInput.addEventListener("keydown", function () {
    let range = editor.getSelection();

    //Prevents editor's bug 1
    if (event.key == "Backspace" && range != null && editor.getFormat(range.index, 1)["list"] == null) {
        if (range.index > 0) {
            const nearestIndex = editor.getFormat(range.index - 2, 1),
                  currentIndex = editor.getFormat(range.index - 1, 1);

            formatStyle("bold");
            formatStyle("italic");
            formatStyle("strike");

            function formatStyle(formatType) {
                if (currentIndex[formatType] && nearestIndex[formatType] == null) {
                    event.preventDefault();
                    editor.deleteText(range.index - 1, 1);
                }
            }
        }
        else if (range.length == 0) { event.preventDefault(); }
    }
    //Prevents editor's bug 2
    else if (!event.ctrlKey && event.key != "v" && event.key.length == 1 && editor.getFormat(range.index, 1)["code-block"] == true) {
        event.preventDefault();
        editor.focus();
        editor.insertText(range.index, event.key);
    }
    //Pastes text inside of editor.
    else if (event.ctrlKey && event.key == "v") {
        asyncFunc();

        async function asyncFunc() {
            const textToPaste = await navigator.clipboard.readText(),
                index = editor.getSelection().index;

            editor.insertText(range.index, textToPaste);
            setTimeout(function () { editor.setSelection(index + textToPaste.length, 0) }, 1);
        }
    }
    //Selects whole text in editor.
    else if (event.ctrlKey && event.key == "a") {
        editor.setSelection(0, editor.getLength());
    }
})

    //Animation and turns on editor's scrollbar if is needed.
qlEditor = document.querySelector(".ql-editor");

descriptionInput.addEventListener("click", function () {
    const editorHeight = window.getComputedStyle(qlEditor).height,
        editorScrollHeight = `${qlEditor.scrollHeight}px`;

    if (!descriptionInput.classList.contains("focus")) {
        descriptionContainer.classList.toggle("focus");
        descriptionInput.classList.toggle("focus");
        topBar.classList.toggle("focus");

        if (editorHeight < editorScrollHeight) {
            qlEditor.classList.toggle("scrollbar");
        }

        isShadowAdded = true;
    }
})

wasClicked = false;

document.body.addEventListener("click", function () {
    const clickedList = event.target;
    if (!descriptionInput.contains(clickedList) && !topBar.contains(clickedList)) {
        wasClicked = true;
    }
    else {
        wasClicked = false;
    }
});


//Topbar
topBar = document.getElementById("topBar");
descriptionContainer = document.getElementById("descriptionContainer");
isShadowAdded = false;

    //Animation
topBar.addEventListener("click", function () {
    if (!isShadowAdded && !size.contains(event.target) && !descriptionInput.classList.contains("focus")) {
        descriptionInput.focus();
        descriptionContainer.classList.toggle("focus");
        descriptionInput.classList.toggle("focus");
        topBar.classList.toggle("focus");
        isShadowAdded = true;
    }
})

    //Another animation and turns on editor's scrollbar if is needed.
document.body.addEventListener("click", function () {
    if (!descriptionInput.contains(event.target) && !topBar.contains(event.target) && !fontColorPalette.contains(event.target)) {
        if (descriptionInput.classList.contains("focus")) {
            if (qlEditor.classList.contains("scrollbar")) {
                qlEditor.classList.toggle("scrollbar");
            }

            descriptionContainer.classList.toggle("focus");
            descriptionInput.classList.toggle("focus");
            topBar.classList.toggle("focus");
            isShadowAdded = false;
        }
    }
})

    //Needed to prevent bugs.
topBarClicked = false;

topBar.addEventListener("click", function () {
    topBarClicked = true;
});

//Text formating
    //Bold
isBold = false;
boldText = document.querySelector("#boldTxt");
svg = boldText.querySelector("svg");

boldText.addEventListener("click", function () { isBold = formatOnClick("bold", svg, isBold, reverseBold) });
descriptionInput.addEventListener("keydown", function () { formatOnKeyClick("bold", svg, reverseBold) });

function reverseBold() {
    reverseFormat("bold");
}

    //Italic
isItalic = false,
italicText = document.getElementById("italicText");
svg2 = italicText.querySelector("svg");
rangeLength = 0;
rangeIndex = -1;

italicText.addEventListener("click", function () { isItalic = formatOnClick("italic", svg2, isItalic, reverseItalic); });
descriptionInput.addEventListener("keydown", function () { formatOnKeyClick("italic", svg2, reverseItalic); });

function reverseItalic() {
    reverseFormat("italic");
}

    //Strike through
isStrike = false;
strikeText = document.getElementById("strikeText");
svg3 = strikeText.querySelector("svg");

strikeText.addEventListener("click", function () { isStrike = formatOnClick("strike", svg3, isStrike, reverseStrike); });
descriptionInput.addEventListener("keydown", function () { formatOnKeyClick("strike", svg3, reverseStrike); });

function reverseStrike() {
    reverseFormat("strike");
}


//Font color & background color
fontColor = document.querySelector("#fontColor"),
fontColorPicker = document.querySelector("#fontColorPicker");
fontColorPalette = document.querySelector("#fontColorPalette");
fontColorStatusContainer = document.querySelector("#fontColorStatus");
fontColorStatus = document.querySelector("#fontColorStatus .fontColorBar");
autoFontColor = document.querySelector("#autoFontColor");
customFontColor = document.querySelector("#customFontColor");
colorChoiceArray = document.querySelectorAll("#colorChoices div");
isAutoFontColorChosen = true;

background = document.querySelector("#background");
backgroundPicker = document.querySelector("#backgroundPicker");
backgroundPalette = document.querySelector("#backgroundPalette");
backgroundStatusContainer = document.querySelector("#backgroundStatus");
autoBackground = document.querySelector("#autoBackground");
backgroundStatus = document.querySelector("#backgroundStatus svg");
customBackground = document.querySelector("#customBackground");
backgroundChoiceArray = document.querySelectorAll("#backgroundChoices div");
isAutoBackgroundChosen = true;

    //Activates palette.
fontColor.addEventListener("click", function () { activatePalette(fontColorPalette); })
background.addEventListener("click", function () { activatePalette(backgroundPalette); });

    //Animation
background.addEventListener("mouseenter", function () {
    backgroundStatusContainer.style.backgroundColor = window.getComputedStyle(this).backgroundColor;
});

background.addEventListener("mouseleave", function () {
    backgroundStatusContainer.style.backgroundColor = null;
});

fontColor.addEventListener("mouseenter", function () {
    fontColorStatusContainer.style.backgroundColor = window.getComputedStyle(this).backgroundColor;
});

fontColor.addEventListener("mouseleave", function () {
    fontColorStatusContainer.style.backgroundColor = null;
});

function activatePalette(paletteName) {
    if (paletteName.style.visibility != "visible") { paletteName.style.visibility = "visible"; }
}

fontColorPicker.addEventListener("input", function () { isAutoFontColorChosen = applyCustomColor(autoFontColor, fontColorStatus, fontColorPicker); });
backgroundPicker.addEventListener("input", function () { isAutoBackgroundChosen = applyCustomColor(autoBackground, backgroundStatus, backgroundPicker); });

function applyCustomColor(commonColor, colorStatus, colorPicker) {
    commonColor.style.backgroundColor = "transparent";
    colorStatus.style.fill = colorPicker.value;
    return false;
}

fontColorStatusContainer.addEventListener("click", function () { applyColorStyle(fontColorStatus, "color"); });
backgroundStatusContainer.addEventListener("click", function () { applyColorStyle(backgroundStatus, "background"); });

function applyColorStyle(colorStatus, formatType) {
    editor.focus();

    let isTransparentBackground = false;
    if (colorStatus.style.fill == "rgb(117, 117, 117)" && formatType == "background") {
        colorStatus.style.fill = "transparent";
        isTransparentBackground = true;
    }

    if (rangeIndex != -1 && rangeLength > 0) {
        let formatObj = {};
        formatObj[formatType] = colorStatus.style.fill;
        editor.formatText(rangeIndex, rangeLength, formatObj);
    }
    else if (rangeIndex != -1) { editor.format(formatType, colorStatus.style.fill); }

    if (isTransparentBackground) { colorStatus.style.fill = "#757575"; }
}

    //ColorChoice
chooseColor("fontColor", colorChoiceArray, fontColorStatus, autoFontColor);
chooseColor("background", backgroundChoiceArray, backgroundStatus, autoBackground);

function chooseColor(paletteName, colorArray, colorStatus, autoColor) {
    for (let x = 0; x < colorArray.length; x++) {
        colorArray[x].addEventListener("click", function () {
            editor.focus();
            colorStatus.style.fill = colorArray[x].style.backgroundColor;
            autoColor.style.backgroundColor = "transparent";

            if (paletteName == "fontColor") {
                isAutoFontColorChosen = false;
            }
            else {
                isAutoBackgroundChosen = false;
            }
        })
    }
}
    
    //autoFontColor & autoBackground
autoFontColor.addEventListener("click", function () {
    isAutoFontColorChosen = changeColorToDefault(autoFontColor, fontColorStatus, "#1a1717");
});

autoBackground.addEventListener("click", function () {
    isAutoBackgroundChosen = changeColorToDefault(autoBackground, backgroundStatus, "#757575");
});

function changeColorToDefault(autoColor, colorStatus, defaultColor) {
    autoColor.style = null;
    
    colorStatus.style.fill = defaultColor;
    return true;
}

autoFontColor.addEventListener("mouseenter", function () {
    if (document.body.classList.contains("darkTheme")) {
        autoFontColor.style.backgroundColor = "#292323";
    }
    else {
        autoFontColor.style.backgroundColor = "#e9e4e4";
    }
});

autoFontColor.addEventListener("mouseleave", function () {
    if (!isAutoFontColorChosen) {
        autoFontColor.style.backgroundColor = "transparent";
    }
    else {
        autoFontColor.style = null;
    }
});

autoBackground.addEventListener("mouseenter", function () {
    if (document.body.classList.contains("darkTheme")) {
        autoBackground.style.backgroundColor = "#292323";
    }
    else {
        autoBackground.style.backgroundColor = "#e9e4e4";
    }
});

autoBackground.addEventListener("mouseleave", function () {
    if (!isAutoBackgroundChosen) {
        autoBackground.style.backgroundColor = "transparent";
    }
    else {
        autoBackground.style = null;
    }
});

    //customFontColor & customBackground
customFontColor.addEventListener("click", function () {
    fontColorPicker.click();
});

customBackground.addEventListener("click", function () {
    backgroundPicker.click();
});

    //Palettes drag
positionXBefore = 0, positionYBefore = 0;
positionXAfter = 0, positionYAfter = 0;

fontColorPalette.addEventListener("mousedown", function () { moveColorPalette(fontColorPalette); });

backgroundPalette.addEventListener("mousedown", function () { moveColorPalette(backgroundPalette); });

function moveColorPalette(object) {
    positionXBefore = event.clientX;
    positionYBefore = event.clientY;

    const mouseMoveFunc = function () { colorPaletteMouseMove(object) };
    document.addEventListener("mousemove", mouseMoveFunc);

    const mouseUpFunc = function () { colorPaletteMouseUp(mouseMoveFunc); };
    document.addEventListener("mouseup", mouseUpFunc);
}

function colorPaletteMouseMove(object) {
    positionXAfter = positionXBefore - event.clientX;
    positionYAfter = positionYBefore - event.clientY;
    positionXBefore = event.clientX;
    positionYBefore = event.clientY;

    object.style.left = (object.offsetLeft - positionXAfter) + "px";
    object.style.top = (object.offsetTop - positionYAfter) + "px";
}

function colorPaletteMouseUp(mouseMoveFunc) {
    document.removeEventListener("mousemove", mouseMoveFunc);
}

    //Closes palette
document.body.addEventListener("keydown", function () {
    if (backgroundPalette.style.visibility == "visible") {
        ClosePalette(backgroundStatus, background, backgroundPalette);
    }
    else if(fontColorPalette.style.visibility == "visible") {
        ClosePalette(fontColorStatusContainer, fontColor, fontColorPalette);
    }
});

document.body.addEventListener("click", function () {
    const clickedList = event.target;

    if (backgroundPalette.style.visibility == "visible" && !backgroundPalette.contains(clickedList) && !background.contains(clickedList)) {
        closePalette(backgroundStatus, background, backgroundPalette);
    }
    else if (fontColorPalette.style.visibility == "visible" && !fontColorPalette.contains(clickedList) && !fontColor.contains(clickedList)) {
        closePalette(fontColorStatusContainer, fontColor, fontColorPalette);
    }
});

function closePalette(status, btn, palette) {
    palette.style.visibility = "hidden";
    palette.style.top = "140%";
    palette.style.left = "0%";

    const width = parseFloat(window.getComputedStyle(palette).width),
        btnWidth = parseFloat(window.getComputedStyle(status).width) + parseFloat(window.getComputedStyle(btn).width);

    palette.style.left = `${-(width - btnWidth) / 2}px`;
}

//Indent
indent = document.querySelector("#indent"),
decreaseindent = document.querySelector("#decreaseindent");

indent.addEventListener("click", function () {
    editor.focus();
    tabKeyFunc(false);
});

decreaseindent.addEventListener("click", function () {
    editor.focus();
    tabKeyFunc(true);
});

    //Indent on tab key click and bonded with it things.
function tabKeyFunc(isDecreaseindent) {
    const index = editor.getSelection().index;

    if (!isDecreaseindent) {
        changeTabIndices(index, false);
        changeVideoIndices(index, false);
        tabIndices[tabIndices.length] = index + 1;
        editor.insertText(index, "\t");
    }
    else if (tabIndices.includes(index)) {
        tabIndices.splice(tabIndices.indexOf(index), 1);

        editor.deleteText(index - 1, 1);
        changeTabIndices(index, true);
        changeVideoIndices(index, true);
    }
}

function changeTabIndices(currentIndex, wasDeletedSign) {
    for (let x = 0; x < tabIndices.length; x++) {
        if (tabIndices[x] != null && currentIndex < tabIndices[x]) {
            if (wasDeletedSign) { tabIndices[x]--; }
            else { tabIndices[x]++; }
        }
    }
}

videoIndices = [];

function changeVideoIndices(currentIndex, wasDeletedSign) {
    for (let x = 0; x < videoIndices.length; x++) {
        if (videoIndices[x] != null && currentIndex < videoIndices[x]) {
            if (wasDeletedSign) { videoIndices[x]--; }
            else { videoIndices[x]++; }
        }
    }
}

    //Indents handling in editor.
tabIndices = [];

descriptionInput.addEventListener("keydown", function () {
    let range = editor.getSelection();

    if (event.key == "Tab" && event.shiftKey) {
        event.preventDefault();
        tabKeyFunc(true);
    }
    else if (event.key == "Tab") {
        event.preventDefault();
        tabKeyFunc(false);
    }
    else if (event.key == "Backspace") {
        const index = range.index;

        if (index && tabIndices.includes(index)) {
            tabIndices.splice(tabIndices.indexOf(index), 1);
        }
    }
    else if (event.key.length == 1) {
        changeTabIndices(range.index, false);
        changeVideoIndices(range.index, false);
    }
    else if (event.key == "Backspace" && range.index != 0 || event.key == "Delete" && range.index != editor.getLength() - 1) {
        if (videoIndices.includes(range.index)) {
            videoIndices.splice(videoIndices.indexOf(range.index), 1);

            if (event.key == "Backspace") {
                editor.deleteText(range.index - 1, 1);
            }
        }

        if (tabIndices.includes(range.index)) { tabIndices.splice(tabIndices.indexOf(range.index), 1); }

        changeTabIndices(range.index, true);
        changeVideoIndices(range.index, true);
    }
    else if (event.key == "Enter") {
        setTimeout(function () {
            editor.format("align", null);
        }, 1);

        if (videoIndices.includes(range.index + 1)) {
            event.preventDefault();

            let p = document.createElement("p");
            document.querySelector(".ql-editor").appendChild(p);

            setTimeout(function () { editor.setSelection(editor.getLength(), 1); }, 1);
        }
    }
});

//AlignType
alignType = document.querySelector("#alignType");
alignValues = [null, 'center', 'right', 'justify'];
alignValue = 0;

async function changeTextAlign(value) {
    let alignTypeOptions = document.querySelector("#alignTypeOptions");

    isKeyClicked = true;
    editor.blur();
    editor.focus();

    editor.format("align", value);
    alignTypeOptions.style.visibility = "hidden";

    const clone = alignType.querySelector("#alignTypeOptions").cloneNode(true);

    switch (value) {
        case null: //case of left align
            alignType.innerHTML = '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path clip-rule="evenodd" d="m3 6.75c-.41421 0-.75.33579-.75.75s.33579.75.75.75h18c.4142 0 .75-.33579.75-.75s-.3358-.75-.75-.75zm0 9c-.41421 0-.75.3358-.75.75s.33579.75.75.75h12c.4142 0 .75-.3358.75-.75s-.3358-.75-.75-.75zm-.75-2.25c0-.4142.33579-.75.75-.75h18c.4142 0 .75.3358.75.75s-.3358.75-.75.75h-18c-.41421 0-.75-.3358-.75-.75zm.75-3.75c-.41421 0-.75.3358-.75.75s.33579.75.75.75h12c.4142 0 .75-.3358.75-.75s-.3358-.75-.75-.75z" fill-rule="evenodd"></path></g></svg>';
            alignValue = 0;
            break;
        case "center":
            alignType.innerHTML = '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M5 8H19M5 16H19M3 12H21" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
            alignValue = 1;
            break;
        case "right":
            alignType.innerHTML = '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M8 10H21M3 14H21M8 18H21M3 6H21" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
            alignValue = 2;
            break;
        case "justify":
            alignType.innerHTML = '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 10H21M3 14H21M3 18H21M3 6H21" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
            alignValue = 3;
            break;
    }

    setTimeout(function () {
        if (!descriptionInput.classList.contains("focus")) {
            document.querySelector("#descriptionInput").focus();
            document.querySelector("#descriptionContainer").classList.toggle("focus");
            document.querySelector("#descriptionInput").classList.toggle("focus");
            topBar.classList.toggle("focus");
        }
    }, 1);

    alignType.appendChild(clone);

    if (value) {
        document.querySelector("#alignType svg").style.stroke = "rgb(7, 56, 135)";
    }
}

    //Opens alignType menu or sets to its default value if it's set another one.
alignType.addEventListener("click", async function () {
    let el = this;

    if (document.querySelector("#alignTypeOptions").style.visibility != "visible") {
        editor.blur();
        editor.focus();

        const index = editor.getSelection().index;
        editor.setSelection(index - 1, 0);
        editor.setSelection(index, 0);

        const copy = el.querySelector("#alignTypeOptions").cloneNode(true);

        if (alignValue != 0) {
            el.innerHTML = '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path clip-rule="evenodd" d="m3 6.75c-.41421 0-.75.33579-.75.75s.33579.75.75.75h18c.4142 0 .75-.33579.75-.75s-.3358-.75-.75-.75zm0 9c-.41421 0-.75.3358-.75.75s.33579.75.75.75h12c.4142 0 .75-.3358.75-.75s-.3358-.75-.75-.75zm-.75-2.25c0-.4142.33579-.75.75-.75h18c.4142 0 .75.3358.75.75s-.3358.75-.75.75h-18c-.41421 0-.75-.3358-.75-.75zm.75-3.75c-.41421 0-.75.3358-.75.75s.33579.75.75.75h12c.4142 0 .75-.3358.75-.75s-.3358-.75-.75-.75z" fill-rule="evenodd"></path></g></svg>';
        }

        el.appendChild(copy);

        if (alignValue == 0) {
            el.querySelector("svg").style.fill = "#b3b3b3";
            document.querySelector("#alignTypeOptions").style.visibility = "visible";
        }
        else {
            editor.format("align", null);
            alignValue = 0;
            isKeyClicked = true;
        }

        setTimeout(function () {
            if (!descriptionInput.classList.contains("focus")) {
                document.querySelector("#descriptionInput").focus();
                document.querySelector("#descriptionContainer").classList.toggle("focus");
                document.querySelector("#descriptionInput").classList.toggle("focus");
                topBar.classList.toggle("focus");
            }
        }, 1);
    }
});

    //Closes alignType menu.
document.body.addEventListener("click", function (e) {
    let alignTypeOptions = document.querySelector("#alignTypeOptions");

    if (alignTypeOptions?.style.visibility == "visible" && alignTypeOptions?.contains(event.target)) {
        alignTypeOptions.style.visibility = "hidden";
        alignType.style.background = "transparent";
        document.querySelector("#alignType svg").style.fill = "#757575";
        alignType.style = null;
        event.preventDefault();
    }
    else if (alignTypeOptions?.style.visibility == "visible" && !alignType.contains(event.target) && !alignType.contains(event.target)) {
        alignTypeOptions.style.visibility = "hidden";
        alignType.querySelector("svg").style = null;
        alignType.style = null;
    }

    const options = document.querySelectorAll("#alignTypeOptions div");

    for (let i = 0; i < options.length; i++) {
        if (options[i].contains(event.target)) {
            changeTextAlign(alignValues[i]);
        }
    }
});

//Ordered & bullet list & code-block & blockquote
orderedList = document.querySelector("#orderedList");
orderedListSvg = orderedList.querySelector("svg");

orderedList.addEventListener("click", function () { changeTextStructure("list", orderedListSvg, "ordered"); });

bulletList = document.querySelector("#bulletList");
bulletListSvg = bulletList.querySelector("svg");

bulletList.addEventListener("click", function () { changeTextStructure("list", bulletListSvg, "bullet"); });

codeBlock = document.querySelector("#codeBlock");
codeBlockSvg = codeBlock.querySelector("svg");

codeBlock.addEventListener("click", function () { changeTextStructure("code-block", codeBlockSvg, true); });

blockquote = document.querySelector("#blockquote");
blockquoteSvg = blockquote.querySelector("svg");

blockquote.addEventListener("click", function () { changeTextStructure("blockquote", blockquoteSvg, true); });

function changeTextStructure(structureElement, svg, type) {
    editor.focus();
    editor.off("text-change", textChangeFunc);

    let range = editor.getSelection(),
        listType = editor.getFormat(range.index, range.length)[structureElement];

    if (listType != true && listType != type) {
        let formatObj = {};

        formatObj[structureElement] = type;
        editor.formatLine(range.index, range.length, formatObj);

        svg.style.fill = "#073887";

        if (type != "bullet") { bulletListSvg.style.fill = "#757575"; }
        if (type != "ordered") { orderedListSvg.style.fill = "#757575"; }
        if (structureElement != "blockquote") { blockquoteSvg.style.fill = "#757575"; }
        if (structureElement != "code-block") { codeBlockSvg.style.fill = "#757575"; }
    }
    else {
        let formatObj = {};

        formatObj[structureElement] = null;
        svg.style.fill = "#757575";

        editor.formatLine(range.index, range.length, formatObj);
    }

    editor.on("text-change", textChangeFunc);
}


//Sub & sup script
superscript = document.querySelector("#superscript");
superscriptSvg = superscript.querySelector("svg");

superscript.addEventListener("click", function () { scriptFunc("super", superscriptSvg); });

subscript = document.querySelector("#subscript");
subscriptSvg = subscript.querySelector("svg");

subscript.addEventListener("click", function () { scriptFunc("sub", subscriptSvg); });

function scriptFunc(type, svg) {
    editor.focus();

    let range = editor.getSelection(),
        format = editor.getFormat(range.index, range.length)["script"];

    if (format != type) {
        if (range.length > 0) {
            let formatObj = {};
            formatObj["script"] = type;
            editor.formatText(range.index, range.length, formatObj);
        }
        else {
            editor.format("script", type);
        }

        svg.style.fill = "#073887";

        if (type == "super") { subscriptSvg.style.fill = "#757575"; }
        else if (type == "sub") { superscriptSvg.style.fill = "#757575"; }
    }
    else {
        if (range.length > 0) {
            let formatObj = {};
            formatObj["script"] = null;
            editor.formatText(range.index, range.length, formatObj);
        }
        else {
            editor.format("script", null);
        }

        svg.style.fill = "#757575";
    }
}


//Link & image & video
linkCreator = document.querySelector("#linkCreator");
linkCreatorPopup = document.querySelector("#linkCreatorPopup");
    //linkCreatorPopupSvg = linkCreatorPopup.querySelector("svg");

    //Opens uploader.
//document.querySelectorAll(".uploadSection .formatBtn:has(div)")?.forEach(x => {
//    x.addEventListener("click", function () {
//        let div = document.querySelector(`#${this.id}Popup`);

//        div.style.visibility = "visible";
//        overlay.style.display = "block";

//        div.querySelector("svg").addEventListener("click", function () {
//            let container = this.parentNode;

//            container.style.visibility = "hidden";
//            overlay.style.display = "none";

//            container.querySelectorAll("input").forEach(y => {
//                y.value = null;
//            });
//        });
//    });
//});
    //Inserts link into post.
document.querySelector("#createLink")?.addEventListener("click", function () {
    let popup = document.querySelector("#linkCreatorPopup"),
        linkHref = popup.querySelector("#linkHref"),
        linkTag = popup.querySelector("#linkTag");

    editor.focus();
    let range = editor.getSelection();

    editor.insertText(range.index, linkTag.value);

    let formatObj = {};

    formatObj["link"] = linkHref.value;
    editor.formatText(range.index, linkTag.value.length, formatObj);

    closePopup(popup)
});

    //Inserts video into post.

//document.querySelector("#uploadVideo")?.addEventListener("click", function () {
//    if (this.parentNode.querySelector("input").value.includes("<iframe")) {
//        editor.focus();

//        let popup = document.querySelector("#videoUploaderPopup"),
//            videoUrl = popup.querySelector("#videoUrl");

//        let range = editor.getSelection(),
//            sizeType = editor.getFormat(range.index, range.length)["size"];

//        videoIndices[videoIndices.length] = range.index + 1;

//        let rawUrl = videoUrl.value.trim(),
//            url = rawUrl.substring(0, rawUrl.indexOf("iframe") + 7) + 'align="center" ' + rawUrl.slice(rawUrl.indexOf("iframe") + 6);

//        try {
//            editor.clipboard.dangerouslyPasteHTML(range.index, url);
//        } catch (error) { }

//        closePopup(popup);

//        if (sizeType != null) {
//            size.value = sizeType;
//            size.style.color = "#073887";
//        }
//    }
//    else {
//        this.parentNode.querySelectorAll("p")[1].style.display = "block";
//    }
//});

    //Closes popup.
function closePopup(popup) {
    popup.querySelectorAll("input").forEach(x => { x.value = null; })
    popup.style.visibility = "hidden";
    overlay.style.display = "none";
}

//FormatBtns status etc.
lastIndexText = -1;

    //Updates text format status while selecting text in editor and turns on scrollbar if it is needed.
editor.on("selection-change", function () {
    let editorHeight = window.getComputedStyle(qlEditor).height,
        editorScrollHeight = `${qlEditor.scrollHeight}px`;

    if (!qlEditor.classList.contains("scrollbar") && parseInt(editorScrollHeight) > parseInt(editorHeight)) {
        qlEditor.classList.toggle("scrollbar");
    }

    let range = editor.getSelection();
    if (range != null) {
        rangeLength = range.length;
        rangeIndex = range.index;
    }

    lastIndexText = rangeIndex;
    updateStyleStatus();
})

    //Updates text format status while typing new character in editor text and turns on scrollbar if it is needed.
isKeyClicked = false;

editor.on("text-change", textChangeFunc);
function textChangeFunc() {
    let editorHeight = window.getComputedStyle(qlEditor).height,
        editorScrollHeight = `${qlEditor.scrollHeight}px`;

    if (editorHeight < editorScrollHeight && descriptionInput.classList.contains("focus") && !qlEditor.classList.contains("scrollbar")) {
        qlEditor.classList.toggle("scrollbar");
    }

    if (videoIndices.includes(editor.getSelection().index + 1)) {
        editor.getSelection(range.index + 1, 1);
    }

    if (!isKeyClicked) {
        lastIndexText = editor.getLength > 0 ? editor.getLength() - 1 : 0;
        updateStyleStatus()
    }
    else { isKeyClicked = false; }
}

    //FormatBtns status animation
async function updateStyleStatus() {
    setTimeout(function () {
        if (!wasClicked) {
            editor.focus();
            let range = editor.getSelection();
            let format = editor.getFormat(range?.index, range?.length);

            descriptionInput.scrollIntoView({ behavior: "smooth", block: "center" })

            isBold = formatStyle("bold", svg);
            isItalic = formatStyle("italic", svg2);
            isStrike = formatStyle("strike", svg3);

            formatStyle("size", null);
            formatStyle("code-block", codeBlock.querySelector("svg"));
            formatStyle("blockquote", blockquote.querySelector("svg"));
            formatStyle("list", null);
            formatStyle("script", null);
            formatStyle("align", null);

            function formatStyle(formatType, svgElement) {
                if (formatType != "size" && formatType != "list" && formatType != "script" && formatType != "align") {
                    if (format[formatType]) {
                        svgElement.style.fill = "#073887";
                        return true;
                    }
                    else {
                        svgElement.style.fill = "#757575";
                        return false;
                    }
                }
                else if (formatType == "size") {
                    if (format[formatType] != null) {
                        size.value = format[formatType];
                        size.style.color = "#073887";
                    }
                    else {
                        size.value = "normal";
                        size.style.color = "#212529";
                    }
                }
                else if (formatType == "list") {
                    if (format[formatType] == "ordered") {
                        orderedListSvg.style.fill = "#073887";
                        bulletListSvg.style.fill = "#757575";
                    }
                    else if (format[formatType] == "bullet") {
                        bulletList.style.backgroundColor = "073887";
                        bulletListSvg.style.fill = "#073887";
                        orderedListSvg.style.fill = "#757575";
                    }
                    else {
                        orderedListSvg.style.fill = bulletListSvg.style.fill = "#757575";
                    }
                }
                else if (formatType == "script") {
                    let superscriptSvg = superscript.querySelector("svg");

                    if (format[formatType] == "super") {
                        superscriptSvg.style.fill = "#073887";
                        subscriptSvg.style.fill = "#757575";
                    }
                    else if (format[formatType] == "sub") {
                        subscriptSvg.style.fill = "#073887";
                        superscriptSvg.style.fill = "#757575";
                    }
                    else {
                        subscriptSvg.style.fill = superscriptSvg.style.fill = "#757575";
                    }
                }
                else if (formatType == "align") {
                    let alignTypeOptions = document.querySelector("#alignTypeOptions");

                    if (format[formatType] == null) {
                        format[formatType] = "left";
                    }

                    const clone = alignTypeOptions.cloneNode(true);

                    switch (format[formatType]) {
                        case "left":
                            if (alignValue != 0) {
                                alignType.innerHTML = '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path clip-rule="evenodd" d="m3 6.75c-.41421 0-.75.33579-.75.75s.33579.75.75.75h18c.4142 0 .75-.33579.75-.75s-.3358-.75-.75-.75zm0 9c-.41421 0-.75.3358-.75.75s.33579.75.75.75h12c.4142 0 .75-.3358.75-.75s-.3358-.75-.75-.75zm-.75-2.25c0-.4142.33579-.75.75-.75h18c.4142 0 .75.3358.75.75s-.3358.75-.75.75h-18c-.41421 0-.75-.3358-.75-.75zm.75-3.75c-.41421 0-.75.3358-.75.75s.33579.75.75.75h12c.4142 0 .75-.3358.75-.75s-.3358-.75-.75-.75z" fill-rule="evenodd"></path></g></svg>';
                                alignValue = 0;
                                alignType.appendChild(clone);
                            }

                            break;
                        case "center":
                            if (alignValue != 1) {
                                alignType.innerHTML = '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M5 8H19M5 16H19M3 12H21" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
                                alignValue = 1;
                                alignType.appendChild(clone);
                            }

                            break;
                        case "right":
                            if (alignValue != 2) {
                                alignType.innerHTML = '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M8 10H21M3 14H21M8 18H21M3 6H21" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
                                alignValue = 2;
                                alignType.appendChild(clone);
                            }

                            break;
                        case "justify":
                            if (alignValue != 3) {
                                alignType.innerHTML = '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 10H21M3 14H21M3 18H21M3 6H21" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
                                alignValue = 3;
                                alignType.appendChild(clone);
                            }

                            break;
                    }

                    setTimeout(function () {
                        if (alignValue != 0) {
                            alignType.querySelector("svg").style.stroke = "rgb(7, 56, 135)";
                        }
                    }, 10);


                    alignType.style.background = null;
                }
            }
        }
        else {
            wasClicked = false;
        }
    }, 1);
}

    //Formats text by clicking on formatBtn.
indexBeforeReverse = -1;

function formatOnClick(formatType, svg, bool, onceFunc) {
    descriptionInput.focus();

    let range = editor.getSelection();
    editor.setSelection(rangeIndex, rangeLength);

    if (rangeLength != 0) {
        isKeyClicked = true;

        let formatObj = {},
            wasFirstIndex = false;

        if (range.index == 0) {
            editor.off("text-change", textChangeFunc);
            wasFirstIndex = true;
        }

        if (bool) {
            formatObj[formatType] = false;

            editor.formatText(rangeIndex, rangeLength, formatObj);
            svg.style.fill = "#757575";

            if (wasFirstIndex) {
                editor.on("text-change", textChangeFunc);
            }

            return false;
        }
        else {
            formatObj[formatType] = true;

            editor.formatText(rangeIndex, rangeLength, formatObj);
            svg.style.fill = "#073887";

            isItalic = formatStyle("italic", svg2);
            isBold = formatStyle("bold", svg);
            isStrike = formatStyle("strike", svg3);

            if (wasFirstIndex) {
                editor.on("text-change", textChangeFunc);
            }

            return true;
        }

        function formatStyle(formatType, svgElement) {
            let range = editor.getSelection(),
                format = editor.getFormat(range.index, 1);

            if (format[formatType]) {
                svgElement.style.fill = "#073887";
                return true;
            }
        }
    }
    else if (!bool) {
        editor.format(formatType, "true");
        editor.off("text-change", onceFunc);

        svg.style.fill = "#073887";
        return true;
    }
    else if (bool) {
        svg.style.fill = "#757575";
        editor.once("text-change", onceFunc);

        if (range != null) {
            indexBeforeReverse = range.index;
        }

        return false;
    }
}

    //Formats text by keyboard shortcut.
function formatOnKeyClick(formatType, svg, onceFunc) {
    editor.focus();

    let range = editor.getSelection(),
        index = range.index,
        length = range.length;

    if (event.altKey) {
        if (event.key == "1" && formatType == "bold") {
            isKeyClicked = true;

            if (!isBold) {
                formatStyle(true);
                isBold = true;
            }
            else {
                formatStyle(false);
                isBold = false;
            }
        }
        else if (event.key == "2" && formatType == "italic") {
            isKeyClicked = true;

            if (!isItalic) {
                formatStyle(true);
                isItalic = true;
            }
            else {
                formatStyle(false);
                isItalic = false;
            }
        }
        else if (event.key == "3" && formatType == "strike") {
            isKeyClicked = true;

            if (!isStrike) {
                formatStyle(true);
                isStrike = true;
            }
            else {
                formatStyle(false);
                isStrike = false;
            }
        }
    }

        //Prevents bugs.
    function turnDownFunc(func) {
        if (!descriptionInput.contains(event.target) && !topBar.contains(event.target)) { editor.off("text-change", func); }
    }

        //Updates format btn status.
    function formatStyle(isBool) {
        let formatObj = {};

        if (isBool) {
            if (range?.length > 0) {
                formatObj[formatType] = true;

                let wasFirstIndex = false;
                if (index == 0) {
                    editor.off("text-change", textChangeFunc);
                    wasFirstIndex = true;
                }

                editor.formatText(index, length, formatObj);

                if (wasFirstIndex) {
                    editor.on("text-change", textChangeFunc);
                }
            }
            else {
                editor.format(formatType, "true");
            }

            editor.off("text-change", onceFunc);
            svg.style.fill = "#073887";
        }
        else {
            if (range?.length > 0) {
                formatObj[formatType] = false;

                let wasFirstIndex = false;

                if (index == 0) {
                    editor.off("text-change", textChangeFunc);
                    wasFirstIndex = true;
                }

                editor.formatText(index, length, formatObj);

                if (wasFirstIndex) {
                    editor.on("text-change", textChangeFunc);
                }
            }
            else {
                editor.once("text-change", onceFunc);

                if (range != null) { indexBeforeReverse = range.index; }
                else { indexBeforeReverse = 0; }
            }

            svg.style.fill = "#757575";
            document.body.addEventListener("click", function () { turnDownFunc(onceFunc); });
        }
    }
}

    //Prevents editor's bugs.
function reverseFormat(formatType) {
    let range = editor.getSelection();

    if (indexBeforeReverse < range.index) {
        let formatObj = {};
        formatObj[formatType] = false;
        editor.formatText(range.index - 1, 1, formatObj);
    }
    else {
        indexBeforeReverse = range.index;
        editor.once("text-change", onceFunc);

        function onceFunc() {
            reverseFormat(formatType);
        }
    }
}


//Size
size = document.querySelector("#size");

size.addEventListener("change", function () {
    if (size.value == "normal") {
        editor.format("size", null);
        size.style.color = "#212529";
    }
    else {
        editor.format("size", size.value);
        size.style.color = "#073887";
    }

    if (!isShadowAdded) {
        descriptionInput.focus();
        descriptionContainer.classList.toggle("focus");
        descriptionInput.classList.toggle("focus");
        topBar.classList.toggle("focus");
        isShadowAdded = true;
    }
});

//Adds text from contenteditable container to form input.
description = document.querySelector("#description");
submit = document.querySelector("#submit");

submit?.addEventListener("mouseenter", function () {
    description.value = document.querySelector(".ql-editor").innerHTML;
});

//Loads description of edited post into editor.
document.addEventListener("DOMContentLoaded", function () {
    editor.setText("");
    asyncFunc();

    document.querySelector(".ql-editor").innerHTML = description.value;

    async function asyncFunc() {
        setTimeout(function () {
            descriptionInput.blur();
        }, 1);
    }
});
