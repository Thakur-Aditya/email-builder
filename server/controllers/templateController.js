import { EmailTemplate } from "../models/EmailTemplate.js";
import fs from "fs/promises";
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";
import DOMPurify from "dompurify";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function getBaseTemplate() {
  const baseTemplatePath = path.join(__dirname, "../layout.html");
  const baseTemplate = await fs.readFile(baseTemplatePath, "utf-8");
  return baseTemplate;
}
const generateCSS = (styles) => {
  // Base CSS - ye hamesha rahega
  const baseCSS = `
    body {
      margin: 0;
      padding: 0;
      font-family: Arial, sans-serif;
      line-height: 1.6;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .heading {
      padding: 20px;
      background-color: {{headerBgColor}};
    }
    .content {
      padding: 20px;
      background-color: #ffffff;
    }
    .image {
      max-width: 100%;
      height: auto;
      margin: 20px 0;
    }
    .footer {
      padding: 20px;
      background-color: #f5f5f5;
    }
  `;

  // Dynamic styles ko generate karo
  const dynamicCSS = styles
    .map(
      (style) => `
    .${style.element} {
      font-size: ${style.fontSize || "16px"};
      font-family: ${style.fontFamily || "Arial"};
      color: ${style.color || "#000000"};
      text-align: ${style.alignment || "left"};
    }
  `
    )
    .join("\n");

  return baseCSS + "\n" + dynamicCSS;
};
export const getTemplates = async (req, res) => {
  try {
    const templates = await EmailTemplate.find().sort({ updatedAt: -1 });
    const baseTemplate = await getBaseTemplate();

    let finalTemplate = baseTemplate.replace("{{styles}}", generateCSS([]));

    res.json({
      templates, // Template ka sara data
      baseHTML: finalTemplate, // Compiled HTML structure
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getTemplateById = async (req, res) => {
  try {
    const template = await EmailTemplate.findById(req.params.id);
    if (!template) {
      return res.status(404).json({ error: "Template not found" });
    }
    res.json({
      ...template.toObject(),
    });
  } catch (error) {
    res.status(499).json({ error: error.message });
  }
};

export const createTemplate = async (req, res) => {
  try {
    const templateData = {
      heading: req.body.heading,
      content: req.body.content,
      footer: req.body.footer,
      name: req.body.name,
      headerBgColor: req.body.headerBgColor,
      imageUrl: req.body.imageUrl,
      styles: req.body.styles,
    };
    const template = new EmailTemplate(templateData);
    await template.save();
    res.status(201).json(template);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

export const updateTemplate = async (req, res) => {
  try {
    // Sanitize HTML content
    const sanitizedData = {
      ...req.body,
      content: DOMPurify.sanitize(req.body.content),
      footer: DOMPurify.sanitize(req.body.footer),
    };

    const template = await EmailTemplate.findByIdAndUpdate(
      req.params.id,
      sanitizedData,
      { new: true }
    );
    if (!template) {
      return res.status(404).json({ error: "Template not found" });
    }
    res.json(template);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteTemplate = async (req, res) => {
  try {
    const template = await EmailTemplate.findByIdAndDelete(req.params.id);
    if (!template) {
      return res.status(404).json({ error: "Template not found" });
    }
    res.json({ message: "Template deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const downloadTemplate = async (req, res) => {
  try {
    const template = await EmailTemplate.findById(req.params.id);
    if (!template) {
      return res.status(404).json({ error: "Template not found" });
    }

    const baseTemplate = await getBaseTemplate();

    let finalTemplate = baseTemplate.replace(
      "{{styles}}",
      generateCSS(template.styles || [])
    );

    finalTemplate = finalTemplate
      .replace("{{heading}}", `${template.heading}`)
      .replace("{{content}}", `${template.content}`)
      .replace("{{imageUrl}}", `${template.imageUrl}`)
      .replace("{{footer}}", `${template.footer}`)
      .replace("{{headerBgColor}}", `${template.headerBgColor}`);

    res.setHeader("Content-Type", "text/html");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=template-${template.name}.html`
    );
    res.send(finalTemplate);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
