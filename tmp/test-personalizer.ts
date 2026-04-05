import { ErrorPersonalizer } from './apps/api/src/common/utils/error-personalizer';
import { HttpStatus } from '@nestjs/common';

const testCases = [
  { message: 'No file provided', status: HttpStatus.BAD_REQUEST },
  { message: 'Unsupported file format. Please upload PDF or DOCX.', status: HttpStatus.BAD_REQUEST },
  { message: 'resumeText and jobDescription are required', status: HttpStatus.BAD_REQUEST },
  { message: 'Some random technical error', status: HttpStatus.INTERNAL_SERVER_ERROR },
  { message: 'Unauthorized', status: HttpStatus.UNAUTHORIZED },
  { message: 'No file provided', status: HttpStatus.BAD_REQUEST, user: { firstName: 'John' } },
];

console.log('--- Error Personalizer Test Results ---');
testCases.forEach((tc) => {
  const result = ErrorPersonalizer.personalize(tc.message, tc.status, (tc as any).user);
  console.log(`\nInput: "${tc.message}" (Status: ${tc.status}, User: ${(tc as any).user?.firstName || 'None'})`);
  console.log(`Output: "${result.friendlyMessage}"`);
});
