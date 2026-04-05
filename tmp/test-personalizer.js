const { ErrorPersonalizer } = require('../apps/api/src/common/utils/error-personalizer');

const testCases = [
  { message: 'No file provided', status: 400 },
  { message: 'Unsupported file format. Please upload PDF or DOCX.', status: 400 },
  { message: 'resumeText and jobDescription are required', status: 400 },
  { message: 'Some random technical error', status: 500 },
  { message: 'Unauthorized', status: 401 },
  { message: 'No file provided', status: 400, user: { firstName: 'John' } },
];

console.log('--- Error Personalizer Test Results ---');
testCases.forEach((tc) => {
  const result = ErrorPersonalizer.personalize(tc.message, tc.status, tc.user);
  console.log(`\nInput: "${tc.message}" (Status: ${tc.status}, User: ${tc.user?.firstName || 'None'})`);
  console.log(`Output: "${result.friendlyMessage}"`);
});
