import React, { useState, useEffect } from "react";
import axios from "axios";
import { StyleControls } from "./components/StyleControls";
import { EmailPreview } from "./components/EmailPreview";

function App() {
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [baseHTML, setBaseHTML] = useState("");
  const [emailConfig, setEmailConfig] = useState({
    name: "",
    heading: "",
    content: "",
    footer: "",
    headerBgColor: "",
    imageUrl: "",
    styles: [],
  });
  // const API_URL = "http://localhost:8800/api";
  const API_URL = "https://email-builder-h1mi.onrender.com/api";

  // All existing functionality remains the same
  useEffect(() => {
    const userResponse = window.confirm(
      "Here is the link for a video tour of this project. Would you like to open it?"
    );

    if (userResponse) {
      window.open("https://youtu.be/0nofnotlbV8?si=BcbJTJoECuoJF2eP", "_blank"); // Open in a new tab
    }
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      console.log("I ran");
      const response = await axios.get(`${API_URL}/templates`);
      console.log(response);
      if (response.data.templates.length === 0)
        setSelectedTemplate(response.data.baseHTML);
      else setSelectedTemplate(response.data.templates[response.data.templates.length - 1]);

      setTemplates(response.data.templates);
      setBaseHTML(response.data.baseHTML);
    } catch (error) {
      console.error("Error fetching templates:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(emailConfig);
    try {
      await axios.post(`${API_URL}/templates`, emailConfig);
      alert("Template saved successfully!");
    } catch (error) {
      console.error("Error saving template:", error);
    }
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await axios.post(`${API_URL}/upload-image`, formData);
      console.log(response);
      setEmailConfig({
        ...emailConfig,
        imageUrl: response.data.imageUrl,
      });
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const loadTemplate = async (id) => {
    try {
      const response = await axios.get(`${API_URL}/templates/${id}`);
      setSelectedTemplate(response.data);
      setEmailConfig(response.data);
    } catch (error) {
      console.error("Error loading template:", error);
    }
  };

  const handleStyleChange = (element, styleConfig) => {
    const updatedStyles = [
      ...emailConfig.styles.filter((s) => s.element !== element),
      { element, ...styleConfig },
    ];

    const newConfig = {
      ...emailConfig,
      styles: updatedStyles,
    };

    setEmailConfig(newConfig);
  };
  const handleInputChange = (field, value) => {
    const newConfig = {
      ...emailConfig,
      [field]: value,
    };
    setEmailConfig(newConfig);
  };

  const handleDownload = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/templates/${selectedTemplate._id}/download`,
        { responseType: "blob" }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `template-${emailConfig.name}.html`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error downloading template:", error);
    }
  };

  async function handleDelete() {
    try {
      await axios.delete(`${API_URL}/templates/${selectedTemplate._id}`);
      alert("Template deleted successfully!");
      fetchTemplates();
    } catch (error) {
      console.error("Error deleting template");
    }
  }
  const handleReorder = (newOrder) => {
    // Yahan aap apne HTML ko update kar sakte hain
    console.log('New order:', newOrder);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Email Builder
          </h1>
          <div className="flex items-center gap-4">
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              onChange={(e) => loadTemplate(e.target.value)}
            >
              <option value="">Select a template</option>
              {templates.map((template) => (
                <option key={template._id} value={template._id}>
                  {template.name} (v{template.version})
                </option>
              ))}
            </select>
            {selectedTemplate && (
              <>
                <button
                  onClick={handleDownload}
                  className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
                >
                  Download HTML
                </button>
                <button
                  onClick={handleDelete}
                  className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
                >
                  Delete Template
                </button>
              </>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Form */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-6">Email Content</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Heading
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={emailConfig.heading}
                    onChange={(e) =>
                      handleInputChange("heading", e.target.value)
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={emailConfig.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Content
                  </label>
                  <textarea
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows="6"
                    value={emailConfig.content}
                    onChange={(e) =>
                      handleInputChange("content", e.target.value)
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Footer
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={emailConfig.footer}
                    onChange={(e) =>
                      handleInputChange("footer", e.target.value)
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Header Background Color
                  </label>
                  <input
                    type="color"
                    value={emailConfig.headerBgColor}
                    onChange={(e) =>
                      handleInputChange("headerBgColor", e.target.value)
                    }
                    className="w-full h-10 p-1 border border-gray-300 rounded-lg"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                >
                  Save Template
                </button>
              </form>
            </div>

            {/* Style Controls */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-6">Style Controls</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-3">Title Styles</h3>
                  <StyleControls
                    element="heading"
                    styles={emailConfig.styles}
                    onStyleChange={handleStyleChange}
                  />
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-3">Content Styles</h3>
                  <StyleControls
                    element="content"
                    styles={emailConfig.styles}
                    onStyleChange={handleStyleChange}
                  />
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-3">Footer Styles</h3>
                  <StyleControls
                    element="footer"
                    styles={emailConfig.styles}
                    onStyleChange={handleStyleChange}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Preview */}
          <div className="lg:sticky lg:top-6 h-fit">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-6">Preview</h2>
              <div className="border border-gray-200 rounded-lg p-4">
                {selectedTemplate && (
                  <EmailPreview
                    baseHTML={baseHTML}
                    templateData={emailConfig}
                    onReorder={handleReorder}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
