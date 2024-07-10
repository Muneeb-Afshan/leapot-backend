const nodeHtmlToImage = require("node-html-to-image");
const Template = require("../../model/SiteBuilderSchema");
const simpleGit = require("simple-git");
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const axios = require("axios");
require("dotenv").config();

const NETLIFY_API_TOKEN = process.env.NETLIFY_API_TOKEN;



async function deployToNetlify(htmlContent) {
  try {
    console.log('Creating a new site on Netlify...');
    const siteResponse = await axios.post(
      "https://api.netlify.com/api/v1/sites",
      {},
      {
        headers: {
          Authorization: `Bearer ${NETLIFY_API_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log('Site creation response:', siteResponse.data);

    if (siteResponse.status >= 200 && siteResponse.status < 300) {
      const siteId = siteResponse.data.id;

      console.log('Deploying HTML content to Netlify...');
      const deployResponse = await axios.post(
        `https://api.netlify.com/api/v1/sites/${siteId}/deploys`,
        {
          files: {
            "index.html": {
              content: htmlContent,
            },
          },
        },
        {
          headers: {
            Authorization: `Bearer ${NETLIFY_API_TOKEN}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log('Deployment response:', deployResponse.data);

      if (deployResponse.status >= 200 && deployResponse.status < 300) {
        const deployId = deployResponse.data.id;
        const deployUrl = deployResponse.data.deploy_ssl_url;

        // await pollDeploymentStatus(deployId, siteId);

        console.log('Deployment successful. Deployment URL:', deployUrl);
        return deployUrl;
      } else {
        throw new Error(`Failed to deploy content to Netlify. Status: ${deployResponse.status}`);
      }
    } else {
      throw new Error(`Failed to create site on Netlify. Status: ${siteResponse.status}`);
    }
  } catch (error) {
    console.error('Error deploying to Netlify:', error);
    throw error;
  }
}

// async function pollDeploymentStatus(deployId, siteId) {
//   const url = `https://api.netlify.com/api/v1/sites/${siteId}/deploys/${deployId}`;

//   while (true) {
//     try {
//       const response = await axios.get(url, {
//         headers: {
//           Authorization: `Bearer ${NETLIFY_API_TOKEN}`,
//         },
//       });

//       const state = response.data.state;
//       const errorMessage = response.data.error_message;

//       if (state === 'ready') {
//         console.log('Deployment is ready.');
//         return;
//       } else if (state === 'error') {
//         console.error('Deployment failed with error:', errorMessage);
//         throw new Error(`Deployment failed: ${errorMessage}`);
//       } else {
//         console.log('Deployment is still in progress...');
//       }

//       await new Promise(resolve => setTimeout(resolve, 10000)); // Poll every 10 seconds
//     } catch (error) {
//       console.error('Error checking deployment status:', error);
//       throw error;
//     }
//   }
// }


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
    const netlifyLink = await deployToNetlify(`<html><head></head><body>${pageTemplate}</body></html>`);

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
      netlifyLink,
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
    const netlifyLink = await deployToNetlify(`
        <html>
        <head>
        <style>
        @tailwind base;
        @tailwind components;
        @tailwind utilities
        </style>               
        <style>${cssTemplate}</style>
        </head>
        <body>${pageTemplate}</body>
        </html>`);

    // Create a new template in the UserSavedPages category
    const newTemplate = new Template({
      categoryId: "UserSavedPages",
      pageName,
      title,
      pageTemplate,
      htmlTemplate,
      cssTemplate,
      userName,
      netlifyLink,
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
    const netlifyLink = await deployToNetlify(template.netlifySiteId, `<html><head></head><body>${pageTemplate}</body></html>`);

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






// code 7 


// const nodeHtmlToImage = require("node-html-to-image");
// const Template = require("../../model/SiteBuilderSchema");
// const simpleGit = require("simple-git");
// const path = require("path");
// const fs = require("fs");
// const { v4: uuidv4 } = require("uuid");
// const axios = require("axios");
// require("dotenv").config();

// const NETLIFY_API_TOKEN = process.env.NETLIFY_API_TOKEN

// const fetch = require('node-fetch');

// // Function to deploy template to Cloudflare Workers
// const deployToCloudflare = async (pageTemplate) => {
//   const workerScript = `
//     addEventListener('fetch', event => {
//       event.respondWith(handleRequest(event.request))
//     })

//     async function handleRequest(request) {
//       const headers = { 'Content-Type': 'text/html' };
//       const response = new Response(\`${pageTemplate}\`, { headers });
//       return response;
//     }
//   `;

//   const response = await fetch('https://api.cloudflare.com/client/v4/accounts/{account_id}/workers/scripts/{script_name}/preview', {
//     method: 'PUT',
//     headers: {
//       'Content-Type': 'application/javascript',
//       'X-Auth-Email': 'your_email@example.com',
//       'X-Auth-Key': 'your_api_key',
//     },
//     body: workerScript,
//   });

//   if (!response.ok) {
//     throw new Error('Failed to deploy to Cloudflare Workers');
//   }

//   const result = await response.json();
//   return result.preview_url;
// };


// // Controller functions

// // To get all templates
// exports.getAllTemplates = async (req, res) => {
//   try {
//     const templates = await Template.find();
//     res.json(templates);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server Error" });
//   }
// };

// // To get Template by id
// exports.getTemplateById = async (req, res) => {
//   try {
//     const template = await Template.findById(req.params.id);

//     if (!template) {
//       return res.status(404).json({ message: "Template not found" });
//     }

//     res.json(template);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server Error" });
//   }
// };

// // To get UserSavedPages
// exports.getUserSavedTemplates = async (req, res) => {
//   try {
//     const templates = await Template.find({
//       categoryId: "UserSavedPages",
//       isDeleted: false,
//     });
//     res.json(templates);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server Error" });
//   }
// };

// // To add templates
// // Updated addTemplate function
// exports.addTemplate = async (req, res) => {
//   try {
//     const {
//       categoryId,
//       pageName,
//       title,
//       pageTemplate,
//       htmlTemplate,
//       cssTemplate,
//       userName,
//     } = req.body;

//     // Generate image from the HTML and CSS content (if needed)
//     // Replace with your image generation logic if required

//     // Deploy HTML content to Cloudflare Workers
//     const workerLink = await deployToCloudflare(pageTemplate);

//     // Create a new template
//     const newTemplate = new Template({
//       categoryId,
//       pageName,
//       title,
//       pageTemplate,
//       htmlTemplate,
//       cssTemplate,
//       isDeleted: false,
//       userName,
//       cloudflareWorkerLink: workerLink,
//       previewImage: 'data:image/png;base64,base64_image_here', // Replace with actual image source
//     });

//     // Save the new template to the database
//     const savedTemplate = await newTemplate.save();

//     res.status(201).json({ message: 'Template added successfully', template: savedTemplate });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server Error' });
//   }
// };

// // To add templates to the addUserSavedTemplate
// exports.addUserSavedTemplate = async (req, res) => {
//   try {
//     const {
//       pageName,
//       title,
//       pageTemplate,
//       htmlTemplate,
//       cssTemplate,
//       userName,
//     } = req.body;

//     // Generate image from the HTML and CSS content
//     const imageBuffer = await nodeHtmlToImage({
//       html: `<html>
//                <head>
//                  <style>
//                    ${cssTemplate}
//                  </style>
//                  <style>
//                    @tailwind base;
//                    @tailwind components;
//                    @tailwind utilities;
//                  </style>
//                  <link href="https://unpkg.com/tailwindcss@^1.0/dist/tailwind.min.css" rel="stylesheet">
//                </head>
//                <body>
//                  ${htmlTemplate}
//                </body>
//              </html>`,
//       encoding: "buffer",
//     });

//     const base64Image = imageBuffer.toString("base64");
//     const imageSrc = `data:image/png;base64,${base64Image}`;

//     // Deploy HTML content to Netlify
//     const netlifyLink = await deployToNetlify(`
//         <html>
//         <head>
//         <style>
//         @tailwind base;
//         @tailwind components;
//         @tailwind utilities
//         </style>               
//         <style>${cssTemplate}</style>
//         </head>
//         <body>${pageTemplate}</body>
//         </html>`);

//     // Create a new template in the UserSavedPages category
//     const newTemplate = new Template({
//       categoryId: "UserSavedPages",
//       pageName,
//       title,
//       pageTemplate,
//       htmlTemplate,
//       cssTemplate,
//       userName,
//       netlifyLink,
//       previewImage: imageSrc,
//     });

//     await newTemplate.save();

//     res.status(201).json({
//       message: "User saved template added successfully",
//       template: newTemplate,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server Error" });
//   }
// };


// // To delete template
// exports.deleteTemplate = async (req, res) => {
//   const { id } = req.params;

//   try {
//     await Template.findByIdAndUpdate(id, { isDeleted: true });
//     res
//       .status(200)
//       .json({ message: "Template deleted successfully (logical delete)" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server Error" });
//   }
// };

// // Update Templates
// // Function to update Cloudflare Worker script
// const updateCloudflareWorker = async (workerId, pageTemplate) => {
//   const workerScript = `
//     addEventListener('fetch', event => {
//       event.respondWith(handleRequest(event.request))
//     })

//     async function handleRequest(request) {
//       const headers = { 'Content-Type': 'text/html' };
//       const response = new Response(\`${pageTemplate}\`, { headers });
//       return response;
//     }
//   `;

//   const response = await fetch(`https://api.cloudflare.com/client/v4/accounts/{account_id}/workers/scripts/{script_name}/preview`, {
//     method: 'PUT',
//     headers: {
//       'Content-Type': 'application/javascript',
//       'X-Auth-Email': 'your_email@example.com',
//       'X-Auth-Key': 'your_api_key',
//     },
//     body: workerScript,
//   });

//   if (!response.ok) {
//     throw new Error('Failed to update Cloudflare Workers script');
//   }

//   const result = await response.json();
//   return result.preview_url;
// };

// // Updated updateTemplateById function
// exports.updateTemplateById = async (req, res) => {
//   const { id } = req.params;
//   const { pageTemplate } = req.body;

//   try {
//     // Find the template by ID
//     const template = await Template.findById(id);

//     if (!template) {
//       return res.status(404).json({ message: 'Template not found' });
//     }

//     // Update the pageTemplate field in the template
//     template.pageTemplate = pageTemplate;

//     // Update Cloudflare Worker script with new pageTemplate
//     const updatedWorkerLink = await updateCloudflareWorker(template.cloudflareWorkerId, pageTemplate);

//     // Update the Cloudflare Worker link in the template
//     template.cloudflareWorkerLink = updatedWorkerLink;

//     // Save the updated template
//     const updatedTemplate = await template.save();

//     res.json(updatedTemplate);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server Error' });
//   }
// };

