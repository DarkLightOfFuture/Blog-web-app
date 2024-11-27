var descriptionInput, qlEditor, wasClicked,
  topBar, descriptionContainer, isShadowAdded, topBarClicked,
  isBold, boldText, svg, isItalic,
  italicText, svg2, rangeLength, rangeIndex,
  isStrike, strikeText, svg3, fontColor,
  fontColorPicker, fontColorPalette, fontColorStatusContainer, fontColorStatus,
  autoFontColor, customFontColor, colorChoiceArray, isAutoFontColorChosen,
  background, backgroundPicker, backgroundPalette, backgroundStatusContainer,
  autoBackground, backgroundStatus, customBackground, backgroundChoiceArray,
  isAutoBackgroundChosen, positionXBefore, positionYBefore, positionXAfter,
  positionYAfter, indent, decreaseindent, videoIndices,
  tabIndices, alignType, alignValues, alignValue,
  orderedList, orderedListSvg, bulletList, bulletListSvg,
  codeBlock, codeBlockSvg, blockquote, blockquoteSvg,
  superscript, superscriptSvg, subscript, subscriptSvg,
  linkCreator, linkCreatorPopup, lastIndexText, isKeyClicked,
  indexBeforeReverse, size, description, submit;


//Foldable navbar
previousScrollPos = window.scrollY;

window.onscroll = function () {
    let currentScrollPos = window.scrollY,
        nav = document.getElementById("nav")?.style;

    if (nav) {
        if (previousScrollPos < currentScrollPos) {
            nav.top = "-95px";
        }
        else {
            nav.top = "0px";
        }
    }

    previousScrollPos = currentScrollPos;
}

//Dark theme
//wasPreventedBug = false;
//checkBox = document.querySelector(".switch #checkBox");

//function toggleTheme() {
//    const allElements = document.querySelectorAll("*");

//    for (x = 0; x < allElements.length; x++) {
//        allElements[x].classList.toggle("darkTheme");
//    }

//    localStorage.setItem("darkTheme", checkBox.checked);
//}

//    //Loads last theme switch state.
//document.addEventListener("DOMContentLoaded", function () {
//    document.body.style.visibility = "visible";

//    let slider = document.querySelector("#slider");
//    slider?.classList.toggle("transition");

//    let isDarkTheme = JSON.parse(localStorage.getItem("darkTheme"));

//    if (checkBox) {
//        if (isDarkTheme) {
//            checkBox.checked = true;
//        }
//        else {
//            checkBox.checked = null;
//        }
//    }
//});
//    //Prevents theme switch's bugs.
//document.addEventListener("DOMContentLoaded", async function () {
//    setTimeout(function () {
//        let checkBox = document.querySelector(".switch #checkBox");
//        const val = checkBox?.checked;

//        if (document.body.classList.contains("darkTheme") != val && checkBox) {
//            checkBox.checked = !val;
//        }
//    }, 1)
//});

//Sets automatically min-height of comment form textarea and functions bonded with comment text limit and comment section.
textarea = document.querySelector("textarea");
submitBtn = document.querySelector("input[type='submit']");
textareaLimit = document.querySelector(".commentInputBlock span");
textareaDefaultHeight = textarea ? `${textarea.offsetHeight}px` : null;

document.addEventListener("DOMContentLoaded", function () {
    if (textarea) {
        textarea.style.maxHeight = textarea.style.minHeight = textareaDefaultHeight;
    }

    //If User wasn't logged in and did this by link in comment section, it scrolls into this section after successful logging.
    let commentSection = document.querySelector("#commentSection");

    if (sessionStorage.getItem("loginSuccess") == "true" && commentSection != null) {
        commentSection.scrollIntoView();
        sessionStorage.setItem("loginSuccess", "false");
    }
});

    //Tells browser to scroll into comment section if logging will be successful.
document.querySelector("#login")?.addEventListener("mousedown", function () {
    sessionStorage.setItem("loginSuccess", "true");
});

//Image upload input.
imageFile = document.querySelector("#imageFile");
imageUrl = document.querySelector("#imageUrl");

document.querySelector(".uploadContainer")?.addEventListener("click", function () {
    imageFile.click();
});

pattern1 = /^image\//;
pattern2 = /gif/;

imageFile?.addEventListener("change", function () {
    const file = this.files[0];

    if (file["type"].match(pattern1) && !file["type"].match(pattern2)) {
        document.querySelector(".uploadContainer span").innerHTML = file["name"];
    }
    else {
        document.querySelector(".formatTypes").style.color = "red";
        this.value = null;
    }
});

radioInputs = document.querySelectorAll("input[name='avatarType']");

if (radioInputs != null) {
    let uploadContainer = document.querySelector(".uploadContainer");
    let addressSelectionContainer = document.querySelector(".addressSelectionContainer");

    for (let i = 0; i < radioInputs.length; i++) {
        radioInputs[i].addEventListener("click", function () {
            if (this.value == "url") {
                addressSelectionContainer.style.display = "flex";

                uploadContainer.style.display = "none";
                imageFile.value = null;
                uploadContainer.querySelector("span").innerHTML = "...or drag.";
            }
            else {
                addressSelectionContainer.style.display = "none";
                addressSelectionContainer.querySelector("input").value = null;

                uploadContainer.style.display = "flex";
            }
        });
    }
}

cancelBtns = [document.querySelector("#uploadImageContainer svg"), document.querySelector(".input .actionContainer p")];
uploadImageContainer = document.querySelector("#uploadImageContainer");
profileAvatar = document.querySelector(".profileAvatar img");

imageInputs = document.querySelector(".imageInputs");
imageInputsList = [];

    //Uploads image (into article / as avatar).
document.querySelector("#uploadImageContainer .btn-secondary")?.addEventListener("click", async function () {
    const file = imageFile.files[0];

    if (file) {
        if (imageFile.name == "avatarFile") {
            profileAvatar.src = window.URL.createObjectURL(file);
        }
        else {
            const url = window.URL.createObjectURL(imageFile.files[0]),
                src = url;

            let copy = imageFile.cloneNode(true);
            Object.assign(copy, {
                id: null,
                name: "imageFiles"
            })

            editor.focus();

            let index = editor.getSelection().index;
            imageInputsList.push({ key: copy, val: index, url: url })

            try {
                editor.format("image", "default.jpg");
            }
            catch (err) {

            }

            setTimeout(function () {
                document.querySelectorAll(".ql-editor img").forEach(x => {
                    if (x.src == "https://localhost:7029/Posts/default.jpg") {
                        x.src = src;
                        editor.setSelection(index + 2, 0);
                        imageFile.value = null;
                    }
                });
            }, 1);
        }
        
        overlay.style.display = uploadImageContainer.style.display = "none";
        imageFile.value = null;
        uploadImageContainer.querySelector("span").innerHTML = "...or drag.";
    }
    else {
        let error = document.querySelector(".addressSelectionContainer .error");
        const url = document.querySelector(".addressSelectionContainer #url").value;

        if (url != null) {
            let el = this,
                img = document.createElement("img");

            img.style.display = "none";
            img.addEventListener("error", function () {
                this.parentNode.querySelector(".wait").style.display = "none";
                elseFunc();
            });

            img.addEventListener("load", function () {
                overlay.style.display = uploadImageContainer.style.display =
                    this.parentNode.querySelector(".wait").style.display = "none";

                if (imageUrl.name == "avatarUrl") {
                    profileAvatar.src = imageUrl.value = url;
                }
                else {
                    let input = el.parentNode.parentNode.parentNode.querySelector("input[type='text']");
                    const oldImages = document.querySelectorAll(".ql-editor img");

                    try {
                        editor.format("image", url);
                    }
                    catch (err) { }

                    let copy = input.cloneNode(true);
                    Object.assign(copy, {
                        id: null,
                        name: "imageUrls",
                        required: null
                    });

                    const index = editor.getSelection().index;
                    imageInputsList.push({ key: copy, val: index, url: url });

                    setTimeout(function () {
                        const newImages = document.querySelectorAll(".ql-editor img");

                    newImages.forEach(x => {
                            if (x in oldImages == false) {
                                x.scrollIntoView({ behavior: "instant", block: "center" });
                                editor.setSelection(index + 2, 0);
                            }
                        });
                    }, 1);
                }

                el.parentNode.parentNode.parentNode.querySelectorAll("input:not([type='radio'])").forEach(x => {
                    x.value = null;
                });
            });

            img.src = url;
            document.body.appendChild(img);
            this.parentNode.parentNode.querySelector(".error").innerHTML = null;
            this.parentNode.parentNode.querySelector(".wait").style.display = "inline-block";
        }
        else {
            elseFunc();
        }

        function elseFunc() {
            error.style.color = "red";
            error.innerHTML = "Incorrect address or format type.";
        }
    }
});

    //Uploading images into article - logic.
document.querySelector("#submit")?.addEventListener("mouseenter", function () {
    imageInputsList.sort((a, b) => a.val - b.val);

    imageInputsList.forEach(x => {
        if (descriptionInput.innerHTML.includes(x.url.replaceAll("&", "&amp;"))) {
            imageInputs.appendChild(x.key);
        }
    });
})

    //Closes image upload input.
cancelBtns.forEach(y => y?.addEventListener("click", function () {
    let inputs = document.querySelectorAll(".input input:not([type='radio']):not([type='button'])");

    inputs.forEach(x => {
        x.value = "";
    });

    overlay.style.display = uploadImageContainer.style.display = "none";
}));

document.querySelectorAll(".profileAvatar svg, #imageUploader")?.forEach(x => {
    x.addEventListener("click", function () {
        overlay.style.display = uploadImageContainer.style.display = "block";
    });
});

//Tags
    //Adjusts width of tag input.
document.body?.addEventListener("keyup", function () {
    tagFormInput = document.querySelector(".tagForm input[type='text']");

    if (tagFormInput != null && tagFormInput.contains(event.target)) {
        tagFormInput.style.width = `${tagFormInput.scrollWidth}px`;
    }
});

    //Creates a new tag.
document.querySelector(".tagCreationForm p")?.addEventListener("click", function () { AddNewTag(this); });

async function AddNewTag(el) {
    let xhttp = new XMLHttpRequest();
    const tag = { Id: 0, Name: el.parentNode.querySelector("input").value };

    xhttp.open("POST", `https://localhost:7029/Tags/Create`, true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(JSON.stringify(tag));

    xhttp.onreadystatechange = function () {
        if (xhttp.readyState == XMLHttpRequest.DONE && xhttp.status == 200) {
            let parent = el.parentNode;
            parent.style.opacity = 0.3;
            parent.querySelector("label").style.backgroundColor = "#0b3998";
            parent.remove();

            const x = { Id: xhttp.response, Name: tag.Name };
            let label = CreateTag(x, ""),
                tags = document.querySelector(".tags");
            tags.insertBefore(label, tags.querySelector(".tagForm"));

            let newTag = tags.querySelector(".tagForm");

            newTag.addEventListener("click", function () { TagCheck(newTag); });

            newTag.style.opacity = 0;
            Animation();

            function Animation() {
                if (parseFloat(newTag.style.opacity) < 1) {
                    newTag.style.opacity = parseFloat(newTag.style.opacity) + 0.1;
                    setTimeout(Animation, 100);
                }
            }

            let mainDiv = document.createElement("div");
            mainDiv.className = "tagCreationForm";

            label = document.createElement("label");
            label.className = "tagForm";

            let input = document.createElement("input");
            input.type = "text";
            let p = document.createElement("p");
            p.innerHTML = "+";

            if (document.body.classList.contains("darkTheme")) {
                label.classList.add("darkTheme");
                input.classList.add("darkTheme");
            }

            label.appendChild(input);
            mainDiv.appendChild(label);
            mainDiv.appendChild(p);
            tags.insertBefore(mainDiv, newTag);

            document.querySelector(".tagCreationForm p").addEventListener("click", function () { AddNewTag(this); });
        }
        else if (xhttp.readyState == XMLHttpRequest.DONE) {
            let alert = document.querySelector("#alertTag");

            alert.style.transform = `scale(1)`;
            setTimeout(function () { alert.style.transform = "scale(0)"; }, 5000);
        }
    };
}

    //Loads tags of edited article.
document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll('.chosenTags .chosenTag').forEach(x => {
        let clone = x.cloneNode(true),
            input = clone.querySelector("input");

        const id = input.value;
        chosenTags.push(id);
        input.remove();

        document.querySelectorAll(".tags .tagForm").forEach(y => {
            if (y.innerHTML.includes(`value="${id}"`)) {
                y.classList.toggle("checked");
                y.querySelector("input").checked = true;
            }
        });
    });

    document.querySelectorAll('.chosenTags input').forEach(x => {
        x.checked = true;
    });
});

//Opens input by click on label.
document.querySelectorAll(".inputBox label, .searchInputBox label").forEach(x => {
  x.addEventListener("click", function () {
        document.querySelector(`input[id="${x.htmlFor}"]`).click();
    });
});

////Alerts
//alerts = document.querySelectorAll(".alert");

//alerts?.forEach(x => { 
//    x.addEventListener("click", function () {
//        let el = this;
//        el.style.transform = "scale(0)";
//    });
//});

//    //Prevents alert's bugs.
//document.addEventListener("DOMContentLoaded", function () { document.body.click(); });

//    //Sets display position of alert.
//document.body?.addEventListener("click", async function () {
//    event.stopPropagation();
//    const clickedList = event.target;

//    alerts?.forEach(x => {
//        let submitBtns = x.parentNode.querySelectorAll(".submitBtn") ?? x.parentNode.querySelectorAll(".submitBtn.darkTheme"),
//            wasClicked = false;

//        submitBtns.forEach(y => {
//            if (y.contains(clickedList)) {
//                wasClicked = true;
//            }
//        });

//        let yPos, xPos;
//        const position = window.getComputedStyle(x.parentNode).position;

//        if (position == "relative" || position == "absolute") {
//            yPos = event.clientY;
//            xPos = event.clientX;
//        }
//        else {
//            yPos = event.pageY;
//            xPos = event.pageX;
//        }

//        if (clickedList.contains(x.parentNode) || x.style.transform == "scale(1)" && !wasClicked) {
//            x.style.transform = "scale(0)";

//            setTimeout(function () {
//                x.parentNode.replaceChild(x.cloneNode(true), x);
//                alerts = document.querySelectorAll(".alert");
//            }, 1000)
//        }
//        else if (wasClicked) {
//            const width = parseFloat(getComputedStyle(x).width) / 2,
//                height = parseFloat(getComputedStyle(x).height),
//                rem = parseFloat(getComputedStyle(document.body).fontSize);

//            x.style.left = xPos - width + "px";
//            x.style.top = yPos - height - rem * 0.8 + "px";

//            setTimeout(function () { x.style.transform = "scale(0)"; }, x.id == "alertSharedLink" ? 2000 : 4500);
//        }
//    });

//    //Comment options bonded functions.
//    document.querySelectorAll(".commentContainer .commentOpts .opts").forEach(x => {
//        if ( x.style.visibility == "visible" && !clickedList.contains(x.parentNode.querySelector("p")) || clickedList.contains(x.parentNode) && x.style.visibility == "visible") {
//            x.style.visibility = "hidden";
//        }
//    });

//    document.querySelectorAll(".commentContainer .commentOpts p").forEach(x => {
//        x.addEventListener("click", function () {
//            if (x.style.visibility != "visible") {
//                this.parentNode.querySelector(".opts").style.visibility = "visible";
//            }
//        })
//    });
//});

//Show more btn
document.querySelector(".moreBtn")?.addEventListener("click", function () {
    this.parentNode.querySelector(".overlay").style.display = "none";
    this.parentNode.style.maxHeight = "999rem";
    this.style.display = "none";
});

document.addEventListener("DOMContentLoaded", function () {
    let articleTags = document.querySelector(".articleTags");

    if (articleTags != null && articleTags.offsetHeight > 6 * parseInt(window.getComputedStyle(document.body).fontSize)) {
        articleTags.querySelector(".overlay").style.display = articleTags.querySelector(".moreBtn").style.display = "block";
    }
});

//Comment
    //Creates comment block
function CreateComment(src, userName, comment, changedDate = null) {
    let container = document.createElement("div");
    container.className = "comment";

    let commentAuthorInfo = document.createElement("div");
    commentAuthorInfo.className = "commentAuthorInfo";

    let p1 = document.createElement("p"),
        p2 = p1.cloneNode(true);

    let img = document.createElement("img");
    img.src = src;
    p1.appendChild(img);

    if (changedDate == null) {
        const weekDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const date = new Date();
        const year = date.getFullYear(), weekDay = weekDays[date.getDay()];
        let day = date.getDate() < 10 ? "0" + date.getDate().toString() : date.getDate();
        let month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
        changedDate = `${weekDay}, ${day}.${month}.${year} ${date.getHours()}:${date.getMinutes()}`;
    }

    let span1 = document.createElement("span"),
        span2 = span1.cloneNode(true);
    Object.assign(span1, { className: "pubDate", innerHTML: changedDate });
    span2.innerHTML = userName;

    p2.appendChild(document.createTextNode("@"));
    p2.appendChild(span2);
    p2.appendChild(span1);

    commentAuthorInfo.appendChild(p1);
    commentAuthorInfo.appendChild(p2);

    if (document.body.classList.contains("darkTheme")) {
        container.classList.add("darkTheme");
        commentAuthorInfo.classList.add("darkTheme");
    }

    container.appendChild(commentAuthorInfo);
    container.appendChild(document.createTextNode(comment));
    
    return container;
};

    //Bonds comment with its options.
function CreateCommentContainer(newComment, canDelete, canReport) {
    let commentContainer = document.createElement("div");
    commentContainer.className = "commentContainer";

    let commentOpts = document.createElement("div");
    commentOpts.className = "commentOpts";

    let opts = null,
        p = null,
        arr = [];

    if (canDelete || canReport) {
        opts = document.createElement("div");
        opts.classList.add("opts");
        arr.push(opts);

        p = document.createElement("p");
        p.innerHTML = ". . .";
        arr.push(p);
    }

    let opt1 = null;
    if (canReport) {
        opt1 = document.createElement("div");
        opt1.innerHTML = "Report comment";
        arr.push(opt1);
    }

    let opt2 = null;
    if (canDelete) {
        opt2 = document.createElement("div");
        opt2.innerHTML = "Delete comment";
        opt2.className = "delete";
        opt2.style.color = "#bf0808";
        arr.push(opt2);
    }

    if (document.body.classList.contains("darkTheme")) {
        arr.forEach(x => {
            x.classList.add('darkTheme');
        });
    }

    if (canReport) { opts.appendChild(opt1); }
    if (canDelete) { opts.appendChild(opt2); }
    if (canReport || canDelete) {
        commentOpts.appendChild(p);
        commentOpts.appendChild(opts);
    }

    commentContainer.appendChild(newComment);
    commentContainer.appendChild(commentOpts);

    return commentContainer;
}

    //Whole posting of new comment and request to server.
document.querySelector(".commentForm .submitBtn")?.addEventListener("click", async function () {
    let parent = this.parentNode.parentNode;
    const commentContent = parent.querySelector("textarea").value;

    if (commentContent.length >= 10) {
        const src = parent.querySelector("img").src,
            userName = parent.querySelector(".userName").value;

        PostComment(src, userName, commentContent, parent);
    }
    else {
        let alert = parent.parentNode.querySelector("#commentLengthAlert");
        alert.style.transform = "scale(1)";
    }
});

    //Process of posting comment on the site.
async function PostComment(src, userName, commentContent, parent) {
    let comment = CreateComment(src, userName, commentContent);

    let createdComment = document.createElement("div");
    createdComment.className = "createdComment";

    if (document.body.classList.contains("darkTheme")) {
        createdComment.classList.add("darkTheme");
    }

    let p = document.createElement("p");
    p.innerHTML = "Posting...";
    p.style.color = "#184ab1";
    p.style.opacity = 1;

    let isReversed = false
    animation(p);

    createdComment.appendChild(comment);
    createdComment.appendChild(p);

    let commentSection = document.querySelector("#commentSection");

    let resetCommentContainer = document.createElement("div");
    resetCommentContainer.className = "resetCommentContainer";
    resetCommentContainer.appendChild(createdComment);

    commentSection.insertBefore(resetCommentContainer, document.querySelector("#commentSection .commentContainer"));

    async function animation(el) {
        let opacity = parseFloat(el.style.opacity);

        if (!isReversed) {
            opacity -= 0.1

            if (el.style.opacity == 0) {
                isReversed = true
            }
        }
        else {
            opacity += 0.100

            if (el.style.opacity == 1) {
                isReversed = false;
            }
        }

        el.style.opacity = opacity
        setTimeout(function () { animation(el); }, 100);
    }

    const commentInstance = {
        UserName: userName,
        PostId: document.querySelector("#postId").value,
        Content: commentContent
    }

    let xhttp = new XMLHttpRequest();
    xhttp.open("POST", "https://localhost:7029/Comments/CreateComment", true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.setRequestHeader("RequestVerificationToken", parent.querySelector("input[name='__RequestVerificationToken']").value)
    xhttp.send(JSON.stringify(commentInstance));

    xhttp.onreadystatechange = function () {
        if (xhttp.readyState == XMLHttpRequest.DONE && xhttp.status == 200) {
            parent.querySelector("textarea").value = "";
            const createdComments = document.querySelectorAll("#commentSection .createdComment");

            let spans = textareaLimit.querySelectorAll("span");
            spans[1].innerHTML = "0";
            spans[0].innerHTML = null;
            textareaLimit.style = null;

            createdComments.forEach(x => {
                if (x == createdComment) {
                    x.parentNode.remove();

                    Object.assign(textarea.style, {
                        height: textareaDefaultHeight,
                        minHeight: textareaDefaultHeight,
                        maxHeight: textareaDefaultHeight
                    });
                }
            });

            const firstComment = document.querySelector("#commentSection .commentContainer");

            let newComment = createdComment.querySelector(".comment");
            newComment.style.opacity = 0;

            let commentContainer = CreateCommentContainer(newComment, true, false);

            commentSection.insertBefore(commentContainer, firstComment);

            newComment = document.querySelector("#commentSection .comment");

            let val = 0.1;
            animation(newComment);
            async function animation(el) {
                if (val < 1) {
                    el.style.opacity = val;
                    val += 0.1;

                    setTimeout(function () { animation(el); }, 40);
                }
            }
        }
        else if (xhttp.readyState == XMLHttpRequest.DONE) {
            parent.querySelector("textarea").value = "";
            const createdComments = document.querySelectorAll("#commentSection .createdComment");

            let spans = textareaLimit.querySelectorAll("span");
            spans[1].innerHTML = "0";
            spans[0].innerHTML = null;
            textareaLimit.style = null;

            createdComments.forEach(x => {
                if (x == createdComment) {
                    let children = x.querySelectorAll("p");
                    children.forEach(y => {
                        if (y.parentNode.classList.contains("createdComment")) {
                            y.remove();
                        }
                    });
                    x.style.opacity = 0.4;

                    let p = document.createElement("p");
                    p.style.color = "red";
                    p.innerHTML = "⚠ Failed to post the comment."
                    x.appendChild(p);

                    const copy = x.cloneNode(true);

                    let resetCommentContainer = document.createElement("div");
                    resetCommentContainer.className = "resetCommentContainer";

                    let resetBtn = document.createElement("div");
                    Object.assign(resetBtn, { innerHTML: "⟳", className: "resetBtnComment" });

                    resetBtn.addEventListener("click", function () {
                        this.parentNode.remove();
                        PostComment(src, userName, commentContent, parent);
                    });

                    if (document.body.classList.contains("darkTheme")) {
                        resetCommentContainer.classList.add("darkTheme");
                        resetBtn.classList.add("darkTheme");
                        copy.classList.add("darkTheme");
                    }

                    resetCommentContainer.appendChild(copy);
                    resetCommentContainer.appendChild(resetBtn);

                    commentSection.insertBefore(resetCommentContainer, x);
                    x.remove();
                }
            });
        }
    };
}

    //Deletes comment (form)
document.querySelectorAll(".deleteForm form div")[1]?.addEventListener("click", function () {
    let container = this.parentNode.parentNode;

    let p = container.querySelector("p");
    if (p) { p.innerHTML = ""; }

    let table = document.querySelector("table:has(input)");

    if (table) {
        table.querySelectorAll("input").forEach(x => { x.checked = false; });
        table.querySelectorAll("tr.checked").forEach(x => { x.classList.toggle("checked"); });
    }

    container.style.visibility = "hidden";
    document.querySelector("#overlay").style.display = "none";
})

var overlay = document.querySelector("#overlay");

    //Deletes comment 
document.body?.addEventListener("click", function () {
    if (event.target.parentNode?.parentNode?.parentNode) {
        const clickedList = event.target.parentNode.parentNode.parentNode;

        document.querySelectorAll("#commentSection .commentOpts .opts div")?.forEach(x => {
            if (x.innerHTML == "Delete comment" && clickedList == x.parentNode.parentNode.parentNode) {
                const comment = x.parentNode.parentNode.parentNode.querySelector(".comment").cloneNode(true);

                let deleteForm = document.querySelector(".deleteForm"),
                    postId = deleteForm.querySelector("#postId");

                deleteForm.style.visibility = "visible";
                overlay.style.display = "block";

                let userName = deleteForm.querySelector("#userName"),
                    p = comment.querySelectorAll("p")[1].cloneNode(true);

                userName.value = p.querySelector("span").innerHTML;

                let commentContent = deleteForm.querySelector("#comment");
                comment.querySelector("div").remove();
                commentContent.value = comment.textContent.trim();

                let btn = deleteForm.querySelector("form div");
                btn.addEventListener("click", DeleteComment);

                function DeleteComment() {
                    let xhttp = new XMLHttpRequest();
                    const model = {
                        Content: commentContent.value,
                        PostId: postId.value,
                        UserName: userName.value
                    };

                    xhttp.open("POST", "https://localhost:7029/Comments/DeleteComment2");
                    xhttp.setRequestHeader("Content-Type", "application/json");
                    xhttp.setRequestHeader("RequestVerificationToken", deleteForm.querySelector("input[name='__RequestVerificationToken']").value);
                    xhttp.send(JSON.stringify(model));

                    xhttp.onreadystatechange = function () {
                        if (xhttp.readyState == XMLHttpRequest.DONE) {
                            if (xhttp.status == 200) {
                                deleteForm.style.visibility = "hidden";
                                overlay.style.display = "none";
                                x.parentNode.parentNode.parentNode.remove();

                                btn.removeEventListener("click", DeleteComment);
                            }
                            else {
                                deleteForm.querySelector("p").innerHTML = "Failed to delete comment.";
                            }
                        }
                    }
                }
            }
        });
    }
})

    //Changes order of comments
document.querySelector("#commentsOrder")?.addEventListener("click", async function () {
    let xhttp = new XMLHttpRequest();
    xhttp.open("POST", "https://localhost:7029/Comments/ChangeOrder", true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.setRequestHeader("RequestVerificationToken", document.querySelector("input[name='__RequestVerificationToken']").value);

    let isAscending = this.value == "Oldest" ? true : false;
    let id = document.querySelector("#postId").value;

    let model = {
        Id: id,
        IsAscending: isAscending
    }
    xhttp.send(JSON.stringify(model));

    xhttp.onreadystatechange = function () {
        if (xhttp.readyState == XMLHttpRequest.DONE) {
            document.querySelectorAll(".commentContainer").forEach(x => { x.remove(); });

            let commentSection = document.querySelector("#commentSection");
            let comments = JSON.parse(xhttp.response);

            comments.forEach(x => {
                let comment = CreateComment(x.Avatar, x.UserName, x.Content, x.PubDate);
                let commentContainer = CreateCommentContainer(comment, x.CanDelete, x.CanReport);
                commentSection.appendChild(commentContainer);
            });
        }
    }
});

//Progress bar
progressBar = document.querySelector("#progressBar");

if (progressBar) {
    document.addEventListener("DOMContentLoaded", function () {
        ProgressBarAnimation();
    });

    window.addEventListener("scroll", function () {
        ProgressBarAnimation();
    });

    function ProgressBarAnimation() {
        const commentSectionHeight = parseFloat(window.getComputedStyle(commentSection).height),
            bodyHeight = parseFloat(window.getComputedStyle(document.body).height);

        progressBar.style.width = `${(window.scrollY) / (bodyHeight - commentSectionHeight - window.innerHeight) * 100}%`;
    }
}

//Rating of post
    //Sets rating status at load of page.
document.addEventListener("DOMContentLoaded", function () {
    const bool = document.querySelector("#ratingContainer #isLiked")?.value;

    if (bool?.length > 0) {
        wasRated = true;

        if (bool.toLowerCase() == "true") {
            func(document.querySelector("#ratingContainer p"));
        }
        else {
            func(document.querySelectorAll("#ratingContainer p")[1]);
        }
    }

    function func(x) {
        x.classList.toggle("clicked");
        x.parentNode.classList.toggle("clicked");
    }
})

    //Rating request and animation of it.
wasRated = false;

document.querySelectorAll("#ratingContainer p")?.forEach(x => {
    x.addEventListener("click", function () {
        let xhttp = new XMLHttpRequest();
        xhttp.open("post", "https://localhost:7029/Posts/ChangePostRating");
        xhttp.setRequestHeader("Content-Type", "application/json");

        const postId = document.querySelector("#postId")?.value;
        let model = { Value: 1, PostId: postId, IsLiked: false },
            rating = this.parentNode.querySelector("span");

        const previousRatingVal = parseInt(rating.innerHTML),
            optionBackgroundColor = window.getComputedStyle(x).backgroundColor;

        if (document.querySelector(".commentForm")) {
            this.classList.toggle("clicked");

            if (optionBackgroundColor == "rgb(230, 213, 213)" || optionBackgroundColor == "rgb(57, 56, 56)") {
                const ratingValue = wasRated ? 2 : 1;

                if (!this.parentNode.classList.contains("clicked")) {
                    this.parentNode.classList.toggle("clicked");
                }

                if (x.innerHTML == "+") {
                    model.Value = ratingValue;
                    model.IsLiked = true;
                }
                else {
                    model.Value = -ratingValue;
                }

                wasRated = true;
            }
            else {
                this.parentNode.classList.toggle("clicked");
                wasRated = false;

                if (x.innerHTML == "+") {
                    model.Value = -1;
                }

                model.IsLiked = null;
            }

            rating.innerHTML = previousRatingVal + model.Value;

            if (x.innerHTML == "+") {
                let p = this.parentNode.querySelectorAll("p")[1];

                if (p.classList.contains("clicked")) {
                    p.classList.toggle("clicked");
                }
            }
            else {
                let p = this.parentNode.querySelector("p");

                if (p.classList.contains("clicked")) {
                    p.classList.toggle("clicked");
                }
            }
        }
        else {
            let alert = document.querySelector("#alertRatingChoice");
            alert.style.transform = "scale(1)";
        }

        xhttp.send(JSON.stringify(model));
    });
});

//Post sharing.
document.querySelector("#articleInfo #shareBtn")?.addEventListener("click", async function () {
    const width = window.getComputedStyle(this).width;

    let el = this;
    setTimeout(function () {
        el.innerHTML = "✓";
        el.style.width = width;
        el.style.transition = "background-color 6s";
        el.style.backgroundColor = "green";
        window.navigator.clipboard.writeText(window.location.href);
        document.querySelector("#alertSharedLink").style.transform = "scale(1)";
    }, 1);

    setTimeout(function () {
        el.style = null;
        el.innerHTML = `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M13.803 5.33333C13.803 3.49238 15.3022 2 17.1515 2C19.0008 2 20.5 3.49238 20.5 5.33333C20.5 7.17428 19.0008 8.66667 17.1515 8.66667C16.2177 8.66667 15.3738 8.28596 14.7671 7.67347L10.1317 10.8295C10.1745 11.0425 10.197 11.2625 10.197 11.4872C10.197 11.9322 10.109 12.3576 9.94959 12.7464L15.0323 16.0858C15.6092 15.6161 16.3473 15.3333 17.1515 15.3333C19.0008 15.3333 20.5 16.8257 20.5 18.6667C20.5 20.5076 19.0008 22 17.1515 22C15.3022 22 13.803 20.5076 13.803 18.6667C13.803 18.1845 13.9062 17.7255 14.0917 17.3111L9.05007 13.9987C8.46196 14.5098 7.6916 14.8205 6.84848 14.8205C4.99917 14.8205 3.5 13.3281 3.5 11.4872C3.5 9.64623 4.99917 8.15385 6.84848 8.15385C7.9119 8.15385 8.85853 8.64725 9.47145 9.41518L13.9639 6.35642C13.8594 6.03359 13.803 5.6896 13.803 5.33333Z"></path> </g></svg>`;
    }, 1200);
});

//Table
    //Row selecting.
document.querySelector("table th input")?.addEventListener("click", function () {
    const val = this.checked;

    this.parentNode.parentNode.parentNode.parentNode.querySelectorAll("input").forEach(x => {
        let tr = x.parentNode.parentNode;
        x.checked = val;

        if (val && !tr.classList.contains("checked") || !val && tr.classList.contains("checked")) {
            tr.classList.toggle("checked");
        }
    });
});

document.querySelectorAll("table input")?.forEach(x => {
    x.addEventListener("click", function () {
        this.parentNode.parentNode.classList.toggle("checked");
    });
});

    //Allows deleting records from table.
document.querySelectorAll("table input")?.forEach(x => {
    x.addEventListener("input", async function () {
        setTimeout(function () {
            let rows = document.querySelectorAll("table tr:has(input:checked)");
            console.log(rows.length);
            if (rows.length >= 1) {
                document.querySelector("#removeBtn").parentNode.style.display = "inline-block";
            }
            else if (rows.length == 0) {
                document.querySelector("#removeBtn").parentNode.style.display = "none";
            }
        }, 1);
    });
});

removeBtn = document.querySelector("#removeBtn");

removeBtn?.addEventListener("click", function () {
    document.querySelector(".deleteForm").style.visibility = "visible";
    this.parentNode.style.display = "none";
    overlay.style.display = "block";
});

if (removeBtn) {
    document.querySelector(".deleteForm div")?.addEventListener("click", function () {
        let rowsToDelete = document.querySelectorAll("table td:has(input:checked)"),
            all = document.querySelectorAll("table td:has(input)").length;

        const isDeleted = rowsToDelete.length == all && all != 0;

        rowsToDelete.forEach(x => {
            x.parentNode.remove();
        });

        let idArray = [];
        rowsToDelete.forEach(x => {
            const val = x.parentNode.querySelectorAll("td")[1].innerHTML.trim();
            idArray.push(val);
        });

        const model = window.location.href.split("/")[3];

        let xhttp = new XMLHttpRequest();
        xhttp.open("POST", `https://localhost:7029/${model}/Delete${model.substr(0, model.length - 1)}`);
        xhttp.setRequestHeader("Content-Type", "application/json");
        xhttp.send(JSON.stringify(idArray));

        if (isDeleted) {
            let row = document.createElement("tr");

            let isDarkTheme = false;
            if (document.body.classList.contains("darkTheme")) {
                isDarkTheme = true;
            }

            if (isDarkTheme) {
                row.classList.toggle("darkTheme");
            }

            const count = document.querySelectorAll("table th").length,
                indices = [0, 1, count - 1];

            for (let i = 0; i < count; i++) {
                let td = document.createElement("td");

                if (!indices.includes(i)) {
                    td.innerHTML = "---------------------------";
                }
                else {
                    td.innerHTML = "-----";
                }

                if (isDarkTheme) {
                    td.classList.toggle("darkTheme");
                }

                row.appendChild(td);
            }

            document.querySelector("table tbody").appendChild(row);
        }

        document.querySelector("table th input").checked = false;

        this.parentNode.parentNode.style.visibility = "hidden";
        overlay.style.display = "none";
    });
}

//Menu with slider
slider = document.querySelector("#optionsContainer #sections .slider");
sections = document.querySelectorAll("#optionsContainer #sections div");
sectionNames = [];
sliderTopVal = "";
sliderTopValName = "";

sections?.forEach(x => {
    if (!x.classList.contains("slider")) {
        x.addEventListener("mouseenter", function () {
            slider.style.top = `${x.offsetTop}px`;
        });
    }
});

document.querySelectorAll("#optionsContainer #sections > *").forEach(x => {
    x.addEventListener("mouseenter", function () {
        ChangeSliderBorderRadius(x.textContent.toLowerCase());
    });
});

document.querySelector("#optionsContainer #sections")?.addEventListener("mouseleave", function () {
    slider.style.top = sliderTopVal;
    ChangeSliderBorderRadius(sliderTopValName);
});

function ChangeSliderBorderRadius(name) {
    const index = sectionNames.indexOf(name);

    if (index == 0) {
        slider.style.borderRadius = "1rem 1rem 0rem 0rem";
    }
    else if (index == sectionNames.length - 2) {
        slider.style.borderRadius = "0rem 0rem 1rem 0rem";
    }
    else {
        slider.style.borderRadius = null;
    }
}

if (sections) {
    document.addEventListener("DOMContentLoaded", async function () {
        const href = window.location.href.split("/");

        sections.forEach(x => {
            const top = `${x.offsetTop}px`;
            sectionNames.push(x.innerHTML.toLowerCase());

            if (href[4] == x.innerHTML.toLowerCase()) {
                sliderTopVal = top;
                sliderTopValName = x.innerHTML.toLowerCase();

                setTimeout(function () { ChangeSliderBorderRadius(sliderTopValName); }, 1);
            }
        });

        if (slider) {
            slider.style.top = sliderTopVal;
        }
    });
}

//Administration menu (changes user's roles)
adminsContainer = document.querySelector("#adminsContainer div");
usersContainer = document.querySelector("#usersContainer div");
toAdminsList = [];
toUsersList = [];

document.body?.addEventListener("click", function () {
    document.querySelectorAll("#usersContainer div div")?.forEach(x => {
        if (x.contains(event.target)) {
            const copy = x.cloneNode(true);
            x.remove();

            copy.querySelector("input").name = "admins";
            adminsContainer.insertBefore(copy, adminsContainer.querySelector("div"));
        }
    });

    document.querySelectorAll("#adminsContainer div div")?.forEach(x => {
        if (x.contains(event.target)) {
            const copy = x.cloneNode(true);
            x.remove();

            copy.querySelector("input").name = "users";
            usersContainer.insertBefore(copy, usersContainer.querySelector("div"));
        }
    });
});

document.querySelector("#options .btn-secondary")?.addEventListener("click", function () {
    adminsContainer.innerHTML = usersContainer.innerHTML = "";

    toAdminsList.forEach(x => {
        let div = document.createElement("div");
        div.innerHTML = x;

        adminsContainer.appendChild(div);
    });

    toUsersList.forEach(x => {
        let div = document.createElement("div");
        div.innerHTML = x;

        usersContainer.appendChild(div);
    });
});

if (adminsContainer) {
    document.addEventListener("DOMContentLoaded", function () {
        adminsContainer.querySelectorAll("div").forEach(x => {
            toAdminsList.push(x.innerHTML);
        });

        usersContainer.querySelectorAll("div").forEach(x => {
            toUsersList.push(x.innerHTML);
        });
    })
}

//SelectBox (animation and changing of value)
selects = document.querySelectorAll(".selectBox .select");

document.addEventListener("DOMContentLoaded", function () {
    selects?.forEach(select => {
        let options = select.parentNode.querySelector(".options");

        select.style.width = window.getComputedStyle(options).width;

        options.querySelectorAll("div").forEach(x => {
            if (x.innerHTML == select.querySelector("p").innerHTML) {
                x.classList.toggle("chosen");
            }
        });
    });
});

selects?.forEach(select => {
    select.addEventListener("click", function () {
        let options = select.parentNode.querySelector(".options");

        if (!this.classList.contains("focus")) {
            options.style.transform = "scaleY(1)";
        }
        else {
            options.style.transform = "scaleY(0)";
        }

        this.classList.toggle('focus');
        this.querySelectorAll("p")[1].classList.toggle("focus");
    });
});

document.querySelectorAll(".selectBox .options")?.forEach(options => {
    options.querySelectorAll("div").forEach(x => {
        x.addEventListener("click", async function () {
            let selectBox = this.parentNode.parentNode;

            if (!this.classList.contains("chosen")) {
                let input = selectBox.querySelector("input");

                this.parentNode.querySelector(".chosen").classList.toggle("chosen");
                this.classList.toggle("chosen");

                selectBox.querySelector(".select p").innerHTML = input.value = this.innerHTML;
                setTimeout(function () { input.click(); }, 1);
            }

            selectBox.querySelector(".select").classList.toggle("focus");
            selectBox.querySelectorAll(".select p")[1].classList.toggle("focus");
            this.parentNode.style.transform = "scaleY(0)";
        });
    });
});

document.body?.addEventListener("click", function () {
    const clickedList = event.target;

    selects.forEach(select => {
        let options = select.parentNode.querySelector(".options");

        if (!select.contains(clickedList) && !options.contains(clickedList) && options.style.transform == "scaleY(1)") {
            options.style.transform = "scaleY(0)";
            select.classList.toggle("focus");
            select.querySelectorAll("p")[1].classList.toggle("focus");
        }
    });
});

//Preview of image
imagePreview = document.querySelector("#imagePreview");

document.querySelectorAll("#mainArticle img")?.forEach(x => {
    x.addEventListener("click", async function () {
        imagePreview.appendChild(x.cloneNode(true));
        overlay.style.display = "block";

        setTimeout(function () {
            imagePreview.querySelector("img").style.transform = "scale(1.9)";
        }, 1);
    });
});

    //Zooms out previewed images on click
document.body?.addEventListener("click", async function () {
    let img = imagePreview?.querySelector("img"),
        content = document.querySelector("#content");

    if (img != null && (!content.contains(event.target) || imagePreview.contains(event.target))) {
        await zoomOutPreviewedImage(img);
    }
})

    //Zooms out previewed images on scroll
window.addEventListener("scroll", async function () {
    let img = imagePreview?.querySelector("img");

    if (img) {
        zoomOutPreviewedImage(img);
    }
});

async function zoomOutPreviewedImage(img) {
    img.style.transform = "scale(0)";

    setTimeout(function () {
        img.remove();
        overlay.style.display = "none";
    }, 500);
}
