import createNextIntlPlugin from 'next-intl/plugin';

const API_URL = process.env.API_URL
 
const nextConfig = {}
 
const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);