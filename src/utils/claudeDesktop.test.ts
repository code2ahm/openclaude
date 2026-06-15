import { expect, test } from 'bun:test'
import { getClaudeDesktopConfigPath } from './claudeDesktop.js'

const isWindows = process.platform === 'win32'

test('getClaudeDesktopConfigPath returns APPDATA path on Windows when APPDATA is set', async () => {
  if (!isWindows) return

  const appData = process.env.APPDATA
  const result = await getClaudeDesktopConfigPath()
  expect(result).toBe(`${appData}\\Claude\\claude_desktop_config.json`)
})

test('getClaudeDesktopConfigPath throws when APPDATA is unset on Windows', async () => {
  if (!isWindows) return

  const original = process.env.APPDATA
  delete process.env.APPDATA

  await expect(getClaudeDesktopConfigPath()).rejects.toThrow(
    'APPDATA environment variable is not set.',
  )

  process.env.APPDATA = original
})
