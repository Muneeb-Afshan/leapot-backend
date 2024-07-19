const nodeHtmlToImage = require("node-html-to-image");
const Template = require("../../model/SiteBuilderSchema");
const simpleGit = require("simple-git");
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const axios = require("axios");
require("dotenv").config();


// Controller functions

// To get all templates
exports.getAllTemplates = async (req, res) => {
  try {
    const templates = await Template.find();
    res.json(templates);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// To get Template by id
exports.getTemplateById = async (req, res) => {
  try {
    const template = await Template.findById(req.params.id);

    if (!template) {
      return res.status(404).json({ message: "Template not found" });
    }

    res.json(template);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// To get UserSavedPages
exports.getUserSavedTemplates = async (req, res) => {
  try {
    const templates = await Template.find({
      categoryId: "UserSavedPages",
      isDeleted: false,
    });
    res.json(templates);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// To add templates
exports.addTemplate = async (req, res) => {
  try {
    const {
      categoryId,
      pageName,
      title,
      pageTemplate,
      htmlTemplate,
      cssTemplate,
      userName,
    } = req.body;

    // Generate image from the HTML and CSS content
    const imageBuffer = await nodeHtmlToImage({
      html: `<html>
               <head>
                 <style>${cssTemplate}</style>
                 <style>
                   @tailwind base;
                   @tailwind components;
                   @tailwind utilities;
                 </style>
                 <link href="https://unpkg.com/tailwindcss@^1.0/dist/tailwind.min.css" rel="stylesheet">
               </head>
               <body>
                 ${htmlTemplate}
               </body>
             </html>`,
      encoding: 'buffer',
    });

    const base64Image = imageBuffer.toString('base64');
    const imageSrc = `data:image/png;base64,${base64Image}`;

    // Deploy HTML content to Netlify
    // const netlifyLink = await deployToNetlify(`<html><head></head><body>${pageTemplate}</body></html>`);

    // Create a new template
    const newTemplate = new Template({
      categoryId,
      pageName,
      title,
      pageTemplate,
      htmlTemplate,
      cssTemplate,
      isDeleted: false,
      userName,
      netlifySiteId: 'site-id-placeholder', // Placeholder until you have the actual site ID
      netlifyLink:'this is link',
      previewImage: imageSrc,
    });

    // Save the new template to the database
    const savedTemplate = await newTemplate.save();

    res.status(201).json({ message: 'Template added successfully', template: savedTemplate });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// To add templates to the addUserSavedTemplate
exports.addUserSavedTemplate = async (req, res) => {
  try {
    const {
      pageName,
      title,
      pageTemplate,
      htmlTemplate,
      cssTemplate,
      userName,
    } = req.body;

    // Generate image from the HTML and CSS content
    const imageBuffer = await nodeHtmlToImage({
      html: `<html>
               <head>
                 <style>
                   ${cssTemplate}
                 </style>
                 <style>
                   @tailwind base;
                   @tailwind components;
                   @tailwind utilities;
                 </style>
                 <link href="https://unpkg.com/tailwindcss@^1.0/dist/tailwind.min.css" rel="stylesheet">
               </head>
               <body>
                 ${htmlTemplate}
               </body>
             </html>`,
      encoding: "buffer",
    });

    const base64Image = imageBuffer.toString("base64");
    const imageSrc = `data:image/png;base64,${base64Image}`;

    // Deploy HTML content to Netlify
    // const netlifyLink = await deployToNetlify(`
    //     <html>
    //     <head>
    //     <style>
    //     @tailwind base;
    //     @tailwind components;
    //     @tailwind utilities
    //     </style>               
    //     <style>${cssTemplate}</style>
    //     </head>
    //     <body>${pageTemplate}</body>
    //     </html>`);

    // Create a new template in the UserSavedPages category
    const newTemplate = new Template({
      categoryId: "UserSavedPages",
      pageName,
      title,
      pageTemplate,
      htmlTemplate,
      cssTemplate,
      userName,
      netlifyLink:'this is link',
      previewImage: imageSrc,
    });

    await newTemplate.save();

    res.status(201).json({
      message: "User saved template added successfully",
      template: newTemplate,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};


// To delete template
exports.deleteTemplate = async (req, res) => {
  const { id } = req.params;

  try {
    await Template.findByIdAndUpdate(id, { isDeleted: true });
    res
      .status(200)
      .json({ message: "Template deleted successfully (logical delete)" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Update Templates
exports.updateTemplateById = async (req, res) => {
  const { id } = req.params;
  const { pageTemplate } = req.body;

  try {
    // Find the template by ID
    const template = await Template.findById(id);

    if (!template) {
      return res.status(404).json({ message: 'Template not found' });
    }

    // Update the pageTemplate field in the template
    template.pageTemplate = pageTemplate;

    // Deploy updated HTML content to Netlify
    // const netlifyLink = await deployToNetlify(template.netlifySiteId, `<html><head></head><body>${pageTemplate}</body></html>`);

    // Update the Netlify link in the template
    template.netlifyLink = netlifyLink;

    // Save the updated template
    const updatedTemplate = await template.save();

    res.json(updatedTemplate);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};




