'use client'

import { showPreferences } from 'vanilla-cookieconsent'

/**
 * Reopens the cookie preferences modal. Calls the API directly because vanilla-cookieconsent only binds
 * `data-cc` buttons present when it starts, not ones rendered after client-side navigation.
 */
export function CookieSettingsButton({ className, children = 'Cookie settings' }: { className?: string; children?: React.ReactNode }) {
  return (
    <button className={className} onClick={() => showPreferences()} type="button">
      {children}
    </button>
  )
}
