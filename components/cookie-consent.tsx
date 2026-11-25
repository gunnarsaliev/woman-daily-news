'use client'

import { useEffect } from 'react'
import * as CookieConsent from 'vanilla-cookieconsent'
import 'vanilla-cookieconsent/dist/cookieconsent.css'
import { CONSENT_CATEGORIES } from '@/lib/consent'

declare global {
  interface Window {
    dataLayer: unknown[]
    gtag: (...args: unknown[]) => void
  }
}

/** Sends the visitor's current choices to Google Consent Mode (no-op until gtag/GTM is on the page). */
function updateGoogleConsent() {
  // Defined by CONSENT_DEFAULTS_SCRIPT in the root layout.
  window.gtag?.(
    'consent',
    'update',
    Object.fromEntries(CONSENT_CATEGORIES.map((c) => [c.id, CookieConsent.acceptedCategory(c.id) ? 'granted' : 'denied'])),
  )
}

export function CookieConsentBanner() {
  useEffect(() => {
    CookieConsent.run({
      // Bump when categories change, to ask everyone again.
      revision: 0,
      guiOptions: {
        consentModal: { layout: 'box', position: 'bottom left', equalWeightButtons: true },
        preferencesModal: { layout: 'box', equalWeightButtons: true },
      },
      categories: Object.fromEntries(
        CONSENT_CATEGORIES.map((c) => [c.id, c.necessary ? { enabled: true, readOnly: true } : {}]),
      ),
      onConsent: updateGoogleConsent,
      onChange: updateGoogleConsent,
      language: {
        default: 'en',
        translations: {
          en: {
            consentModal: {
              title: 'We value your privacy',
              description:
                'We use cookies and similar technologies to keep the site working, understand how it is used and, with your permission, for personalization and advertising. You can change your choice at any time from “Cookie settings” in the footer.',
              acceptAllBtn: 'Accept all',
              acceptNecessaryBtn: 'Reject all',
              showPreferencesBtn: 'Manage preferences',
              footer: '<a href="/privacy">Privacy policy</a>',
            },
            preferencesModal: {
              title: 'Cookie preferences',
              acceptAllBtn: 'Accept all',
              acceptNecessaryBtn: 'Reject all',
              savePreferencesBtn: 'Save preferences',
              closeIconLabel: 'Close',
              sections: [
                {
                  description:
                    'Choose which kinds of storage you allow. Security storage is always on because the site needs it.',
                },
                ...CONSENT_CATEGORIES.map((c) => ({
                  title: c.title,
                  description: c.description,
                  linkedCategory: c.id,
                })),
                {
                  title: 'More information',
                  description: 'For questions about how we use your data, see our <a href="/privacy">privacy policy</a>.',
                },
              ],
            },
          },
        },
      },
    })
  }, [])

  return null
}
