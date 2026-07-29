document.addEventListener("DOMContentLoaded", () => {

    // Project image upload elements
    const dropZone = document.getElementById("projectImageDropZone");
    const fileInput = document.getElementById("projectImage");
    const chooseButton = document.getElementById("chooseProjectImageButton");
    const previewContainer = document.getElementById(
        "projectImagePreviewContainer"
    );
    const previewImage = document.getElementById("projectImagePreview");
    const dropContent = document.getElementById("dropZoneContent");
    const removeButton = document.getElementById(
        "removeProjectImageButton"
    );


    // Choose image button
    if (chooseButton && fileInput) {
        chooseButton.addEventListener("click", (event) => {
            event.preventDefault();
            event.stopPropagation();

            fileInput.click();
        });
    }


    // Click anywhere inside drop zone
    if (dropZone && fileInput) {
        dropZone.addEventListener("click", (event) => {
            if (
                event.target === removeButton ||
                event.target.closest("#removeProjectImageButton")
            ) {
                return;
            }

            fileInput.click();
        });
    }


    // Drag over
    if (dropZone) {
        dropZone.addEventListener("dragover", (event) => {
            event.preventDefault();

            dropZone.classList.add("drag-over");
        });
    }


    // Drag enter
    if (dropZone) {
        dropZone.addEventListener("dragenter", (event) => {
            event.preventDefault();

            dropZone.classList.add("drag-over");
        });
    }


    // Drag leave
    if (dropZone) {
        dropZone.addEventListener("dragleave", (event) => {
            event.preventDefault();

            dropZone.classList.remove("drag-over");
        });
    }


    // Drop image
    if (dropZone && fileInput) {
        dropZone.addEventListener("drop", (event) => {
            event.preventDefault();
            event.stopPropagation();

            dropZone.classList.remove("drag-over");

            const files = event.dataTransfer.files;

            if (!files || files.length === 0) {
                return;
            }

            const file = files[0];

            if (!file.type.startsWith("image/")) {
                alert("Please choose an image file.");
                return;
            }

            try {
                const dataTransfer = new DataTransfer();

                dataTransfer.items.add(file);

                fileInput.files = dataTransfer.files;
            } catch (error) {
                console.log(
                    "Browser could not assign dropped file:",
                    error
                );
            }

            showImagePreview(file);
        });
    }


    // Image selected from file browser
    if (fileInput) {
        fileInput.addEventListener("change", () => {
            if (
                !fileInput.files ||
                fileInput.files.length === 0
            ) {
                return;
            }

            const file = fileInput.files[0];

            showImagePreview(file);
        });
    }


    // Show project image preview
    function showImagePreview(file) {

        if (!file) {
            return;
        }

        if (!file.type.startsWith("image/")) {
            alert("Please choose an image file.");

            if (fileInput) {
                fileInput.value = "";
            }

            return;
        }

        const reader = new FileReader();

        reader.onload = (event) => {

            if (previewImage) {
                previewImage.src = event.target.result;
            }

            if (dropContent) {
                dropContent.style.display = "none";
            }

            if (previewContainer) {
                previewContainer.classList.add("active");
                previewContainer.style.display = "block";
            }
        };

        reader.onerror = () => {
            alert("The image could not be previewed.");
        };

        reader.readAsDataURL(file);
    }


    // Remove selected image
    if (removeButton) {
        removeButton.addEventListener("click", (event) => {
            event.preventDefault();
            event.stopPropagation();

            clearImagePreview();
        });
    }


    // Clear image preview
    function clearImagePreview() {

        if (fileInput) {
            fileInput.value = "";
        }

        if (previewImage) {
            previewImage.src = "";
        }

        if (previewContainer) {
            previewContainer.classList.remove("active");
            previewContainer.style.display = "none";
        }

        if (dropContent) {
            dropContent.style.display = "";
        }
    }


    // Admin controls
    const adminButtons = document.querySelectorAll(
        ".admin-project-button"
    );

    const adminCodeModalElement = document.getElementById(
        "adminCodeModal"
    );

    const manageProjectModalElement = document.getElementById(
        "manageProjectModal"
    );

    const editProjectModalElement = document.getElementById(
        "editProjectModal"
    );

    const adminCodeInput = document.getElementById(
        "adminCode"
    );

    const adminCodeError = document.getElementById(
        "adminCodeError"
    );

    const verifyAdminButton = document.getElementById(
        "verifyAdminButton"
    );


    // Bootstrap modal objects
    let adminCodeModal = null;
    let manageProjectModal = null;
    let editProjectModal = null;


    if (
        adminCodeModalElement &&
        typeof bootstrap !== "undefined"
    ) {
        adminCodeModal = new bootstrap.Modal(
            adminCodeModalElement
        );
    }


    if (
        manageProjectModalElement &&
        typeof bootstrap !== "undefined"
    ) {
        manageProjectModal = new bootstrap.Modal(
            manageProjectModalElement
        );
    }


    if (
        editProjectModalElement &&
        typeof bootstrap !== "undefined"
    ) {
        editProjectModal = new bootstrap.Modal(
            editProjectModalElement
        );
    }


    // Current selected project
    let selectedProjectId = null;

    let selectedProject = {
        id: "",
        title: "",
        body: "",
        imageUrl: "",
        githubUrl: "",
        liveUrl: "",
        technologies: ""
    };

    let enteredAdminCode = "";


    // Open admin code window
    adminButtons.forEach((button) => {

        button.addEventListener("click", (event) => {

            event.preventDefault();

            selectedProjectId =
                button.dataset.projectId || "";

            selectedProject = {
                id: selectedProjectId,

                title:
                    button.dataset.title || "",

                body:
                    button.dataset.body || "",

                imageUrl:
                    button.dataset.imageUrl || "",

                githubUrl:
                    button.dataset.githubUrl || "",

                liveUrl:
                    button.dataset.liveUrl || "",

                technologies:
                    button.dataset.technologies || ""
            };


            if (adminCodeInput) {
                adminCodeInput.value = "";
            }


            if (adminCodeError) {
                adminCodeError.textContent = "";
            }


            enteredAdminCode = "";


            if (adminCodeModal) {
                adminCodeModal.show();
            }
        });
    });


    // Verify admin code
    if (verifyAdminButton) {

        verifyAdminButton.addEventListener(
            "click",
            async () => {

                if (!adminCodeInput) {
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
                    adminCodeError.textContent = "";
                }


                verifyAdminButton.disabled = true;

                const originalText =
                    verifyAdminButton.textContent;

                verifyAdminButton.textContent =
                    "Checking...";


                try {

                    const response = await fetch(
                        "/admin/verify",
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({
                                code: enteredAdminCode
                            })
                        }
                    );


                    const result =
                        await response.json();


                    if (!response.ok || !result.valid) {

                        if (adminCodeError) {
                            adminCodeError.textContent =
                                result.message ||
                                "Incorrect administrator code.";
                        }

                        return;
                    }


                    if (adminCodeError) {
                        adminCodeError.textContent = "";
                    }


                    if (adminCodeModal) {
                        adminCodeModal.hide();
                    }


                    setTimeout(() => {

                        if (manageProjectModal) {
                            manageProjectModal.show();
                        }

                    }, 250);

                } catch (error) {

                    console.error(
                        "Admin verification error:",
                        error
                    );


                    if (adminCodeError) {
                        adminCodeError.textContent =
                            "Unable to verify administrator code.";
                    }

                } finally {

                    verifyAdminButton.disabled = false;

                    verifyAdminButton.textContent =
                        originalText;
                }
            }
        );
    }


    // Allow Enter key for admin code
    if (adminCodeInput) {

        adminCodeInput.addEventListener(
            "keydown",
            (event) => {

                if (event.key === "Enter") {

                    event.preventDefault();

                    if (verifyAdminButton) {
                        verifyAdminButton.click();
                    }
                }
            }
        );
    }


    // Edit project controls
    const editProjectButton = document.getElementById(
        "editProjectButton"
    );

    const editProjectForm = document.getElementById(
        "editProjectForm"
    );

    const editProjectTitle = document.getElementById(
        "editProjectTitle"
    );

    const editProjectBody = document.getElementById(
        "editProjectBody"
    );

    const editProjectImageUrl = document.getElementById(
        "editProjectImageUrl"
    );

    const editProjectGithubUrl = document.getElementById(
        "editProjectGithubUrl"
    );

    const editProjectLiveUrl = document.getElementById(
        "editProjectLiveUrl"
    );

    const editProjectTechnologies = document.getElementById(
        "editProjectTechnologies"
    );

    const editProjectAdminCode = document.getElementById(
        "editProjectAdminCode"
    );


    // Open edit project window
    if (editProjectButton) {

        editProjectButton.addEventListener(
            "click",
            () => {

                if (!selectedProjectId) {
                    alert("No project was selected.");
                    return;
                }


                if (editProjectTitle) {
                    editProjectTitle.value =
                        selectedProject.title;
                }


                if (editProjectBody) {
                    editProjectBody.value =
                        selectedProject.body;
                }


                if (editProjectImageUrl) {
                    editProjectImageUrl.value =
                        selectedProject.imageUrl;
                }


                if (editProjectGithubUrl) {
                    editProjectGithubUrl.value =
                        selectedProject.githubUrl;
                }


                if (editProjectLiveUrl) {
                    editProjectLiveUrl.value =
                        selectedProject.liveUrl;
                }


                if (editProjectTechnologies) {
                    editProjectTechnologies.value =
                        selectedProject.technologies;
                }


                if (editProjectAdminCode) {
                    editProjectAdminCode.value =
                        enteredAdminCode;
                }


                if (editProjectForm) {
                    editProjectForm.action =
                        `/projects/${selectedProjectId}`;
                }


                if (manageProjectModal) {
                    manageProjectModal.hide();
                }


                setTimeout(() => {

                    if (editProjectModal) {
                        editProjectModal.show();
                    }

                }, 250);
            }
        );
    }


    // Delete project controls
    const deleteProjectButton = document.getElementById(
        "deleteProjectButton"
    );

    const deleteProjectForm = document.getElementById(
        "deleteProjectForm"
    );

    const deleteProjectAdminCode = document.getElementById(
        "deleteProjectAdminCode"
    );


    if (
        deleteProjectButton &&
        deleteProjectForm
    ) {

        deleteProjectButton.addEventListener(
            "click",
            () => {

                if (!selectedProjectId) {

                    alert(
                        "No project was selected."
                    );

                    return;
                }


                const confirmed = window.confirm(
                    "Are you sure you want to delete this project?"
                );


                if (!confirmed) {
                    return;
                }


                deleteProjectForm.action =
                    `/projects/${selectedProjectId}`;


                if (deleteProjectAdminCode) {
                    deleteProjectAdminCode.value =
                        enteredAdminCode;
                }


                deleteProjectForm.submit();
            }
        );
    }


    // Project creation form validation
    const createProjectForm = document.getElementById(
        "createProjectForm"
    );


    if (createProjectForm) {

        createProjectForm.addEventListener(
            "submit",
            (event) => {

                const titleInput =
                    createProjectForm.querySelector(
                        '[name="title"]'
                    );

                const bodyInput =
                    createProjectForm.querySelector(
                        '[name="body"]'
                    );


                if (
                    titleInput &&
                    !titleInput.value.trim()
                ) {

                    event.preventDefault();

                    alert(
                        "Please enter a project title."
                    );

                    titleInput.focus();

                    return;
                }


                if (
                    bodyInput &&
                    !bodyInput.value.trim()
                ) {

                    event.preventDefault();

                    alert(
                        "Please enter a project description."
                    );

                    bodyInput.focus();

                    return;
                }
            }
        );
    }


    // URL helpers
    const urlInputs = document.querySelectorAll(
        'input[type="url"]'
    );


    urlInputs.forEach((input) => {

        input.addEventListener(
            "blur",
            () => {

                let value =
                    input.value.trim();


                if (!value) {
                    return;
                }


                if (
                    !value.startsWith("http://") &&
                    !value.startsWith("https://")
                ) {

                    value =
                        `https://${value}`;

                    input.value = value;
                }
            }
        );
    });


    // External project links
    const projectLinks = document.querySelectorAll(
        ".project-external-link"
    );


    projectLinks.forEach((link) => {

        link.addEventListener(
            "click",
            (event) => {

                const href =
                    link.getAttribute("href");


                if (
                    !href ||
                    href === "#"
                ) {

                    event.preventDefault();
                }
            }
        );
    });


    // Reset create-project image when form resets
    if (createProjectForm) {

        createProjectForm.addEventListener(
            "reset",
            () => {

                setTimeout(() => {
                    clearImagePreview();
                }, 0);
            }
        );
    }


    // Clear admin information when modal closes
    if (adminCodeModalElement) {

        adminCodeModalElement.addEventListener(
            "hidden.bs.modal",
            () => {

                if (adminCodeInput) {
                    adminCodeInput.value = "";
                }


                if (adminCodeError) {
                    adminCodeError.textContent = "";
                }
            }
        );
    }


    console.log(
        "projectScreen.js loaded successfully."
    );
});