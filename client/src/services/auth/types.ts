import { Entity } from '@/api/types';

export type AccessTokenResponse = {
  access_token: string;
};

export type User = Entity<{
  name: string;
  email: string;
}>;

//   {
//     "message": "User registered successfully",
//     "success": true,
//     "data": {
//         "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImVobWVkQGdtYWlsLmNvbSIsInN1YiI6NCwiaWF0IjoxNzQ1NzkzNzc2LCJleHAiOjE3NDU3OTczNzZ9.P-XheFgIAKh71kIyO_HXMou0Knc7Rp7ceLQWsGKiIro"
//     }
// }
