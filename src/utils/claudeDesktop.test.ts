import { expect, mock, test } from 'bun:test'

// force windows code path regardless of host os so ci (linux) covers it too.
// mock.module is process-global in bun - this file controls the mock for the
// lifetime of the process, so it must not re-export tested helpers.
mock.module('./platform.js', () => ({
  getPlatform: () => 'windows' as const,
  SUPPORTED_PLATFORMS: ['macos', 'wsl', 'windows'],
}))

import { getClaudeDesktopConfigPath } from './claudeDesktop.js'

test('getClaudeDesktopConfigPath returns APPDATA path on Windows when APPDATA is set', async () => {
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
