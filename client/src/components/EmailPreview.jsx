import React, { useEffect, useState } from "react";
import DOMPurify from "dompurify";

export const EmailPreview = ({ baseHTML, templateData = {} }) => {
  const [styles, setStyles] = useState(""); // State to hold the generated styles
  const [renderedHTML, setRenderedHTML] = useState("");

  useEffect(() => {
    const newStyles = (templateData.styles || [])
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
    console.log(newStyles);
    setStyles(newStyles);
  }, [templateData.styles]);

  useEffect(() => {
    if (!baseHTML) return;

    let previewHTML = baseHTML; // Always start with the original baseHTML

    const replacements = {
      "{{heading}}": templateData.heading || "",
      "{{content}}": templateData.content || "",
      "{{footer}}": templateData.footer || "",
      "{{headerBgColor}}": templateData.headerBgColor || "",
      "{{imageUrl}}": templateData.imageUrl || "",
    };

    Object.entries(replacements).forEach(([placeholder, value]) => {
      previewHTML = previewHTML.replace(
        placeholder,
        DOMPurify.sanitize(value) // Sanitize for security
      );
    });

    setRenderedHTML(previewHTML); // Update the final rendered HTML
  }, [baseHTML, templateData]); // Re-run when baseHTML or templateData changes


  return (
    <div className="preview-container">
      <style>{styles}</style>
      <div
        dangerouslySetInnerHTML={{ __html: renderedHTML }}
        className="email-preview"
      />
    </div>
  );
};












// import React, { useEffect, useState } from "react";
// import DOMPurify from "dompurify";
// import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

// export const EmailPreview = ({ baseHTML, templateData = {}, onReorder }) => {
//   const [styles, setStyles] = useState("");
//   const [renderedHTML, setRenderedHTML] = useState("");
//   const [emailElements, setEmailElements] = useState([]);

//   // Base HTML se draggable elements extract karna
//   useEffect(() => {
//     if (!baseHTML) return;
  
//     const parser = new DOMParser();
//     const doc = parser.parseFromString(baseHTML, 'text/html');
    
//     const elementsToDrag = [
//       { 
//         id: 'email-heading', 
//         element: doc.querySelector('.heading'), 
//         type: 'heading' 
//       },
//       { 
//         id: 'email-image', 
//         element: doc.querySelector('.image'), 
//         type: 'image' 
//       },
//       { 
//         id: 'email-content', 
//         element: doc.querySelector('.content'), 
//         type: 'content' 
//       },
//       { 
//         id: 'email-footer', 
//         element: doc.querySelector('.footer'), 
//         type: 'footer' 
//       }
//     ].filter(item => item.element);
  
//     setEmailElements(elementsToDrag);
//   }, [baseHTML]);
//   // Styles generation logic 
//   useEffect(() => {
//     const newStyles = (templateData.styles || [])
//       .map(
//         (style) => `
//           .${style.element} {
//             font-size: ${style.fontSize || "16px"};
//             font-family: ${style.fontFamily || "Arial"};
//             color: ${style.color || "#000000"};
//             text-align: ${style.alignment || "left"};
//           }
//         `
//       )
//       .join("\n");
//     setStyles(newStyles);
//   }, [templateData.styles]);

//   // HTML rendering logic 
//   useEffect(() => {
//     if (!baseHTML) return;

//     let previewHTML = baseHTML;

//     const replacements = {
//       "{{heading}}": templateData.heading || "",
//       "{{content}}": templateData.content || "",
//       "{{footer}}": templateData.footer || "",
//       "{{headerBgColor}}": templateData.headerBgColor || "",
//       "{{imageUrl}}": templateData.imageUrl || "",
//     };

//     Object.entries(replacements).forEach(([placeholder, value]) => {
//       previewHTML = previewHTML.replace(
//         placeholder,
//         DOMPurify.sanitize(value)
//       );
//     });

//     setRenderedHTML(previewHTML);
//   }, [baseHTML, templateData]);

//   // Drag and drop handler
//   const onDragEnd = (result) => {
//     console.log('Drag Result:', result);
    
//     if (!result.destination) {
//       console.log('No destination');
//       return;
//     }

//     const newElements = Array.from(emailElements);
//     const [reorderedItem] = newElements.splice(result.source.index, 1);
//     newElements.splice(result.destination.index, 0, reorderedItem);

//     console.log('New Elements:', newElements);
//     setEmailElements(newElements);
//     onReorder?.(newElements);
//   };


//   return (
//     <div className="preview-container">
//       <style>{styles}</style>
//       <DragDropContext onDragEnd={onDragEnd}>
//       <Droppable droppableId="email-layout-droppable">
//           {(provided) => (
//             <div 
//               {...provided.droppableProps} 
//               ref={provided.innerRef}
//               className="email-preview"
//             >
//               {emailElements.map((item, index) => (
//                 <Draggable 
//                   key={item.id} 
//                   draggableId={item.id} 
//                   index={index}
//                 >
//                   {(provided) => (
//                     <div
//                       ref={provided.innerRef}
//                       {...provided.draggableProps}
//                       {...provided.dragHandleProps}
//                     >
//                       <div 
//                         dangerouslySetInnerHTML={{ 
//                           __html: DOMPurify.sanitize(item.element.outerHTML) 
//                         }} 
//                       />
//                     </div>
//                   )}
//                 </Draggable>
//               ))}
//               {provided.placeholder}
//             </div>
//           )}
//         </Droppable>
//       </DragDropContext>
//     </div>
//   );
// };