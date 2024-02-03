const { cookies } = require('next/headers');

export const clearCookie = () => {
  cookies().delete('user');
};
