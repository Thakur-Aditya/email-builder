import mongoose from 'mongoose';

const styleConfigSchema = new mongoose.Schema({
  element: String,  // e.g., 'title', 'content', 'footer'
  fontSize: String,
  fontFamily: String,
  color: String,
  alignment: String
});

const emailTemplateSchema = new mongoose.Schema({
  name: String,
  heading: String,
  content: String,
  imageUrl: String,
  footer: String,
  headerBgColor: String,
  styles: [styleConfigSchema],
  version: { type: Number, default: 1 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Add versioning middleware
emailTemplateSchema.pre('save', function(next) {
  if (this.isModified() && !this.isNew) {
    this.version += 1;
  }
  this.updatedAt = new Date();
  next();
});

export const EmailTemplate = mongoose.model('EmailTemplate', emailTemplateSchema);