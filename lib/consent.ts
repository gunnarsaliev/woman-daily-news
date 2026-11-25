/**
 * Cookie consent categories. Each id matches a Google Consent Mode v2 consent type, so the visitor's choices can be
 * passed straight to `gtag('consent', 'update', …)` for Google Analytics / Tag Manager / Ads.
 */
export const CONSENT_CATEGORIES = [
  {
    id: 'security_storage',
    title: 'Security',
    description: 'Storage needed to keep the site secure, such as fraud and abuse prevention.',
    necessary: true,
  },
  {
    id: 'functionality_storage',
    title: 'Functionality',
    description: 'Remembers choices you make, such as your cookie preferences, so the site works the way you expect.',
    necessary: false,
  },
  {
    id: 'personalization_storage',
    title: 'Personalization',
    description: 'Lets us tailor content and recommendations to you.',
    necessary: false,
  },
  {
    id: 'analytics_storage',
    title: 'Analytics',
    description: 'Helps us understand how visitors use the site, such as which stories are read and for how long.',
    necessary: false,
  },
  {
    id: 'ad_storage',
    title: 'Advertising storage',
    description: 'Lets advertising partners store cookies on your device, for example to measure ad performance.',
    necessary: false,
  },
  {
    id: 'ad_user_data',
    title: 'Advertising user data',
    description: 'Allows sending data about your visit to Google for advertising purposes.',
    necessary: false,
  },
  {
    id: 'ad_personalization',
    title: 'Personalized advertising',
    description: 'Allows ads to be personalized to your interests, for example through remarketing.',
    necessary: false,
  },
] as const

/**
 * Google Tag Manager container (NEXT_PUBLIC_GTM_ID, e.g. GTM-XXXXXXX). GTM is not loaded while it is unset.
 * Tags inside it respect the Consent Mode state set below.
 */
export const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID?.trim() || undefined

/** Standard GTM loader: the `gtm.js` event is what fires "All Pages" / Initialization triggers. */
export function gtmScript(id: string) {
  return `
(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});
var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;
j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer',${JSON.stringify(id)});
`
}

export type ConsentCategoryId = (typeof CONSENT_CATEGORIES)[number]['id']

/**
 * Runs in <head> before any tag loads: sets every non-necessary Consent Mode type to "denied" until the visitor
 * chooses. Tags that load later (GA4, GTM, Ads) read these defaults and wait for the update.
 */
export const CONSENT_DEFAULTS_SCRIPT = `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
window.gtag = window.gtag || gtag;
gtag('consent', 'default', ${JSON.stringify({
  ...Object.fromEntries(CONSENT_CATEGORIES.map((c) => [c.id, c.necessary ? 'granted' : 'denied'])),
  // Must be a key of the consent object: a separate 4th argument makes GTM reject the whole command.
  wait_for_update: 500,
})});
gtag('set', 'ads_data_redaction', true);
`
