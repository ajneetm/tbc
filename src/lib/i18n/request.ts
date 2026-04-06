import {getRequestConfig} from 'next-intl/server';
import { getUserLocale } from './getUserLocale';
 
export default getRequestConfig(async () => {
  const locale = await getUserLocale();

  return {
    locale,
    messages: (await import(`./translations/${locale}.json`)).default,
  };
});