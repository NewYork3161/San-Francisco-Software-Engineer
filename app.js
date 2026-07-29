const express = require("express");
const methodOverride = require("method-override");
const multer = require("multer");
const path = require("path");
const crypto = require("crypto");
const { createClient } = require("@supabase/supabase-js");

require("dotenv").config();


const app = express();

const PORT =
    process.env.PORT || 3000;


// ======================================================
// EJS
// ======================================================

app.set(
    "view engine",
    "ejs"
);


// ======================================================
// MIDDLEWARE
// ======================================================

app.use(
    express.urlencoded({
        extended: true
    })
);

app.use(
    express.json()
);

app.use(
    methodOverride("_method")
);

app.use(
    express.static("public")
);


// ======================================================
// MULTER
// ======================================================

const upload =
    multer({
        storage:
            multer.memoryStorage(),

        limits: {
            fileSize:
                10 * 1024 * 1024
        },

        fileFilter:
            (
                req,
                file,
                callback
            ) => {

                if (
                    !file.mimetype.startsWith(
                        "image/"
                    )
                ) {
                    return callback(
                        new Error(
                            "Only image files are allowed."
                        )
                    );
                }

                callback(
                    null,
                    true
                );
            }
    });


// ======================================================
// SUPABASE
// ======================================================

let supabase = null;


if (
    process.env.SUPABASE_URL &&
    process.env.SUPABASE_KEY
) {

    supabase =
        createClient(
            process.env.SUPABASE_URL,
            process.env.SUPABASE_KEY
        );


    console.log(
        "Supabase connected."
    );

} else {

    console.log(
        "Supabase not configured yet."
    );
}


// ======================================================
// HELPER FUNCTIONS
// ======================================================


// ------------------------------------------------------
// VERIFY ADMIN CODE
// ------------------------------------------------------

function validAdminCode(code) {

    if (!process.env.ADMIN_CODE) {

        return false;
    }


    return (
        String(
            code || ""
        ).trim() ===
        String(
            process.env.ADMIN_CODE
        ).trim()
    );
}


// ------------------------------------------------------
// UPLOAD BLOG IMAGE
// ------------------------------------------------------

async function uploadBlogImage(file) {

    if (!file) {

        return null;
    }


    if (!supabase) {

        throw new Error(
            "Supabase is not configured."
        );
    }


    const extension =
        path.extname(
            file.originalname
        ) || ".jpg";


    const fileName =
        `${Date.now()}-${crypto.randomUUID()}${extension}`;


    const storagePath =
        `posts/${fileName}`;


    const {
        error: uploadError
    } =
        await supabase
            .storage
            .from(
                "blog-images"
            )
            .upload(
                storagePath,
                file.buffer,
                {
                    contentType:
                        file.mimetype,

                    upsert:
                        false
                }
            );


    if (uploadError) {

        console.error(
            "Supabase image upload error:",
            uploadError
        );


        throw uploadError;
    }


    const {
        data
    } =
        supabase
            .storage
            .from(
                "blog-images"
            )
            .getPublicUrl(
                storagePath
            );


    if (
        !data ||
        !data.publicUrl
    ) {

        throw new Error(
            "Unable to create public image URL."
        );
    }


    return data.publicUrl;
}


// ------------------------------------------------------
// UPLOAD PROJECT IMAGE
// ------------------------------------------------------

async function uploadProjectImage(file) {

    if (!file) {

        return null;
    }


    if (!supabase) {

        throw new Error(
            "Supabase is not configured."
        );
    }


    const extension =
        path.extname(
            file.originalname
        ) || ".jpg";


    const fileName =
        `${Date.now()}-${crypto.randomUUID()}${extension}`;


    const storagePath =
        `projects/${fileName}`;


    const {
        error: uploadError
    } =
        await supabase
            .storage
            .from(
                "project-images"
            )
            .upload(
                storagePath,
                file.buffer,
                {
                    contentType:
                        file.mimetype,

                    upsert:
                        false
                }
            );


    if (uploadError) {

        console.error(
            "Supabase project image upload error:",
            uploadError
        );


        throw uploadError;
    }


    const {
        data
    } =
        supabase
            .storage
            .from(
                "project-images"
            )
            .getPublicUrl(
                storagePath
            );


    if (
        !data ||
        !data.publicUrl
    ) {

        throw new Error(
            "Unable to create public project image URL."
        );
    }


    return data.publicUrl;
}


// ------------------------------------------------------
// GET PROJECT IMAGE STORAGE PATH
// ------------------------------------------------------

function getProjectImageStoragePath(imageUrl) {

    if (!imageUrl) {

        return null;
    }


    const marker =
        "/storage/v1/object/public/project-images/";


    const markerIndex =
        imageUrl.indexOf(
            marker
        );


    if (markerIndex === -1) {

        return null;
    }


    return decodeURIComponent(
        imageUrl.substring(
            markerIndex +
            marker.length
        )
    );
}


// ------------------------------------------------------
// DELETE PROJECT IMAGE
// ------------------------------------------------------

async function deleteProjectImage(imageUrl) {

    if (
        !supabase ||
        !imageUrl
    ) {

        return;
    }


    const storagePath =
        getProjectImageStoragePath(
            imageUrl
        );


    if (!storagePath) {

        return;
    }


    const {
        error
    } =
        await supabase
            .storage
            .from(
                "project-images"
            )
            .remove([
                storagePath
            ]);


    if (error) {

        console.error(
            "Supabase project image deletion error:",
            error
        );
    }
}


// ======================================================
// HOME
// ======================================================

app.get(
    "/",
    (req, res) => {

        return res.render(
            "loadingScreen"
        );
    }
);


// ======================================================
// PROJECTS
// ======================================================

app.get(
    "/projects",

    async (
        req,
        res
    ) => {

        try {

            if (!supabase) {

                return res.render(
                    "projectScreen",
                    {
                        projects: []
                    }
                );
            }


            const {
                data: projects,
                error
            } =
                await supabase
                    .from(
                        "projects"
                    )
                    .select("*")
                    .order(
                        "created_at",
                        {
                            ascending:
                                false
                        }
                    );


            if (error) {

                console.error(
                    "Supabase projects error:",
                    error
                );


                return res.render(
                    "projectScreen",
                    {
                        projects: []
                    }
                );
            }


            return res.render(
                "projectScreen",
                {
                    projects:
                        projects || []
                }
            );

        } catch (error) {

            console.error(
                "Projects route error:",
                error
            );


            return res.render(
                "projectScreen",
                {
                    projects: []
                }
            );
        }
    }
);
// ======================================================
// PROJECTS - CREATE PROJECT
// ======================================================

app.post(
    "/projects",

    upload.single(
        "image"
    ),

    async (
        req,
        res
    ) => {

        try {

            if (!supabase) {

                return res
                    .status(500)
                    .send(
                        "Supabase is not configured."
                    );
            }


            const title =
                req.body?.title
                    ?.toString()
                    .trim();


            const body =
                req.body?.body
                    ?.toString()
                    .trim();


            const technologies =
                req.body?.technologies
                    ?.toString()
                    .trim() || null;


            const githubUrl =
                req.body?.github_url
                    ?.toString()
                    .trim() || null;


            const liveUrl =
                req.body?.live_url
                    ?.toString()
                    .trim() || null;


            if (
                !title ||
                !body
            ) {

                return res
                    .status(400)
                    .send(
                        "Project title and description are required."
                    );
            }


            let imageUrl =
                null;


            if (req.file) {

                imageUrl =
                    await uploadProjectImage(
                        req.file
                    );
            }


            const {
                error
            } =
                await supabase
                    .from(
                        "projects"
                    )
                    .insert([
                        {
                            title,
                            body,

                            technologies,

                            github_url:
                                githubUrl,

                            live_url:
                                liveUrl,

                            image_url:
                                imageUrl
                        }
                    ]);


            if (error) {

                console.error(
                    "Supabase create project error:",
                    error
                );


                if (imageUrl) {

                    await deleteProjectImage(
                        imageUrl
                    );
                }


                return res
                    .status(500)
                    .send(
                        "Unable to publish project."
                    );
            }


            console.log(
                "Project published successfully."
            );


            return res.redirect(
                "/projects"
            );

        } catch (error) {

            console.error(
                "Create project route error:",
                error
            );


            return res
                .status(500)
                .send(
                    "Unable to publish project."
                );
        }
    }
);


// ======================================================
// PROJECTS - GET ONE PROJECT
// ======================================================

app.get(
    "/projects/:id/data",

    async (
        req,
        res
    ) => {

        try {

            if (!supabase) {

                return res
                    .status(500)
                    .json({
                        message:
                            "Supabase is not configured."
                    });
            }


            const projectId =
                req.params.id;


            const {
                data: project,
                error
            } =
                await supabase
                    .from(
                        "projects"
                    )
                    .select("*")
                    .eq(
                        "id",
                        projectId
                    )
                    .single();


            if (
                error ||
                !project
            ) {

                console.error(
                    "Get project error:",
                    error
                );


                return res
                    .status(404)
                    .json({
                        message:
                            "Project not found."
                    });
            }


            return res.json({
                project
            });

        } catch (error) {

            console.error(
                "Get project route error:",
                error
            );


            return res
                .status(500)
                .json({
                    message:
                        "Unable to load project."
                });
        }
    }
);


// ======================================================
// PROJECTS - UPDATE PROJECT
// ======================================================

app.put(
    "/projects/:id",

    upload.single(
        "image"
    ),

    async (
        req,
        res
    ) => {

        try {

            if (!supabase) {

                return res
                    .status(500)
                    .send(
                        "Supabase is not configured."
                    );
            }


            const projectId =
                req.params.id;


            const adminCode =
                req.body
                    ?.adminCode
                    ?.toString()
                    .trim();


            if (
                !validAdminCode(
                    adminCode
                )
            ) {

                return res
                    .status(401)
                    .send(
                        "Unauthorized."
                    );
            }


            const title =
                req.body?.title
                    ?.toString()
                    .trim();


            const body =
                req.body?.body
                    ?.toString()
                    .trim();


            const technologies =
                req.body?.technologies
                    ?.toString()
                    .trim() || null;


            const githubUrl =
                req.body?.github_url
                    ?.toString()
                    .trim() || null;


            const liveUrl =
                req.body?.live_url
                    ?.toString()
                    .trim() || null;


            if (
                !title ||
                !body
            ) {

                return res
                    .status(400)
                    .send(
                        "Project title and description are required."
                    );
            }


            const {
                data: existingProject,
                error: existingError
            } =
                await supabase
                    .from(
                        "projects"
                    )
                    .select("*")
                    .eq(
                        "id",
                        projectId
                    )
                    .single();


            if (
                existingError ||
                !existingProject
            ) {

                console.error(
                    "Find project error:",
                    existingError
                );


                return res
                    .status(404)
                    .send(
                        "Project not found."
                    );
            }


            let imageUrl =
                existingProject.image_url;


            let newImageUrl =
                null;


            if (req.file) {

                newImageUrl =
                    await uploadProjectImage(
                        req.file
                    );

                imageUrl =
                    newImageUrl;
            }


            const {
                error
            } =
                await supabase
                    .from(
                        "projects"
                    )
                    .update({
                        title,
                        body,

                        technologies,

                        github_url:
                            githubUrl,

                        live_url:
                            liveUrl,

                        image_url:
                            imageUrl
                    })
                    .eq(
                        "id",
                        projectId
                    );


            if (error) {

                console.error(
                    "Update project error:",
                    error
                );


                if (newImageUrl) {

                    await deleteProjectImage(
                        newImageUrl
                    );
                }


                return res
                    .status(500)
                    .send(
                        "Unable to update project."
                    );
            }


            if (
                newImageUrl &&
                existingProject.image_url
            ) {

                await deleteProjectImage(
                    existingProject.image_url
                );
            }


            console.log(
                "Project updated successfully."
            );


            return res.redirect(
                "/projects"
            );

        } catch (error) {

            console.error(
                "Update project route error:",
                error
            );


            return res
                .status(500)
                .send(
                    "Unable to update project."
                );
        }
    }
);


// ======================================================
// PROJECTS - DELETE PROJECT
// ======================================================

app.delete(
    "/projects/:id",

    async (
        req,
        res
    ) => {

        try {

            if (!supabase) {

                return res
                    .status(500)
                    .send(
                        "Supabase is not configured."
                    );
            }


            const projectId =
                req.params.id;


            const adminCode =
                req.body
                    ?.adminCode
                    ?.toString()
                    .trim();


            if (
                !validAdminCode(
                    adminCode
                )
            ) {

                return res
                    .status(401)
                    .send(
                        "Unauthorized."
                    );
            }


            const {
                data: existingProject,
                error: existingError
            } =
                await supabase
                    .from(
                        "projects"
                    )
                    .select("*")
                    .eq(
                        "id",
                        projectId
                    )
                    .single();


            if (
                existingError ||
                !existingProject
            ) {

                console.error(
                    "Find project before delete error:",
                    existingError
                );


                return res
                    .status(404)
                    .send(
                        "Project not found."
                    );
            }


            const {
                error
            } =
                await supabase
                    .from(
                        "projects"
                    )
                    .delete()
                    .eq(
                        "id",
                        projectId
                    );


            if (error) {

                console.error(
                    "Delete project error:",
                    error
                );


                return res
                    .status(500)
                    .send(
                        "Unable to delete project."
                    );
            }


            if (existingProject.image_url) {

                await deleteProjectImage(
                    existingProject.image_url
                );
            }


            console.log(
                "Project deleted successfully."
            );


            return res.redirect(
                "/projects"
            );

        } catch (error) {

            console.error(
                "Delete project route error:",
                error
            );


            return res
                .status(500)
                .send(
                    "Unable to delete project."
                );
        }
    }
);


// ======================================================
// RESUME
// ======================================================

app.get(
    "/resume",

    (req, res) => {

        return res.render(
            "resumeScreen"
        );
    }
);
// ======================================================
// BLOG - GET POSTS AND COMMENTS
// ======================================================

app.get(
    "/blog",

    async (
        req,
        res
    ) => {

        try {

            if (!supabase) {

                return res.render(
                    "blogScreen",
                    {
                        posts: []
                    }
                );
            }


            // ==============================================
            // GET BLOG POSTS
            // ==============================================

            const {
                data: posts,
                error: postsError
            } =
                await supabase
                    .from(
                        "posts"
                    )
                    .select("*")
                    .order(
                        "created_at",
                        {
                            ascending:
                                false
                        }
                    );


            if (postsError) {

                console.error(
                    "Supabase blog error:",
                    postsError
                );


                return res.render(
                    "blogScreen",
                    {
                        posts: []
                    }
                );
            }


            // ==============================================
            // GET COMMENTS
            // ==============================================

            let comments = [];


            const {
                data: commentRows,
                error: commentsError
            } =
                await supabase
                    .from(
                        "comments"
                    )
                    .select("*")
                    .order(
                        "created_at",
                        {
                            ascending:
                                true
                        }
                    );


            if (commentsError) {

                console.error(
                    "Supabase comments error:",
                    commentsError
                );

            } else {

                comments =
                    commentRows || [];
            }


            // ==============================================
            // ATTACH COMMENTS TO THEIR BLOG POSTS
            // ==============================================

            const postsWithComments =
                (
                    posts || []
                ).map(
                    (post) => {

                        return {
                            ...post,

                            comments:
                                comments.filter(
                                    (comment) => {

                                        return (
                                            String(
                                                comment.post_id
                                            ) ===
                                            String(
                                                post.id
                                            )
                                        );
                                    }
                                )
                        };
                    }
                );


            return res.render(
                "blogScreen",
                {
                    posts:
                        postsWithComments
                }
            );

        } catch (error) {

            console.error(
                "Blog route error:",
                error
            );


            return res.render(
                "blogScreen",
                {
                    posts: []
                }
            );
        }
    }
);


// ======================================================
// ADMINISTRATOR VERIFICATION
// ======================================================

app.post(
    "/admin/verify",

    (
        req,
        res
    ) => {

        try {

            const code =
                req.body?.code
                    ?.toString()
                    .trim();


            if (
                !process.env.ADMIN_CODE
            ) {

                console.error(
                    "ADMIN_CODE is missing from .env"
                );


                return res
                    .status(500)
                    .json({
                        valid: false,

                        message:
                            "Administrator verification is not configured."
                    });
            }


            if (!code) {

                return res
                    .status(400)
                    .json({
                        valid: false,

                        message:
                            "Administrator code is required."
                    });
            }


            if (
                !validAdminCode(
                    code
                )
            ) {

                return res
                    .status(401)
                    .json({
                        valid: false,

                        message:
                            "Incorrect administrator code."
                    });
            }


            console.log(
                "Administrator code verified successfully."
            );


            return res.json({
                valid: true
            });

        } catch (error) {

            console.error(
                "Admin verification error:",
                error
            );


            return res
                .status(500)
                .json({
                    valid: false,

                    message:
                        "Unable to verify administrator code."
                });
        }
    }
);


// ======================================================
// BLOG - GET ONE POST
// ======================================================

app.get(
    "/blog/:id/data",

    async (
        req,
        res
    ) => {

        try {

            if (!supabase) {

                return res
                    .status(500)
                    .json({
                        message:
                            "Supabase is not configured."
                    });
            }


            const postId =
                req.params.id;


            const {
                data: post,
                error
            } =
                await supabase
                    .from(
                        "posts"
                    )
                    .select("*")
                    .eq(
                        "id",
                        postId
                    )
                    .single();


            if (
                error ||
                !post
            ) {

                console.error(
                    "Get blog post error:",
                    error
                );


                return res
                    .status(404)
                    .json({
                        message:
                            "Blog post not found."
                    });
            }


            return res.json({
                post
            });

        } catch (error) {

            console.error(
                "Get blog post route error:",
                error
            );


            return res
                .status(500)
                .json({
                    message:
                        "Unable to load blog post."
                });
        }
    }
);


// ======================================================
// BLOG - CREATE POST
// ======================================================

app.post(
    "/blog",

    upload.single(
        "image"
    ),

    async (
        req,
        res
    ) => {

        try {

            if (!supabase) {

                return res
                    .status(500)
                    .send(
                        "Supabase is not configured."
                    );
            }


            const title =
                req.body?.title
                    ?.toString()
                    .trim();


            const body =
                req.body?.body
                    ?.toString()
                    .trim();


            if (
                !title ||
                !body
            ) {

                return res
                    .status(400)
                    .send(
                        "Title and body are required."
                    );
            }


            let imageUrl =
                null;


            if (req.file) {

                imageUrl =
                    await uploadBlogImage(
                        req.file
                    );
            }


            const {
                error
            } =
                await supabase
                    .from(
                        "posts"
                    )
                    .insert([
                        {
                            title,
                            body,

                            image_url:
                                imageUrl
                        }
                    ]);


            if (error) {

                console.error(
                    "Supabase create blog post error:",
                    error
                );


                return res
                    .status(500)
                    .send(
                        "Unable to publish blog post."
                    );
            }


            console.log(
                "Blog post published successfully."
            );


            return res.redirect(
                "/blog"
            );

        } catch (error) {

            console.error(
                "Create blog post route error:",
                error
            );


            return res
                .status(500)
                .send(
                    "Unable to publish blog post."
                );
        }
    }
);


// ======================================================
// BLOG - EDIT POST
// ======================================================

app.post(
    "/blog/:id/edit",

    upload.single(
        "image"
    ),

    async (
        req,
        res
    ) => {

        try {

            if (!supabase) {

                return res
                    .status(500)
                    .send(
                        "Supabase is not configured."
                    );
            }


            const postId =
                req.params.id;


            const adminCode =
                req.body
                    ?.adminCode
                    ?.toString()
                    .trim();


            if (
                !validAdminCode(
                    adminCode
                )
            ) {

                return res
                    .status(401)
                    .send(
                        "Unauthorized."
                    );
            }


            const title =
                req.body?.title
                    ?.toString()
                    .trim();


            const body =
                req.body?.body
                    ?.toString()
                    .trim();


            if (
                !title ||
                !body
            ) {

                return res
                    .status(400)
                    .send(
                        "Title and body are required."
                    );
            }


            // ==============================================
            // FIND EXISTING POST
            // ==============================================

            const {
                data: existingPost,
                error:
                    existingError
            } =
                await supabase
                    .from(
                        "posts"
                    )
                    .select("*")
                    .eq(
                        "id",
                        postId
                    )
                    .single();


            if (
                existingError ||
                !existingPost
            ) {

                console.error(
                    "Find blog post error:",
                    existingError
                );


                return res
                    .status(404)
                    .send(
                        "Blog post not found."
                    );
            }


            let imageUrl =
                existingPost.image_url;


            if (req.file) {

                imageUrl =
                    await uploadBlogImage(
                        req.file
                    );
            }


            // ==============================================
            // UPDATE POST
            // ==============================================

            const {
                error
            } =
                await supabase
                    .from(
                        "posts"
                    )
                    .update({
                        title,
                        body,

                        image_url:
                            imageUrl
                    })
                    .eq(
                        "id",
                        postId
                    );


            if (error) {

                console.error(
                    "Update blog post error:",
                    error
                );


                return res
                    .status(500)
                    .send(
                        "Unable to update blog post."
                    );
            }


            console.log(
                "Blog post updated successfully."
            );


            return res.redirect(
                "/blog"
            );

        } catch (error) {

            console.error(
                "Update blog post route error:",
                error
            );


            return res
                .status(500)
                .send(
                    "Unable to update blog post."
                );
        }
    }
);


// ======================================================
// BLOG - DELETE POST
// ======================================================

app.post(
    "/blog/:id/delete",

    async (
        req,
        res
    ) => {

        try {

            if (!supabase) {

                return res
                    .status(500)
                    .send(
                        "Supabase is not configured."
                    );
            }


            const postId =
                req.params.id;


            const adminCode =
                req.body
                    ?.adminCode
                    ?.toString()
                    .trim();


            if (
                !validAdminCode(
                    adminCode
                )
            ) {

                return res
                    .status(401)
                    .send(
                        "Unauthorized."
                    );
            }


            // ==============================================
            // DELETE COMMENTS FIRST
            // ==============================================

            const {
                error:
                    commentsDeleteError
            } =
                await supabase
                    .from(
                        "comments"
                    )
                    .delete()
                    .eq(
                        "post_id",
                        postId
                    );


            if (
                commentsDeleteError
            ) {

                console.error(
                    "Delete associated comments error:",
                    commentsDeleteError
                );
            }


            // ==============================================
            // DELETE POST
            // ==============================================

            const {
                error
            } =
                await supabase
                    .from(
                        "posts"
                    )
                    .delete()
                    .eq(
                        "id",
                        postId
                    );


            if (error) {

                console.error(
                    "Delete blog post error:",
                    error
                );


                return res
                    .status(500)
                    .send(
                        "Unable to delete blog post."
                    );
            }


            console.log(
                "Blog post deleted successfully."
            );


            return res.redirect(
                "/blog"
            );

        } catch (error) {

            console.error(
                "Delete blog post route error:",
                error
            );


            return res
                .status(500)
                .send(
                    "Unable to delete blog post."
                );
        }
    }
);
// ======================================================
// BLOG - CREATE COMMENT
// ======================================================
//
// SUPABASE COMMENTS TABLE MUST CONTAIN:
//
// id           uuid
// created_at   timestamptz
// post_id      uuid
// author_name  text
// body         text
//
// ======================================================

app.post(
    "/blog/:id/comments",

    async (
        req,
        res
    ) => {

        try {

            if (!supabase) {

                return res
                    .status(500)
                    .send(
                        "Supabase is not configured."
                    );
            }


            const postId =
                req.params.id;


            /*
                These names match the EJS:

                name="author_name"
                name="body"
            */

            const authorName =
                req.body
                    ?.author_name
                    ?.toString()
                    .trim();


            const body =
                req.body
                    ?.body
                    ?.toString()
                    .trim();


            if (
                !authorName ||
                !body
            ) {

                return res
                    .status(400)
                    .send(
                        "Name and comment are required."
                    );
            }


            // ==============================================
            // VERIFY BLOG POST EXISTS
            // ==============================================

            const {
                data: post,
                error:
                    postError
            } =
                await supabase
                    .from(
                        "posts"
                    )
                    .select(
                        "id"
                    )
                    .eq(
                        "id",
                        postId
                    )
                    .single();


            if (
                postError ||
                !post
            ) {

                console.error(
                    "Comment post lookup error:",
                    postError
                );


                return res
                    .status(404)
                    .send(
                        "Blog post not found."
                    );
            }


            // ==============================================
            // INSERT COMMENT
            // ==============================================

            const {
                error
            } =
                await supabase
                    .from(
                        "comments"
                    )
                    .insert([
                        {
                            post_id:
                                postId,

                            author_name:
                                authorName,

                            body
                        }
                    ]);


            if (error) {

                console.error(
                    "Create blog comment error:",
                    error
                );


                return res
                    .status(500)
                    .send(
                        "Unable to post comment."
                    );
            }


            console.log(
                "Blog comment posted successfully."
            );


            return res.redirect(
                "/blog"
            );

        } catch (error) {

            console.error(
                "Create blog comment route error:",
                error
            );


            return res
                .status(500)
                .send(
                    "Unable to post comment."
                );
        }
    }
);


// ======================================================
// BLOG - EDIT COMMENT
// ======================================================

app.post(
    "/blog/comments/:commentId/edit",

    async (
        req,
        res
    ) => {

        try {

            if (!supabase) {

                return res
                    .status(500)
                    .send(
                        "Supabase is not configured."
                    );
            }


            const commentId =
                req.params.commentId;


            const body =
                req.body
                    ?.body
                    ?.toString()
                    .trim();


            if (!commentId) {

                return res
                    .status(400)
                    .send(
                        "Comment ID is required."
                    );
            }


            if (!body) {

                return res
                    .status(400)
                    .send(
                        "Comment cannot be empty."
                    );
            }


            // ==============================================
            // FIND COMMENT
            // ==============================================

            const {
                data:
                    existingComment,

                error:
                    existingError
            } =
                await supabase
                    .from(
                        "comments"
                    )
                    .select(
                        "id, post_id"
                    )
                    .eq(
                        "id",
                        commentId
                    )
                    .single();


            if (
                existingError ||
                !existingComment
            ) {

                console.error(
                    "Find comment error:",
                    existingError
                );


                return res
                    .status(404)
                    .send(
                        "Comment not found."
                    );
            }


            // ==============================================
            // UPDATE COMMENT
            // ==============================================

            const {
                error
            } =
                await supabase
                    .from(
                        "comments"
                    )
                    .update({
                        body
                    })
                    .eq(
                        "id",
                        commentId
                    );


            if (error) {

                console.error(
                    "Update blog comment error:",
                    error
                );


                return res
                    .status(500)
                    .send(
                        "Unable to update comment."
                    );
            }


            console.log(
                "Blog comment updated successfully."
            );


            return res.redirect(
                "/blog"
            );

        } catch (error) {

            console.error(
                "Update blog comment route error:",
                error
            );


            return res
                .status(500)
                .send(
                    "Unable to update comment."
                );
        }
    }
);


// ======================================================
// BLOG - DELETE COMMENT
// ======================================================

app.post(
    "/blog/comments/:commentId/delete",

    async (
        req,
        res
    ) => {

        try {

            if (!supabase) {

                return res
                    .status(500)
                    .send(
                        "Supabase is not configured."
                    );
            }


            const commentId =
                req.params.commentId;


            if (!commentId) {

                return res
                    .status(400)
                    .send(
                        "Comment ID is required."
                    );
            }


            // ==============================================
            // FIND COMMENT
            // ==============================================

            const {
                data:
                    existingComment,

                error:
                    existingError
            } =
                await supabase
                    .from(
                        "comments"
                    )
                    .select(
                        "id, post_id"
                    )
                    .eq(
                        "id",
                        commentId
                    )
                    .single();


            if (
                existingError ||
                !existingComment
            ) {

                console.error(
                    "Find comment error:",
                    existingError
                );


                return res
                    .status(404)
                    .send(
                        "Comment not found."
                    );
            }


            // ==============================================
            // DELETE COMMENT
            // ==============================================

            const {
                error
            } =
                await supabase
                    .from(
                        "comments"
                    )
                    .delete()
                    .eq(
                        "id",
                        commentId
                    );


            if (error) {

                console.error(
                    "Delete blog comment error:",
                    error
                );


                return res
                    .status(500)
                    .send(
                        "Unable to delete comment."
                    );
            }


            console.log(
                "Blog comment deleted successfully."
            );


            return res.redirect(
                "/blog"
            );

        } catch (error) {

            console.error(
                "Delete blog comment route error:",
                error
            );


            return res
                .status(500)
                .send(
                    "Unable to delete comment."
                );
        }
    }
);


// ======================================================
// 404
// ======================================================

app.use(
    (
        req,
        res
    ) => {

        return res
            .status(404)
            .send(
                "404 - Page Not Found"
            );
    }
);


// ======================================================
// ERROR HANDLER
// ======================================================

app.use(
    (
        error,
        req,
        res,
        next
    ) => {

        console.error(
            "Application error:",
            error
        );


        if (
            error instanceof
            multer.MulterError
        ) {

            return res
                .status(400)
                .send(
                    `Image upload error: ${error.message}`
                );
        }


        return res
            .status(500)
            .send(
                error.message ||
                "Internal Server Error"
            );
    }
);


// ======================================================
// START SERVER
// ======================================================

app.listen(
    PORT,

    () => {

        console.log(
            "Supabase status:",
            supabase
                ? "Connected"
                : "Not configured"
        );


        console.log(
            "Admin code status:",
            process.env.ADMIN_CODE
                ? "Configured"
                : "NOT CONFIGURED"
        );


        console.log(
            `Server running on http://localhost:${PORT}`
        );
    }
);
