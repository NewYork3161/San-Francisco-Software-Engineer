document.addEventListener("DOMContentLoaded", () => {

    // ======================================================
    // CREATE BLOG POST IMAGE UPLOAD
    // ======================================================

    const dropZone =
        document.getElementById(
            "blogImageDropZone"
        );

    const fileInput =
        document.getElementById(
            "blogImage"
        );

    const chooseButton =
        document.getElementById(
            "chooseBlogImageButton"
        );

    const previewContainer =
        document.getElementById(
            "blogImagePreviewContainer"
        );

    const previewImage =
        document.getElementById(
            "blogImagePreview"
        );

    const dropContent =
        document.getElementById(
            "dropZoneContent"
        );

    const removeButton =
        document.getElementById(
            "removeBlogImageButton"
        );


    // ======================================================
    // CHOOSE CREATE-POST IMAGE
    // ======================================================

    if (
        chooseButton &&
        fileInput
    ) {

        chooseButton.addEventListener(
            "click",
            (event) => {

                event.preventDefault();
                event.stopPropagation();

                fileInput.click();
            }
        );
    }


    // ======================================================
    // CREATE-POST IMAGE DROP ZONE
    // ======================================================

    if (
        dropZone &&
        fileInput
    ) {

        dropZone.addEventListener(
            "click",
            (event) => {

                if (
                    event.target === chooseButton ||
                    event.target === removeButton
                ) {

                    return;
                }


                fileInput.click();
            }
        );


        dropZone.addEventListener(
            "dragover",
            (event) => {

                event.preventDefault();

                dropZone.classList.add(
                    "drag-over"
                );
            }
        );


        dropZone.addEventListener(
            "dragleave",
            () => {

                dropZone.classList.remove(
                    "drag-over"
                );
            }
        );


        dropZone.addEventListener(
            "drop",
            (event) => {

                event.preventDefault();

                dropZone.classList.remove(
                    "drag-over"
                );


                const droppedFiles =
                    event.dataTransfer.files;


                if (
                    !droppedFiles ||
                    droppedFiles.length === 0
                ) {

                    return;
                }


                const selectedFile =
                    droppedFiles[0];


                if (
                    !selectedFile.type.startsWith(
                        "image/"
                    )
                ) {

                    window.alert(
                        "Please choose an image file."
                    );

                    return;
                }


                try {

                    const dataTransfer =
                        new DataTransfer();

                    dataTransfer.items.add(
                        selectedFile
                    );

                    fileInput.files =
                        dataTransfer.files;

                } catch (error) {

                    console.error(
                        "Unable to assign dropped image:",
                        error
                    );
                }


                showCreateImagePreview(
                    selectedFile
                );
            }
        );


        fileInput.addEventListener(
            "change",
            () => {

                if (
                    fileInput.files &&
                    fileInput.files.length > 0
                ) {

                    showCreateImagePreview(
                        fileInput.files[0]
                    );
                }
            }
        );
    }


    // ======================================================
    // SHOW CREATE-POST IMAGE PREVIEW
    // ======================================================

    function showCreateImagePreview(file) {

        if (
            !file ||
            !file.type.startsWith(
                "image/"
            )
        ) {

            window.alert(
                "Please choose an image file."
            );

            return;
        }


        const reader =
            new FileReader();


        reader.onload =
            (event) => {

                if (previewImage) {

                    previewImage.src =
                        event.target.result;
                }


                if (dropContent) {

                    dropContent.style.display =
                        "none";
                }


                if (previewContainer) {

                    previewContainer.classList.add(
                        "active"
                    );

                    previewContainer.style.display =
                        "block";
                }
            };


        reader.onerror =
            () => {

                window.alert(
                    "Unable to preview this image."
                );
            };


        reader.readAsDataURL(
            file
        );
    }


    // ======================================================
    // REMOVE CREATE-POST IMAGE
    // ======================================================

    if (removeButton) {

        removeButton.addEventListener(
            "click",
            (event) => {

                event.preventDefault();
                event.stopPropagation();


                if (fileInput) {

                    fileInput.value =
                        "";
                }


                if (previewImage) {

                    previewImage.src =
                        "";
                }


                if (previewContainer) {

                    previewContainer.classList.remove(
                        "active"
                    );

                    previewContainer.style.display =
                        "none";
                }


                if (dropContent) {

                    dropContent.style.display =
                        "block";
                }
            }
        );
    }


    // ======================================================
    // MAIN BLOG POST ADMIN ELEMENTS
    // ======================================================

    const adminPostButtons =
        document.querySelectorAll(
            ".admin-post-button"
        );


    const adminCodeModalElement =
        document.getElementById(
            "adminCodeModal"
        );


    const managePostModalElement =
        document.getElementById(
            "managePostModal"
        );


    const editPostModalElement =
        document.getElementById(
            "editPostModal"
        );


    const adminCodeInput =
        document.getElementById(
            "adminCode"
        );


    const adminCodeError =
        document.getElementById(
            "adminCodeError"
        );


    const verifyAdminButton =
        document.getElementById(
            "verifyAdminButton"
        );


    const editPostButton =
        document.getElementById(
            "editPostButton"
        );


    const deletePostButton =
        document.getElementById(
            "deletePostButton"
        );


    const editPostForm =
        document.getElementById(
            "editPostForm"
        );


    const editPostAdminCode =
        document.getElementById(
            "editPostAdminCode"
        );


    const editPostTitle =
        document.getElementById(
            "editPostTitle"
        );


    const editPostBody =
        document.getElementById(
            "editPostBody"
        );


    const editPostImage =
        document.getElementById(
            "editPostImage"
        );


    const currentPostPreview =
        document.getElementById(
            "currentPostPreview"
        );


    const editPostCurrentImage =
        document.getElementById(
            "editPostCurrentImage"
        );


    const deletePostForm =
        document.getElementById(
            "deletePostForm"
        );


    const deletePostAdminCode =
        document.getElementById(
            "deletePostAdminCode"
        );


    // ======================================================
    // MAIN BLOG POST STATE
    // ======================================================

    let selectedPostId =
        null;

    let enteredAdminCode =
        "";


    // ======================================================
    // MAIN BLOG POST BOOTSTRAP MODALS
    // ======================================================

    let adminCodeModal =
        null;

    let managePostModal =
        null;

    let editPostModal =
        null;


    if (
        adminCodeModalElement &&
        typeof bootstrap !== "undefined"
    ) {

        adminCodeModal =
            bootstrap.Modal.getOrCreateInstance(
                adminCodeModalElement
            );
    }


    if (
        managePostModalElement &&
        typeof bootstrap !== "undefined"
    ) {

        managePostModal =
            bootstrap.Modal.getOrCreateInstance(
                managePostModalElement
            );
    }


    if (
        editPostModalElement &&
        typeof bootstrap !== "undefined"
    ) {

        editPostModal =
            bootstrap.Modal.getOrCreateInstance(
                editPostModalElement
            );
    }


    // ======================================================
    // OPEN MAIN BLOG POST ADMIN CODE WINDOW
    // ======================================================

    adminPostButtons.forEach(
        (button) => {

            button.addEventListener(
                "click",
                () => {

                    selectedPostId =
                        button.dataset.postId || null;


                    enteredAdminCode =
                        "";


                    if (adminCodeInput) {

                        adminCodeInput.value =
                            "";
                    }


                    if (adminCodeError) {

                        adminCodeError.textContent =
                            "";
                    }


                    if (
                        selectedPostId &&
                        adminCodeModal
                    ) {

                        adminCodeModal.show();


                        setTimeout(
                            () => {

                                if (adminCodeInput) {

                                    adminCodeInput.focus();
                                }
                            },
                            250
                        );
                    }
                }
            );
        }
    );


    // ======================================================
    // VERIFY MAIN BLOG POST ADMIN CODE
    // ======================================================

    if (verifyAdminButton) {

        verifyAdminButton.addEventListener(
            "click",
            async () => {

                if (
                    !selectedPostId ||
                    !adminCodeInput
                ) {

                    return;
                }


                enteredAdminCode =
                    adminCodeInput.value.trim();


                if (!enteredAdminCode) {

                    if (adminCodeError) {

                        adminCodeError.textContent =
                            "Enter the administrator code.";
                    }

                    return;
                }


                if (adminCodeError) {

                    adminCodeError.textContent =
                        "";
                }


                const originalButtonText =
                    verifyAdminButton.textContent;


                verifyAdminButton.disabled =
                    true;

                verifyAdminButton.textContent =
                    "Checking...";


                try {

                    const response =
                        await fetch(
                            "/admin/verify",
                            {
                                method:
                                    "POST",

                                headers: {
                                    "Content-Type":
                                        "application/json"
                                },

                                body:
                                    JSON.stringify({
                                        code:
                                            enteredAdminCode
                                    })
                            }
                        );


                    const result =
                        await response.json();


                    if (
                        !response.ok ||
                        !result.valid
                    ) {

                        if (adminCodeError) {

                            adminCodeError.textContent =
                                result.message ||
                                "Incorrect administrator code.";
                        }

                        return;
                    }


                    if (editPostAdminCode) {

                        editPostAdminCode.value =
                            enteredAdminCode;
                    }


                    if (deletePostAdminCode) {

                        deletePostAdminCode.value =
                            enteredAdminCode;
                    }


                    if (adminCodeModal) {

                        adminCodeModal.hide();
                    }


                    setTimeout(
                        () => {

                            if (managePostModal) {

                                managePostModal.show();
                            }
                        },
                        250
                    );

                } catch (error) {

                    console.error(
                        "Administrator verification error:",
                        error
                    );


                    if (adminCodeError) {

                        adminCodeError.textContent =
                            "Unable to verify administrator code.";
                    }

                } finally {

                    verifyAdminButton.disabled =
                        false;

                    verifyAdminButton.textContent =
                        originalButtonText;
                }
            }
        );
    }


    // ======================================================
    // ADMIN CODE ENTER KEY
    // ======================================================

    if (adminCodeInput) {

        adminCodeInput.addEventListener(
            "keydown",
            (event) => {

                if (
                    event.key === "Enter"
                ) {

                    event.preventDefault();

                    if (verifyAdminButton) {

                        verifyAdminButton.click();
                    }
                }
            }
        );
    }


    // ======================================================
    // OPEN MAIN BLOG POST EDIT WINDOW
    // ======================================================

    if (editPostButton) {

        editPostButton.addEventListener(
            "click",
            async () => {

                if (!selectedPostId) {

                    return;
                }


                const originalButtonText =
                    editPostButton.textContent;


                editPostButton.disabled =
                    true;

                editPostButton.textContent =
                    "Loading...";


                try {

                    const response =
                        await fetch(
                            `/blog/${selectedPostId}/data`
                        );


                    const result =
                        await response.json();


                    if (
                        !response.ok ||
                        !result.post
                    ) {

                        window.alert(
                            result.message ||
                            "Unable to load the blog post."
                        );

                        return;
                    }


                    if (editPostTitle) {

                        editPostTitle.value =
                            result.post.title || "";
                    }


                    if (editPostBody) {

                        editPostBody.value =
                            result.post.body || "";
                    }


                    if (editPostImage) {

                        editPostImage.value =
                            "";
                    }


                    if (
                        currentPostPreview &&
                        editPostCurrentImage
                    ) {

                        if (result.post.image_url) {

                            editPostCurrentImage.src =
                                result.post.image_url;

                            editPostCurrentImage.alt =
                                result.post.title
                                    ? `${result.post.title} image`
                                    : "Current blog post image";

                            currentPostPreview.style.display =
                                "block";

                        } else {

                            editPostCurrentImage.src =
                                "";

                            currentPostPreview.style.display =
                                "none";
                        }
                    }


                    if (editPostForm) {

                        editPostForm.action =
                            `/blog/${selectedPostId}/edit`;

                        editPostForm.method =
                            "POST";
                    }


                    if (editPostAdminCode) {

                        editPostAdminCode.value =
                            enteredAdminCode;
                    }


                    if (managePostModal) {

                        managePostModal.hide();
                    }


                    setTimeout(
                        () => {

                            if (editPostModal) {

                                editPostModal.show();
                            }
                        },
                        250
                    );

                } catch (error) {

                    console.error(
                        "Unable to load blog post:",
                        error
                    );


                    window.alert(
                        "Unable to load the blog post."
                    );

                } finally {

                    editPostButton.disabled =
                        false;

                    editPostButton.textContent =
                        originalButtonText;
                }
            }
        );
    }


    // ======================================================
    // MAIN BLOG POST REPLACEMENT IMAGE PREVIEW
    // ======================================================

    if (
        editPostImage &&
        currentPostPreview &&
        editPostCurrentImage
    ) {

        editPostImage.addEventListener(
            "change",
            () => {

                if (
                    !editPostImage.files ||
                    editPostImage.files.length === 0
                ) {

                    return;
                }


                const selectedFile =
                    editPostImage.files[0];


                if (
                    !selectedFile.type.startsWith(
                        "image/"
                    )
                ) {

                    window.alert(
                        "Please choose an image file."
                    );

                    editPostImage.value =
                        "";

                    return;
                }


                const reader =
                    new FileReader();


                reader.onload =
                    (event) => {

                        editPostCurrentImage.src =
                            event.target.result;

                        editPostCurrentImage.alt =
                            "Replacement blog post image";

                        currentPostPreview.style.display =
                            "block";
                    };


                reader.onerror =
                    () => {

                        window.alert(
                            "Unable to preview this image."
                        );
                    };


                reader.readAsDataURL(
                    selectedFile
                );
            }
        );
    }


    // ======================================================
    // MAIN BLOG POST EDIT FORM
    // ======================================================

    if (editPostForm) {

        editPostForm.addEventListener(
            "submit",
            (event) => {

                if (!selectedPostId) {

                    event.preventDefault();

                    window.alert(
                        "No blog post is selected."
                    );

                    return;
                }


                const title =
                    editPostTitle
                        ? editPostTitle.value.trim()
                        : "";


                const body =
                    editPostBody
                        ? editPostBody.value.trim()
                        : "";


                if (
                    !title ||
                    !body
                ) {

                    event.preventDefault();

                    window.alert(
                        "Title and body are required."
                    );

                    return;
                }


                editPostForm.action =
                    `/blog/${selectedPostId}/edit`;

                editPostForm.method =
                    "POST";


                if (editPostAdminCode) {

                    editPostAdminCode.value =
                        enteredAdminCode;
                }
            }
        );
    }


    // ======================================================
    // DELETE MAIN BLOG POST
    // ======================================================

    if (
        deletePostButton &&
        deletePostForm
    ) {

        deletePostButton.addEventListener(
            "click",
            () => {

                if (!selectedPostId) {

                    return;
                }


                const confirmed =
                    window.confirm(
                        "Delete this blog post and every comment attached to it?"
                    );


                if (!confirmed) {

                    return;
                }


                deletePostForm.action =
                    `/blog/${selectedPostId}/delete`;

                deletePostForm.method =
                    "POST";


                if (deletePostAdminCode) {

                    deletePostAdminCode.value =
                        enteredAdminCode;
                }


                deletePostForm.submit();
            }
        );
    }


    // ======================================================
    // USER COMMENT MODAL ELEMENTS
    // ======================================================

    const editCommentButtons =
        document.querySelectorAll(
            ".edit-comment-button"
        );


    const deleteCommentButtons =
        document.querySelectorAll(
            ".delete-comment-button"
        );


    const editCommentModalElement =
        document.getElementById(
            "editCommentModal"
        );


    const editCommentForm =
        document.getElementById(
            "editCommentForm"
        );


    const editCommentBody =
        document.getElementById(
            "editCommentBody"
        );


    const editCommentError =
        document.getElementById(
            "editCommentError"
        );


    const saveCommentChangesButton =
        document.getElementById(
            "saveCommentChangesButton"
        );


    const deleteCommentModalElement =
        document.getElementById(
            "deleteCommentModal"
        );


    const deleteCommentForm =
        document.getElementById(
            "deleteCommentForm"
        );


    const deleteCommentPreviewText =
        document.getElementById(
            "deleteCommentPreviewText"
        );


    const deleteCommentError =
        document.getElementById(
            "deleteCommentError"
        );


    const confirmDeleteCommentButton =
        document.getElementById(
            "confirmDeleteCommentButton"
        );


    // ======================================================
    // USER COMMENT MODALS
    // ======================================================

    let editCommentModal =
        null;

    let deleteCommentModal =
        null;


    if (
        editCommentModalElement &&
        typeof bootstrap !== "undefined"
    ) {

        editCommentModal =
            bootstrap.Modal.getOrCreateInstance(
                editCommentModalElement
            );
    }


    if (
        deleteCommentModalElement &&
        typeof bootstrap !== "undefined"
    ) {

        deleteCommentModal =
            bootstrap.Modal.getOrCreateInstance(
                deleteCommentModalElement
            );
    }


    // ======================================================
    // SELECTED USER COMMENT STATE
    // ======================================================

    let selectedCommentId =
        null;

    let selectedCommentCard =
        null;


    // ======================================================
    // GET COMMENT BODY FROM THE CLICKED COMMENT CARD
    // ======================================================

    function getCommentBodyFromButton(
        button
    ) {

        const commentCard =
            button.closest(
                ".comment-card"
            );


        if (!commentCard) {

            return {
                card: null,
                body: ""
            };
        }


        const commentBodyElement =
            commentCard.querySelector(
                ".comment-body"
            );


        return {
            card:
                commentCard,

            body:
                commentBodyElement
                    ? commentBodyElement.textContent.trim()
                    : ""
        };
    }


    // ======================================================
    // OPEN USER COMMENT EDIT WINDOW
    // ======================================================

    editCommentButtons.forEach(
        (button) => {

            button.addEventListener(
                "click",
                () => {

                    const commentId =
                        button.dataset.commentId;


                    if (!commentId) {

                        console.error(
                            "The comment ID is missing."
                        );

                        return;
                    }


                    const commentInformation =
                        getCommentBodyFromButton(
                            button
                        );


                    selectedCommentId =
                        commentId;

                    selectedCommentCard =
                        commentInformation.card;


                    if (editCommentBody) {

                        editCommentBody.value =
                            commentInformation.body;
                    }


                    if (editCommentError) {

                        editCommentError.textContent =
                            "";
                    }


                    if (editCommentForm) {

                        editCommentForm.action =
                            `/blog/comments/${selectedCommentId}/edit`;

                        editCommentForm.method =
                            "POST";
                    }


                    if (editCommentModal) {

                        editCommentModal.show();


                        setTimeout(
                            () => {

                                if (editCommentBody) {

                                    editCommentBody.focus();

                                    editCommentBody.setSelectionRange(
                                        editCommentBody.value.length,
                                        editCommentBody.value.length
                                    );
                                }
                            },
                            250
                        );
                    }
                }
            );
        }
    );


    // ======================================================
    // SAVE USER COMMENT CHANGES
    // ======================================================

    if (editCommentForm) {

        editCommentForm.addEventListener(
            "submit",
            (event) => {

                if (!selectedCommentId) {

                    event.preventDefault();


                    if (editCommentError) {

                        editCommentError.textContent =
                            "No comment is selected.";
                    }

                    return;
                }


                const updatedCommentBody =
                    editCommentBody
                        ? editCommentBody.value.trim()
                        : "";


                if (!updatedCommentBody) {

                    event.preventDefault();


                    if (editCommentError) {

                        editCommentError.textContent =
                            "Comment cannot be empty.";
                    }


                    if (editCommentBody) {

                        editCommentBody.focus();
                    }

                    return;
                }


                editCommentForm.action =
                    `/blog/comments/${selectedCommentId}/edit`;

                editCommentForm.method =
                    "POST";


                if (saveCommentChangesButton) {

                    saveCommentChangesButton.disabled =
                        true;

                    saveCommentChangesButton.textContent =
                        "Saving...";
                }
            }
        );
    }


    // ======================================================
    // OPEN USER COMMENT DELETE WINDOW
    // ======================================================

    deleteCommentButtons.forEach(
        (button) => {

            button.addEventListener(
                "click",
                () => {

                    const commentId =
                        button.dataset.commentId;


                    if (!commentId) {

                        console.error(
                            "The comment ID is missing."
                        );

                        return;
                    }


                    const commentInformation =
                        getCommentBodyFromButton(
                            button
                        );


                    selectedCommentId =
                        commentId;

                    selectedCommentCard =
                        commentInformation.card;


                    if (deleteCommentPreviewText) {

                        deleteCommentPreviewText.textContent =
                            commentInformation.body;
                    }


                    if (deleteCommentError) {

                        deleteCommentError.textContent =
                            "";
                    }


                    if (deleteCommentForm) {

                        deleteCommentForm.action =
                            `/blog/comments/${selectedCommentId}/delete`;

                        deleteCommentForm.method =
                            "POST";
                    }


                    if (deleteCommentModal) {

                        deleteCommentModal.show();
                    }
                }
            );
        }
    );


    // ======================================================
    // DELETE ONLY THE SELECTED USER COMMENT
    // ======================================================

    if (deleteCommentForm) {

        deleteCommentForm.addEventListener(
            "submit",
            (event) => {

                if (!selectedCommentId) {

                    event.preventDefault();


                    if (deleteCommentError) {

                        deleteCommentError.textContent =
                            "No comment is selected.";
                    }

                    return;
                }


                deleteCommentForm.action =
                    `/blog/comments/${selectedCommentId}/delete`;

                deleteCommentForm.method =
                    "POST";


                if (confirmDeleteCommentButton) {

                    confirmDeleteCommentButton.disabled =
                        true;

                    confirmDeleteCommentButton.textContent =
                        "Deleting...";
                }
            }
        );
    }


    // ======================================================
    // CLEAN UP MAIN ADMIN CODE MODAL
    // ======================================================

    if (adminCodeModalElement) {

        adminCodeModalElement.addEventListener(
            "hidden.bs.modal",
            () => {

                if (adminCodeInput) {

                    adminCodeInput.value =
                        "";
                }


                if (adminCodeError) {

                    adminCodeError.textContent =
                        "";
                }
            }
        );
    }


    // ======================================================
    // CLEAN UP MAIN BLOG POST EDIT MODAL
    // ======================================================

    if (editPostModalElement) {

        editPostModalElement.addEventListener(
            "hidden.bs.modal",
            () => {

                if (editPostImage) {

                    editPostImage.value =
                        "";
                }


                if (editPostCurrentImage) {

                    editPostCurrentImage.src =
                        "";
                }


                if (currentPostPreview) {

                    currentPostPreview.style.display =
                        "none";
                }
            }
        );
    }


    // ======================================================
    // CLEAN UP USER COMMENT EDIT MODAL
    // ======================================================

    if (editCommentModalElement) {

        editCommentModalElement.addEventListener(
            "hidden.bs.modal",
            () => {

                selectedCommentId =
                    null;

                selectedCommentCard =
                    null;


                if (editCommentBody) {

                    editCommentBody.value =
                        "";
                }


                if (editCommentError) {

                    editCommentError.textContent =
                        "";
                }


                if (editCommentForm) {

                    editCommentForm.removeAttribute(
                        "action"
                    );
                }


                if (saveCommentChangesButton) {

                    saveCommentChangesButton.disabled =
                        false;

                    saveCommentChangesButton.textContent =
                        "Save Changes";
                }
            }
        );
    }


    // ======================================================
    // CLEAN UP USER COMMENT DELETE MODAL
    // ======================================================

    if (deleteCommentModalElement) {

        deleteCommentModalElement.addEventListener(
            "hidden.bs.modal",
            () => {

                selectedCommentId =
                    null;

                selectedCommentCard =
                    null;


                if (deleteCommentPreviewText) {

                    deleteCommentPreviewText.textContent =
                        "";
                }


                if (deleteCommentError) {

                    deleteCommentError.textContent =
                        "";
                }


                if (deleteCommentForm) {

                    deleteCommentForm.removeAttribute(
                        "action"
                    );
                }


                if (confirmDeleteCommentButton) {

                    confirmDeleteCommentButton.disabled =
                        false;

                    confirmDeleteCommentButton.textContent =
                        "Delete Comment";
                }
            }
        );
    }


    // ======================================================
    // BLOG JAVASCRIPT STATUS
    // ======================================================

    console.log(
        "blogScreen.js loaded successfully."
    );
});