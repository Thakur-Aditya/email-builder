import React from 'react';

const fontFamilies = [
  'Arial', 'Times New Roman', 'Helvetica', 'Georgia', 'Verdana'
];

const fontSizes = [
  '12px', '14px', '16px', '18px', '20px', '24px', '28px', '32px'
];

const alignments = ['left', 'center', 'right'];

export const StyleControls = ({ element, styles, onStyleChange }) => {
  const currentStyle = styles.find(s => s.element === element) || {
    fontSize: '16px',
    fontFamily: 'Arial',
    color: '#000000',
    alignment: 'left'
  };

  const handleChange = (property, value) => {
    onStyleChange(element, { ...currentStyle, [property]: value });
  };

  return (
    <div className="grid grid-cols-2 gap-2 mb-4">
      <div>
        <label className="block text-sm">Font Family</label>
        <select
          className="w-full p-2 border rounded"
          value={currentStyle.fontFamily}
          onChange={(e) => handleChange('fontFamily', e.target.value)}
        >
          {fontFamilies.map(font => (
            <option key={font} value={font}>{font}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm">Font Size</label>
        <select
          className="w-full p-2 border rounded"
          value={currentStyle.fontSize}
          onChange={(e) => handleChange('fontSize', e.target.value)}
        >
          {fontSizes.map(size => (
            <option key={size} value={size}>{size}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm">Color</label>
        <input
          type="color"
          className="w-full p-1 border rounded"
          value={currentStyle.color}
          onChange={(e) => handleChange('color', e.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm">Alignment</label>
        <select
          className="w-full p-2 border rounded"
          value={currentStyle.alignment}
          onChange={(e) => handleChange('alignment', e.target.value)}
        >
          {alignments.map(align => (
            <option key={align} value={align}>{align}</option>
          ))}
        </select>
      </div>
    </div>
  );
};
