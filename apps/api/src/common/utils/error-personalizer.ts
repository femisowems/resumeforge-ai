import { HttpStatus } from '@nestjs/common';

export interface PersonalizedError {
  friendlyMessage: string;
  originalMessage: string;
}

const ERROR_MAPPINGS: Record<string, string> = {
  // Resumes Service Errors
  'No file provided': "Oops! It looks like you forgot to attach your resume. Mind uploading it so I can get to work?",
  'Resume file or text is required': "I'm missing your resume! Please upload a file or paste the text so I can start working my magic.",
  'Unsupported file format. Please upload PDF or DOCX.': "I can currently only process PDF and DOCX files. Could you please re-upload your resume as one of those?",
  'Could not extract text from resume': "I'm having a bit of trouble reading your resume. Could you try a different file format like PDF or DOCX?",
  
  // Generation Controller Errors
  'resumeText and jobDescription are required': "Hey there! We need both your resume and a job description to start crafting your application. Mind adding both?",
  'resumeText is required': "I'm missing your resume text! Could you provide that so we can optimize it?",
  'jobDescription is required': "I need a job description to know exactly what we're aiming for. Could you paste it in?",
  'Generation failed. Please try again with different inputs.': "Hmm, I hit a snag while crafting your professional narrative. Could you try adjusting your inputs a bit?",

  // Documents Errors
  'Document with ID': "We couldn't find that specific document. Could you double-check the ID or try searching again?",

  // AI Service Errors


  'Gemini API Quota Exceeded. Please try again later or switch models.': "Our AI is currently a bit overwhelmed with requests. We'll be back in just a moment!",
  'AI returned an invalid response format. Please try again.': "Our AI had a little trouble formatting its thoughts. Let's try that generation again!",
  
  // Auth Errors
  'Unauthorized': "It looks like you're not logged in. Let's get you signed in so we can continue!",
  'Forbidden resource': "You don't have permission to access this. If you think this is a mistake, let us know!",
};

const STATUS_MAPPINGS: Record<number, string> = {
  [HttpStatus.BAD_REQUEST]: "Something isn't quite right with the information provided. Let's double-check it together!",
  [HttpStatus.UNAUTHORIZED]: "Wait a second, we need you to sign in before we can proceed. Let's get you logged in!",
  [HttpStatus.FORBIDDEN]: "It seems you don't have access to this part of the forge. If you're stuck, reach out to us!",
  [HttpStatus.NOT_FOUND]: "We looked everywhere, but we couldn't find what you're searching for. Maybe it went for a walk?",
  [HttpStatus.INTERNAL_SERVER_ERROR]: "Our forge hit a bit of a snag. Our engineers are already looking into it!",
};

export class ErrorPersonalizer {
  static personalize(message: string | string[], status: number, user?: any): PersonalizedError {
    const originalMessage = Array.isArray(message) ? message[0] : message;
    
    // Check for exact message mapping
    let friendlyMessage = ERROR_MAPPINGS[originalMessage];
    
    // If no exact match, check for partial matches in the message
    if (!friendlyMessage) {
      for (const [key, value] of Object.entries(ERROR_MAPPINGS)) {
        if (originalMessage.toLowerCase().includes(key.toLowerCase())) {
          friendlyMessage = value;
          break;
        }
      }
    }

    // Default to status code mapping if still no friendly message
    if (!friendlyMessage) {
      friendlyMessage = STATUS_MAPPINGS[status] || "We hit an unexpected snag. Don't worry, we're on it!";
    }

    // Add user personalization if available
    if (user && user.firstName) {
      friendlyMessage = `Hi ${user.firstName}, ${friendlyMessage.charAt(0).toLowerCase()}${friendlyMessage.slice(1)}`;
    } else if (user && user.name) {
      friendlyMessage = `Hi ${user.name}, ${friendlyMessage.charAt(0).toLowerCase()}${friendlyMessage.slice(1)}`;
    }

    return {
      friendlyMessage,
      originalMessage,
    };
  }
}
