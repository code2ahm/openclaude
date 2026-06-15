import { expect, test } from 'bun:test'
import { getClaudeDesktopConfigPath } from './claudeDesktop.js'

const isWindows = process.platform === 'win32'

test('getClaudeDesktopConfigPath returns APPDATA path on Windows when APPDATA is set', async () => {
  if (!isWindows) return

  const original = process.env.APPDATA
  process.env.APPDATA = 'C:\\Users\\test\\AppData\\Roaming'
  try {
    const result = await getClaudeDesktopConfigPath()
    expect(result).toBe(
      'C:\\Users\\test\\AppData\\Roaming\\Claude\\claude_desktop_config.json',
    )
  } finally {
    process.env.APPDATA = original
  }
})

test('getClaudeDesktopConfigPath throws when APPDATA is unset on Windows', async () => {
  if (!isWindows) return

  const original = process.env.APPDATA
  try {
    delete process.env.APPDATA
    await expect(getClaudeDesktopConfigPath()).rejects.toThrow(
      'APPDATA environment variable is not set.',
    )
  } finally {
    process.env.APPDATA = original
  }
})
